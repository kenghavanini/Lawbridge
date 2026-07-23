import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/**
 * Defense-in-depth fallback only. In normal operation, middleware already
 * redirects 'unverified' and 'rejected' lawyers to /verify before they
 * ever reach a page that would render this — 'pending_review' and
 * 'approved' both get real access now (see has_board_access() in
 * schema.sql) and never hit this component at all.
 */
export function VerificationGate() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
        <ShieldCheck className="h-6 w-6 text-accent" />
      </div>
      <h1 className="mt-6 font-serif text-2xl text-foreground">Verification required</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The case board requires a quick, automated verification step first.
      </p>
      <Link
        href="/verify"
        className="transition-standard mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Start verification
      </Link>
    </div>
  );
}
