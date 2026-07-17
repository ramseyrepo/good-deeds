import { SoupedLogo } from "./souped-logo";

type WfNavProps = {
  /**
   * When provided, the right-side pill renders the signed-in email
   * instead of an auth-status placeholder. Pass the result of
   * `getCurrentSession()` from `@/lib/auth`. Leave undefined for the
   * public landing where there's no session to display.
   */
  signedInAs?: string | null;
};

export function WfNav({ signedInAs }: WfNavProps = {}) {
  return (
    <div
      className="mx-2 mt-0.75 rounded-[5px] overflow-hidden border border-wf-cyan/30"
      style={{ background: "var(--wf-nav)" }}
    >
      <div className="flex items-center justify-between px-7 py-3.5">
        <div className="text-white">
          <SoupedLogo className="h-6 w-auto" />
        </div>
        <div className="px-3.5 py-1 border border-wf-cyan/30 rounded-full">
          <span className="text-[11px] text-white/35 uppercase tracking-wider">
            {signedInAs ?? "Public"}
          </span>
        </div>
      </div>
    </div>
  );
}
