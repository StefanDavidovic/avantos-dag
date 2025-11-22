import { useState } from "react";
import type { PrefillMapping } from "../types/forms.types";
import { PrefillModal } from "./PrefillModal";
import { usePrefillSources } from "../hooks/usePrefillSources";
import { useUpdatePrefill } from "../hooks/useUpdatePrefill";

interface Props {
  nodeId: string;
  fieldName: string;
  currentPrefill?: PrefillMapping;
}

export function PrefillRow({ nodeId, fieldName, currentPrefill }: Props) {
  const [open, setOpen] = useState(false);
  const { sources } = usePrefillSources(nodeId);
  const update = useUpdatePrefill();

  const hasMapping = Boolean(currentPrefill);

  return (
    <div className="flex items-center justify-between border rounded p-2 bg-gray-100">
      <span className="font-medium">{fieldName}</span>

      {hasMapping ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {currentPrefill?.type === "form_field"
              ? `From form ${currentPrefill.sourceFormId} → ${currentPrefill.field}`
              : `Global: ${currentPrefill?.field}`}
          </span>

          <button
            className="text-red-600 text-sm hover:underline"
            onClick={() =>
              update.mutate({
                nodeId,
                field: fieldName,
                mapping: null,
              })
            }
          >
            X
          </button>
        </div>
      ) : (
        <button
          className="text-blue-600 text-sm hover:underline"
          onClick={() => setOpen(true)}
        >
          Add Prefill
        </button>
      )}

      {sources && (
        <PrefillModal
          open={open}
          onClose={() => setOpen(false)}
          sources={sources}
          onSelect={(mapping) => {
            update.mutate(
              { nodeId, field: fieldName, mapping },
              { onSuccess: () => setOpen(false) }
            );
          }}
        />
      )}
    </div>
  );
}
