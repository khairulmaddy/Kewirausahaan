export interface Question {
  id: number;
  questionText: string;
  options: {
    key: string; // 'A', 'B', 'C', 'D', 'E'
    text: string;
  }[];
  correctKey: string; // e.g. 'B'
  explanation: string; // Pembahasan
}

export interface StudentRecord {
  id: string; // unique ID
  name: string; // Nama Siswa
  studentClass: string; // Kelas
  subject: string; // Mata Pelajaran (always "Kreatif, Inovasi dan Kewirausahaan")
  attemptIndex: number; // Kesempatan ke- (1, 2, or 3)
  score: number; // e.g. 80 (Skor)
  correctAnswersCount: number; // Jumlah Benar
  incorrectAnswersCount: number; // Jumlah Salah
  durationSeconds: number; // Durasi pengerjaan dalam detik
  timestamp: string; // Tanggal & waktu pencapaian (ISO string / formatted)
  answers: { [questionId: number]: { selected: string; correct: string; isCorrect: boolean } };
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}
