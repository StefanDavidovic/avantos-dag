import { useParams } from "react-router-dom";
import { PrefillRow } from "../components/PrefillRow";
import { useFormsGraph } from "../hooks/useFormGraph";
import { findFormSchemaForNode, findNodeById } from "../utils/formNodes";

export function FormDetails() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { data, isLoading } = useFormsGraph();

  if (isLoading) return <div>Loading...</div>;
  if (!data || !nodeId) return <div>Error</div>;

  const node = findNodeById(data.nodes, nodeId);
  if (!node) return <div>Node not found</div>;

  const schema = findFormSchemaForNode(node, data.forms);
  if (!schema) return <div>Schema missing</div>;

  const fields = Object.keys(schema.field_schema.properties);
  const prefill = node.data.input_mapping ?? {};

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">{node.data.name}</h1>

      {fields.map((f) => (
        <PrefillRow
          key={f}
          nodeId={nodeId}
          fieldName={f}
          currentPrefill={prefill[f]}
        />
      ))}
    </div>
  );
}
