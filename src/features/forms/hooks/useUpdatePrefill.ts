import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePrefill } from "../api/updatePrefill";

export function useUpdatePrefill() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updatePrefill,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forms-graph"] });
    },
  });
}
