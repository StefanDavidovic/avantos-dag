import { useQuery } from "@tanstack/react-query";
import { fetchForms } from "../api/getForms";

export function useFormsGraph() {
  return useQuery({
    queryKey: ["forms-raw"],
    queryFn: fetchForms,
  });
}
