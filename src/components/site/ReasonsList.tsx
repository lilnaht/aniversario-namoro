import type { Reason } from "@/lib/types";

type ReasonsListProps = {
  reasons: Reason[];
};

export default function ReasonsList({ reasons }: ReasonsListProps) {
  if (reasons.length === 0) {
    return <p className="text-sm text-rose-500/80">Adicione motivos no admin.</p>;
  }

  return (
    <div className="mt-6 grid gap-3">
      {reasons.map((reason) => (
        <div
          key={reason.id}
          className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm text-rose-700"
        >
          {reason.text}
        </div>
      ))}
    </div>
  );
}
