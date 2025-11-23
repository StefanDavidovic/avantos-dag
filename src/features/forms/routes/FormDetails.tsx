import { Link, useParams } from "react-router-dom";
import { PrefillRow } from "../components/PrefillRow";
import { useFormsGraph } from "../hooks/useFormGraph";
import { findFormSchemaForNode, findNodeById } from "../utils/formNodes";
import { usePrefillSources } from "../hooks/usePrefillSources";
import { usePrefillOverrides } from "../hooks/usePrefillOverrides";

export function FormDetails() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { data, isLoading } = useFormsGraph();
  const { applyOverrides } = usePrefillOverrides();
  const {
    sources,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = usePrefillSources(nodeId);

  if (isLoading) return <div>Loading...</div>;
  if (!data || !nodeId) return <div>Error</div>;

  const node = findNodeById(data.nodes, nodeId);
  if (!node) return <div>Node not found</div>;

  const schema = findFormSchemaForNode(node, data.forms);
  if (!schema) return <div>Schema missing</div>;

  const fields = Object.keys(schema.field_schema.properties);
  const serverPrefill = node.data.input_mapping ?? {};
  const effectivePrefill = applyOverrides(nodeId, serverPrefill);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/forms" className="text-blue-600 hover:underline">
            ← Back to forms
          </Link>
        </div>

        <div className="mx-auto w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-[0.2em]">
            Form Details
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {node.data.name}
          </h1>
          <p className="text-base text-slate-600">
            Configure how downstream data should prefill this form’s fields. You
            can mix direct dependencies, upstream dependencies, and global data.
          </p>
        </div>

        <section className="mx-auto w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Prefill</h2>
              <p className="text-sm text-slate-600">
                Select a field to add or edit its prefill source.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {sourcesLoading
                ? "Loading…"
                : `${sources?.length ?? 0} source groups`}
            </span>
          </div>

          {sourcesError && (
            <p className="text-sm text-red-600">
              Unable to load prefill sources. Try again later.
            </p>
          )}

          <div className="space-y-3">
            {fields.map((f) => (
              <PrefillRow
                key={f}
                nodeId={nodeId}
                fieldName={f}
                currentPrefill={effectivePrefill[f]}
                sources={sources}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
