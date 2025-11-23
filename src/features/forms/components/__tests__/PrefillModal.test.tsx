import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrefillModal } from "../PrefillModal";
import type { PrefillSourceGroup } from "../../types/forms.types";

const sources: PrefillSourceGroup[] = [
  {
    id: "direct",
    label: "Direct Dependencies",
    items: [
      {
        id: "form-a-email",
        label: "Email",
        helperText: "Form A",
        badge: "Form",
        mapping: {
          type: "form_field",
          sourceFormId: "form-a",
          field: "email",
        },
      },
    ],
  },
  {
    id: "global",
    label: "Global Data",
    items: [
      {
        id: "global-client",
        label: "Client Email",
        helperText: "Global data",
        badge: "Global",
        mapping: {
          type: "global_data",
          field: "client.email",
        },
      },
    ],
  },
];

describe("PrefillModal", () => {
  it("filters items via search and calls onSelect", async () => {
    const onSelect = vi.fn();
    render(
      <PrefillModal
        open
        onClose={() => undefined}
        sources={sources}
        onSelect={onSelect}
      />
    );

    const user = userEvent.setup();
    await user.type(
      screen.getByPlaceholderText(/search fields/i),
      "client email"
    );

    expect(screen.queryByText("Email")).not.toBeInTheDocument();
    expect(screen.getByText("Client Email")).toBeInTheDocument();

    await user.click(screen.getByText("Client Email"));
    expect(onSelect).toHaveBeenCalledWith({
      type: "global_data",
      field: "client.email",
    });
  });

  it("allows choosing options without searching", async () => {
    const onSelect = vi.fn();
    render(
      <PrefillModal
        open
        onClose={() => undefined}
        sources={sources}
        onSelect={onSelect}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Email"));

    expect(onSelect).toHaveBeenCalledWith({
      type: "form_field",
      sourceFormId: "form-a",
      field: "email",
    });
  });
});

