export const MOCK_USERS = {
  guru: { id: 'g1', nama: 'Pak Ahmad Fauzi', mapel: 'Matematika', kelas: 'XI IPA 2', avatar: 'AF', role: 'guru' as const },
  murid: { id: 'm1', nama: 'Daffa Rizky', kelas: 'XI IPA 2', avatar: 'DR', role: 'murid' as const, poin: 420, ranking: 3 },
  orangtua: { id: 'o1', nama: 'Bpk. Rizky Pratama', anak: 'Daffa Rizky', kelas: 'XI IPA 2', avatar: 'RP', role: 'orangtua' as const },
}

export const MOCK_PENGAJAR = [
  { id: 'g1', nama: 'Ahmad Fauzi, S.Pd', mapel: 'Matematika', kelas: ['X', 'XI', 'XII'], wa: '6281234567890', email: 'ahmad@smadule.id', avatar: 'AF', status: 'online', spesialisasi: 'Kalkulus & Statistika', color: '#4F46E5' },
  { id: 'g2', nama: 'Siti Rahayu, M.Pd', mapel: 'Bahasa Indonesia', kelas: ['X', 'XI'], wa: '6281234567891', email: 'siti@smadule.id', avatar: 'SR', status: 'mengajar', spesialisasi: 'Sastra & Komposisi', color: '#10B981' },
  { id: 'g3', nama: 'Budi Santoso, S.T', mapel: 'Fisika', kelas: ['XI', 'XII'], wa: '6281234567892', email: 'budi@smadule.id', avatar: 'BS', status: 'offline', spesialisasi: 'Mekanika & Termodinamika', color: '#F59E0B' },
  { id: 'g4', nama: 'Dewi Kartika, S.Pd', mapel: 'Kimia', kelas: ['XI', 'XII'], wa: '6281234567893', email: 'dewi@smadule.id', avatar: 'DK', status: 'online', spesialisasi: 'Kimia Organik', color: '#EF4444' },
  { id: 'g5', nama: 'Rendi Pratama, M.Si', mapel: 'Biologi', kelas: ['X', 'XI'], wa: '6281234567894', email: 'rendi@smadule.id', avatar: 'RP', status: 'online', spesialisasi: 'Genetika & Ekologi', color: '#8B5CF6' },
  { id: 'g6', nama: 'Nurul Hidayah, S.S', mapel: 'Bahasa Inggris', kelas: ['X', 'XI', 'XII'], wa: '6281234567895', email: 'nurul@smadule.id', avatar: 'NH', status: 'mengajar', spesialisasi: 'Grammar & Conversation', color: '#EC4899' },
]

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

