import type { FormsResponse, FormViewModel } from "../types/forms.types";

export function buildFormsView(data: FormsResponse): FormViewModel[] {
  const { nodes, forms } = data;

  const formsById = new Map(forms.map((f) => [f.id, f]));

  return nodes.map((node) => {
    const schema = formsById.get(node.data.component_id);
    if (!schema) {
      throw new Error(
        `Form definition missing for component_id=${node.data.component_id}`
      );
    }

    const fieldCount = Object.keys(schema.field_schema.properties).length;

    return {
      nodeId: node.id,
      formId: schema.id,
      name: node.data.name,
      fieldCount,
    };
  });
}
