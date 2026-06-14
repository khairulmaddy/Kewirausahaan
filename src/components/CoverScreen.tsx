import React, { useState, useEffect } from "react";
import { StudentRecord } from "../types";
import { BookOpen, User, GraduationCap, Award, HelpCircle, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface CoverScreenProps {
  onStartExam: (name: string, studentClass: string, attemptIndex: number) => void;
  records: StudentRecord[];
  onOpenAdmin: () => void;
}

export default function CoverScreen({ onStartExam, records, onOpenAdmin }: CoverScreenProps) {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [personalHistory, setPersonalHistory] = useState<StudentRecord[]>([]);

  // Monitor name/class changes to detect previous attempts dynamically
  useEffect(() => {
    if (name.trim()) {
      const match = records.filter(
        (r) => r.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      setPersonalHistory(match);
    } else {
      setPersonalHistory([]);
    }
  }, [name, records]);

  const attemptsUsed = personalHistory.length;
  const attemptsRemaining = Math.max(0, 3 - attemptsUsed);
  const currentAttemptIndex = attemptsUsed + 1; // 1, 2, or 3

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentClass.trim()) return;

    if (attemptsRemaining <= 0) {
      alert("Maaf, Anda telah menggunakan seluruh 3 kesempatan ujian untuk nama ini.");
      return;
    }

    onStartExam(name.trim(), studentClass.trim(), currentAttemptIndex);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Decorative Shimmering Header Logo/Title Card */}
      <span id="cover-header-span"></span>
      <div 
        id="branding-header-card" 
        className="relative overflow-hidden border-4 border-black bg-yellow-300 p-8 text-black shadow-[8px_8px_0px_#1A1A1A] mb-8"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <BookOpen className="w-48 h-48 rotate-12 text-black" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-white text-xs font-black uppercase tracking-wide mb-4 shadow-[2px_2px_0px_#1A1A1A]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Portal Ujian Mandiri Siswa
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-2">
            Mata Pelajaran:
          </h1>
          <p className="text-2xl md:text-3xl font-display font-black text-indigo-900 uppercase tracking-tighter bg-white/65 inline-block px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#1A1A1A]">
            Kreatif, Inovasi & Kewirausahaan
          </p>
          <div className="h-1.5 w-24 bg-black my-4"></div>
          <p className="text-xs md:text-sm font-bold text-slate-800 max-w-lg leading-relaxed font-mono">
            Uji pemahaman Anda tentang konsep dasar kewirausahaan, break-even point (BEP), kualifikasi inovatif, dan rencana usaha secara interaktif.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div id="registration-card" className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#1A1A1A] mb-6 rounded-none">
        <h2 className="text-2xl font-display font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
          <GraduationCap className="w-7 h-7 text-[#FF6B35]" />
          Registrasi Peserta Ujian
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Locked Subject Input */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
              Mata Pelajaran
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#4ECDC4]/20 border-2 border-black text-black font-black uppercase tracking-tight text-sm shadow-[3px_3px_0px_#121212]">
              <BookOpen className="w-5 h-5 text-black shrink-0" />
              <span>Kreatif, Inovasi dan Kewirausahaan</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mt-1.5">
              *Mata pelajaran dikunci untuk aplikasi ujian ini.
            </p>
          </div>

          {/* Student Name */}
          <div>
            <label htmlFor="student-name" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
              Nama Lengkap Siswa <span className="text-[#FF6B35] font-black">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-black" />
              </div>
              <input
                id="student-name"
                type="text"
                required
                placeholder="MASUKKAN NAMA LENGKAP ANDA..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-4 border-black rounded-none bg-white text-black font-semibold uppercase focus:bg-amber-50 focus:outline-hidden transition-all text-base shadow-[4px_4px_0px_#1A1A1A] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Student Class */}
          <div>
            <label htmlFor="student-class" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
              Kelas / Jurusan <span className="text-[#FF6B35] font-black">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-black" />
              </div>
              <input
                id="student-class"
                type="text"
                required
                placeholder="CONTOH: XII RPL 1, XI TATA NIAGA..."
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-4 border-black rounded-none bg-white text-black font-semibold uppercase focus:bg-amber-50 focus:outline-hidden transition-all text-base shadow-[4px_4px_0px_#1A1A1A] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Dinamis Status Detektor Sesi Sebelumnya */}
          {name.trim() && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border-4 border-black bg-blue-100 rounded-none shadow-[4px_4px_0px_#1A1A1A] text-black"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 font-mono">
                [Analisis Riwayat komputer]
              </h3>
              
              {attemptsUsed === 0 ? (
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 mt-0.5 shrink-0 text-black fill-yellow-400" />
                  <div>
                    <p className="font-black uppercase text-sm tracking-tight">Selamat Datang, ini ujian pertama Anda!</p>
                    <p className="text-xs font-medium mt-1 leading-relaxed text-slate-800">
                      Anda berada di <strong>Kesempatan #1</strong>. Pada kesempatan 1 & 2, jawaban benar beserta pembahasan super informatif akan ditampilkan setelah memeriksa jawaban demi hasil belajar maksimal!
                    </p>
                  </div>
                </div>
              ) : attemptsUsed < 3 ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 mt-1 shrink-0 text-black" />
                    <div>
                      <p className="font-black uppercase text-sm tracking-tight">Kembali berjuang! Anda telah ujian {attemptsUsed} kali.</p>
                      <p className="text-xs font-medium mt-1 leading-relaxed text-slate-800">
                        Anda berada di <strong>Kesempatan #{currentAttemptIndex}</strong>. 
                        {currentAttemptIndex === 2 
                          ? " Di kesempatan ke-2 ini Anda tetap bisa membaca pembahasan pasca menjawab." 
                          : " PERINGATAN: Di kesempatan TERAKHIR (#3), soal dan opsi jawaban akan diacak penuh secara acak, dan pembahasan/kunci jawaban disembunyikan."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Ringkasan Ujian Lalu */}
                  <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#1A1A1A]">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Skor Ujian Sebelumnya:</p>
                    {personalHistory.map((hist, idx) => (
                      <div key={hist.id} className="flex justify-between items-center text-xs font-bold text-black py-1 border-b-2 border-dashed border-slate-200 last:border-0">
                        <span>Kesempatan {hist.attemptIndex}:</span>
                        <span className="font-black text-[#FF6B35]">
                          Skor {hist.score}% ({hist.correctAnswersCount} Benar / {hist.incorrectAnswersCount} Salah)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-red-100 p-3 border-2 border-black">
                  <ShieldAlert className="w-6 h-6 text-black shrink-0" />
                  <div>
                    <p className="font-black uppercase text-sm">Batas Kesempatan Habis</p>
                    <p className="text-xs font-semibold mt-0.5 text-red-950">
                      Nama <strong>{name}</strong> telah menyelesaikan 3 kali kesempatan ujian di komputer ini. Silakan hubungi guru Admin Anda.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Submit Action Button */}
          <button
            id="start-exam-button"
            type="submit"
            disabled={attemptsRemaining <= 0 || !name.trim() || !studentClass.trim()}
            className={`w-full py-4 px-6 border-4 border-black font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] ${
              attemptsRemaining <= 0 || !name.trim() || !studentClass.trim()
                ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none border-dashed"
                : currentAttemptIndex === 3
                ? "bg-indigo-500 text-white"
                : "bg-[#FF6B35] text-white"
            }`}
          >
            {attemptsRemaining <= 0 ? (
              <>
                <ShieldAlert className="w-5 h-5 text-black" />
                Batas Kesempatan Ujian Habis
              </>
            ) : currentAttemptIndex === 3 ? (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
                Mulai Ujian Terakhir (Mode Acak Penuh #3)
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 text-white" />
                Mulai Ujian (Kesempatan #{currentAttemptIndex})
              </>
            )}
          </button>
        </form>
      </div>

      {/* Rules Info Cards */}
      <div id="rules-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-black mb-8">
        <div id="rule-1-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A]">
          <span className="font-black text-[#4ECDC4] text-sm uppercase tracking-tight block mb-2 border-b-2 border-black pb-1">📋 Kesempatan 1 & 2</span>
          Ujian santai & latihan. Sistem menunjukkan kunci jawaban dan pembahasan rinci agar Anda belajar meningkatkan skor.
        </div>
        <div id="rule-2-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A]">
          <span className="font-black text-indigo-500 text-sm uppercase tracking-tight block mb-2 border-b-2 border-black pb-1">🎲 Kesempatan Akhir (#3)</span>
          Ujian Murni. Urutan Soal & Opsi Jawaban (A-E) diacak total. Kunci jawaban & pembahasan disembunyikan.
        </div>
        <div id="rule-3-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A]">
          <span className="font-black text-[#FF6B35] text-sm uppercase tracking-tight block mb-2 border-b-2 border-black pb-1">⏱️ Stopwatch Real-Time</span>
          Durasi pengerjaan Anda dicatat dalam detik di database, membantu guru mengevaluasi kecepatan pemahaman Anda.
        </div>
      </div>
    </div>
  );
}
