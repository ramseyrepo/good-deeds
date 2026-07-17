import { describe, expect, it } from "vitest";
import { ping } from "./ping";

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.append(key, value);
  }
  return fd;
}

describe("ping action", () => {
  it("returns a greeting for a valid name", async () => {
    const result = await ping(makeFormData({ name: "Ada" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.message).toBe("Hello, Ada. Your stack is souped.");
    }
  });

  it("trims whitespace from the name", async () => {
    const result = await ping(makeFormData({ name: "  Linus  " }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.message).toContain("Linus");
  });

  it("rejects empty names", async () => {
    const result = await ping(makeFormData({ name: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Name is required");
  });

  it("rejects names over 60 characters", async () => {
    const result = await ping(makeFormData({ name: "x".repeat(61) }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Name is too long");
  });
});
