import { useQuery } from "@tanstack/react-query";
import { api } from "../client";
import type { BlueprintGraph } from "./types";

export async function fetchBlueprint(): Promise<BlueprintGraph> {
  const res = await api.get<BlueprintGraph>(
    "/api/v1/demo/actions/blueprints/demo/graph"
  );
  return res.data;
}

export function useBlueprint() {
  return useQuery({
    queryKey: ["blueprint"],
    queryFn: fetchBlueprint,
  });
}
