import React from "react";
import type { FormViewModel } from "../types/forms.types";

interface Props {
  form: FormViewModel;
  onSelect?: (formId: string) => void;
}

export const FormCard: React.FC<Props> = ({ form, onSelect }) => {
  return (
    <div
      className="border rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-shadow shadow-sm hover:shadow-md"
      onClick={() => onSelect?.(form.nodeId)}
    >
      <h3 className="text-lg font-semibold">{form.name}</h3>
      <p className="text-sm text-gray-600">{form.fieldCount} fields</p>
    </div>
  );
};
