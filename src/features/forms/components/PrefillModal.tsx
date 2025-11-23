import { Dialog } from "@headlessui/react";
import { useMemo, useState } from "react";
import type { PrefillSourceGroup, PrefillMapping } from "../types/forms.types";

interface Props {
  open: boolean;
  onClose: () => void;
  sources: PrefillSourceGroup[];
  onSelect: (mapping: PrefillMapping) => void;
}

export function PrefillModal({ open, onClose, sources, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const allItems = useMemo(
    () =>
      sources.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          groupLabel: group.label,
        }))
      ),
    [sources]
  );

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems;
    const query = search.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.helperText?.toLowerCase().includes(query)
    );
  }, [allItems, search]);

  return (
    <Dialog open={open} onClose={onClose} as="div">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100">
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <Dialog.Title className="text-2xl font-semibold text-slate-900">
                Choose a prefill source
              </Dialog.Title>
              <p className="text-sm text-slate-500 mt-1">
                You can pull values from upstream forms or global data points.
              </p>
            </div>
            <button
              className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-4 border-b border-slate-100">
            <input
              type="search"
              placeholder="Search fields or data sources"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex max-h-[60vh] overflow-hidden divide-x divide-slate-100">
            <div className="w-60 overflow-y-auto px-4 py-5 space-y-2 bg-slate-50">
              {sources.map((group) => (
                <button
                  key={group.id}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => {
                    const firstItem = group.items[0];
                    if (firstItem) onSelect(firstItem.mapping);
                  }}
                  disabled={!group.items.length}
                >
                  {group.label}
                  <span className="block text-xs font-normal text-slate-400">
                    {group.items.length} option
                    {group.items.length === 1 ? "" : "s"}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {filteredItems.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-10">
                  No sources match “{search}”.
                </div>
              )}

              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left border border-slate-200 rounded-2xl px-4 py-3 hover:border-blue-300 hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => onSelect(item.mapping)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.helperText || item.groupLabel}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                      {item.badge ?? item.groupLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
