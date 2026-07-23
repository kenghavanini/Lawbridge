// Hand-authored to match supabase/schema.sql exactly. In a live project,
// regenerate this after every migration with:
//   supabase gen types typescript --project-id <ref> > lib/types/database.types.ts
// Keeping it hand-written here so the rest of the boilerplate has real
// autocomplete and compiler checking without a live project to point at.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "client" | "lawyer" | "law_firm_admin" | "platform_admin";
export type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";
// Dedicated to lawyer_profiles specifically — kept separate from the
// shared VerificationStatus above (still used by cases/law_firms) so this
// vocabulary change doesn't ripple into unrelated approval workflows.
export type LawyerVerificationStatus = "unverified" | "pending_review" | "approved" | "rejected";
export type CaseStatus = "draft" | "open" | "matched" | "in_progress" | "closed" | "archived";
export type MatchStatus = "pending" | "accepted" | "declined" | "withdrawn";
export type DocumentType =
  | "case_evidence"
  | "client_id_verification"
  | "lawyer_bar_license"
  | "firm_registration"
  | "retainer_agreement";
export type PracticeArea =
  | "corporate"
  | "litigation"
  | "family"
  | "immigration"
  | "real_estate"
  | "ip"
  | "criminal"
  | "employment"
  | "tax"
  | "other";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      jurisdictions: {
        Row: {
          id: string;
          country_code: string;
          region_code: string | null;
          region_name: string | null;
          city: string | null;
          bar_association_name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_code: string;
          region_code?: string | null;
          region_name?: string | null;
          city?: string | null;
          bar_association_name: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["jurisdictions"]["Insert"]>;
      };
      law_firms: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          registration_number: string | null;
          country_code: string;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          registration_number?: string | null;
          country_code: string;
          verification_status?: VerificationStatus;
        };
        Update: Partial<Database["public"]["Tables"]["law_firms"]["Insert"]>;
      };
      lawyer_profiles: {
        Row: {
          id: string;
          law_firm_id: string | null;
          bar_license_number: string;
          years_experience: number;
          bio: string | null;
          hourly_rate_cents: number | null;
          verification_status: LawyerVerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          // Raw self-reported intake from /verify — not yet reconciled
          // against the structured jurisdictions table. See schema.sql.
          self_reported_jurisdiction: string | null;
          bar_admission_year: number | null;
          ai_triage_notes: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          law_firm_id?: string | null;
          bar_license_number: string;
          years_experience?: number;
          bio?: string | null;
          hourly_rate_cents?: number | null;
          verification_status?: LawyerVerificationStatus;
          verified_at?: string | null;
          self_reported_jurisdiction?: string | null;
          bar_admission_year?: number | null;
          ai_triage_notes?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["lawyer_profiles"]["Insert"]>;
      };
      lawyer_jurisdictions: {
        Row: { lawyer_id: string; jurisdiction_id: string; bar_admission_date: string | null };
        Insert: { lawyer_id: string; jurisdiction_id: string; bar_admission_date?: string | null };
        Update: Partial<Database["public"]["Tables"]["lawyer_jurisdictions"]["Insert"]>;
      };
      lawyer_practice_areas: {
        Row: { lawyer_id: string; practice_area: PracticeArea };
        Insert: { lawyer_id: string; practice_area: PracticeArea };
        Update: Partial<Database["public"]["Tables"]["lawyer_practice_areas"]["Insert"]>;
      };
      cases: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          anonymized_summary: string;
          full_description: string;
          practice_area: PracticeArea;
          jurisdiction_id: string;
          budget_min_cents: number | null;
          budget_max_cents: number | null;
          status: CaseStatus;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          anonymized_summary: string;
          full_description: string;
          practice_area: PracticeArea;
          jurisdiction_id: string;
          budget_min_cents?: number | null;
          budget_max_cents?: number | null;
          status?: CaseStatus;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>;
      };
      case_documents: {
        Row: {
          id: string;
          case_id: string;
          uploaded_by: string;
          storage_path: string;
          document_type: DocumentType;
          file_name: string;
          file_size_bytes: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          uploaded_by: string;
          storage_path: string;
          document_type: DocumentType;
          file_name: string;
          file_size_bytes: number;
          mime_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["case_documents"]["Insert"]>;
      };
      case_matches: {
        Row: {
          id: string;
          case_id: string;
          lawyer_id: string;
          status: MatchStatus;
          requested_at: string;
          responded_at: string | null;
          decline_reason: string | null;
        };
        Insert: {
          id?: string;
          case_id: string;
          lawyer_id: string;
          status?: MatchStatus;
          decline_reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["case_matches"]["Insert"]> & {
          responded_at?: string | null;
        };
      };
      message_threads: {
        Row: { id: string; case_match_id: string; created_at: string; archived_at: string | null };
        Insert: { id?: string; case_match_id: string; archived_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["message_threads"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          body_encrypted: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          body_encrypted: string;
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_table: string;
          target_id: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_table: string;
          target_id: string;
          metadata?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
      };
    };
    Views: {
      case_listings: {
        Row: {
          id: string;
          title: string;
          anonymized_summary: string;
          practice_area: PracticeArea;
          jurisdiction_id: string;
          budget_min_cents: number | null;
          budget_max_cents: number | null;
          status: CaseStatus;
          created_at: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      lawyer_verification_status: LawyerVerificationStatus;
      case_status: CaseStatus;
      match_status: MatchStatus;
      document_type: DocumentType;
      practice_area: PracticeArea;
    };
  };
}
