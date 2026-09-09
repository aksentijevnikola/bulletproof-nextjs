"use client";

import { CheckCircle2Icon, LogInIcon } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/shared/ui";
import { type LoginValues, loginSchema } from "../model/login";

type LoginField = keyof LoginValues;
type LoginErrors = Partial<Record<LoginField, string>>;

function getLoginErrors(formData: FormData): LoginErrors {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (result.success) {
    return {};
  }

  const errors: LoginErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if ((field === "email" || field === "password") && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const field = target.name;
    if (field !== "email" && field !== "password") {
      return;
    }

    setSubmitted(false);
    setErrors(({ [field]: _fieldError, ...remainingErrors }) => {
      return remainingErrors;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = getLoginErrors(new FormData(event.currentTarget));
    const firstInvalidField = (["email", "password"] as const).find(
      (field) => nextErrors[field],
    );

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

  const errorEntries = Object.entries(errors) as Array<[LoginField, string]>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login form</CardTitle>
        <CardDescription>
          Validate credentials locally. No request will be sent.
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
            <Alert variant="destructive" aria-labelledby="login-errors-title">
              <AlertTitle id="login-errors-title">
                Correct {errorEntries.length} field
                {errorEntries.length === 1 ? "" : "s"}
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errorEntries.map(([field, message]) => (
                    <li key={field}>
                      <a href={`#login-${field}`}>{message}</a>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          {submitted ? (
            <Alert role="status" aria-live="polite">
              <CheckCircle2Icon aria-hidden="true" />
              <AlertTitle>Validation complete</AlertTitle>
              <AlertDescription>
                The values passed local validation. No authentication request
                was made and no session was created.
              </AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="login-email">Email address</FieldLabel>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "login-email-error" : "login-email-hint"
                }
              />
              <FieldDescription id="login-email-hint">
                Use any correctly formatted address.
              </FieldDescription>
              <FieldError id="login-email-error">{errors.email}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? "login-password-error"
                    : "login-password-hint"
                }
              />
              <FieldDescription id="login-password-hint">
                At least 8 characters for this validation demo.
              </FieldDescription>
              <FieldError id="login-password-error">
                {errors.password}
              </FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 border-t">
          <Button type="submit" className="w-full">
            <LogInIcon data-icon="inline-start" aria-hidden="true" />
            Validate form
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
