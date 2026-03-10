import { BadgeCheck, Clock } from "lucide-react";

interface ProofCardProps {
  title: string;
  description: string;
  clientName: string;
  dateCompleted: string;
  verified: boolean;
  verifiedAt?: string | null;
  showPending?: boolean;
}

export default function ProofCard({
  title,
  description,
  clientName,
  dateCompleted,
  verified,
  showPending = false,
}: ProofCardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Verified badge */}
      {verified && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
          <BadgeCheck className="w-3.5 h-3.5" />
          Client Verified
        </div>
      )}

      {/* Pending badge */}
      {!verified && showPending && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          Pending Verification
        </div>
      )}

      <h3 className="text-lg font-bold text-navy-800 pr-36 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Client: {clientName}</span>
        <span>
          {new Date(dateCompleted).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
