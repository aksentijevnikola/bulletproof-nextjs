"use client";

import { CheckCircle2Icon, SaveIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { type FormEvent, useRef, useState } from "react";
import {
  type SettingsValues,
  settingsSchema,
} from "@/features/settings/settings-schema";
import { useHasMounted } from "@/shared/hooks/use-has-mounted";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type SettingsField = keyof SettingsValues;
type SettingsErrors = Partial<Record<SettingsField, string>>;

function getSettingsErrors(formData: FormData): SettingsErrors {
  const result = settingsSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    timezone: formData.get("timezone"),
    theme: formData.get("theme"),
  });

  if (result.success) {
    return {};
  }

  const errors: SettingsErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (
      (field === "displayName" ||
        field === "email" ||
        field === "timezone" ||
        field === "theme") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function SettingsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { setTheme, theme } = useTheme();
  const mounted = useHasMounted();
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function clearFieldState(field: SettingsField) {
    setSubmitted(false);
    setErrors(({ [field]: _fieldError, ...remainingErrors }) => {
      return remainingErrors;
    });
  }

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const field = target.name;
    if (field !== "displayName" && field !== "email") {
      return;
    }

    clearFieldState(field);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = getSettingsErrors(new FormData(event.currentTarget));
    const fieldOrder: SettingsField[] = [
      "displayName",
      "email",
      "timezone",
      "theme",
    ];
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    setErrors(nextErrors);
    setSubmitted(firstInvalidField === undefined);

    if (firstInvalidField) {
      requestAnimationFrame(() => {
        const field = formRef.current?.elements.namedItem(firstInvalidField);
        if (field instanceof HTMLElement) {
          field.focus();
        }
      });
    }
  }

  const errorEntries = Object.entries(errors) as Array<[SettingsField, string]>;
  const currentTheme =
    mounted && (theme === "light" || theme === "dark") ? theme : "system";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile and appearance</CardTitle>
        <CardDescription>
          Validate profile values locally and apply a browser theme.
        </CardDescription>
      </CardHeader>
      <form
        ref={formRef}
        noValidate
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      >
        <CardContent className="flex flex-col gap-6">
          {errorEntries.length > 0 ? (
            <Alert
              variant="destructive"
              aria-labelledby="settings-errors-title"
            >
              <AlertTitle id="settings-errors-title">
                Correct {errorEntries.length} field
                {errorEntries.length === 1 ? "" : "s"}
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errorEntries.map(([field, message]) => (
                    <li key={field}>
                      <a href={`#settings-${field}`}>{message}</a>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          {submitted ? (
            <Alert role="status" aria-live="polite">
              <CheckCircle2Icon aria-hidden="true" />
              <AlertTitle>Preferences validated</AlertTitle>
              <AlertDescription>
                Theme is applied in this browser. Profile values were not sent
                to a server or saved to a user account.
              </AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.displayName)}>
              <FieldLabel htmlFor="settings-displayName">
                Display name
              </FieldLabel>
              <Input
                id="settings-displayName"
                name="displayName"
                defaultValue="bulletproof-nextjs Operator"
                autoComplete="name"
                aria-invalid={Boolean(errors.displayName)}
                aria-describedby={
                  errors.displayName ? "settings-displayName-error" : undefined
                }
              />
              <FieldError id="settings-displayName-error">
                {errors.displayName}
              </FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="settings-email">Email address</FieldLabel>
              <Input
                id="settings-email"
                name="email"
                type="email"
                defaultValue="operator@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "settings-email-error" : undefined
                }
              />
              <FieldError id="settings-email-error">{errors.email}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.timezone)}>
              <FieldLabel htmlFor="settings-timezone">Timezone</FieldLabel>
              <Select
                name="timezone"
                defaultValue="Europe/Skopje"
                onValueChange={() => clearFieldState("timezone")}
              >
                <SelectTrigger
                  id="settings-timezone"
                  className="w-full"
                  aria-invalid={Boolean(errors.timezone)}
                  aria-describedby={
                    errors.timezone ? "settings-timezone-error" : undefined
                  }
                >
                  <SelectValue placeholder="Choose a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Europe/Skopje">Europe/Skopje</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">
                      America/New_York
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      America/Los_Angeles
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError id="settings-timezone-error">
                {errors.timezone}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="settings-theme">Theme</FieldLabel>
              <Select
                name="theme"
                value={currentTheme}
                onValueChange={(value) => {
                  clearFieldState("theme");
                  setTheme(value);
                }}
              >
                <SelectTrigger id="settings-theme" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Applied immediately and managed by the browser theme control.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 border-t">
          <Button type="submit">
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            Validate preferences
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
