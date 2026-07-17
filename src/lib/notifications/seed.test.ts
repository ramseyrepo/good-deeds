import { describe, it, expect, vi, beforeEach } from "vitest";

const upsertMock = vi.fn();
vi.mock("@/lib/db", () => ({
  db: { notificationWorkflowConfig: { upsert: (...a: unknown[]) => upsertMock(...a) } },
}));
vi.mock("./workflows", () => ({
  WORKFLOWS: [
    {
      key: "welcome", label: "Welcome", description: "d",
      availableChannels: ["in_app", "email"], defaultChannels: ["in_app"],
      renderInApp: () => ({ title: "", body: "" }),
      renderEmail: () => ({ subject: "", html: "" }),
    },
  ],
}));

import { seedWorkflowConfigs } from "./seed";

beforeEach(() => upsertMock.mockReset());

describe("seedWorkflowConfigs", () => {
  it("upserts one row per workflow, preserving enabled/channels on update", async () => {
    upsertMock.mockResolvedValue({});
    await seedWorkflowConfigs();
    expect(upsertMock).toHaveBeenCalledOnce();
    const arg = upsertMock.mock.calls[0][0] as {
      where: { key: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    };
    expect(arg.where.key).toBe("welcome");
    // create seeds enabled=false + default channels
    expect(arg.create.enabled).toBe(false);
    // update must NOT include enabled or channels (user-owned)
    expect(arg.update).not.toHaveProperty("enabled");
    expect(arg.update).not.toHaveProperty("channels");
    expect(arg.update).toHaveProperty("label");
    expect(arg.update).toHaveProperty("availableChannels");
  });
});
