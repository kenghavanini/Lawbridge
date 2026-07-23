export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string
          target_table: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id: string
          target_table: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          case_id: string
          created_at: string
          file_name: string
          file_size_bytes: number
          id: string
          mime_type: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          case_id: string
          created_at?: string
          file_name: string
          file_size_bytes: number
          id?: string
          mime_type: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          case_id?: string
          created_at?: string
          file_name?: string
          file_size_bytes?: number
          id?: string
          mime_type?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_matches: {
        Row: {
          case_id: string
          decline_reason: string | null
          id: string
          lawyer_id: string
          requested_at: string
          responded_at: string | null
          status: Database["public"]["Enums"]["match_status"]
        }
        Insert: {
          case_id: string
          decline_reason?: string | null
          id?: string
          lawyer_id: string
          requested_at?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
        }
        Update: {
          case_id?: string
          decline_reason?: string | null
          id?: string
          lawyer_id?: string
          requested_at?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
        }
        Relationships: [
          {
            foreignKeyName: "case_matches_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_matches_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_matches_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "lawyer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          anonymized_summary: string
          budget_max_cents: number | null
          budget_min_cents: number | null
          client_id: string
          created_at: string
          full_description: string
          id: string
          jurisdiction_id: string
          practice_area: string | null
          search_vector: unknown
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          anonymized_summary: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          client_id: string
          created_at?: string
          full_description: string
          id?: string
          jurisdiction_id: string
          practice_area?: string | null
          search_vector?: unknown
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          anonymized_summary?: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          client_id?: string
          created_at?: string
          full_description?: string
          id?: string
          jurisdiction_id?: string
          practice_area?: string | null
          search_vector?: unknown
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jurisdictions: {
        Row: {
          bar_association_name: string
          country_code: string
          created_at: string
          id: string
          is_active: boolean
          region_code: string | null
          region_name: string | null
        }
        Insert: {
          bar_association_name: string
          country_code: string
          created_at?: string
          id?: string
          is_active?: boolean
          region_code?: string | null
          region_name?: string | null
        }
        Update: {
          bar_association_name?: string
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          region_code?: string | null
          region_name?: string | null
        }
        Relationships: []
      }
      law_firms: {
        Row: {
          country_code: string
          created_at: string
          id: string
          name: string
          owner_id: string
          registration_number: string | null
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          name: string
          owner_id: string
          registration_number?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          registration_number?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "law_firms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "law_firms_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lawyer_jurisdictions: {
        Row: {
          bar_admission_date: string | null
          jurisdiction_id: string
          lawyer_id: string
        }
        Insert: {
          bar_admission_date?: string | null
          jurisdiction_id: string
          lawyer_id: string
        }
        Update: {
          bar_admission_date?: string | null
          jurisdiction_id?: string
          lawyer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lawyer_jurisdictions_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lawyer_jurisdictions_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "lawyer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lawyer_practice_areas: {
        Row: {
          lawyer_id: string
        }
        Insert: {
          lawyer_id: string
        }
        Update: {
          lawyer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lawyer_practice_areas_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "lawyer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lawyer_profiles: {
        Row: {
          bar_admission_year: number | null
          bar_license_number: string
          bio: string | null
          created_at: string
          hourly_rate_cents: number | null
          id: string
          law_firm_id: string | null
          self_reported_jurisdiction: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          verified_by: string | null
          years_experience: number
        }
        Insert: {
          bar_admission_year?: number | null
          bar_license_number: string
          bio?: string | null
          created_at?: string
          hourly_rate_cents?: number | null
          id: string
          law_firm_id?: string | null
          self_reported_jurisdiction?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
          years_experience?: number
        }
        Update: {
          bar_admission_year?: number | null
          bar_license_number?: string
          bio?: string | null
          created_at?: string
          hourly_rate_cents?: number | null
          id?: string
          law_firm_id?: string | null
          self_reported_jurisdiction?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "lawyer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lawyer_profiles_law_firm_id_fkey"
            columns: ["law_firm_id"]
            isOneToOne: false
            referencedRelation: "law_firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lawyer_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          archived_at: string | null
          case_match_id: string
          created_at: string
          id: string
        }
        Insert: {
          archived_at?: string | null
          case_match_id: string
          created_at?: string
          id?: string
        }
        Update: {
          archived_at?: string | null
          case_match_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_case_match_id_fkey"
            columns: ["case_match_id"]
            isOneToOne: true
            referencedRelation: "case_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body_encrypted: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          body_encrypted: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          thread_id: string
        }
        Update: {
          body_encrypted?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          onboarding_completed: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          onboarding_completed?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          onboarding_completed?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      case_listings: {
        Row: {
          anonymized_summary: string | null
          budget_max_cents: number | null
          budget_min_cents: number | null
          created_at: string | null
          id: string | null
          jurisdiction_id: string | null
          practice_area: string | null
          status: Database["public"]["Enums"]["case_status"] | null
          title: string | null
        }
        Insert: {
          anonymized_summary?: string | null
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string | null
          id?: string | null
          jurisdiction_id?: string | null
          practice_area?: string | null
          status?: Database["public"]["Enums"]["case_status"] | null
          title?: string | null
        }
        Update: {
          anonymized_summary?: string | null
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string | null
          id?: string | null
          jurisdiction_id?: string | null
          practice_area?: string | null
          status?: Database["public"]["Enums"]["case_status"] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_accepted_match: { Args: { p_case_id: string }; Returns: boolean }
      has_board_access: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      case_status:
        | "draft"
        | "open"
        | "matched"
        | "in_progress"
        | "closed"
        | "archived"
      document_type:
        | "case_evidence"
        | "client_id_verification"
        | "lawyer_bar_license"
        | "firm_registration"
        | "retainer_agreement"
      lawyer_verification_status: "unverified" | "pending_review" | "approved"
      match_status: "pending" | "accepted" | "declined" | "withdrawn"
      practice_area:
        | "corporate"
        | "litigation"
        | "family"
        | "immigration"
        | "real_estate"
        | "ip"
        | "criminal"
        | "employment"
        | "tax"
        | "other"
      user_role: "client" | "lawyer" | "law_firm_admin" | "platform_admin"
      verification_status:
        | "unverified"
        | "pending"
        | "pending_review"
        | "verified"
        | "approved"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_status: [
        "draft",
        "open",
        "matched",
        "in_progress",
        "closed",
        "archived",
      ],
      document_type: [
        "case_evidence",
        "client_id_verification",
        "lawyer_bar_license",
        "firm_registration",
        "retainer_agreement",
      ],
      lawyer_verification_status: ["unverified", "pending_review", "approved"],
      match_status: ["pending", "accepted", "declined", "withdrawn"],
      practice_area: [
        "corporate",
        "litigation",
        "family",
        "immigration",
        "real_estate",
        "ip",
        "criminal",
        "employment",
        "tax",
        "other",
      ],
      user_role: ["client", "lawyer", "law_firm_admin", "platform_admin"],
      verification_status: [
        "unverified",
        "pending",
        "pending_review",
        "verified",
        "approved",
        "rejected",
      ],
    },
  },
} as const
