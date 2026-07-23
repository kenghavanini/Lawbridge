export type PracticeArea = 'corporate' | 'litigation' | 'intellectual_property' | 'real_estate' | 'family_law';

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          client_id: string;
          practice_area: PracticeArea;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          client_id: string;
          practice_area?: PracticeArea;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          client_id?: string;
          practice_area?: PracticeArea;
          created_at?: string;
        };
      };
    };
  };
}

export type LawyerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'approved';

