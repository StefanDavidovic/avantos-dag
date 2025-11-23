import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormDetails } from "../FormDetails";
import type { FormsResponse, PrefillSourceGroup } from "../../types/forms.types";

vi.mock("../../hooks/useFormGraph", () => ({
  useFormsGraph: vi.fn(),
}));

vi.mock("../../hooks/usePrefillSources", () => ({
  usePrefillSources: vi.fn(),
}));

vi.mock("../../hooks/usePrefillOverrides", () => ({
  usePrefillOverrides: vi.fn(),
}));

const mockedUseFormsGraph = vi.mocked(
  await import("../../hooks/useFormGraph").then((mod) => mod.useFormsGraph)
);
const mockedUsePrefillSources = vi.mocked(
  await import("../../hooks/usePrefillSources").then(
    (mod) => mod.usePrefillSources
  )
);
const mockedUsePrefillOverrides = vi.mocked(
  await import("../../hooks/usePrefillOverrides").then(
    (mod) => mod.usePrefillOverrides
  )
);

const graph: FormsResponse = {
  nodes: [
    {
      id: "form-a",
      type: "form",
      data: {
        component_id: "schema-a",
        name: "Form A",
        input_mapping: {},
      },
    },
  ],
  forms: [
    {
      id: "schema-a",
      field_schema: {
        properties: {
          email: { type: "string", title: "Email" },
          name: { type: "string", title: "Name" },
        },
      },
      ui_schema: {},
    },
  ],
};

const sources: PrefillSourceGroup[] = [
  {
    id: "direct",
    label: "Direct",
    items: [
      {
        id: "form-x-email",
        label: "Email",
        helperText: "Form X",
        mapping: {
          type: "form_field",
          sourceFormId: "form-x",
          field: "email",
        },
      },
    ],
  },
];

describe("FormDetails", () => {
  beforeEach(() => {
    mockedUseFormsGraph.mockReturnValue({
      data: graph,
      isLoading: false,
    } as any);
    mockedUsePrefillSources.mockReturnValue({
      sources,
      isLoading: false,
      error: null,
    } as any);
    mockedUsePrefillOverrides.mockReturnValue({
      applyOverrides: () => ({}),
    } as any);
  });

  const renderRoute = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/forms/form-a"]}>
          <Routes>
            <Route path="/forms/:nodeId" element={<FormDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it("renders fields and metadata", () => {
    renderRoute();

    expect(screen.getByText("Form Details")).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
  });

  it("opens modal when clicking a field", async () => {
    renderRoute();
    const user = userEvent.setup();

    const emailRow = screen.getByRole("button", { name: /email/i });
    await user.click(emailRow);

    expect(screen.getByText(/Choose a prefill source/i)).toBeInTheDocument();

    const option = within(screen.getByRole("dialog")).getByText("Email");
    await user.click(option);
  });
});

