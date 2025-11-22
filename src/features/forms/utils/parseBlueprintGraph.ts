import type { BlueprintForm } from "../../../api/blueprint/types";

export type ParsedGraph = {
  formsById: Record<string, BlueprintForm>;
  next: Record<string, string[]>;
  root: string;
};

export function parseBlueprintGraph(data: any): ParsedGraph {
  const formsById: Record<string, BlueprintForm> = {};
  const next: Record<string, string[]> = {};

  data.forms.forEach((form) => {
    formsById[form.id] = form;
    next[form.id] = [];
  });

  data.edges.forEach((e) => {
    next[e.from].push(e.to);
  });

  const allTargets = new Set(data.edges.map((e) => e.to));
  const root = data.forms.find((f) => !allTargets.has(f.id))?.id;

  if (!root) throw new Error("Blueprint graph has no root form");

  return { formsById, next, root };
}
