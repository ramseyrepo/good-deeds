type WfButtonProps = {
  label: string;
  primary?: boolean;
  href?: string;
};

export function WfButton({ label, primary, href }: WfButtonProps) {
  const className = `inline-block px-7 py-3 text-[13px] ${primary ? "wf-btn-primary" : "wf-btn-secondary"}`;

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={`${className} cursor-pointer`}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {label}
      </a>
    );
  }

  return <div className={className}>{label}</div>;
}
