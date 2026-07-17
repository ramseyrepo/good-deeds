"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { markRead as markReadAction, markAllRead as markAllReadAction } from "@/actions/notifications";

export interface NotificationDTO {
  id: string;
  workflowKey: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

interface Snapshot {
  items: NotificationDTO[];
  unreadCount: number;
}

/**
 * Transport abstraction. Today: polling (fetch on focus + interval). The
 * interface is intentionally minimal so a future SSE/websocket transport can
 * drop in without touching the hook's consumers. SSE is NOT viable on Vercel
 * serverless today (request timeouts, no shared state), hence polling.
 */
interface Transport {
  start: (onData: (snap: Snapshot) => void) => () => void;
}

const POLL_INTERVAL_MS = 45_000;

function pollingTransport(): Transport {
  return {
    start(onData) {
      let stopped = false;
      const fetchOnce = async () => {
        try {
          const res = await fetch("/api/notifications", { cache: "no-store" });
          if (!res.ok) return;
          const snap = (await res.json()) as Snapshot;
          if (!stopped) onData(snap);
        } catch {
          /* network hiccup — next tick retries */
        }
      };
      void fetchOnce();
      const interval = setInterval(fetchOnce, POLL_INTERVAL_MS);
      const onFocus = () => void fetchOnce();
      window.addEventListener("focus", onFocus);
      return () => {
        stopped = true;
        clearInterval(interval);
        window.removeEventListener("focus", onFocus);
      };
    },
  };
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const transportRef = useRef<Transport>(pollingTransport());

  const apply = useCallback((snap: Snapshot) => {
    setItems(snap.items);
    setUnreadCount(snap.unreadCount);
  }, []);

  useEffect(() => {
    const stop = transportRef.current.start(apply);
    return stop;
  }, [apply]);

  const refresh = useCallback(() => {
    void fetch("/api/notifications", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((snap: Snapshot | null) => { if (snap) apply(snap); });
  }, [apply]);

  const markRead = useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    void markReadAction(id).then(() => refresh());
  }, [refresh]);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })));
    setUnreadCount(0);
    void markAllReadAction().then(() => refresh());
  }, [refresh]);

  return { items, unreadCount, markRead, markAllRead, refresh };
}
