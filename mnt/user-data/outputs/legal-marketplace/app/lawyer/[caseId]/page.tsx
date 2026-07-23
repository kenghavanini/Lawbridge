// @ts-nocheck
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requestCaseMatch, respondToMatchRequest } from "@/lib/actions/case-actions";
import { getThreadMessages } from "@/lib/actions/message-actions";
import { ConfirmationBadge } from "@/components/case/confirmation-badge";
import type { LawyerVerificationStatus } from "@/lib/types/database.types";

export default async function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return notFound();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();

  const { data: listing } = await supabase.from("case_listings").select("*").eq("id", caseId).maybeSingle();
  if (!listing) return notFound();

  const { data: fullCase } = await supabase
    .from("cases")
    .select("*, case_documents(*)")
    .eq("id", caseId)
    .maybeSingle();

  const hasFullAccess = Boolean(fullCase);

  let myMatch: { id: string; status: string } | null = null;
  if (profile?.role === "lawyer") {
    const { data } = await supabase
      .from("case_matches")
      .select("id, status")
      .eq("case_id", caseId)
      .eq("lawyer_id", auth.user.id)
      .maybeSingle();
    myMatch = data;
  }

  // Each match paired with the requesting lawyer's confirmation tier — this
  // is the actual point where "instant access, honestly labeled" has to
  // show up, since it's where a client decides whether to accept someone
  // whose credentials might be self-reported and unconfirmed.
  let pendingMatches: Array<{
    id: string;
    lawyer_id: string;
    status: string;
    requested_at: string;
    lawyerStatus: LawyerVerificationStatus;
  }> = [];
  if (fullCase && fullCase.client_id === auth.user.id) {
    const { data: matches } = await supabase
      .from("case_matches")
      .select("id, lawyer_id, status, requested_at")
      .eq("case_id", caseId)
      .order("requested_at", { ascending: false });

    if (matches && matches.length > 0) {
      const { data: lawyerProfiles } = await supabase
        .from("lawyer_profiles")
        .select("id, verification_status")
        .in(
          "id",
          matches.map((m) => m.lawyer_id)
        );

      const statusById = new Map((lawyerProfiles ?? []).map((l) => [l.id, l.verification_status]));
      pendingMatches = matches.map((m) => ({
        ...m,
        lawyerStatus: statusById.get(m.lawyer_id) ?? "unverified",
      }));
    }
  }

  let threadMessages: Awaited<ReturnType<typeof getThreadMessages>> = [];
  if (hasFullAccess && myMatch?.status === "accepted") {
    const { data: thread } = await supabase
      .from("message_threads")
      .select("id")
      .eq("case_match_id", myMatch.id)
      .maybeSingle();
    if (thread) {
      threadMessages = await getThreadMessages(thread.id);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/lawyer" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to case board
      </Link>

      <header className="mt-4 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-widest text-accent">{listing.practice_area.replace("_", " ")}</p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">{listing.title}</h1>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Public summary</h2>
        <p className="mt-3 leading-relaxed text-foreground">{listing.anonymized_summary}</p>
      </section>

      {hasFullAccess && fullCase ? (
        <section className="mt-10 rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-accent">Full case file — unlocked</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground">{fullCase.full_description}</p>

          {fullCase.case_documents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Documents</h3>
              <ul className="mt-2 space-y-1">
                {fullCase.case_documents.map((doc) => (
                  <li key={doc.id} className="text-sm text-foreground">
                    {doc.file_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-10 rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Full case details, client identity, and uploaded documents remain locked until the client accepts your
            match request.
          </p>
          {profile?.role === "lawyer" && !myMatch && (
            <form
              action={async () => {
                "use server";
                await requestCaseMatch(caseId);
              }}
              className="mt-4"
            >
              <button
                type="submit"
                className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Request to view full case
              </button>
            </form>
          )}
          {myMatch?.status === "pending" && (
            <p className="mt-4 text-xs text-muted-foreground">Your request is awaiting the client&apos;s decision.</p>
          )}
          {myMatch?.status === "declined" && <p className="mt-4 text-xs text-muted-foreground">The client declined this request.</p>}
          {myMatch?.status === "withdrawn" && <p className="mt-4 text-xs text-muted-foreground">You withdrew this request.</p>}
        </section>
      )}

      {pendingMatches.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Lawyer requests</h2>
          <ul className="mt-3 space-y-3">
            {pendingMatches.map((match) => (
              <li key={match.id} className="rounded-md border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm capitalize text-foreground">Request status: {match.status}</span>
                    <ConfirmationBadge status={match.lawyerStatus} />
                  </div>
                  {match.status === "pending" && (
                    <div className="flex gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await respondToMatchRequest(match.id, "accepted");
                        }}
                      >
                        <button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                          Accept
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await respondToMatchRequest(match.id, "declined");
                        }}
                      >
                        <button type="submit" className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">
                          Decline
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {myMatch?.status === "accepted" && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Secure messages</h2>
          <div className="mt-3 space-y-3 rounded-lg border border-border p-4">
            {threadMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet. Say hello.</p>
            ) : (
              threadMessages.map((message) => (
                <p key={message.id} className="text-sm text-foreground">
                  {message.body}
                </p>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

