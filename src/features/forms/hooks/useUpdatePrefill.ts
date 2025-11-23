import { useMutation } from "@tanstack/react-query";
import type { PrefillMapping } from "../types/forms.types";
import { usePrefillOverrides } from "./usePrefillOverrides";

interface UpdatePrefillParams {
  nodeId: string;
  field: string;
  mapping: PrefillMapping | null;
}

interface UpdatePrefillResult {
  success: boolean;
  data: PrefillMapping | null;
}

export function useUpdatePrefill() {
  const { setOverride } = usePrefillOverrides();

  return useMutation<UpdatePrefillResult, Error, UpdatePrefillParams>({
    mutationFn: async ({ nodeId, field, mapping }) => {
      setOverride(nodeId, field, mapping);
      return { success: true, data: mapping };
    },
  });
}
