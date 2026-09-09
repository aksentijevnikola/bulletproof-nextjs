import { SettingsForm } from "./settings-form";

export function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-2">
        <p className="blueprint-kicker">Preferences / 02</p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Workspace preferences
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Profile values remain local to this form. Theme selection is applied
          in this browser.
        </p>
      </section>
      <SettingsForm />
    </div>
  );
}
