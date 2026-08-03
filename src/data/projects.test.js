import { describe, it, expect } from "vitest";
import { PROJECTS, shippedCount, liveCount } from "./projects.js";

describe("projects data", () => {
  it("shippedCount matches the number of listed projects", () => {
    expect(shippedCount).toBe(PROJECTS.length);
  });

  it("liveCount only counts projects with a real href", () => {
    const expected = PROJECTS.filter((p) => p.href).length;
    expect(liveCount).toBe(expected);
  });

  it("every project has a unique slug", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
