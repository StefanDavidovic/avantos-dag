import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFormsGraph } from "../hooks/useFormGraph";
import { buildFormGraphLayout } from "../utils/graphLayout";

const COLUMN_WIDTH = 220;
const COLUMN_GAP = 120;
const ROW_HEIGHT = 120;
const ROW_GAP = 50;

export function FormsList() {
  const { data, isLoading, isError } = useFormsGraph();

  const layout = useMemo(
    () => (data ? buildFormGraphLayout(data.nodes) : null),
    [data]
  );

  const formsById = useMemo(
    () => new Map(data?.forms.map((form) => [form.id, form]) ?? []),
    [data]
  );

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-700">
        Loading forms...
      </div>
    );
  if (isError)
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-600">
        Failed to load forms.
      </div>
    );
  if (!data || !layout || layout.columns.length === 0)
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-700">
        No forms found.
      </div>
    );

  const width =
    layout.columns.length * COLUMN_WIDTH +
    Math.max(0, layout.columns.length - 1) * COLUMN_GAP;
  const height =
    Math.max(1, layout.maxRows) * ROW_HEIGHT +
    Math.max(0, layout.maxRows - 1) * ROW_GAP;

  const nodeCenters = new Map<
    string,
    { x: number; y: number; top: number; left: number }
  >();

  layout.columns.forEach((column) => {
    column.nodes.forEach((positioned) => {
      const left = positioned.level * (COLUMN_WIDTH + COLUMN_GAP);
      const top = positioned.rowIndex * (ROW_HEIGHT + ROW_GAP);
      nodeCenters.set(positioned.node.id, {
        x: left + COLUMN_WIDTH / 2,
        y: top + ROW_HEIGHT / 2,
        top,
        left,
      });
    });
  });

  const renderEdgeLines = () =>
    data.nodes.flatMap((node) => {
      const targets = node.data.prerequisites ?? [];
      return targets.map((parentId) => {
        const from = nodeCenters.get(parentId);
        const to = nodeCenters.get(node.id);
        if (!from || !to) return null;
        return (
          <line
            key={`${parentId}-${node.id}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#CBD5F5"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      });
    });

  const getFieldCount = (componentId: string) => {
    const form = formsById.get(componentId);
    if (!form) return 0;
    return Object.keys(form.field_schema.properties ?? {}).length;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-8 pt-10 pb-6">
        <div className="max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-900">Forms Graph</h1>
          <p className="text-base text-gray-600 mt-2">
            Visual overview of the blueprint graph. Click a form to configure its
            prefill settings.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6">
        <div className="h-full w-full rounded-2xl bg-white shadow-inner overflow-auto">
          <div
            className="relative mx-auto"
            style={{
              width: Math.max(width + 120, window.innerWidth - 64),
              height: Math.max(height + 120, window.innerHeight - 200),
            }}
          >
            <svg
              width={width + 120}
              height={height + 120}
              className="absolute inset-0 pointer-events-none"
            >
              <g transform="translate(60,60)">{renderEdgeLines()}</g>
            </svg>

            {layout.columns.map((column) =>
              column.nodes.map((positioned) => {
                const { left, top } = nodeCenters.get(positioned.node.id)!;
                const fieldCount = getFieldCount(
                  positioned.node.data.component_id
                );

                return (
                  <Link
                    key={positioned.node.id}
                    to={`/forms/${positioned.node.id}`}
                    className="absolute block rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-5 w-[220px]"
                    style={{
                      left: left + 60,
                      top: top + 60,
                      height: ROW_HEIGHT,
                    }}
                  >
                    <div className="text-xs uppercase text-slate-500 tracking-wide mb-1">
                      Level {positioned.level + 1}
                    </div>
                    <div className="text-xl font-semibold text-slate-900">
                      {positioned.node.data.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {fieldCount} field{fieldCount === 1 ? "" : "s"}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Depends on {positioned.node.data.prerequisites?.length ?? 0}{" "}
                      form
                      {positioned.node.data.prerequisites?.length === 1 ? "" : "s"}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
