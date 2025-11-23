import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FormsList } from "../FormList";
import type { FormsResponse } from "../../types/forms.types";

vi.mock("../../hooks/useFormGraph", () => ({
  useFormsGraph: vi.fn(),
}));

const mockedUseFormsGraph = vi.mocked(
  await import("../../hooks/useFormGraph").then((mod) => mod.useFormsGraph)
);

const sampleGraph: FormsResponse = {
  nodes: [
    {
      id: "form-a",
      type: "form",
      data: {
        component_id: "schema-a",
        name: "Form A",
      },
    },
    {
      id: "form-b",
      type: "form",
      data: {
        component_id: "schema-b",
        name: "Form B",
        prerequisites: ["form-a"],
      },
    },
  ],
  forms: [
    {
      id: "schema-a",
      field_schema: { properties: { email: { type: "string", title: "Email" } } },
      ui_schema: {},
    },
    {
      id: "schema-b",
      field_schema: { properties: { name: { type: "string", title: "Name" } } },
      ui_schema: {},
    },
  ],
};

describe("FormsList", () => {
  beforeEach(() => {
    mockedUseFormsGraph.mockReturnValue({
      data: sampleGraph,
      isLoading: false,
      isError: false,
    } as any);
  });

  it("renders nodes from the graph response", () => {
    render(
      <MemoryRouter>
        <FormsList />
      </MemoryRouter>
    );

    expect(screen.getByText("Form A")).toBeInTheDocument();
    expect(screen.getByText("Form B")).toBeInTheDocument();
  });

  it("shows loading and error states", () => {
    mockedUseFormsGraph.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <FormsList />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading forms/i)).toBeInTheDocument();

    mockedUseFormsGraph.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);
    render(
      <MemoryRouter>
        <FormsList />
      </MemoryRouter>
    );
    expect(screen.getByText(/Failed to load forms/i)).toBeInTheDocument();
  });
});

