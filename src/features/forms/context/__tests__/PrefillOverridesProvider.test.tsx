import { describe, expect, it, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { PrefillOverridesProvider, PREFILL_OVERRIDES_STORAGE_KEY } from "../PrefillOverridesProvider";
import { usePrefillOverrides } from "../../hooks/usePrefillOverrides";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PrefillOverridesProvider>{children}</PrefillOverridesProvider>
);

beforeEach(() => {
  window.localStorage.clear();
});

describe("PrefillOverridesProvider", () => {
  it("hydrates overrides from localStorage", () => {
    window.localStorage.setItem(
      PREFILL_OVERRIDES_STORAGE_KEY,
      JSON.stringify({
        "form-a": {
          email: { type: "global_data", field: "client.email" },
        },
      })
    );

    const { result } = renderHook(() => usePrefillOverrides(), { wrapper });

    expect(
      result.current.applyOverrides("form-a", {
        name: { type: "global_data", field: "client.name" },
      })
    ).toMatchObject({
      email: { type: "global_data", field: "client.email" },
      name: { type: "global_data", field: "client.name" },
    });
  });

  it("persists overrides when updated", async () => {
    const { result } = renderHook(() => usePrefillOverrides(), { wrapper });

    act(() =>
      result.current.setOverride("form-b", "id", {
        type: "form_field",
        sourceFormId: "form-a",
        field: "id",
      })
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          window.localStorage.getItem(PREFILL_OVERRIDES_STORAGE_KEY) ?? "{}"
        )
      ).toMatchObject({
        "form-b": {
          id: { type: "form_field", sourceFormId: "form-a", field: "id" },
        },
      });
    });
  });

  it("removes overrides when mapping cleared", async () => {
    window.localStorage.setItem(
      PREFILL_OVERRIDES_STORAGE_KEY,
      JSON.stringify({
        "form-c": {
          email: { type: "global_data", field: "client.email" },
        },
      })
    );

    const { result } = renderHook(() => usePrefillOverrides(), { wrapper });

    act(() => result.current.setOverride("form-c", "email", null));

    await waitFor(() => {
      expect(window.localStorage.getItem(PREFILL_OVERRIDES_STORAGE_KEY)).toBe(
        null
      );
    });
  });
});

