import { WfButton } from "./wf-button";

type WfCardProps = {
  title: string;
  body: string;
  action: string;
  actionHref?: string;
};

export function WfCard({ title, body, action, actionHref }: WfCardProps) {
  return (
    <div className="wf-card p-5">
      <p className="text-lg font-bold text-white mb-2">{title}</p>
      <p className="text-sm text-white/55 leading-relaxed mb-5">{body}</p>
      <WfButton label={action} href={actionHref} />
    </div>
  );
}
