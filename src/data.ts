import { Question } from "./types";

export const ORIGINAL_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "Apa yang dimaksud dengan kewirausahaan (entrepreneurship)?",
    options: [
      { key: "A", text: "Proses mengelola perusahaan besar" },
      { key: "B", text: "Kemampuan untuk menciptakan sesuatu yang baru dan berbeda melalui pemikiran kreatif dan tindakan inovatif" },
      { key: "C", text: "Kegiatan mencari keuntungan sebanyak-banyaknya dengan modal orang lain" },
      { key: "D", text: "Proses bekerja di instansi pemerintah" },
      { key: "E", text: "Keterampilan dalam berpidato di depan umum" }
    ],
    correctKey: "B",
    explanation: "Kewirausahaan adalah kemampuan untuk menciptakan sesuatu yang baru dan berbeda melalui pemikiran kreatif dan tindakan inovatif. Ini bukan sekadar berjualan atau mencari keuntungan, melainkan pola pikir untuk menciptakan nilai tambah melalui inovasi dan pengambilan risiko."
  },
  {
    id: 2,
    questionText: "Salah satu ciri utama wirausaha adalah memiliki kemampuan untuk melihat...",
    options: [
      { key: "A", text: "Pengurangan biaya" },
      { key: "B", text: "Peluang" },
      { key: "C", text: "Ancaman pasar" },
      { key: "D", text: "Keterbatasan modal" },
      { key: "E", text: "Keseimbangan kerja" }
    ],
    correctKey: "B",
    explanation: "Ciri utama wirausaha adalah kemampuan untuk melihat peluang di tengah kesulitan. Wirausaha berhasil karena mereka dapat mengidentifikasi peluang bisnis yang belum dimanfaatkan oleh orang lain."
  },
  {
    id: 3,
    questionText: "Karakter wirausaha yang wajib dimiliki untuk dapat menciptakan ide-ide baru yang belum pernah ada sebelumnya adalah...",
    options: [
      { key: "A", text: "Percaya diri" },
      { key: "B", text: "Disiplin" },
      { key: "C", text: "Kreatif dan Inovatif" },
      { key: "D", text: "Berorientasi pada tugas dan hasil" },
      { key: "E", text: "Berani mengambil risiko" }
    ],
    correctKey: "C",
    explanation: "Kreatif dan inovatif adalah karakter yang memungkinkan wirausaha menciptakan ide baru yang berbeda. Kreativitas adalah kemampuan melahirkan sesuatu yang baru, sedangkan inovasi adalah proses mengubah peluang menjadi ide yang dapat dijual."
  },
  {
    id: 4,
    questionText: "Apa tujuan utama dari pembuatan rencana usaha (business plan)?",
    options: [
      { key: "A", text: "Agar mendapatkan pinjaman bank semata" },
      { key: "B", text: "Sebagai panduan operasional dan alat untuk meyakinkan investor" },
      { key: "C", text: "Menghindari pajak pemerintah" },
      { key: "D", text: "Mengintimidasi pesaing" },
      { key: "E", text: "Mempersingkat waktu produksi" }
    ],
    correctKey: "B",
    explanation: "Rencana usaha (business plan) berfungsi sebagai panduan operasional bisnis dan sebagai alat untuk meyakinkan investor atau pemberi pinjaman bahwa usaha tersebut layak dan memiliki potensi sukses."
  },
  {
    id: 5,
    questionText: "BEP merupakan singkatan dari...",
    options: [
      { key: "A", text: "Best Earning Point" },
      { key: "B", text: "Break Even Point" },
      { key: "C", text: "Business Entry Process" },
      { key: "D", text: "Basic Economic Price" },
      { key: "E", text: "Budgeting Every Product" }
    ],
    correctKey: "B",
    explanation: "BEP (Break Even Point) adalah titik di mana pendapatan sama dengan total biaya yang dikeluarkan, sehingga perusahaan tidak untung dan tidak rugi. Rumus BEP dalam unit = Biaya Tetap / (Harga Jual – Biaya Variabel per Unit)"
  }
];

// Simple helper function to shuffle array items
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