export const MOCK_MATERI = [
  {
    id: 'm1', judul: 'Integral Tentu dan Tak Tentu', deskripsi: 'Memahami konsep dasar integral sebagai antiturunan dan aplikasinya dalam menghitung luas daerah.',
    konten: `# Integral Tentu dan Tak Tentu\n\n## Pendahuluan\n\nIntegral adalah salah satu konsep fundamental dalam kalkulus yang merupakan kebalikan dari diferensiasi (turunan). Ada dua jenis integral yang perlu kita pahami: integral tak tentu dan integral tentu.\n\n## Integral Tak Tentu\n\nIntegral tak tentu dari fungsi f(x) didefinisikan sebagai kumpulan semua antiturunan dari f(x). Jika F'(x) = f(x), maka:\n\n∫f(x) dx = F(x) + C\n\ndi mana C adalah konstanta sembarang yang disebut konstanta integrasi.`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: twoDaysAgo, endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    status: 'active', files: ['rumus-integral.pdf', 'latihan-soal.pdf'], createdAt: twoDaysAgo,
  },
  {
    id: 'm2', judul: 'Trigonometri Lanjutan', deskripsi: 'Mempelajari identitas trigonometri, rumus sudut ganda, dan rumus jumlah serta selisih sudut.',
    konten: `# Trigonometri Lanjutan\n\n## Identitas Trigonometri Dasar\n\nsin²x + cos²x = 1\ntan²x + 1 = sec²x`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: yesterday, endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    status: 'active', files: ['tabel-trigonometri.pdf'], createdAt: yesterday,
  },
  {
    id: 'm3', judul: 'Statistika dan Peluang', deskripsi: 'Konsep dasar statistika deskriptif, distribusi data, dan teori peluang.',
    konten: `# Statistika dan Peluang\n\n## Statistika Deskriptif\n\n### Ukuran Pemusatan\n- **Mean**: x̄ = Σxᵢ/n`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: tomorrow, endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
    status: 'scheduled', files: [], createdAt: now,
  },
  {
    id: 'm4', judul: 'Persamaan Diferensial', deskripsi: 'Pengenalan persamaan diferensial biasa, metode separasi variabel, dan aplikasinya.',
    konten: `# Persamaan Diferensial\n\n## Definisi\nPersamaan diferensial adalah persamaan yang memuat turunan dari fungsi yang tidak diketahui.`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: dayAfterTomorrow, endDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
    status: 'scheduled', files: [], createdAt: now,
  },
  {
    id: 'm5', judul: 'Limit Fungsi', deskripsi: 'Konsep limit, sifat-sifat limit, dan keterkaitan dengan kekontinuan fungsi.',
    konten: `# Limit Fungsi\n\n## Definisi Limit\nlim(x→a) f(x) = L berarti nilai f(x) mendekati L ketika x mendekati a.`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: oneWeekAgo, endDate: yesterday,
    status: 'closed', files: ['soal-ulangan.pdf'], createdAt: oneWeekAgo,
  },
  {
    id: 'm6', judul: 'Matriks dan Determinan', deskripsi: 'Operasi matriks, invers matriks, dan determinan beserta aplikasinya.',
    konten: `# Matriks dan Determinan\n\n## Definisi Matriks\nMatriks adalah susunan bilangan yang diatur dalam baris dan kolom.`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    status: 'closed', files: ['matriks-review.pdf'], createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm7', judul: 'Barisan dan Deret', deskripsi: 'Barisan aritmatika, geometri, dan deret terkait beserta aplikasinya.',
    konten: `# Barisan dan Deret\n\n## Barisan Aritmatika\nUn = a + (n-1)b`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: threeDaysLater, endDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
    status: 'draft', files: [], createdAt: now,
  },
  {
    id: 'm8', judul: 'Fungsi Eksponen dan Logaritma', deskripsi: 'Fungsi eksponen, fungsi logaritma, sifat-sifat dan aplikasinya.',
    konten: `# Fungsi Eksponen dan Logaritma\n\n## Fungsi Eksponen\nf(x) = aˣ, a > 0, a ≠ 1`,
    mapel: 'Matematika', kelas: 'XI IPA 2', guru: 'Pak Ahmad Fauzi',
    scheduleDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
    status: 'draft', files: [], createdAt: now,
  },
]

export const MOCK_TUGAS = [
  { id: 't1', judul: 'Latihan Soal Integral Bab 1', materiId: 'm1', deskripsi: 'Kerjakan 10 soal integral dari buku halaman 45-47.', deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: false, tipe: 'essay' },
  { id: 't2', judul: 'Quiz Trigonometri Online', materiId: 'm2', deskripsi: 'Quiz pilihan ganda 15 soal tentang trigonometri lanjutan.', deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: true, tipe: 'quiz' },
  { id: 't3', judul: 'Proyek Statistika Data Kelas', materiId: 'm3', deskripsi: 'Kumpulkan dan analisis data tinggi badan teman sekelas.', deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: false, tipe: 'proyek' },
  { id: 't4', judul: 'UH Limit Fungsi', materiId: 'm5', deskripsi: 'Ulangan harian tentang materi limit fungsi.', deadline: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: true, tipe: 'ulangan' },
  { id: 't5', judul: 'PR Matriks', materiId: 'm6', deskripsi: 'Selesaikan soal-soal matriks nomor 1-20 dari LKS halaman 78.', deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: false, tipe: 'essay' },
  { id: 't6', judul: 'Presentasi Barisan Deret', materiId: 'm7', deskripsi: 'Buat presentasi singkat 5-10 slide tentang aplikasi barisan deret.', deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), nilaiMaks: 100, sudahKumpul: false, tipe: 'proyek' },
]

