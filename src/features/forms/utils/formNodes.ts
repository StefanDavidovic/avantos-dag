import type { FormSchema, Node } from "../types/forms.types";

export function findNodeById(nodes: Node[], nodeId?: string) {
  if (!nodeId) return null;
  return nodes.find((n) => n.id === nodeId) ?? null;
}

export function findFormSchemaForNode(node: Node, forms: FormSchema[]) {
  return forms.find((f) => f.id === node?.data.component_id);
}
