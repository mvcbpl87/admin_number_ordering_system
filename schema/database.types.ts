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
      commission: {
        Row: {
          created_at: string
          id: string
          percent: number
        }
        Insert: {
          created_at?: string
          id?: string
          percent: number
        }
        Update: {
          created_at?: string
          id?: string
          percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          created_at: string
          credit_value: number
          id: string
        }
        Insert: {
          created_at?: string
          credit_value?: number
          id: string
        }
        Update: {
          created_at?: string
          credit_value?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_orders: {
        Row: {
          bought: boolean
          created_at: string
          id: string
          phone_number: string
          receipt_id: string
          ticket_num_id: string
          user_id: string
        }
        Insert: {
          bought?: boolean
          created_at?: string
          id?: string
          phone_number: string
          receipt_id: string
          ticket_num_id: string
          user_id: string
        }
        Update: {
          bought?: boolean
          created_at?: string
          id?: string
          phone_number?: string
          receipt_id?: string
          ticket_num_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_ticket_num_id_fkey"
            columns: ["ticket_num_id"]
            isOneToOne: false
            referencedRelation: "ticket_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prizes: {
        Row: {
          created_at: string
          id: string
          prize_type: string
          prize_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          prize_type: string
          prize_value: number
        }
        Update: {
          created_at?: string
          id?: string
          prize_type?: string
          prize_value?: number
        }
        Relationships: []
      }
      root_commission: {
        Row: {
          created_at: string
          id: string
          percent: number
        }
        Insert: {
          created_at?: string
          id?: string
          percent: number
        }
        Update: {
          created_at?: string
          id?: string
          percent?: number
        }
        Relationships: []
      }
      sold_out_number: {
        Row: {
          category: string
          created_at: string
          draw_date: string
          id: string
          number: number[]
        }
        Insert: {
          category: string
          created_at?: string
          draw_date: string
          id?: string
          number: number[]
        }
        Update: {
          category?: string
          created_at?: string
          draw_date?: string
          id?: string
          number?: number[]
        }
        Relationships: []
      }
      test_table: {
        Row: {
          id: string
          test_num: number[]
        }
        Insert: {
          id?: string
          test_num: number[]
        }
        Update: {
          id?: string
          test_num?: number[]
        }
        Relationships: []
      }
      ticket_bought: {
        Row: {
          category: string
          draw_date: string
          number: string
          total_big: number
          total_small: number
          total_value: number
        }
        Insert: {
          category: string
          draw_date: string
          number: string
          total_big: number
          total_small: number
          total_value: number
        }
        Update: {
          category?: string
          draw_date?: string
          number?: string
          total_big?: number
          total_small?: number
          total_value?: number
        }
        Relationships: []
      }
      ticket_numbers: {
        Row: {
          amount: number
          boxbet: boolean
          category: string[]
          draw_date: string
          gametype: string
          id: string
          number: number[]
        }
        Insert: {
          amount: number
          boxbet: boolean
          category: string[]
          draw_date: string
          gametype: string
          id?: string
          number: number[]
        }
        Update: {
          amount?: number
          boxbet?: boolean
          category?: string[]
          draw_date?: string
          gametype?: string
          id?: string
          number?: number[]
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          refer_to: string | null
          role: string | null
          tier: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          refer_to?: string | null
          role?: string | null
          tier: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          refer_to?: string | null
          role?: string | null
          tier?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      winning_numbers: {
        Row: {
          category: string
          created_at: string
          draw_date: string
          gametype: string
          id: string
          number: number[]
          prize_id: string
        }
        Insert: {
          category: string
          created_at?: string
          draw_date: string
          gametype: string
          id?: string
          number: number[]
          prize_id: string
        }
        Update: {
          category?: string
          created_at?: string
          draw_date?: string
          gametype?: string
          id?: string
          number?: number[]
          prize_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winning_numbers_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      winning_orders: {
        Row: {
          category: string
          claimed: boolean
          customer_id: string
          deposited: boolean
          draw_date: string
          gametype: string
          number: number[]
          prize_id: string
        }
        Insert: {
          category: string
          claimed?: boolean
          customer_id?: string
          deposited?: boolean
          draw_date: string
          gametype: string
          number: number[]
          prize_id?: string
        }
        Update: {
          category?: string
          claimed?: boolean
          customer_id?: string
          deposited?: boolean
          draw_date?: string
          gametype?: string
          number?: number[]
          prize_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winning_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winning_orders_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "prizes"
            referencedColumns: ["id"]
          },
        ]
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
