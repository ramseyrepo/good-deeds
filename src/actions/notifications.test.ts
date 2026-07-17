import { describe, it, expect, vi, beforeEach } from "vitest";

const updateManyMock = vi.fn();
const getSessionMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: { notification: { updateMany: (...a: unknown[]) => updateManyMock(...a) } },
}));
vi.mock("@/lib/auth", () => ({ getCurrentSession: () => getSessionMock() }));

import { markRead, markAllRead } from "./notifications";

beforeEach(() => {
  updateManyMock.mockReset().mockResolvedValue({ count: 1 });
  getSessionMock.mockReset().mockResolvedValue({ sub: "u1" });
});

describe("notification actions", () => {
  it("markRead scopes the update to the current user's sub", async () => {
    const res = await markRead("n1");
    expect(res.ok).toBe(true);
    const arg = updateManyMock.mock.calls[0][0] as { where: Record<string, unknown> };
    expect(arg.where.id).toBe("n1");
    expect(arg.where.userSub).toBe("u1");
  });

  it("markRead returns ok:false with no session", async () => {
    getSessionMock.mockResolvedValue(null);
    const res = await markRead("n1");
    expect(res.ok).toBe(false);
    expect(updateManyMock).not.toHaveBeenCalled();
  });

  it("markAllRead updates all unread for the user", async () => {
    const res = await markAllRead();
    expect(res.ok).toBe(true);
    const arg = updateManyMock.mock.calls[0][0] as { where: Record<string, unknown> };
    expect(arg.where.userSub).toBe("u1");
    expect(arg.where.readAt).toBeNull();
  });
});
