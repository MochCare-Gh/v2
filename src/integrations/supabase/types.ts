export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      deliveries: {
        Row: {
          delivery_date: string
          facility_id: string
          id: string
          midwife_id: string | null
          mother_id: string
          notes: string | null
          outcome: string
        }
        Insert: {
          delivery_date: string
          facility_id: string
          id?: string
          midwife_id?: string | null
          mother_id: string
          notes?: string | null
          outcome: string
        }
        Update: {
          delivery_date?: string
          facility_id?: string
          id?: string
          midwife_id?: string | null
          mother_id?: string
          notes?: string | null
          outcome?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_mother_id_fkey"
            columns: ["mother_id"]
            isOneToOne: false
            referencedRelation: "mothers"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          created_at: string
          district_code: string
          id: string
          name: string
          region: Database["public"]["Enums"]["ghana_region"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_code: string
          id?: string
          name: string
          region: Database["public"]["Enums"]["ghana_region"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_code?: string
          id?: string
          name?: string
          region?: Database["public"]["Enums"]["ghana_region"]
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string
          district_id: string
          facility_code: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          type: Database["public"]["Enums"]["facility_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_id: string
          facility_code: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          type: Database["public"]["Enums"]["facility_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_id?: string
          facility_code?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          type?: Database["public"]["Enums"]["facility_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilities_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      form_entries: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          form_id: string
          id: string
          mother_id: string
          next_visit_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          form_id: string
          id?: string
          mother_id: string
          next_visit_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          form_id?: string
          id?: string
          mother_id?: string
          next_visit_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_entries_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_entries_mother_id_fkey"
            columns: ["mother_id"]
            isOneToOne: false
            referencedRelation: "mothers"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          created_by: string | null
          fields: Json
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fields?: Json
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fields?: Json
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mothers: {
        Row: {
          communication_channel: string | null
          created_at: string
          facility_id: string | null
          full_name: string
          ghana_card_number: string | null
          id: string
          nhis_number: string | null
          phone_number: string | null
          preferred_language: string | null
          registered_by: string | null
          registration_number: string
          updated_at: string
        }
        Insert: {
          communication_channel?: string | null
          created_at?: string
          facility_id?: string | null
          full_name: string
          ghana_card_number?: string | null
          id?: string
          nhis_number?: string | null
          phone_number?: string | null
          preferred_language?: string | null
          registered_by?: string | null
          registration_number: string
          updated_at?: string
        }
        Update: {
          communication_channel?: string | null
          created_at?: string
          facility_id?: string | null
          full_name?: string
          ghana_card_number?: string | null
          id?: string
          nhis_number?: string | null
          phone_number?: string | null
          preferred_language?: string | null
          registered_by?: string | null
          registration_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mothers_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          facility_id: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone_number: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          facility_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone_number?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          facility_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          facility_id: string
          id: string
          midwife_id: string | null
          mother_id: string
          next_visit_date: string | null
          notes: string | null
          visit_date: string
          visit_type: string
        }
        Insert: {
          facility_id: string
          id?: string
          midwife_id?: string | null
          mother_id: string
          next_visit_date?: string | null
          notes?: string | null
          visit_date?: string
          visit_type: string
        }
        Update: {
          facility_id?: string
          id?: string
          midwife_id?: string | null
          mother_id?: string
          next_visit_date?: string | null
          notes?: string | null
          visit_date?: string
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_mother_id_fkey"
            columns: ["mother_id"]
            isOneToOne: false
            referencedRelation: "mothers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      facility_type:
        | "Hospital"
        | "Clinic"
        | "Health Center"
        | "CHPS Compound"
        | "Maternity Home"
      ghana_region:
        | "Ahafo"
        | "Ashanti"
        | "Bono"
        | "Bono East"
        | "Central"
        | "Eastern"
        | "Greater Accra"
        | "North East"
        | "Northern"
        | "Oti"
        | "Savannah"
        | "Upper East"
        | "Upper West"
        | "Volta"
        | "Western"
        | "Western North"
      user_role: "admin" | "midwife" | "supervisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
