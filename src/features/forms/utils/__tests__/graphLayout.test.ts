import { describe, expect, it } from "vitest";
import { buildFormGraphLayout } from "../graphLayout";
import type { Node } from "../../types/forms.types";

const sampleNodes: Node[] = [
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
  {
    id: "form-c",
    type: "form",
    data: {
      component_id: "schema-c",
      name: "Form C",
      prerequisites: ["form-a"],
    },
  },
  {
    id: "form-d",
    type: "form",
    data: {
      component_id: "schema-d",
      name: "Form D",
      prerequisites: ["form-b", "form-c"],
    },
  },
];

describe("buildFormGraphLayout", () => {
  it("places root nodes in the first column", () => {
    const layout = buildFormGraphLayout(sampleNodes);
    const rootNode = layout.positionedNodes.find(
      (node) => node.node.id === "form-a"
    );

    expect(rootNode?.level).toBe(0);
  });

  it("assigns each node level based on deepest prerequisite", () => {
    const layout = buildFormGraphLayout(sampleNodes);
    const levelMap = new Map(
      layout.positionedNodes.map((p) => [p.node.id, p.level])
    );

    expect(levelMap.get("form-b")).toBe(1);
    expect(levelMap.get("form-c")).toBe(1);
    expect(levelMap.get("form-d")).toBe(2);
  });

  it("tracks max rows for sizing", () => {
    const layout = buildFormGraphLayout(sampleNodes);
    expect(layout.maxRows).toBe(2);
  });
});

