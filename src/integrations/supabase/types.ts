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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_expressions: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string
          responded_at: string | null
          sender_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          responded_at?: string | null
          sender_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interest_expressions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interest_expressions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          category: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      live_queue: {
        Row: {
          id: string
          joined_at: string | null
          preferred_gender: Database["public"]["Enums"]["gender_type"][] | null
          session_type: Database["public"]["Enums"]["live_session_type"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          preferred_gender?: Database["public"]["Enums"]["gender_type"][] | null
          session_type: Database["public"]["Enums"]["live_session_type"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          preferred_gender?: Database["public"]["Enums"]["gender_type"][] | null
          session_type?: Database["public"]["Enums"]["live_session_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          ended_at: string | null
          id: string
          is_active: boolean | null
          session_type: Database["public"]["Enums"]["live_session_type"]
          started_at: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_type: Database["public"]["Enums"]["live_session_type"]
          started_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_type?: Database["public"]["Enums"]["live_session_type"]
          started_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          id: string
          is_active: boolean | null
          last_message_at: string | null
          matched_at: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          matched_at?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          matched_at?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string
          display_name: string | null
          education: Database["public"]["Enums"]["education_level"] | null
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          height_cm: number | null
          id: string
          is_online: boolean | null
          is_premium: boolean | null
          last_seen: string | null
          latitude: number | null
          live_mode_enabled: boolean | null
          longitude: number | null
          occupation: string | null
          onboarding_completed: boolean | null
          phone: string | null
          relationship_goal:
            | Database["public"]["Enums"]["relationship_goal"]
            | null
          school: string | null
          serious_mode_enabled: boolean | null
          swipe_mode_enabled: boolean | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth: string
          display_name?: string | null
          education?: Database["public"]["Enums"]["education_level"] | null
          email?: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          height_cm?: number | null
          id: string
          is_online?: boolean | null
          is_premium?: boolean | null
          last_seen?: string | null
          latitude?: number | null
          live_mode_enabled?: boolean | null
          longitude?: number | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          relationship_goal?:
            | Database["public"]["Enums"]["relationship_goal"]
            | null
          school?: string | null
          serious_mode_enabled?: boolean | null
          swipe_mode_enabled?: boolean | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string
          display_name?: string | null
          education?: Database["public"]["Enums"]["education_level"] | null
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          height_cm?: number | null
          id?: string
          is_online?: boolean | null
          is_premium?: boolean | null
          last_seen?: string | null
          latitude?: number | null
          live_mode_enabled?: boolean | null
          longitude?: number | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          relationship_goal?:
            | Database["public"]["Enums"]["relationship_goal"]
            | null
          school?: string | null
          serious_mode_enabled?: boolean | null
          swipe_mode_enabled?: boolean | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_id: string
          reporter_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_id: string
          reporter_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reported_id?: string
          reporter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      serious_profiles: {
        Row: {
          about_family: string | null
          assets: string | null
          caste: string | null
          created_at: string | null
          expectations: string | null
          family_type: string | null
          family_values: string | null
          father_occupation: string | null
          id: string
          mother_occupation: string | null
          mother_tongue: string | null
          partner_age_max: number | null
          partner_age_min: number | null
          partner_education:
            | Database["public"]["Enums"]["education_level"][]
            | null
          partner_height_max: number | null
          partner_height_min: number | null
          partner_occupation: string[] | null
          partner_religion: string[] | null
          religion: string | null
          salary_range: string | null
          siblings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          about_family?: string | null
          assets?: string | null
          caste?: string | null
          created_at?: string | null
          expectations?: string | null
          family_type?: string | null
          family_values?: string | null
          father_occupation?: string | null
          id?: string
          mother_occupation?: string | null
          mother_tongue?: string | null
          partner_age_max?: number | null
          partner_age_min?: number | null
          partner_education?:
            | Database["public"]["Enums"]["education_level"][]
            | null
          partner_height_max?: number | null
          partner_height_min?: number | null
          partner_occupation?: string[] | null
          partner_religion?: string[] | null
          religion?: string | null
          salary_range?: string | null
          siblings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          about_family?: string | null
          assets?: string | null
          caste?: string | null
          created_at?: string | null
          expectations?: string | null
          family_type?: string | null
          family_values?: string | null
          father_occupation?: string | null
          id?: string
          mother_occupation?: string | null
          mother_tongue?: string | null
          partner_age_max?: number | null
          partner_age_min?: number | null
          partner_education?:
            | Database["public"]["Enums"]["education_level"][]
            | null
          partner_height_max?: number | null
          partner_height_min?: number | null
          partner_occupation?: string[] | null
          partner_religion?: string[] | null
          religion?: string | null
          salary_range?: string | null
          siblings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "serious_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          action: Database["public"]["Enums"]["swipe_action"]
          created_at: string | null
          id: string
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["swipe_action"]
          created_at?: string | null
          id?: string
          swiped_id: string
          swiper_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["swipe_action"]
          created_at?: string | null
          id?: string
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          id: string
          interest_id: string
          user_id: string
        }
        Insert: {
          id?: string
          interest_id: string
          user_id: string
        }
        Update: {
          id?: string
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          order_index: number | null
          photo_url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          max_age: number | null
          max_distance_km: number | null
          min_age: number | null
          preferred_gender: Database["public"]["Enums"]["gender_type"][] | null
          relationship_goals:
            | Database["public"]["Enums"]["relationship_goal"][]
            | null
          show_verified_only: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          preferred_gender?: Database["public"]["Enums"]["gender_type"][] | null
          relationship_goals?:
            | Database["public"]["Enums"]["relationship_goal"][]
            | null
          show_verified_only?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          preferred_gender?: Database["public"]["Enums"]["gender_type"][] | null
          relationship_goals?:
            | Database["public"]["Enums"]["relationship_goal"][]
            | null
          show_verified_only?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      education_level:
        | "high_school"
        | "bachelors"
        | "masters"
        | "doctorate"
        | "other"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      live_session_type: "text" | "audio" | "video"
      relationship_goal: "casual" | "serious" | "marriage" | "friendship"
      report_reason:
        | "spam"
        | "inappropriate"
        | "harassment"
        | "fake_profile"
        | "underage"
        | "other"
      swipe_action: "like" | "dislike" | "superlike"
      verification_status: "none" | "pending" | "verified" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      education_level: [
        "high_school",
        "bachelors",
        "masters",
        "doctorate",
        "other",
      ],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      live_session_type: ["text", "audio", "video"],
      relationship_goal: ["casual", "serious", "marriage", "friendship"],
      report_reason: [
        "spam",
        "inappropriate",
        "harassment",
        "fake_profile",
        "underage",
        "other",
      ],
      swipe_action: ["like", "dislike", "superlike"],
      verification_status: ["none", "pending", "verified", "rejected"],
    },
  },
} as const
