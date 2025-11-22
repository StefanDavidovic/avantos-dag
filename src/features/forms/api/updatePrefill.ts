import { api } from "../../../api/client";
import type { PrefillMapping } from "../types/forms.types";

interface UpdatePrefillResponse {
  success: boolean;
  data: PrefillMapping;
}

interface UpdatePrefillParams {
  nodeId: string;
  field: string;
  mapping: PrefillMapping | null;
}

export async function updatePrefill({
  nodeId,
  field,
  mapping,
}: UpdatePrefillParams): Promise<UpdatePrefillResponse> {
  const res = await api.patch<UpdatePrefillResponse>(
    `/api/v1/forms/${nodeId}/prefill`,
    { field, mapping }
  );

  return res.data;
}
