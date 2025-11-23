import { useMemo, useReducer, type ReactNode } from "react";
import type { PrefillMapping } from "../types/forms.types";
import {
  PrefillOverridesContext,
  type PrefillOverridesState,
} from "./PrefillOverridesContext";

type Action = {
  type: "set";
  nodeId: string;
  field: string;
  mapping: PrefillMapping | null;
};

function reducer(
  state: PrefillOverridesState,
  action: Action
): PrefillOverridesState {
  switch (action.type) {
    case "set": {
      const { nodeId, field, mapping } = action;
      const node = state[nodeId] ?? {};

      const updatedNode =
        mapping === null
          ? Object.fromEntries(
              Object.entries(node).filter(([f]) => f !== field)
            )
          : { ...node, [field]: mapping };

      if (Object.keys(updatedNode).length === 0) {
        const { [nodeId]: _, ...rest } = state;
        return rest;
      }

      return {
        ...state,
        [nodeId]: updatedNode,
      };
    }

    default:
      return state;
  }
}

export function PrefillOverridesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {});

  const value = useMemo(() => {
    const applyOverrides = (
      nodeId: string,
      base: Record<string, PrefillMapping | undefined> = {}
    ) => {
      const nodeOverrides = state[nodeId];
      if (!nodeOverrides) return base;

      const result = { ...base };

      Object.entries(nodeOverrides).forEach(([field, mapping]) => {
        if (mapping === null) {
          delete result[field];
        } else {
          result[field] = mapping;
        }
      });

      return result;
    };

    return {
      overrides: state,
      setOverride: (
        nodeId: string,
        field: string,
        mapping: PrefillMapping | null
      ) => dispatch({ type: "set", nodeId, field, mapping }),
      applyOverrides,
    };
  }, [state]);

  return (
    <PrefillOverridesContext.Provider value={value}>
      {children}
    </PrefillOverridesContext.Provider>
  );
}
