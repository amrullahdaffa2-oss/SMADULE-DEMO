import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions matching the schema
export type Database = {
  public: {
    Tables: {
      pengajar: {
        Row: {
          id: string
          nama: string
          mapel: string
          kelas: string[]
          wa: string
          email: string
          avatar: string
          status: string
          spesialisasi: string
          color: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pengajar']['Row'], 'created_at'>
      }
      murid: {
        Row: {
          id: string
          nama: string
          kelas: string
          avatar: string
          poin: number
          ranking: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['murid']['Row'], 'created_at'>
      }
      materi: {
        Row: {
          id: string
          judul: string
          deskripsi: string
          konten: string
          mapel: string
          kelas: string
          guru: string
          schedule_date: string
          end_date: string
          status: string
          files: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['materi']['Row'], 'created_at'>
      }
      tugas: {
        Row: {
          id: string
          judul: string
          materi_id: string
          deskripsi: string
          deadline: string
          nilai_maks: number
          sudah_kumpul: boolean
          tipe: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tugas']['Row'], 'created_at'>
      }
      nilai: {
        Row: {
          id: string
          murid_id: string
          murid_nama: string
          materi_id: string
          tipe: string
          nilai_angka: number
          nilai_huruf: string
          feedback: string
          dinilai_pada: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['nilai']['Row'], 'created_at'>
      }
      absensi: {
        Row: {
          id: string
          murid_id: string
          murid_nama: string
          materi_id: string
          materi_judul: string
          waktu_hadir: string
          durasi: number
          status_tugas: string
          completed_pretest: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['absensi']['Row'], 'created_at'>
      }
      diskusi: {
        Row: {
          id: string
          materi_id: string
          author_id: string
          author_nama: string
          author_role: string
          konten: string
          upvotes: number
          is_pinned: boolean
          parent_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['diskusi']['Row'], 'created_at'>
      }
      notifikasi: {
        Row: {
          id: string
          murid_id: string
          judul: string
          pesan: string
          waktu: string
          dibaca: boolean
          tipe: string
          icon: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifikasi']['Row'], 'created_at'>
      }
    }
  }
}
