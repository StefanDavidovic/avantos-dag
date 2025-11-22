import { useMemo } from "react";
import {
  getDirectDependencies,
  getTransitiveDependencies,
} from "../utils/graph";
import type { PrefillSourceGroup } from "../types/forms.types";
import { useFormsGraph } from "./useFormGraph";

export function usePrefillSources(nodeId: string | undefined) {
  const { data, isLoading, error } = useFormsGraph();

  const sources = useMemo<PrefillSourceGroup[] | undefined>(() => {
    if (!data || !nodeId) return;

    const { nodes, forms } = data;

    const direct = getDirectDependencies(nodeId, nodes);
    const transitive = getTransitiveDependencies(nodeId, nodes);

    const formsById = new Map(forms.map((f) => [f.id, f]));

    const mapToFormFields = (formIds: string[]) =>
      formIds
        .map((formId) => formsById.get(formId))
        .filter(Boolean)
        .map((form) => ({
          formId: form!.id,
          formName: form!.id,
          fields: Object.keys(form!.field_schema.properties),
        }));

    return [
      {
        label: "Direct Dependencies",
        type: "direct",
        forms: mapToFormFields(direct),
      },
      {
        label: "Transitive Dependencies",
        type: "transitive",
        forms: mapToFormFields(transitive),
      },
      {
        label: "Global Data",
        type: "global",
        globals: [
          { key: "client.name", label: "Client Name" },
          { key: "client.email", label: "Client Email" },
        ],
      },
    ];
  }, [data, nodeId]);

  return {
    sources,
    isLoading,
    error,
  };
}
