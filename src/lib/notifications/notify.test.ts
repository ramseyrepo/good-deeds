import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();
const findUniqueMock = vi.fn();
const sendEmailMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    notification: { create: (...a: unknown[]) => createMock(...a) },
    notificationWorkflowConfig: { findUnique: (...a: unknown[]) => findUniqueMock(...a) },
  },
}));
vi.mock("./email", () => ({ sendEmail: (...a: unknown[]) => sendEmailMock(...a) }));

import { notify } from "./notify";

beforeEach(() => {
  createMock.mockReset();
  findUniqueMock.mockReset();
  sendEmailMock.mockReset();
  sendEmailMock.mockResolvedValue({ sent: true });
});

describe("notify", () => {
  it("no-ops when the workflow config is disabled", async () => {
    findUniqueMock.mockResolvedValue({ key: "mention", enabled: false, channels: ["in_app"] });
    await notify("mention", { userSub: "u1", data: { title: "T", body: "B" } });
    expect(createMock).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("no-ops when there is no config row", async () => {
    findUniqueMock.mockResolvedValue(null);
    await notify("mention", { userSub: "u1", data: {} });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("inserts an in-app notification when enabled with in_app channel", async () => {
    findUniqueMock.mockResolvedValue({ key: "mention", enabled: true, channels: ["in_app"] });
    await notify("mention", { userSub: "u1", data: { title: "T", body: "B" } });
    expect(createMock).toHaveBeenCalledOnce();
    const arg = createMock.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(arg.data.userSub).toBe("u1");
    expect(arg.data.workflowKey).toBe("mention");
    expect(arg.data.title).toBe("T");
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("sends email when enabled with email channel and an address", async () => {
    findUniqueMock.mockResolvedValue({ key: "signup", enabled: true, channels: ["email"] });
    await notify("signup", { userSub: "u1", email: "a@b.com", data: { body: "hi" } });
    expect(sendEmailMock).toHaveBeenCalledOnce();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("never throws when the DB call fails", async () => {
    findUniqueMock.mockRejectedValue(new Error("db down"));
    await expect(notify("mention", { userSub: "u1", data: {} })).resolves.toBeUndefined();
  });

  it("does nothing for an unknown workflow key", async () => {
    findUniqueMock.mockResolvedValue({ key: "nope", enabled: true, channels: ["in_app"] });
    await notify("nope", { userSub: "u1", data: {} });
    expect(createMock).not.toHaveBeenCalled();
  });
});
