import { ShieldCheck, ShieldQuestion } from "lucide-react";
import type { LawyerVerificationStatus } from "@/lib/types/database.types";

/**
 * This is what makes "instant access" honest rather than deceptive: it
 * appears anywhere a client can see a specific lawyer (currently: incoming
 * match requests on a case). 'approved' means independently confirmed —
 * currently only reachable by a platform admin. Everything else a lawyer
 * can reach on their own (including 'pending_review', which already has
 * real board access) reads as unconfirmed here, deliberately.
 */
export function ConfirmationBadge({ status }: { status: LawyerVerificationStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
        <ShieldCheck className="h-3 w-3" /> Bar verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <ShieldQuestion className="h-3 w-3" /> Self-reported — not yet confirmed
    </span>
  );
}
