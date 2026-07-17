"use client";

import { useState, useTransition } from "react";
import { ping, type PingResult } from "@/actions/ping";

export function WfPingForm() {
  const [result, setResult] = useState<PingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await ping(formData);
      setResult(res);
    });
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ping-name"
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-wf-cyan"
        >
          Name
        </label>
        <input
          id="ping-name"
          name="name"
          placeholder="Chef"
          autoComplete="off"
          className="wf-card px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-wf-cyan/60"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="wf-btn-primary self-start px-7 py-3 text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Pinging…" : "Ping"}
      </button>
      {result && (
        <div
          role="status"
          aria-live="polite"
          className="wf-card mt-2 px-3 py-2 text-sm"
          style={
            result.ok
              ? { color: "rgba(255,255,255,0.85)" }
              : {
                  borderColor: "rgba(255, 107, 107, 0.4)",
                  backgroundColor: "rgba(255, 107, 107, 0.12)",
                  color: "#ffb4b4",
                }
          }
        >
          {result.ok ? result.message : result.error}
        </div>
      )}
    </form>
  );
}
