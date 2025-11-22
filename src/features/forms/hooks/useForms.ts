import { useQuery } from "@tanstack/react-query";
import type { FormViewModel } from "../types/forms.types";
import { fetchForms } from "../api/getForms";
import { buildFormsView } from "../utils/buildFormsView";

export function useForms(): {
  data?: FormViewModel[];
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
    staleTime: Infinity,
  });

  return {
    data: data ? buildFormsView(data) : undefined,
    isLoading,
    isError,
  };
}
