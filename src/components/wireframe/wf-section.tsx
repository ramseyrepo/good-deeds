import { WfLabelBar } from "./wf-label-bar";

type WfSectionProps = {
  tag: string;
  desc: string;
  children: React.ReactNode;
  compact?: boolean;
};

export function WfSection({ tag, desc, children, compact = false }: WfSectionProps) {
  return (
    <div className="wf-section">
      <WfLabelBar tag={tag} desc={desc} />
      <div className={compact ? "p-5" : "p-10"}>{children}</div>
    </div>
  );
}