export const MOCK_MURID = [
  { id: 'm1', nama: 'Daffa Rizky', kelas: 'XI IPA 2', avatar: 'DR', poin: 420, ranking: 3 },
  { id: 'm2', nama: 'Aulia Putri', kelas: 'XI IPA 2', avatar: 'AP', poin: 580, ranking: 1 },
  { id: 'm3', nama: 'Bintang Cahaya', kelas: 'XI IPA 2', avatar: 'BC', poin: 510, ranking: 2 },
  { id: 'm4', nama: 'Citra Dewi', kelas: 'XI IPA 2', avatar: 'CD', poin: 380, ranking: 4 },
  { id: 'm5', nama: 'Eko Prasetyo', kelas: 'XI IPA 2', avatar: 'EP', poin: 350, ranking: 5 },
  { id: 'm6', nama: 'Fira Nadia', kelas: 'XI IPA 2', avatar: 'FN', poin: 320, ranking: 6 },
  { id: 'm7', nama: 'Gilang Ramadhan', kelas: 'XI IPA 2', avatar: 'GR', poin: 290, ranking: 7 },
  { id: 'm8', nama: 'Hana Safitri', kelas: 'XI IPA 2', avatar: 'HS', poin: 270, ranking: 8 },
  { id: 'm9', nama: 'Ilham Maulana', kelas: 'XI IPA 2', avatar: 'IM', poin: 240, ranking: 9 },
  { id: 'm10', nama: 'Julia Sari', kelas: 'XI IPA 2', avatar: 'JS', poin: 220, ranking: 10 },
  { id: 'm11', nama: 'Krisna Wijaya', kelas: 'XI IPA 2', avatar: 'KW', poin: 200, ranking: 11 },
  { id: 'm12', nama: 'Lina Marlina', kelas: 'XI IPA 2', avatar: 'LM', poin: 180, ranking: 12 },
  { id: 'm13', nama: 'Muhamad Arif', kelas: 'XI IPA 2', avatar: 'MA', poin: 160, ranking: 13 },
  { id: 'm14', nama: 'Nita Febriani', kelas: 'XI IPA 2', avatar: 'NF', poin: 140, ranking: 14 },
  { id: 'm15', nama: 'Oscar Pratama', kelas: 'XI IPA 2', avatar: 'OP', poin: 120, ranking: 15 },
]

