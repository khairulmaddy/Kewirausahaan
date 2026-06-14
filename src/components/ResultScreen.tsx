import React from "react";
import { StudentRecord } from "../types";
import { ORIGINAL_QUESTIONS } from "../data";
import { Award, AlertOctagon, HelpCircle, RefreshCw, Bookmark, ShieldAlert, CheckCircle, XCircle, Home, Info } from "lucide-react";
import { motion } from "motion/react";

interface ResultScreenProps {
  studentName: string;
  studentClass: string;
  attemptIndex: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  score: number;
  durationSeconds: number;
  answers: StudentRecord["answers"];
  onRestart: () => void;
}

export default function ResultScreen({
  studentName,
  studentClass,
  attemptIndex,
  correctAnswersCount,
  incorrectAnswersCount,
  score,
  durationSeconds,
  answers,
  onRestart,
}: ResultScreenProps) {
  
  // Format seconds to string representation
  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    if (mins > 0) {
      return `${mins} menit ${remainder} detik`;
    }
    return `${remainder} detik`;
  };

  const isExcellent = score >= 80;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <span id="result-page-anchor"></span>
      {/* Visual Badge Card */}
      <div className={`p-8 border-4 border-black text-black shadow-[8px_8px_0px_#1A1A1A] mb-8 rounded-none text-center ${
        isExcellent 
          ? "bg-green-200" 
          : "bg-yellow-300"
      }`}>
        <div className="flex justify-center mb-4">
          {isExcellent ? (
            <div className="w-20 h-20 bg-white border-4 border-black rounded-none flex items-center justify-center text-black shadow-[3px_3px_0px_#1a1a1a]">
              <Award className="w-10 h-10 text-[#FF6B35] fill-[#FF6B35]" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-white border-4 border-black rounded-none flex items-center justify-center text-black shadow-[3px_3px_0px_#1a1a1a]">
              <Bookmark className="w-10 h-10 text-indigo-600 fill-indigo-200" />
            </div>
          )}
        </div>

        <h1 className="text-xs font-black uppercase tracking-widest text-[#1a1a1a] mb-1 font-mono">
          [Hasil Akhir Ujian Terkirim]
        </h1>
        <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-4">
          Selamat, {studentName}!
        </h2>
        
        {/* Dynamic score graphic circular card */}
        <div className="inline-block relative my-4">
          <div className="w-32 h-32 border-4 border-black rounded-none flex items-center justify-center bg-white shadow-[4px_4px_0px_#1A1A1A] mx-auto">
            <div>
              <span className="text-4xl font-display font-black text-black">
                {score}
              </span>
              <span className="text-xs text-black block font-black uppercase tracking-wider mt-1 border-t-2 border-black pt-1">Skor / 100</span>
            </div>
          </div>
        </div>

        {/* Short Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-6 bg-white p-4 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] text-sm rounded-none">
          <div>
            <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider mb-1">Benar</span>
            <span className="text-lg font-black text-black flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4 shrink-0 text-black fill-green-400" />
              {correctAnswersCount}
            </span>
          </div>
          <div className="border-x-2 border-black">
            <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider mb-1">Salah</span>
            <span className="text-lg font-black text-black flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4 shrink-0 text-black fill-red-400" />
              {incorrectAnswersCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider mb-1">Durasi</span>
            <span className="text-xs font-black text-slate-900 block mt-1 font-mono">
              {formatSecs(durationSeconds)}
            </span>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-800 mt-5 font-mono max-w-md mx-auto leading-relaxed">
          *Nilai Anda telah otomatis tersimpan ke dalam basis data rekap kelulusan untuk Mata Pelajaran Kreatif, Inovasi dan Kewirausahaan pada komputer ini.
        </p>
      </div>

      {/* Mode-Specific Detailed Review Screen */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#1A1A1A] mb-6 rounded-none">
        <h3 className="text-xl font-display font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tight">
          {attemptIndex === 3 ? (
            <>
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              Hasil Ujian Terkunci (Kesempatan #3)
            </>
          ) : (
            <>
              <Bookmark className="w-6 h-6 text-[#FF6B35]" />
              Lembar Review Pembahasan (Kesempatan #{attemptIndex})
            </>
          )}
        </h3>

        {attemptIndex === 3 ? (
          <div className="p-6 border-4 border-black bg-blue-150/40 rounded-none shadow-[4px_4px_0px_#1A1A1A] text-black space-y-4">
            <p className="text-sm font-semibold leading-relaxed">
              Karena ini merupakan <strong>Kesempatan Ujian Terakhir (Ke-3)</strong> Anda, isi kunci jawaban serta pembahasan dikunci dan disembunyikan guna menjaga integritas rekapitulasi penilaian murni.
            </p>
            <div className="p-4 bg-indigo-200 border-2 border-black rounded-none text-black font-semibold text-xs leading-relaxed flex items-start gap-3 shadow-[2px_2px_0px_#1a1a1a]">
              <Info className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <span>
                Seluruh nilai Anda di ketiga kesempatan telah tersimpan rapi. Anda dapat mengklik tombol <strong>Admin 🔑</strong> di sudut kanan atas untuk login dan mengecek rekapitulasinya kapan saja!
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-sm font-semibold text-slate-700 leading-relaxed border-b-2 border-black pb-4">
              Gunakan lembar review berikut sebagai sarana penunjang belajar mandiri Anda untuk mempersiapkan ujian akhir di kesempatan ke-3 mendatang.
            </p>
            
            {ORIGINAL_QUESTIONS.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const isCorrect = studentAnswer?.isCorrect || false;

              return (
                <div key={q.id} className="p-5 border-4 border-black bg-[#F4F1EA]/50 hover:bg-[#F4F1EA] transition-colors rounded-none shadow-[4px_4px_0px_#1A1A1A] mb-6">
                  <div className="flex justify-between items-center gap-2 mb-4 pb-2 border-b-2 border-dashed border-black">
                    <span className="text-xs font-black uppercase tracking-wider font-mono text-[#FF6B35]">SOAL {idx + 1}</span>
                    <span className={`text-xs font-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1 rounded-none uppercase tracking-wide text-black ${
                      isCorrect 
                        ? "bg-green-300" 
                        : "bg-red-300"
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-black fill-white" />
                          BENAR
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 shrink-0 text-black fill-white" />
                          SALAH
                        </>
                      )}
                    </span>
                  </div>

                  <p className="font-black text-black mb-4 text-sm md:text-base leading-relaxed uppercase tracking-tight">
                    {q.questionText}
                  </p>

                  <div className="space-y-2 text-xs font-bold text-black mb-4 bg-white p-3 border-2 border-black shadow-[2px_2px_0px_#1a1a1a]">
                    <div className="flex justify-between border-b pb-1 last:border-0 last:pb-0">
                      <span className="text-slate-500 uppercase font-bold text-[10px] font-mono">Jawaban Anda:</span>{" "}
                      <span className={`font-black uppercase ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                        {studentAnswer ? studentAnswer.selected : "Tidak Menjawab"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500 uppercase font-bold text-[10px] font-mono">Kunci Jawaban:</span>{" "}
                        <span className="font-black text-green-700 uppercase">
                          {q.options.find(o => o.key === q.correctKey)?.text || ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-teal-100/30 border-2 border-black shadow-[2px_2px_0px_#1A1A1A]">
                    <span className="text-xs font-black text-black uppercase tracking-wider block mb-1 border-b border-black pb-0.5">📘 PEMBAHASAN:</span>
                    <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Option to return home */}
      <button
        onClick={onRestart}
        className="w-full py-4 bg-[#FF6B35] text-black border-4 border-black font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
      >
        <Home className="w-4 h-4 text-black shrink-0" />
        Kembali Ke Halaman Registrasi
      </button>
    </div>
  );
}
