import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useViewCount } from "./useViewCount.js";

describe("useViewCount", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the fetched count on success", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ value: 42 }),
    });
    const { result } = renderHook(() => useViewCount());
    await waitFor(() => expect(result.current).toBe(42));
  });

  it("stays null when the request fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useViewCount());
    await waitFor(() => expect(result.current).toBeNull());
  });
});
