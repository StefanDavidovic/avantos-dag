import type {
  PrefillSourceGroup,
  PrefillSourceOption,
  PrefillSourceProvider,
  PrefillSourceProviderContext,
} from "../types/forms.types";

const GLOBAL_DATA_SOURCES = [
  { key: "action.name", label: "Action Name" },
  { key: "action.owner", label: "Action Owner" },
  { key: "client.email", label: "Client Email" },
];

const formFieldOptionsFromNodeIds = (
  nodeIds: string[],
  context: PrefillSourceProviderContext
): PrefillSourceOption[] => {
  return nodeIds.flatMap((nodeId) => {
    const node = context.nodeMap.get(nodeId);
    if (!node) return [];

    const form = context.formsById.get(node.data.component_id);
    if (!form) return [];

    const fields = Object.keys(form.field_schema.properties ?? {});

    return fields.map((fieldKey) => ({
      id: `${nodeId}-${fieldKey}`,
      label: fieldKey,
      helperText: node.data.name,
      badge: "Form",
      mapping: {
        type: "form_field",
        sourceFormId: form.id,
        field: fieldKey,
      },
    }));
  });
};

const buildGroup = (
  id: string,
  label: string,
  items: PrefillSourceOption[]
): PrefillSourceGroup | null => {
  if (!items.length) return null;
  return {
    id,
    label,
    items,
  };
};

const directDependencyProvider: PrefillSourceProvider = {
  id: "direct",
  label: "Direct Dependencies",
  resolve: (context) =>
    buildGroup(
      "direct",
      "Direct Dependencies",
      formFieldOptionsFromNodeIds(context.directDependencyIds, context)
    ),
};

const transitiveDependencyProvider: PrefillSourceProvider = {
  id: "transitive",
  label: "Transitive Dependencies",
  resolve: (context) =>
    buildGroup(
      "transitive",
      "Transitive Dependencies",
      formFieldOptionsFromNodeIds(context.transitiveDependencyIds, context)
    ),
};

const globalDataProvider: PrefillSourceProvider = {
  id: "global",
  label: "Global Data",
  resolve: () =>
    buildGroup(
      "global",
      "Global Data",
      GLOBAL_DATA_SOURCES.map((source) => ({
        id: source.key,
        label: source.label,
        helperText: "Global data",
        badge: "Global",
        mapping: {
          type: "global_data",
          field: source.key,
        },
      }))
    ),
};

export const defaultPrefillSourceProviders: PrefillSourceProvider[] = [
  directDependencyProvider,
  transitiveDependencyProvider,
  globalDataProvider,
];

