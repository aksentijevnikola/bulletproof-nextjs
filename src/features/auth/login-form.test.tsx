import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import { LoginForm } from "@/features/auth/login-form";
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

describe("LoginForm", () => {
  test("announces errors and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Validate form" }));

    expect(
      screen.getByRole("alert", { name: /correct 2 fields/i }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText("Email address")).toHaveFocus();
    });
    expect(screen.getAllByText("Enter a valid email address.")).toHaveLength(2);
    expect(
      screen.getAllByText("Password must contain at least 8 characters."),
    ).toHaveLength(2);
  });

  test("reports local validation success without claiming authentication", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Email address"), "dev@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Validate form" }));

    expect(screen.getByText("Validation complete")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Validation complete");
    expect(
      screen.getByText(/no authentication request was made/i),
    ).toBeInTheDocument();
  });

  test("clears stale validation state when fields change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const email = screen.getByLabelText("Email address");
    await user.click(screen.getByRole("button", { name: "Validate form" }));

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByText("Enter a valid email address.")).toHaveLength(2);

    await user.type(email, "dev@example.com");

    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(
      screen.queryByText("Enter a valid email address."),
    ).not.toBeInTheDocument();
  });

  test("clears success state after validated values change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Email address"), "dev@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Validate form" }));

    expect(screen.getByRole("status")).toHaveTextContent("Validation complete");

    await user.type(screen.getByLabelText("Password"), "!");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