export const MOCK_NILAI = [
  { id: 'n1', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm1', tipe: 'pretest', nilaiAngka: 85, nilaiHuruf: 'A', feedback: 'Bagus sekali! Pemahaman konsep dasar integral sudah baik.', dinilaiPada: twoDaysAgo },
  { id: 'n2', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm2', tipe: 'tugas', nilaiAngka: 78, nilaiHuruf: 'B+', feedback: 'Cukup baik, tapi perlu diperdalam untuk soal trigonometri yang lebih kompleks.', dinilaiPada: yesterday },
  { id: 'n3', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm5', tipe: 'ulangan', nilaiAngka: 90, nilaiHuruf: 'A', feedback: 'Excellent! Semua konsep limit dikuasai dengan sangat baik.', dinilaiPada: oneWeekAgo },
  { id: 'n4', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm6', tipe: 'tugas', nilaiAngka: 72, nilaiHuruf: 'B', feedback: 'Ada beberapa kesalahan pada operasi matriks bertingkat.', dinilaiPada: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
]

export const MOCK_ABSENSI = [
  { id: 'a1', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm1', materiJudul: 'Integral Tentu dan Tak Tentu', waktuHadir: twoDaysAgo, durasi: 35, statusTugas: 'belum', completedPretest: true },
  { id: 'a2', muridId: 'm2', muridNama: 'Aulia Putri', materiId: 'm1', materiJudul: 'Integral Tentu dan Tak Tentu', waktuHadir: twoDaysAgo, durasi: 42, statusTugas: 'sudah', completedPretest: true },
  { id: 'a3', muridId: 'm3', muridNama: 'Bintang Cahaya', materiId: 'm1', materiJudul: 'Integral Tentu dan Tak Tentu', waktuHadir: twoDaysAgo, durasi: 28, statusTugas: 'sudah', completedPretest: true },
  { id: 'a4', muridId: 'm4', muridNama: 'Citra Dewi', materiId: 'm1', materiJudul: 'Integral Tentu dan Tak Tentu', waktuHadir: twoDaysAgo, durasi: 15, statusTugas: 'belum', completedPretest: false },
  { id: 'a5', muridId: 'm1', muridNama: 'Daffa Rizky', materiId: 'm2', materiJudul: 'Trigonometri Lanjutan', waktuHadir: yesterday, durasi: 38, statusTugas: 'sudah', completedPretest: true },
  { id: 'a6', muridId: 'm2', muridNama: 'Aulia Putri', materiId: 'm2', materiJudul: 'Trigonometri Lanjutan', waktuHadir: yesterday, durasi: 45, statusTugas: 'sudah', completedPretest: true },
]

export const MOCK_DISKUSI = [
  {
    id: 'd1', materiId: 'm1', authorId: 'm2', authorNama: 'Aulia Putri', authorRole: 'murid' as const,
    konten: 'Pak, untuk soal integral substitusi, apakah kita selalu perlu mengembalikan variabel ke bentuk aslinya?',
    upvotes: 8, isPinned: false, createdAt: twoDaysAgo,
    replies: [
      { id: 'd1r1', materiId: 'm1', authorId: 'g1', authorNama: 'Pak Ahmad Fauzi', authorRole: 'guru' as const, konten: 'Betul sekali! Setelah mengintegralkan dengan variabel substitusi, kita HARUS mengembalikan ke variabel asli agar hasil integral sesuai dengan variabel yang diminta.', upvotes: 5, isPinned: false, createdAt: twoDaysAgo, replies: [] },
    ]
  },
  {
    id: 'd2', materiId: 'm1', authorId: 'm1', authorNama: 'Daffa Rizky', authorRole: 'murid' as const,
    konten: 'Saya masih bingung dengan konstanta C pada integral tak tentu. Kenapa perlu ada?',
    upvotes: 12, isPinned: true, createdAt: yesterday,
    replies: [
      { id: 'd2r1', materiId: 'm1', authorId: 'g1', authorNama: 'Pak Ahmad Fauzi', authorRole: 'guru' as const, konten: 'Konstanta C ada karena turunan dari konstanta adalah nol. Artinya, fungsi x²+5 dan x²+10 memiliki turunan yang sama yaitu 2x.', upvotes: 15, isPinned: true, createdAt: yesterday, replies: [] },
    ]
  },
]

export const MOCK_NOTIFIKASI = [
  { id: 'notif1', judul: 'Materi Baru Tersedia', pesan: 'Materi "Integral Tentu dan Tak Tentu" sudah dapat diakses!', waktu: twoDaysAgo, dibaca: true, tipe: 'materi', icon: '📚' },
  { id: 'notif2', judul: 'Reminder Tugas', pesan: 'Tugas "Latihan Soal Integral Bab 1" deadline dalam 2 hari', waktu: yesterday, dibaca: true, tipe: 'tugas', icon: '📝' },
  { id: 'notif3', judul: 'Pre-Test Selesai', pesan: 'Kamu mendapat nilai 85 pada pre-test Integral!', waktu: yesterday, dibaca: false, tipe: 'nilai', icon: '🎯' },
  { id: 'notif4', judul: 'Materi Trigonometri', pesan: 'Materi "Trigonometri Lanjutan" sudah dapat diakses sekarang!', waktu: yesterday, dibaca: false, tipe: 'materi', icon: '📐' },
  { id: 'notif5', judul: 'Poin Leaderboard', pesan: 'Kamu naik ke posisi #3 di leaderboard minggu ini!', waktu: now, dibaca: false, tipe: 'gamifikasi', icon: '🏆' },
  { id: 'notif6', judul: 'Guru Membalas Diskusi', pesan: 'Pak Ahmad Fauzi membalas pertanyaanmu di diskusi Integral', waktu: yesterday, dibaca: false, tipe: 'diskusi', icon: '💬' },
  { id: 'notif7', judul: 'Materi Akan Segera Tersedia', pesan: 'Materi "Statistika dan Peluang" akan tersedia besok pukul 07.00', waktu: now, dibaca: true, tipe: 'materi', icon: '⏰' },
  { id: 'notif8', judul: 'Nilai Tugas Keluar', pesan: 'Pak Ahmad memberikan nilai 78 untuk tugas Trigonometri kamu', waktu: yesterday, dibaca: false, tipe: 'nilai', icon: '📊' },
  { id: 'notif9', judul: 'Badge Baru!', pesan: 'Selamat! Kamu mendapatkan badge "Tepat Waktu"', waktu: twoDaysAgo, dibaca: true, tipe: 'gamifikasi', icon: '🏅' },
  { id: 'notif10', judul: 'Kehadiran Tercatat', pesan: 'Kehadiran kamu pada materi Trigonometri berhasil dicatat', waktu: yesterday, dibaca: true, tipe: 'absensi', icon: '✅' },
]

export const GRADE_DATA_MURID = [
  { bulan: 'Okt', matematika: 72, fisika: 68, kimia: 75, biologi: 80 },
  { bulan: 'Nov', matematika: 78, fisika: 72, kimia: 70, biologi: 82 },
  { bulan: 'Des', matematika: 85, fisika: 78, kimia: 80, biologi: 85 },
  { bulan: 'Jan', matematika: 80, fisika: 82, kimia: 83, biologi: 88 },
  { bulan: 'Feb', matematika: 88, fisika: 79, kimia: 86, biologi: 90 },
  { bulan: 'Mar', matematika: 90, fisika: 85, kimia: 88, biologi: 87 },
]

export const ATTENDANCE_WEEKLY = [
  { minggu: 'Mg 1', hadir: 5, absen: 0 },
  { minggu: 'Mg 2', hadir: 4, absen: 1 },
  { minggu: 'Mg 3', hadir: 5, absen: 0 },
  { minggu: 'Mg 4', hadir: 5, absen: 0 },
  { minggu: 'Mg 5', hadir: 3, absen: 2 },
  { minggu: 'Mg 6', hadir: 5, absen: 0 },
]
