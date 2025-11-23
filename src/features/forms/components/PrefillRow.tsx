import { useState } from "react";
import type { PrefillMapping, PrefillSourceGroup } from "../types/forms.types";
import { PrefillModal } from "./PrefillModal";
import { useUpdatePrefill } from "../hooks/useUpdatePrefill";

interface Props {
  nodeId: string;
  fieldName: string;
  currentPrefill?: PrefillMapping;
  sources?: PrefillSourceGroup[];
}

function isSameMapping(a?: PrefillMapping, b?: PrefillMapping) {
  if (!a || !b) return false;
  if (a.type !== b.type) return false;
  if (a.type === "form_field" && b.type === "form_field") {
    return a.sourceFormId === b.sourceFormId && a.field === b.field;
  }

  return a.field === b.field;
}

export function PrefillRow({
  nodeId,
  fieldName,
  currentPrefill,
  sources,
}: Props) {
  const [open, setOpen] = useState(false);
  const update = useUpdatePrefill();

  const hasMapping = Boolean(currentPrefill);

  const mappingSummary = (() => {
    if (!currentPrefill) return null;
    if (!sources?.length) {
      if (currentPrefill.type === "form_field") {
        return {
          title: currentPrefill.field ?? "",
          subtitle: currentPrefill.sourceFormId ?? "",
        };
      }
      return {
        title: currentPrefill.field ?? "",
        subtitle: "Global data",
      };
    }

    for (const group of sources) {
      for (const option of group.items) {
        if (isSameMapping(option.mapping, currentPrefill)) {
          return {
            title: option.label,
            subtitle: option.helperText ?? group.label,
          };
        }
      }
    }

    return null;
  })();

  const handleOpen = () => {
    if (!sources?.length) return;
    setOpen(true);
  };

  const handleClear = () =>
    update.mutate({
      nodeId,
      field: fieldName,
      mapping: null,
    });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!sources?.length}
        className={`w-full text-left rounded-2xl border ${
          hasMapping
            ? "border-slate-300 bg-white"
            : "border-slate-200 bg-slate-50"
        } px-5 py-4 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 capitalize">
              {fieldName.replace(/_/g, " ")}
            </p>
            {hasMapping && mappingSummary ? (
              <p className="text-sm text-slate-600 mt-1">
                Prefilled with{" "}
                <span className="font-semibold text-slate-900">
                  {mappingSummary.title}
                </span>
                {mappingSummary.subtitle && ` · ${mappingSummary.subtitle}`}
              </p>
            ) : (
              <p className="text-sm text-slate-500 mt-1">
                No prefill set for this field
              </p>
            )}
          </div>

          {hasMapping && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              style={{ fontSize: "1.3rem", fontWeight: 600 }}
              className="font-bold text-slate-400 hover:text-red-500 transition"
              aria-label={`Clear prefill for ${fieldName}`}
              disabled={update.isPending}
            >
              x
            </button>
          )}
        </div>
      </button>

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
    </>
  );
}
