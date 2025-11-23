import { useMemo } from "react";
import {
  getDirectDependencies,
  getTransitiveDependencies,
} from "../utils/graph";
import type {
  PrefillSourceGroup,
  PrefillSourceProvider,
} from "../types/forms.types";
import { useFormsGraph } from "./useFormGraph";
import { defaultPrefillSourceProviders } from "../utils/prefillSourceProviders";

export function usePrefillSources(
  nodeId: string | undefined,
  providers: PrefillSourceProvider[] = defaultPrefillSourceProviders
) {
  const { data, isLoading, error } = useFormsGraph();

  const sources = useMemo<PrefillSourceGroup[] | undefined>(() => {
    if (!data || !nodeId) return;

    const { nodes, forms } = data;
    const activeNode = nodes.find((n) => n.id === nodeId);
    if (!activeNode) return [];

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const formsById = new Map(forms.map((form) => [form.id, form]));

    const directDependencyIds = getDirectDependencies(nodeId, nodes);
    const allTransitive = getTransitiveDependencies(nodeId, nodes);
    const transitiveDependencyIds = allTransitive.filter(
      (upstreamId) => !directDependencyIds.includes(upstreamId)
    );

    const context = {
      activeNode,
      nodes,
      nodeMap,
      formsById,
      directDependencyIds,
      transitiveDependencyIds,
    };

    return providers
      .map((provider) => provider.resolve(context))
      .filter((group): group is PrefillSourceGroup => Boolean(group));
  }, [data, nodeId, providers]);

  return {
    sources,
    isLoading,
    error,
  };
}
