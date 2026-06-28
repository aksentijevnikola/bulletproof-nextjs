import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import { SettingsForm } from "@/features/settings/settings-form";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

describe("SettingsForm", () => {
  test("focuses the first invalid profile field and shows a summary", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm />);

    const name = screen.getByLabelText("Display name");
    const email = screen.getByLabelText("Email address");
    await user.clear(name);
    await user.clear(email);
    await user.click(
      screen.getByRole("button", { name: "Validate preferences" }),
    );

    expect(
      screen.getByRole("alert", { name: /correct 2 fields/i }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(name).toHaveFocus();
    });
  });

  test("applies theme selection and reports that profile values are not saved", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm />);

    await user.click(screen.getByRole("combobox", { name: "Theme" }));
    await user.click(screen.getByRole("option", { name: "Dark" }));
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
    await user.click(
      screen.getByRole("button", { name: "Validate preferences" }),
    );

    expect(screen.getByText("Preferences validated")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preferences validated",
    );
    expect(
      screen.getByText(/not sent to a server or saved/i),
    ).toBeInTheDocument();
  });

  test("clears stale validation state when fields change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm />);

    const name = screen.getByLabelText("Display name");
    await user.clear(name);
    await user.click(
      screen.getByRole("button", { name: "Validate preferences" }),
    );

    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getAllByText("Display name must contain at least 2 characters."),
    ).toHaveLength(2);

    await user.type(name, "bulletproof-nextjs Operator");

    expect(name).toHaveAttribute("aria-invalid", "false");
    expect(
      screen.queryByText("Display name must contain at least 2 characters."),
    ).not.toBeInTheDocument();
  });

  test("clears success state after validated values change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm />);

    await user.click(
      screen.getByRole("button", { name: "Validate preferences" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preferences validated",
    );

    await user.type(screen.getByLabelText("Display name"), "!");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("clears success state after select values change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm />);

    await user.click(
      screen.getByRole("button", { name: "Validate preferences" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preferences validated",
    );

    await user.click(screen.getByRole("combobox", { name: "Timezone" }));
    await user.click(screen.getByRole("option", { name: "Europe/London" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
