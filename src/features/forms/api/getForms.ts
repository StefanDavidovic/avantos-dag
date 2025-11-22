import { api } from "../../../api/client";
import type { FormsResponse } from "../types/forms.types";

export async function fetchForms(): Promise<FormsResponse> {
  const res = await api.get<FormsResponse>(
    "/api/v1/demo/actions/blueprints/demo/graph"
  );

  return res.data;
}
