type WfLabelBarProps = {
  tag: string;
  desc: string;
};

export function WfLabelBar({ tag, desc }: WfLabelBarProps) {
  return (
    <div className="wf-label-bar flex items-center gap-2.5 px-3.5 py-1.5">
      <span className="wf-tag font-mono text-[10px] font-bold uppercase tracking-wider text-wf-cyan px-1.5 py-0.5 shrink-0">
        {tag}
      </span>
      <span className="text-[11px] text-white/45 leading-snug">{desc}</span>
    </div>
  );
}
