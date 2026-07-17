type WfPhotoProps = {
  height: number;
  label?: string;
};

export function WfPhoto({ height, label }: WfPhotoProps) {
  return (
    <div
      className="wf-card relative flex items-center justify-center overflow-hidden"
      style={{ height }}
    >
      <svg
        width="100%"
        height={height}
        className="absolute inset-0"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(126,200,227,0.30)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(126,200,227,0.30)" strokeWidth="1" />
      </svg>
      {label && (
        <span className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-wf-cyan/30">
          {label}
        </span>
      )}
    </div>
  );
}
