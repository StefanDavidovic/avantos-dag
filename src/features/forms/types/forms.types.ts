export interface FormFieldSchema {
  type: string;
  title: string;
  description?: string;
}

export interface FormSchema {
  id: string;
  field_schema: {
    properties: Record<string, FormFieldSchema>;
  };
  ui_schema: Record<string, unknown>;
}

export interface Node {
  id: string;
  type: "form";
  data: {
    component_id: string;
    name: string;
    prerequisites?: string[];
    input_mapping?: Record<string, PrefillMapping>;
  };
}

export interface FormsResponse {
  nodes: Node[];
  forms: FormSchema[];
}

export interface FormViewModel {
  nodeId: string;
  formId: string;
  name: string;
  fieldCount: number;
}

export interface PrefillMapping {
  type: "form_field" | "global_data";
  sourceFormId?: string;
  field?: string;
}

export interface PrefillSourceOption {
  id: string;
  label: string;
  helperText?: string;
  badge?: string;
  mapping: PrefillMapping;
}

export interface PrefillSourceGroup {
  id: string;
  label: string;
  items: PrefillSourceOption[];
}

export interface PrefillSourceProviderContext {
  activeNode: Node;
  nodes: Node[];
  nodeMap: Map<string, Node>;
  formsById: Map<string, FormSchema>;
  directDependencyIds: string[];
  transitiveDependencyIds: string[];
}

export interface PrefillSourceProvider {
  id: string;
  label: string;
  resolve(
    context: PrefillSourceProviderContext
  ): PrefillSourceGroup | null | undefined;
}
