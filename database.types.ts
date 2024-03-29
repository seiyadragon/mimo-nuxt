export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      UserData: {
        Row: {
          pages: Json[] | null
          user_id: string
        }
        Insert: {
          pages?: Json[] | null
          user_id: string
        }
        Update: {
          pages?: Json[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserData_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
