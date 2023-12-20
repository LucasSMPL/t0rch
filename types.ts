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
      apdu: {
        Row: {
          Amps: string | null
          id: number
          kWH: string | null
          OutputNumber: string | null
          PF: string | null
          raw_response: string
          Status: string | null
          timestamp: string | null
          Voltage: string | null
          Watts: string | null
        }
        Insert: {
          Amps?: string | null
          id?: number
          kWH?: string | null
          OutputNumber?: string | null
          PF?: string | null
          raw_response: string
          Status?: string | null
          timestamp?: string | null
          Voltage?: string | null
          Watts?: string | null
        }
        Update: {
          Amps?: string | null
          id?: number
          kWH?: string | null
          OutputNumber?: string | null
          PF?: string | null
          raw_response?: string
          Status?: string | null
          timestamp?: string | null
          Voltage?: string | null
          Watts?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          message: string
          type: Database["public"]["Enums"]["banner_type"]
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          message: string
          type: Database["public"]["Enums"]["banner_type"]
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          message?: string
          type?: Database["public"]["Enums"]["banner_type"]
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          id: number
          item: string
          type: Database["public"]["Enums"]["question_types"]
        }
        Insert: {
          id?: number
          item: string
          type: Database["public"]["Enums"]["question_types"]
        }
        Update: {
          id?: number
          item?: string
          type?: Database["public"]["Enums"]["question_types"]
        }
        Relationships: []
      }
      client_miners: {
        Row: {
          created_at: string
          id: string
          id_foreman: number
          id_location: number | null
          id_miner_model: number | null
          id_user: string | null
          ip: string | null
          mac: string | null
          name: string | null
          pool_1_name: string | null
          pool_1_url: string | null
          pool_2_name: string | null
          pool_2_url: string | null
          serial: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          id_foreman: number
          id_location?: number | null
          id_miner_model?: number | null
          id_user?: string | null
          ip?: string | null
          mac?: string | null
          name?: string | null
          pool_1_name?: string | null
          pool_1_url?: string | null
          pool_2_name?: string | null
          pool_2_url?: string | null
          serial?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          id_foreman?: number
          id_location?: number | null
          id_miner_model?: number | null
          id_user?: string | null
          ip?: string | null
          mac?: string | null
          name?: string | null
          pool_1_name?: string | null
          pool_1_url?: string | null
          pool_2_name?: string | null
          pool_2_url?: string | null
          serial?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_miners_id_location_fkey"
            columns: ["id_location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_miners_id_miner_model_fkey"
            columns: ["id_miner_model"]
            isOneToOne: false
            referencedRelation: "miner_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_miners_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ClientWorkers: {
        Row: {
          client_email: string | null
          id: number
          worker_name: string | null
        }
        Insert: {
          client_email?: string | null
          id?: number
          worker_name?: string | null
        }
        Update: {
          client_email?: string | null
          id?: number
          worker_name?: string | null
        }
        Relationships: []
      }
      deployment_checklist: {
        Row: {
          answered_at: string
          answered_by: string
          id: number
          id_question: number
          site: string
        }
        Insert: {
          answered_at: string
          answered_by: string
          id?: number
          id_question: number
          site: string
        }
        Update: {
          answered_at?: string
          answered_by?: string
          id?: number
          id_question?: number
          site?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployment_checklist_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployment_checklist_id_question_fkey"
            columns: ["id_question"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          }
        ]
      }
      diagnostic_notes: {
        Row: {
          id: number
          note: string | null
        }
        Insert: {
          id?: number
          note?: string | null
        }
        Update: {
          id?: number
          note?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          classification: string | null
          id: number
          id_employee: string | null
          phone: string | null
          position: string | null
          start_month: string | null
          team: Database["public"]["Enums"]["teams"]
        }
        Insert: {
          classification?: string | null
          id?: number
          id_employee?: string | null
          phone?: string | null
          position?: string | null
          start_month?: string | null
          team?: Database["public"]["Enums"]["teams"]
        }
        Update: {
          classification?: string | null
          id?: number
          id_employee?: string | null
          phone?: string | null
          position?: string | null
          start_month?: string | null
          team?: Database["public"]["Enums"]["teams"]
        }
        Relationships: [
          {
            foreignKeyName: "employees_id_employee_fkey"
            columns: ["id_employee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      hosting_checklist: {
        Row: {
          answered_at: string
          answered_by: string
          id: number
          id_question: number
          site: string
        }
        Insert: {
          answered_at: string
          answered_by: string
          id?: number
          id_question: number
          site: string
        }
        Update: {
          answered_at?: string
          answered_by?: string
          id?: number
          id_question?: number
          site?: string
        }
        Relationships: [
          {
            foreignKeyName: "hosting_checklist_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosting_checklist_id_question_fkey"
            columns: ["id_question"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          }
        ]
      }
      HostingUpkeep: {
        Row: {
          client_note: string | null
          error_log: string | null
          id: number
          id_client: string | null
          id_client_foreman: number | null
          id_miner: number | null
          id_miner_model: number | null
          id_tech: string | null
          location: string | null
          miner_model: string | null
          model: string | null
          pulled_date: string | null
          repair_date: string | null
          repair_note: string | null
          site: string | null
          status: string | null
          tech_name: string | null
          worker_name: string | null
          worker_number: string | null
        }
        Insert: {
          client_note?: string | null
          error_log?: string | null
          id?: number
          id_client?: string | null
          id_client_foreman?: number | null
          id_miner?: number | null
          id_miner_model?: number | null
          id_tech?: string | null
          location?: string | null
          miner_model?: string | null
          model?: string | null
          pulled_date?: string | null
          repair_date?: string | null
          repair_note?: string | null
          site?: string | null
          status?: string | null
          tech_name?: string | null
          worker_name?: string | null
          worker_number?: string | null
        }
        Update: {
          client_note?: string | null
          error_log?: string | null
          id?: number
          id_client?: string | null
          id_client_foreman?: number | null
          id_miner?: number | null
          id_miner_model?: number | null
          id_tech?: string | null
          location?: string | null
          miner_model?: string | null
          model?: string | null
          pulled_date?: string | null
          repair_date?: string | null
          repair_note?: string | null
          site?: string | null
          status?: string | null
          tech_name?: string | null
          worker_name?: string | null
          worker_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "HostingUpkeep_id_client_fkey"
            columns: ["id_client"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "HostingUpkeep_id_miner_model_fkey"
            columns: ["id_miner_model"]
            isOneToOne: false
            referencedRelation: "miner_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "HostingUpkeep_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      InternalRepairs: {
        Row: {
          error_log: string | null
          id: number
          in_date: string | null
          location: string | null
          miner_model: string | null
          miner_serial: string | null
          priority: string | null
          repair_date: string | null
          repair_note: string | null
          site: string | null
          status: string | null
          tech_name: string | null
          worker_name: string | null
        }
        Insert: {
          error_log?: string | null
          id?: number
          in_date?: string | null
          location?: string | null
          miner_model?: string | null
          miner_serial?: string | null
          priority?: string | null
          repair_date?: string | null
          repair_note?: string | null
          site?: string | null
          status?: string | null
          tech_name?: string | null
          worker_name?: string | null
        }
        Update: {
          error_log?: string | null
          id?: number
          in_date?: string | null
          location?: string | null
          miner_model?: string | null
          miner_serial?: string | null
          priority?: string | null
          repair_date?: string | null
          repair_note?: string | null
          site?: string | null
          status?: string | null
          tech_name?: string | null
          worker_name?: string | null
        }
        Relationships: []
      }
      invoices_miner: {
        Row: {
          applied_plan: number | null
          assign_date: string | null
          created_at: string
          credit_amount: number | null
          credit_kwh: number | null
          days_online: number | null
          has_plan: boolean | null
          id: number
          id_client: string
          id_client_foreman: number
          id_miner: number
          id_miner_model: number
          id_report: string
          is_edited: boolean | null
          kwh: number | null
          miner_mac: string | null
          miner_model: string | null
          miner_serial: string | null
          power: number | null
          rate: number | null
          uptime_avg: number | null
          uptime_sum: number | null
        }
        Insert: {
          applied_plan?: number | null
          assign_date?: string | null
          created_at?: string
          credit_amount?: number | null
          credit_kwh?: number | null
          days_online?: number | null
          has_plan?: boolean | null
          id?: number
          id_client: string
          id_client_foreman: number
          id_miner: number
          id_miner_model: number
          id_report: string
          is_edited?: boolean | null
          kwh?: number | null
          miner_mac?: string | null
          miner_model?: string | null
          miner_serial?: string | null
          power?: number | null
          rate?: number | null
          uptime_avg?: number | null
          uptime_sum?: number | null
        }
        Update: {
          applied_plan?: number | null
          assign_date?: string | null
          created_at?: string
          credit_amount?: number | null
          credit_kwh?: number | null
          days_online?: number | null
          has_plan?: boolean | null
          id?: number
          id_client?: string
          id_client_foreman?: number
          id_miner?: number
          id_miner_model?: number
          id_report?: string
          is_edited?: boolean | null
          kwh?: number | null
          miner_mac?: string | null
          miner_model?: string | null
          miner_serial?: string | null
          power?: number | null
          rate?: number | null
          uptime_avg?: number | null
          uptime_sum?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_miner_id_client_fkey"
            columns: ["id_client"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_miner_id_miner_model_fkey"
            columns: ["id_miner_model"]
            isOneToOne: false
            referencedRelation: "miner_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_miner_id_report_fkey"
            columns: ["id_report"]
            isOneToOne: false
            referencedRelation: "uptime_reports"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      miner_models: {
        Row: {
          hashrate: number | null
          id: number
          id_manufacturer: number | null
          model: string
          power: number | null
        }
        Insert: {
          hashrate?: number | null
          id?: number
          id_manufacturer?: number | null
          model: string
          power?: number | null
        }
        Update: {
          hashrate?: number | null
          id?: number
          id_manufacturer?: number | null
          model?: string
          power?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "miner_models_id_manufacturer_fkey"
            columns: ["id_manufacturer"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          }
        ]
      }
      miners: {
        Row: {
          id: number
          id_manufacturer: number
          model: string | null
          protection: boolean | null
          slots: number | null
        }
        Insert: {
          id?: number
          id_manufacturer: number
          model?: string | null
          protection?: boolean | null
          slots?: number | null
        }
        Update: {
          id?: number
          id_manufacturer?: number
          model?: string | null
          protection?: boolean | null
          slots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "miners_id_manufacturer_fkey"
            columns: ["id_manufacturer"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          }
        ]
      }
      network: {
        Row: {
          hostname: string
          id: number
          ip: string | null
          pod_number: string | null
          response: string | null
        }
        Insert: {
          hostname: string
          id?: number
          ip?: string | null
          pod_number?: string | null
          response?: string | null
        }
        Update: {
          hostname?: string
          id?: number
          ip?: string | null
          pod_number?: string | null
          response?: string | null
        }
        Relationships: []
      }
      repair_notes: {
        Row: {
          id: number
          note: string | null
        }
        Insert: {
          id?: number
          note?: string | null
        }
        Update: {
          id?: number
          note?: string | null
        }
        Relationships: []
      }
      repairlist: {
        Row: {
          client_name: string | null
          contacted: string | null
          due_date: string | null
          id: number
          in_date: string | null
          miner_model: string | null
          miner_qty: string | null
          poc: string | null
          repair_link: string | null
          status: string | null
        }
        Insert: {
          client_name?: string | null
          contacted?: string | null
          due_date?: string | null
          id: number
          in_date?: string | null
          miner_model?: string | null
          miner_qty?: string | null
          poc?: string | null
          repair_link?: string | null
          status?: string | null
        }
        Update: {
          client_name?: string | null
          contacted?: string | null
          due_date?: string | null
          id?: number
          in_date?: string | null
          miner_model?: string | null
          miner_qty?: string | null
          poc?: string | null
          repair_link?: string | null
          status?: string | null
        }
        Relationships: []
      }
      repairs: {
        Row: {
          client_email: string | null
          client_name: string | null
          due_date: string | null
          id: number
          id_manufacturer: number | null
          in_date: string | null
          miner_qty: number | null
          status: string | null
        }
        Insert: {
          client_email?: string | null
          client_name?: string | null
          due_date?: string | null
          id?: number
          id_manufacturer?: number | null
          in_date?: string | null
          miner_qty?: number | null
          status?: string | null
        }
        Update: {
          client_email?: string | null
          client_name?: string | null
          due_date?: string | null
          id?: number
          id_manufacturer?: number | null
          in_date?: string | null
          miner_qty?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_id_manufacturer_fkey"
            columns: ["id_manufacturer"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          }
        ]
      }
      repairs_hashboard: {
        Row: {
          completed_at: string | null
          cost: number | null
          id: number
          id_diagnostic_note: number | null
          id_miner_repair: number
          id_repair_note: number | null
          id_tech: string | null
          repair_remark: string | null
          serial: string | null
          slot: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          cost?: number | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_repair: number
          id_repair_note?: number | null
          id_tech?: string | null
          repair_remark?: string | null
          serial?: string | null
          slot?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          cost?: number | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_repair?: number
          id_repair_note?: number | null
          id_tech?: string | null
          repair_remark?: string | null
          serial?: string | null
          slot?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_hashboard_id_diagnostic_note_fkey"
            columns: ["id_diagnostic_note"]
            isOneToOne: false
            referencedRelation: "diagnostic_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_hashboard_id_miner_repair_fkey"
            columns: ["id_miner_repair"]
            isOneToOne: false
            referencedRelation: "repairs_miner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_hashboard_id_repair_note_fkey"
            columns: ["id_repair_note"]
            isOneToOne: false
            referencedRelation: "repair_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_hashboard_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      repairs_intake: {
        Row: {
          answer: boolean | null
          created_at: string
          id: number
          id_question: number
          id_repair: number | null
        }
        Insert: {
          answer?: boolean | null
          created_at?: string
          id?: number
          id_question: number
          id_repair?: number | null
        }
        Update: {
          answer?: boolean | null
          created_at?: string
          id?: number
          id_question?: number
          id_repair?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_intake_id_question_fkey"
            columns: ["id_question"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_intake_id_repair_fkey"
            columns: ["id_repair"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          }
        ]
      }
      repairs_internal: {
        Row: {
          completed_at: string | null
          id: number
          id_diagnostic_note: number | null
          id_miner_model: number
          id_repair_note: number | null
          id_tech: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_model: number
          id_repair_note?: number | null
          id_tech?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_model?: number
          id_repair_note?: number | null
          id_tech?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_internal_id_diagnostic_note_fkey"
            columns: ["id_diagnostic_note"]
            isOneToOne: false
            referencedRelation: "diagnostic_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_internal_id_miner_model_fkey"
            columns: ["id_miner_model"]
            isOneToOne: false
            referencedRelation: "miner_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_internal_id_repair_note_fkey"
            columns: ["id_repair_note"]
            isOneToOne: false
            referencedRelation: "repair_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_internal_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      repairs_miner: {
        Row: {
          cost: number | null
          created_at: string | null
          id: number
          id_diagnostic_note: number | null
          id_miner_model: number | null
          id_repair: number
          id_repair_note: number | null
          id_tech: string | null
          serial: string | null
          status: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_model?: number | null
          id_repair: number
          id_repair_note?: number | null
          id_tech?: string | null
          serial?: string | null
          status?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: number
          id_diagnostic_note?: number | null
          id_miner_model?: number | null
          id_repair?: number
          id_repair_note?: number | null
          id_tech?: string | null
          serial?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_miner_id_diagnostic_note_fkey"
            columns: ["id_diagnostic_note"]
            isOneToOne: false
            referencedRelation: "diagnostic_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_miner_id_miner_model_fkey"
            columns: ["id_miner_model"]
            isOneToOne: false
            referencedRelation: "miner_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_miner_id_repair_fkey"
            columns: ["id_repair"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_miner_id_repair_note_fkey"
            columns: ["id_repair_note"]
            isOneToOne: false
            referencedRelation: "repair_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_miner_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shipment_reports: {
        Row: {
          id: number
          id_repair: number
          miners_in: string
          pallet_name: string | null
          status: string | null
        }
        Insert: {
          id?: number
          id_repair: number
          miners_in: string
          pallet_name?: string | null
          status?: string | null
        }
        Update: {
          id?: number
          id_repair?: number
          miners_in?: string
          pallet_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_reports_id_repair_fkey"
            columns: ["id_repair"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          }
        ]
      }
      support_categories: {
        Row: {
          category: string
          hidden: boolean | null
          id: number
          team: Database["public"]["Enums"]["teams"]
        }
        Insert: {
          category: string
          hidden?: boolean | null
          id?: number
          team: Database["public"]["Enums"]["teams"]
        }
        Update: {
          category?: string
          hidden?: boolean | null
          id?: number
          team?: Database["public"]["Enums"]["teams"]
        }
        Relationships: []
      }
      support_ticket_chats: {
        Row: {
          id: number
          id_sender: string
          id_ticket: number
          message: string
          sent_at: string
        }
        Insert: {
          id?: number
          id_sender: string
          id_ticket: number
          message: string
          sent_at?: string
        }
        Update: {
          id?: number
          id_sender?: string
          id_ticket?: number
          message?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_chats_id_sender_fkey"
            columns: ["id_sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_chats_id_ticket_fkey"
            columns: ["id_ticket"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          }
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: number
          id_category: number
          id_created_by: string
          id_resolved_by: number | null
          is_resolved: boolean
          priority: Database["public"]["Enums"]["priority"]
          resolved_at: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          id_category: number
          id_created_by: string
          id_resolved_by?: number | null
          is_resolved?: boolean
          priority: Database["public"]["Enums"]["priority"]
          resolved_at?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          id_category?: number
          id_created_by?: string
          id_resolved_by?: number | null
          is_resolved?: boolean
          priority?: Database["public"]["Enums"]["priority"]
          resolved_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_id_category_fkey"
            columns: ["id_category"]
            isOneToOne: false
            referencedRelation: "support_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_id_created_by_fkey"
            columns: ["id_created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_id_resolved_by_fkey"
            columns: ["id_resolved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          assigner_id: string
          created_at: string | null
          des: string | null
          endDate: string | null
          id: string
          is_complete: boolean
          name: string | null
          progress: number | null
          startDate: string | null
          tag: string | null
        }
        Insert: {
          assigner_id: string
          created_at?: string | null
          des?: string | null
          endDate?: string | null
          id?: string
          is_complete?: boolean
          name?: string | null
          progress?: number | null
          startDate?: string | null
          tag?: string | null
        }
        Update: {
          assigner_id?: string
          created_at?: string | null
          des?: string | null
          endDate?: string | null
          id?: string
          is_complete?: boolean
          name?: string | null
          progress?: number | null
          startDate?: string | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigner_id_fkey"
            columns: ["assigner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks_assignees: {
        Row: {
          assignee_id: string | null
          created_at: string | null
          id: string
          task_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string | null
          id?: string
          task_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string | null
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignees_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      timesheet: {
        Row: {
          created_at: string
          duration: number | null
          end_time: string | null
          id: number
          id_user: string
          start_time: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: number
          id_user: string
          start_time: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: number
          id_user?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      uptime_reports: {
        Row: {
          created_at: string
          id: string
          month: number
          year: number
        }
        Insert: {
          created_at?: string
          id: string
          month: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          year?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          cvv: string | null
          email: string | null
          foreman_client_id: number | null
          has_contract: boolean | null
          has_plan: boolean | null
          id: string
          name: string | null
          payment_method: string | null
          role: string | null
          temp_password: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          cvv?: string | null
          email?: string | null
          foreman_client_id?: number | null
          has_contract?: boolean | null
          has_plan?: boolean | null
          id: string
          name?: string | null
          payment_method?: string | null
          role?: string | null
          temp_password?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          cvv?: string | null
          email?: string | null
          foreman_client_id?: number | null
          has_contract?: boolean | null
          has_plan?: boolean | null
          id?: string
          name?: string | null
          payment_method?: string | null
          role?: string | null
          temp_password?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      watcher_links: {
        Row: {
          created_at: string
          id: string
          id_repair: number
          id_user: string
        }
        Insert: {
          created_at?: string
          id?: string
          id_repair: number
          id_user: string
        }
        Update: {
          created_at?: string
          id?: string
          id_repair?: number
          id_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "watcher_links_id_repair_fkey"
            columns: ["id_repair"]
            isOneToOne: true
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watcher_links_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      dailyhighhashboard: {
        Row: {
          daily_high: number | null
          id_tech: string | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_hashboard_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      employee_commission: {
        Row: {
          completed: number | null
          id_repair: number | null
          id_tech: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_hashboard_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_miner_id_repair_fkey"
            columns: ["id_repair"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          }
        ]
      }
      employee_hashboards: {
        Row: {
          completed: number | null
          id_tech: string | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_hashboard_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      employee_hashboards12hour: {
        Row: {
          completed: number | null
          id_tech: string | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_hashboard_id_tech_fkey"
            columns: ["id_tech"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      file_exists: {
        Args: {
          bucket: string
          path: string
        }
        Returns: boolean
      }
      get_agg_timesheet: {
        Args: Record<PropertyKey, never>
        Returns: {
          id_user: string
          name: string
          w1_time: string
          w1_overtime: string
          w2_time: string
          w2_overtime: string
          w1_w2_time: string
          w1_w2_overtime: string
        }[]
      }
      get_employee_commissions: {
        Args: {
          arg_id_repair: number
        }
        Returns: {
          id_repair: number
          id_tech: string
          name: string
          completed: number
        }[]
      }
      get_hb_repaired_chart_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          note: string
          total: number
        }[]
      }
      get_invoices: {
        Args: {
          arg_id_report: string
        }
        Returns: {
          id_client: string
          client: string
          total: number
        }[]
      }
      get_miner_invoices: {
        Args: {
          arg_id_report: string
        }
        Returns: {
          id: number
          id_report: string
          id_client: string
          id_client_foreman: number
          id_miner: number
          miner_serial: string
          miner_mac: string
          id_miner_model: number
          miner_model: string
          applied_plan: number
          assign_date: string
          has_plan: boolean
          rate: number
          power: number
          days_online: number
          kwh: number
          uptime_sum: number
          uptime_avg: number
          credit_kwh: number
          credit_amount: number
          is_edited: boolean
        }[]
      }
      get_name_initials: {
        Args: {
          full_name: string
        }
        Returns: string
      }
      get_role: {
        Args: {
          uid: string
        }
        Returns: string
      }
      get_task_assignee: {
        Args: {
          id_task_assignee: string
        }
        Returns: {
          task_name: string
          task_tag: string
          assignee_name: string
          assignee_email: string
        }[]
      }
      get_task_assigner: {
        Args: {
          id_task: string
        }
        Returns: {
          task_name: string
          assigner_name: string
          assigner_email: string
        }[]
      }
      get_ticket_details: {
        Args: {
          arg_id_ticket: number
        }
        Returns: Json
      }
      get_tickets: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: number
          id_category: number
          id_created_by: string
          id_resolved_by: number
          is_resolved: boolean
          priority: Database["public"]["Enums"]["priority"]
          resolved_at: string
          subject: string
          created_by: Json
          resolved_by: Json
          category: Json
        }[]
      }
      get_timesheet: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          id_user: string
          name: string
          daily_totals: Json
          total: number
        }[]
      }
      get_weekly_timesheet: {
        Args: {
          arg_date: string
        }
        Returns: Json
      }
      to_date_noerror: {
        Args: {
          s: string
          fmt: string
        }
        Returns: string
      }
    }
    Enums: {
      banner_type: "maintenance"
      priority: "Low" | "Medium" | "High"
      question_types:
        | "ext_repairs_intake"
        | "hosting_checklist"
        | "deployment_checklist"
      teams: "Admin" | "Hosting" | "Repair" | "IT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
