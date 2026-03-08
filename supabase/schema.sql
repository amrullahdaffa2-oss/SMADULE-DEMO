-- ============================================================
-- SMADULE - Supabase Schema
-- Run this in your Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: pengajar (Teachers)
-- ============================================================
create table if not exists public.pengajar (
  id text primary key,
  nama text not null,
  mapel text not null,
  kelas text[] not null default '{}',
  wa text,
  email text,
  avatar text,
  status text not null default 'offline', -- 'online' | 'offline' | 'mengajar'
  spesialisasi text,
  color text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: murid (Students)
-- ============================================================
create table if not exists public.murid (
  id text primary key,
  nama text not null,
  kelas text not null,
  avatar text,
  poin integer not null default 0,
  ranking integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: materi (Learning Materials)
-- ============================================================
create table if not exists public.materi (
  id text primary key,
  judul text not null,
  deskripsi text,
  konten text,
  mapel text not null,
  kelas text not null,
  guru text not null,
  schedule_date timestamptz,
  end_date timestamptz,
  status text not null default 'draft', -- 'active' | 'scheduled' | 'closed' | 'draft'
  files text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: tugas (Assignments)
-- ============================================================
create table if not exists public.tugas (
  id text primary key,
  judul text not null,
  materi_id text references public.materi(id) on delete cascade,
  deskripsi text,
  deadline timestamptz,
  nilai_maks integer not null default 100,
  sudah_kumpul boolean not null default false,
  tipe text not null default 'essay', -- 'essay' | 'quiz' | 'proyek' | 'ulangan'
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: nilai (Grades)
-- ============================================================
create table if not exists public.nilai (
  id text primary key,
  murid_id text references public.murid(id) on delete cascade,
  murid_nama text not null,
  materi_id text references public.materi(id) on delete cascade,
  tipe text not null, -- 'pretest' | 'tugas' | 'ulangan'
  nilai_angka integer not null,
  nilai_huruf text not null,
  feedback text,
  dinilai_pada timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: absensi (Attendance)
-- ============================================================
create table if not exists public.absensi (
  id text primary key,
  murid_id text references public.murid(id) on delete cascade,
  murid_nama text not null,
  materi_id text references public.materi(id) on delete cascade,
  materi_judul text not null,
  waktu_hadir timestamptz not null default now(),
  durasi integer not null default 0,
  status_tugas text not null default 'belum', -- 'belum' | 'sudah'
  completed_pretest boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: diskusi (Discussions)
-- ============================================================
create table if not exists public.diskusi (
  id text primary key,
  materi_id text references public.materi(id) on delete cascade,
  author_id text not null,
  author_nama text not null,
  author_role text not null, -- 'guru' | 'murid'
  konten text not null,
  upvotes integer not null default 0,
  is_pinned boolean not null default false,
  parent_id text references public.diskusi(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: notifikasi (Notifications)
-- ============================================================
create table if not exists public.notifikasi (
  id text primary key,
  murid_id text references public.murid(id) on delete cascade,
  judul text not null,
  pesan text not null,
  waktu timestamptz not null default now(),
  dibaca boolean not null default false,
  tipe text not null, -- 'materi' | 'tugas' | 'nilai' | 'absensi' | 'diskusi' | 'gamifikasi'
  icon text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.pengajar enable row level security;
alter table public.murid enable row level security;
alter table public.materi enable row level security;
alter table public.tugas enable row level security;
alter table public.nilai enable row level security;
alter table public.absensi enable row level security;
alter table public.diskusi enable row level security;
alter table public.notifikasi enable row level security;

-- Allow public read access for all tables (adjust as needed)
create policy "Allow public read pengajar" on public.pengajar for select using (true);
create policy "Allow public read murid" on public.murid for select using (true);
create policy "Allow public read materi" on public.materi for select using (true);
create policy "Allow public read tugas" on public.tugas for select using (true);
create policy "Allow public read nilai" on public.nilai for select using (true);
create policy "Allow public read absensi" on public.absensi for select using (true);
create policy "Allow public read diskusi" on public.diskusi for select using (true);
create policy "Allow public read notifikasi" on public.notifikasi for select using (true);

-- Allow insert/update for authenticated users (or use anon for demo)
create policy "Allow insert absensi" on public.absensi for insert with check (true);
create policy "Allow insert diskusi" on public.diskusi for insert with check (true);
create policy "Allow update notifikasi" on public.notifikasi for update using (true);
create policy "Allow update murid poin" on public.murid for update using (true);
create policy "Allow insert materi" on public.materi for insert with check (true);
create policy "Allow update materi" on public.materi for update using (true);
create policy "Allow insert tugas" on public.tugas for insert with check (true);
create policy "Allow insert nilai" on public.nilai for insert with check (true);
create policy "Allow update diskusi upvotes" on public.diskusi for update using (true);

-- ============================================================
-- SEED DATA: pengajar
-- ============================================================
insert into public.pengajar (id, nama, mapel, kelas, wa, email, avatar, status, spesialisasi, color) values
  ('g1', 'Ahmad Fauzi, S.Pd', 'Matematika', ARRAY['X','XI','XII'], '6281234567890', 'ahmad@smadule.id', 'AF', 'online', 'Kalkulus & Statistika', '#4F46E5'),
  ('g2', 'Siti Rahayu, M.Pd', 'Bahasa Indonesia', ARRAY['X','XI'], '6281234567891', 'siti@smadule.id', 'SR', 'mengajar', 'Sastra & Komposisi', '#10B981'),
  ('g3', 'Budi Santoso, S.T', 'Fisika', ARRAY['XI','XII'], '6281234567892', 'budi@smadule.id', 'BS', 'offline', 'Mekanika & Termodinamika', '#F59E0B'),
  ('g4', 'Dewi Kartika, S.Pd', 'Kimia', ARRAY['XI','XII'], '6281234567893', 'dewi@smadule.id', 'DK', 'online', 'Kimia Organik', '#EF4444'),
  ('g5', 'Rendi Pratama, M.Si', 'Biologi', ARRAY['X','XI'], '6281234567894', 'rendi@smadule.id', 'RP', 'online', 'Genetika & Ekologi', '#8B5CF6'),
  ('g6', 'Nurul Hidayah, S.S', 'Bahasa Inggris', ARRAY['X','XI','XII'], '6281234567895', 'nurul@smadule.id', 'NH', 'mengajar', 'Grammar & Conversation', '#EC4899')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: murid
-- ============================================================
insert into public.murid (id, nama, kelas, avatar, poin, ranking) values
  ('m1', 'Daffa Rizky', 'XI IPA 2', 'DR', 420, 3),
  ('m2', 'Aulia Putri', 'XI IPA 2', 'AP', 580, 1),
  ('m3', 'Bintang Cahaya', 'XI IPA 2', 'BC', 510, 2),
  ('m4', 'Citra Dewi', 'XI IPA 2', 'CD', 380, 4),
  ('m5', 'Eko Prasetyo', 'XI IPA 2', 'EP', 350, 5),
  ('m6', 'Fira Nadia', 'XI IPA 2', 'FN', 320, 6),
  ('m7', 'Gilang Ramadhan', 'XI IPA 2', 'GR', 290, 7),
  ('m8', 'Hana Safitri', 'XI IPA 2', 'HS', 270, 8),
  ('m9', 'Ilham Maulana', 'XI IPA 2', 'IM', 240, 9),
  ('m10', 'Julia Sari', 'XI IPA 2', 'JS', 220, 10),
  ('m11', 'Krisna Wijaya', 'XI IPA 2', 'KW', 200, 11),
  ('m12', 'Lina Marlina', 'XI IPA 2', 'LM', 180, 12),
  ('m13', 'Muhamad Arif', 'XI IPA 2', 'MA', 160, 13),
  ('m14', 'Nita Febriani', 'XI IPA 2', 'NF', 140, 14),
  ('m15', 'Oscar Pratama', 'XI IPA 2', 'OP', 120, 15)
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: materi
-- ============================================================
insert into public.materi (id, judul, deskripsi, konten, mapel, kelas, guru, schedule_date, end_date, status, files) values
  ('mtri1', 'Integral Tentu dan Tak Tentu', 'Memahami konsep dasar integral sebagai antiturunan dan aplikasinya dalam menghitung luas daerah.', '# Integral Tentu dan Tak Tentu\n\n## Pendahuluan\n\nIntegral adalah salah satu konsep fundamental dalam kalkulus yang merupakan kebalikan dari diferensiasi (turunan).', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() - interval '2 days', now() + interval '14 days', 'active', ARRAY['rumus-integral.pdf','latihan-soal.pdf']),
  ('mtri2', 'Trigonometri Lanjutan', 'Mempelajari identitas trigonometri, rumus sudut ganda, dan rumus jumlah serta selisih sudut.', '# Trigonometri Lanjutan\n\n## Identitas Trigonometri Dasar\n\nsin²x + cos²x = 1', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() - interval '1 day', now() + interval '7 days', 'active', ARRAY['tabel-trigonometri.pdf']),
  ('mtri3', 'Statistika dan Peluang', 'Konsep dasar statistika deskriptif, distribusi data, dan teori peluang.', '# Statistika dan Peluang\n\n## Statistika Deskriptif\n\n### Ukuran Pemusatan\n- **Mean**: x̄ = Σxᵢ/n', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() + interval '1 day', now() + interval '21 days', 'scheduled', ARRAY[]::text[]),
  ('mtri4', 'Persamaan Diferensial', 'Pengenalan persamaan diferensial biasa, metode separasi variabel, dan aplikasinya.', '# Persamaan Diferensial\n\n## Definisi\nPersamaan diferensial adalah persamaan yang memuat turunan dari fungsi yang tidak diketahui.', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() + interval '2 days', now() + interval '28 days', 'scheduled', ARRAY[]::text[]),
  ('mtri5', 'Limit Fungsi', 'Konsep limit, sifat-sifat limit, dan keterkaitan dengan kekontinuan fungsi.', '# Limit Fungsi\n\n## Definisi Limit\nlim(x→a) f(x) = L berarti nilai f(x) mendekati L ketika x mendekati a.', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() - interval '7 days', now() - interval '1 day', 'closed', ARRAY['soal-ulangan.pdf']),
  ('mtri6', 'Matriks dan Determinan', 'Operasi matriks, invers matriks, dan determinan beserta aplikasinya.', '# Matriks dan Determinan\n\n## Definisi Matriks\nMatriks adalah susunan bilangan yang diatur dalam baris dan kolom.', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() - interval '14 days', now() - interval '3 days', 'closed', ARRAY['matriks-review.pdf']),
  ('mtri7', 'Barisan dan Deret', 'Barisan aritmatika, geometri, dan deret terkait beserta aplikasinya.', '# Barisan dan Deret\n\n## Barisan Aritmatika\nUn = a + (n-1)b', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() + interval '3 days', now() + interval '35 days', 'draft', ARRAY[]::text[]),
  ('mtri8', 'Fungsi Eksponen dan Logaritma', 'Fungsi eksponen, fungsi logaritma, sifat-sifat dan aplikasinya.', '# Fungsi Eksponen dan Logaritma\n\n## Fungsi Eksponen\nf(x) = aˣ, a > 0, a ≠ 1', 'Matematika', 'XI IPA 2', 'Pak Ahmad Fauzi', now() + interval '5 days', now() + interval '40 days', 'draft', ARRAY[]::text[])
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: tugas
-- ============================================================
insert into public.tugas (id, judul, materi_id, deskripsi, deadline, nilai_maks, sudah_kumpul, tipe) values
  ('tgs1', 'Latihan Soal Integral Bab 1', 'mtri1', 'Kerjakan 10 soal integral dari buku halaman 45-47.', now() + interval '2 days', 100, false, 'essay'),
  ('tgs2', 'Quiz Trigonometri Online', 'mtri2', 'Quiz pilihan ganda 15 soal tentang trigonometri lanjutan.', now() + interval '1 day', 100, true, 'quiz'),
  ('tgs3', 'Proyek Statistika Data Kelas', 'mtri3', 'Kumpulkan dan analisis data tinggi badan teman sekelas.', now() + interval '5 days', 100, false, 'proyek'),
  ('tgs4', 'UH Limit Fungsi', 'mtri5', 'Ulangan harian tentang materi limit fungsi.', now() - interval '3 days', 100, true, 'ulangan'),
  ('tgs5', 'PR Matriks', 'mtri6', 'Selesaikan soal-soal matriks nomor 1-20 dari LKS halaman 78.', now() - interval '1 day', 100, false, 'essay'),
  ('tgs6', 'Presentasi Barisan Deret', 'mtri7', 'Buat presentasi singkat 5-10 slide tentang aplikasi barisan deret.', now() + interval '7 days', 100, false, 'proyek')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: nilai
-- ============================================================
insert into public.nilai (id, murid_id, murid_nama, materi_id, tipe, nilai_angka, nilai_huruf, feedback, dinilai_pada) values
  ('nil1', 'm1', 'Daffa Rizky', 'mtri1', 'pretest', 85, 'A', 'Bagus sekali! Pemahaman konsep dasar integral sudah baik.', now() - interval '2 days'),
  ('nil2', 'm1', 'Daffa Rizky', 'mtri2', 'tugas', 78, 'B+', 'Cukup baik, tapi perlu diperdalam untuk soal trigonometri yang lebih kompleks.', now() - interval '1 day'),
  ('nil3', 'm1', 'Daffa Rizky', 'mtri5', 'ulangan', 90, 'A', 'Excellent! Semua konsep limit dikuasai dengan sangat baik.', now() - interval '7 days'),
  ('nil4', 'm1', 'Daffa Rizky', 'mtri6', 'tugas', 72, 'B', 'Ada beberapa kesalahan pada operasi matriks bertingkat.', now() - interval '10 days')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: absensi
-- ============================================================
insert into public.absensi (id, murid_id, murid_nama, materi_id, materi_judul, waktu_hadir, durasi, status_tugas, completed_pretest) values
  ('abs1', 'm1', 'Daffa Rizky', 'mtri1', 'Integral Tentu dan Tak Tentu', now() - interval '2 days', 35, 'belum', true),
  ('abs2', 'm2', 'Aulia Putri', 'mtri1', 'Integral Tentu dan Tak Tentu', now() - interval '2 days', 42, 'sudah', true),
  ('abs3', 'm3', 'Bintang Cahaya', 'mtri1', 'Integral Tentu dan Tak Tentu', now() - interval '2 days', 28, 'sudah', true),
  ('abs4', 'm4', 'Citra Dewi', 'mtri1', 'Integral Tentu dan Tak Tentu', now() - interval '2 days', 15, 'belum', false),
  ('abs5', 'm1', 'Daffa Rizky', 'mtri2', 'Trigonometri Lanjutan', now() - interval '1 day', 38, 'sudah', true),
  ('abs6', 'm2', 'Aulia Putri', 'mtri2', 'Trigonometri Lanjutan', now() - interval '1 day', 45, 'sudah', true)
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: diskusi
-- ============================================================
insert into public.diskusi (id, materi_id, author_id, author_nama, author_role, konten, upvotes, is_pinned, parent_id) values
  ('dis1', 'mtri1', 'm2', 'Aulia Putri', 'murid', 'Pak, untuk soal integral substitusi, apakah kita selalu perlu mengembalikan variabel ke bentuk aslinya?', 8, false, null),
  ('dis1r1', 'mtri1', 'g1', 'Pak Ahmad Fauzi', 'guru', 'Betul sekali! Setelah mengintegralkan dengan variabel substitusi, kita HARUS mengembalikan ke variabel asli agar hasil integral sesuai dengan variabel yang diminta.', 5, false, 'dis1'),
  ('dis2', 'mtri1', 'm1', 'Daffa Rizky', 'murid', 'Saya masih bingung dengan konstanta C pada integral tak tentu. Kenapa perlu ada?', 12, true, null),
  ('dis2r1', 'mtri1', 'g1', 'Pak Ahmad Fauzi', 'guru', 'Konstanta C ada karena turunan dari konstanta adalah nol. Artinya, fungsi x²+5 dan x²+10 memiliki turunan yang sama yaitu 2x.', 15, true, 'dis2')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: notifikasi
-- ============================================================
insert into public.notifikasi (id, murid_id, judul, pesan, waktu, dibaca, tipe, icon) values
  ('notif1', 'm1', 'Materi Baru Tersedia', 'Materi "Integral Tentu dan Tak Tentu" sudah dapat diakses!', now() - interval '2 days', true, 'materi', '📚'),
  ('notif2', 'm1', 'Reminder Tugas', 'Tugas "Latihan Soal Integral Bab 1" deadline dalam 2 hari', now() - interval '1 day', true, 'tugas', '📝'),
  ('notif3', 'm1', 'Pre-Test Selesai', 'Kamu mendapat nilai 85 pada pre-test Integral!', now() - interval '1 day', false, 'nilai', '🎯'),
  ('notif4', 'm1', 'Materi Trigonometri', 'Materi "Trigonometri Lanjutan" sudah dapat diakses sekarang!', now() - interval '1 day', false, 'materi', '📐'),
  ('notif5', 'm1', 'Poin Leaderboard', 'Kamu naik ke posisi #3 di leaderboard minggu ini!', now(), false, 'gamifikasi', '🏆'),
  ('notif6', 'm1', 'Guru Membalas Diskusi', 'Pak Ahmad Fauzi membalas pertanyaanmu di diskusi Integral', now() - interval '1 day', false, 'diskusi', '💬'),
  ('notif7', 'm1', 'Materi Akan Segera Tersedia', 'Materi "Statistika dan Peluang" akan tersedia besok pukul 07.00', now(), true, 'materi', '⏰'),
  ('notif8', 'm1', 'Nilai Tugas Keluar', 'Pak Ahmad memberikan nilai 78 untuk tugas Trigonometri kamu', now() - interval '1 day', false, 'nilai', '📊'),
  ('notif9', 'm1', 'Badge Baru!', 'Selamat! Kamu mendapatkan badge "Tepat Waktu"', now() - interval '2 days', true, 'gamifikasi', '🏅'),
  ('notif10', 'm1', 'Kehadiran Tercatat', 'Kehadiran kamu pada materi Trigonometri berhasil dicatat', now() - interval '1 day', true, 'absensi', '✅')
on conflict (id) do nothing;
