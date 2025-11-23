import { useContext } from "react";
import { PrefillOverridesContext } from "../context/PrefillOverridesContext";

export function usePrefillOverrides() {
  const context = useContext(PrefillOverridesContext);
  if (!context) {
    throw new Error("usePrefillOverrides must be used within its provider");
  }

  return context;
}

