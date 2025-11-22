export interface BlueprintField {
  id: string;
  type: string;
  label?: string;
  path?: string;
}

export interface BlueprintForm {
  id: string;
  name: string;
  ui_schema: any;
  field_schema: any;
}

export interface BlueprintEdge {
  from: string;
  to: string;
}

export interface BlueprintGraph {
  forms: BlueprintForm[];
  edges: BlueprintEdge[];
}
