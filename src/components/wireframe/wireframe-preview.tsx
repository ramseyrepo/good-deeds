"use client";

import { useState } from "react";

type Device = "desktop" | "tablet" | "mobile";

function PreviewBanner({ device, setDevice }: { device: Device; setDevice: (d: Device) => void }) {
  return (
    <div className="wf-banner sticky top-0 z-50 flex items-center justify-between px-5 py-2.5 gap-2.5">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-wf-orange shrink-0" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-wf-orange shrink-0">
          Structure Preview
        </span>
      </div>
      <div className="flex gap-0.5 shrink-0 bg-black/25 rounded-[3px] p-0.5">
        {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-[3px] border-none cursor-pointer transition-all duration-150"
            style={{
              background: device === d ? "var(--wf-orange)" : "transparent",
              color: device === d ? "#ffffff" : "rgba(255,255,255,0.4)",
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

type WireframePreviewProps = {
  /**
   * Render-prop that receives the current device. Use it to switch
   * layout breakpoints inside Wf* blocks the same way the live device
   * tabs do (e.g. <WfSection compact={device === "mobile"}>).
   */
  children: (device: Device) => React.ReactNode;
};

/**
 * Optional preview chrome for wireframe surfaces. Wraps your blocks in
 * a sticky "Structure Preview" banner with a desktop/tablet/mobile switcher
 * and a device frame, so a stakeholder can see how the layout reflows
 * before any real styling lands.
 *
 * Use it at the page level when you want this preview UX; skip it (just
 * render Wf* blocks directly) when you only want the wireframe look
 * without the chrome.
 */
export function WireframePreview({ children }: WireframePreviewProps) {
  const [device, setDevice] = useState<Device>("desktop");

  const isDesktop = device === "desktop";
  const frameWidth = isDesktop ? 1100 : device === "tablet" ? 768 : 390;
  const frameRadius = isDesktop ? 0 : device === "mobile" ? 20 : 10;
  const statusBarH = device === "mobile" ? 44 : device === "tablet" ? 32 : 0;

  return (
    <div className="wf-grid min-h-screen">
      <PreviewBanner device={device} setDevice={setDevice} />
      <div
        className="flex justify-center"
        style={{
          padding: isDesktop ? "16px 0 60px" : "40px 24px 60px",
          transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            width: frameWidth,
            flexShrink: 0,
            borderRadius: frameRadius,
            overflow: "hidden",
            border: isDesktop ? "2px solid transparent" : "2px solid rgba(140,190,255,0.4)",
            boxShadow: isDesktop ? "none" : "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)",
            backgroundColor: "var(--wf-page)",
            transition: [
              "width 0.4s cubic-bezier(0.4,0,0.2,1)",
              "border-radius 0.4s cubic-bezier(0.4,0,0.2,1)",
              "border-color 0.4s cubic-bezier(0.4,0,0.2,1)",
              "box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
            ].join(", "),
          }}
        >
          <div
            style={{
              background: "var(--wf-status)",
              height: statusBarH,
              overflow: "hidden",
              transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          {children(device)}
        </div>
      </div>
    </div>
  );
}
