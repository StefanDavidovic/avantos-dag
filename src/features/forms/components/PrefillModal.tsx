import { Dialog } from "@headlessui/react";
import type { PrefillSourceGroup, PrefillMapping } from "../types/forms.types";

interface Props {
  open: boolean;
  onClose: () => void;
  sources: PrefillSourceGroup[];
  onSelect: (mapping: PrefillMapping) => void;
}

export function PrefillModal({ open, onClose, sources, onSelect }: Props) {
  return (
    <Dialog open={open} onClose={onClose} as="div">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-4 w-96 shadow-lg">
          <Dialog.Title className="font-bold text-lg mb-3">
            Select Prefill Source
          </Dialog.Title>

          <div className="space-y-4">
            {sources.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold mb-1">{group.label}</h3>

                {group.forms?.map((form) => (
                  <div key={form.formId} className="mb-2">
                    <div className="font-medium">{form.formName}</div>
                    <div className="pl-2">
                      {form.fields.map((field) => (
                        <button
                          key={field}
                          className="block text-blue-600 hover:underline text-sm"
                          onClick={() =>
                            onSelect({
                              type: "form_field",
                              sourceFormId: form.formId,
                              field,
                            })
                          }
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {group.globals?.map((g) => (
                  <button
                    key={g.key}
                    className="block text-blue-600 hover:underline text-sm"
                    onClick={() =>
                      onSelect({
                        type: "global_data",
                        field: g.key,
                      })
                    }
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button
              className="text-sm text-gray-600 hover:underline"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
