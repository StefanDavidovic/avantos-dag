import { createContext } from "react";
import type { PrefillMapping } from "../types/forms.types";

export type PrefillOverridesState = Record<
  string,
  Record<string, PrefillMapping | null>
>;

export interface PrefillOverridesValue {
  overrides: PrefillOverridesState;
  setOverride: (
    nodeId: string,
    field: string,
    mapping: PrefillMapping | null
  ) => void;
  applyOverrides: (
    nodeId: string,
    base?: Record<string, PrefillMapping | undefined>
  ) => Record<string, PrefillMapping | undefined>;
}

export const PrefillOverridesContext =
  createContext<PrefillOverridesValue | undefined>(undefined);

