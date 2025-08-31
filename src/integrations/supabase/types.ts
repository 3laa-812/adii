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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          device_id: string | null
          id: string
          is_acknowledged: boolean | null
          message: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          title: string
          type: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          title: string
          type: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      device_logs: {
        Row: {
          device_id: string | null
          id: string
          log_level: string
          message: string
          metadata: Json | null
          timestamp: string
        }
        Insert: {
          device_id?: string | null
          id?: string
          log_level: string
          message: string
          metadata?: Json | null
          timestamp?: string
        }
        Update: {
          device_id?: string | null
          id?: string
          log_level?: string
          message?: string
          metadata?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_logs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          battery_level: number | null
          cpu_usage: number | null
          created_at: string
          device_id: string
          firmware_version: string | null
          id: string
          last_seen: string | null
          location: Json
          memory_usage: number | null
          name: string
          provisioning_secret: string | null
          signal_strength: number | null
          status: string
          temperature: number | null
          updated_at: string
        }
        Insert: {
          battery_level?: number | null
          cpu_usage?: number | null
          created_at?: string
          device_id: string
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location: Json
          memory_usage?: number | null
          name: string
          provisioning_secret?: string | null
          signal_strength?: number | null
          status?: string
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          battery_level?: number | null
          cpu_usage?: number | null
          created_at?: string
          device_id?: string
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location?: Json
          memory_usage?: number | null
          name?: string
          provisioning_secret?: string | null
          signal_strength?: number | null
          status?: string
          temperature?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          amount: number
          confidence_score: number | null
          created_at: string
          device_id: string | null
          entry_time: string
          id: string
          image_url: string | null
          is_flagged: boolean | null
          notes: string | null
          payment_method: string | null
          rfid_tag: string | null
          status: string
          transaction_id: string | null
          vehicle_plate: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          amount: number
          confidence_score?: number | null
          created_at?: string
          device_id?: string | null
          entry_time?: string
          id?: string
          image_url?: string | null
          is_flagged?: boolean | null
          notes?: string | null
          payment_method?: string | null
          rfid_tag?: string | null
          status?: string
          transaction_id?: string | null
          vehicle_plate: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          amount?: number
          confidence_score?: number | null
          created_at?: string
          device_id?: string | null
          entry_time?: string
          id?: string
          image_url?: string | null
          is_flagged?: boolean | null
          notes?: string | null
          payment_method?: string | null
          rfid_tag?: string | null
          status?: string
          transaction_id?: string | null
          vehicle_plate?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_rules: {
        Row: {
          base_amount: number
          created_at: string
          device_ids: string[] | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          rule_type: string
          time_conditions: Json | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
          vehicle_type: string | null
        }
        Insert: {
          base_amount: number
          created_at?: string
          device_ids?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          rule_type: string
          time_conditions?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          vehicle_type?: string | null
        }
        Update: {
          base_amount?: number
          created_at?: string
          device_ids?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          rule_type?: string
          time_conditions?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      reconciliation_files: {
        Row: {
          created_at: string
          discrepancies: Json | null
          discrepancies_count: number | null
          file_url: string
          filename: string
          id: string
          processed_at: string | null
          processed_by: string | null
          provider: string
          status: string
          total_amount: number | null
          transaction_count: number | null
          upload_date: string
        }
        Insert: {
          created_at?: string
          discrepancies?: Json | null
          discrepancies_count?: number | null
          file_url: string
          filename: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          provider: string
          status?: string
          total_amount?: number | null
          transaction_count?: number | null
          upload_date?: string
        }
        Update: {
          created_at?: string
          discrepancies?: Json | null
          discrepancies_count?: number | null
          file_url?: string
          filename?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          provider?: string
          status?: string
          total_amount?: number | null
          transaction_count?: number | null
          upload_date?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string
          transaction_ref: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          transaction_ref?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          transaction_ref?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          plate_number: string
          rfid_tag: string | null
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          plate_number: string
          rfid_tag?: string | null
          updated_at?: string
          user_id: string
          vehicle_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          plate_number?: string
          rfid_tag?: string | null
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          auto_topup_amount: number | null
          auto_topup_enabled: boolean | null
          auto_topup_threshold: number | null
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_threshold?: number | null
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_threshold?: number | null
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          id: string
          is_active: boolean | null
          last_response_status: number | null
          last_triggered_at: string | null
          name: string
          retry_count: number | null
          secret: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          name: string
          retry_count?: number | null
          secret: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          name?: string
          retry_count?: number | null
          secret?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
