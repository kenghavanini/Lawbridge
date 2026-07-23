import Link from "next/link";
import { Scale } from "lucide-react";

export function SiteHeader({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href={homeHref} className="flex items-center gap-2 font-serif text-base tracking-tight text-foreground">
        <Scale className="h-4 w-4" />
        Connecting Law
      </Link>
    </div>
  );
}
