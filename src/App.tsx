import React, { useState, useEffect } from "react";
import { StudentRecord } from "./types";
import CoverScreen from "./components/CoverScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import AdminPanel from "./components/AdminPanel";
import { Key, GraduationCap, Home, BookOpen, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ScreenState = "COVER" | "QUIZ" | "RESULT" | "ADMIN";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("COVER");
  
  // Real-time Database Local Storage synchronizer
  const [records, setRecords] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem("kewirausahaan_quiz_records");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Gagal memuat database lokal, me-reset state kosong", e);
      return [];
    }
  });

  // Active student state
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [currentStudentClass, setCurrentStudentClass] = useState("");
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(1);

  // Active result container state
  const [finalResult, setFinalResult] = useState<{
    correctCount: number;
    incorrectCount: number;
    score: number;
    durationSeconds: number;
    answers: StudentRecord["answers"];
  } | null>(null);

  // Sync records with storage whenever modified
  const saveRecords = (newRecords: StudentRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem("kewirausahaan_quiz_records", JSON.stringify(newRecords));
  };

  const handleStartExam = (name: string, studentClass: string, attemptIndex: number) => {
    setCurrentStudentName(name);
    setCurrentStudentClass(studentClass);
    setCurrentAttemptIndex(attemptIndex);
    setScreen("QUIZ");
  };

  const handleFinishQuiz = (
    correctCount: number,
    incorrectCount: number,
    score: number,
    durationSeconds: number,
    answers: StudentRecord["answers"]
  ) => {
    const freshRecord: StudentRecord = {
      id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: currentStudentName,
      studentClass: currentStudentClass,
      subject: "Kreatif, Inovasi dan Kewirausahaan",
      attemptIndex: currentAttemptIndex,
      score,
      correctAnswersCount: correctCount,
      incorrectAnswersCount: incorrectCount,
      durationSeconds,
      timestamp: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
      answers,
    };

    const updated = [freshRecord, ...records];
    saveRecords(updated);

    setFinalResult({
      correctCount,
      incorrectCount,
      score,
      durationSeconds,
      answers,
    });

    setScreen("RESULT");
  };

  // Administrative functions
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  const handleClearAllRecords = () => {
    saveRecords([]);
  };

  const navigateToHomeFromQuiz = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan ujian? Hasil pengerjaan ini tidak akan disimpan.")) {
      setScreen("COVER");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 bg-[#F4F1EA] relative">
      {/* Neo-brutalist styled accent corners or lines instead of soft gradient orbs */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-black pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-black pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-black pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-black pointer-events-none"></div>

      {/* Global Top Navigation Header */}
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-6 sm:mb-8 relative z-20 gap-2">
        <button 
          onClick={() => screen !== "QUIZ" && setScreen("COVER")}
          className="flex items-center gap-1.5 sm:gap-2 text-black hover:bg-violet-100 transition-all font-display font-black text-xs sm:text-sm uppercase tracking-wider bg-white px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-none border-4 border-black shadow-[3px_3px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
          <span>KIK Portal</span>
        </button>

        {/* Dynamic Admin / Home Navigation controller button */}
        {screen === "ADMIN" ? (
          <button
            onClick={() => setScreen("COVER")}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border-4 border-black bg-white text-black font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="hidden xs:inline">Halaman Utama</span>
            <span className="xs:hidden">Cover</span>
          </button>
        ) : (
          screen !== "QUIZ" && (
            <button
              onClick={() => setScreen("ADMIN")}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border-4 border-black bg-violet-300 text-black font-display font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Admin 🔑</span>
            </button>
          )
        )}
      </header>

      {/* Primary Dynamic Main Container area */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-start pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {screen === "COVER" && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CoverScreen
                onStartExam={handleStartExam}
                records={records}
                onOpenAdmin={() => setScreen("ADMIN")}
              />
            </motion.div>
          )}

          {screen === "QUIZ" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <QuizScreen
                studentName={currentStudentName}
                studentClass={currentStudentClass}
                attemptIndex={currentAttemptIndex}
                onFinishQuiz={handleFinishQuiz}
                onQuit={navigateToHomeFromQuiz}
              />
            </motion.div>
          )}

          {screen === "RESULT" && finalResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ResultScreen
                studentName={currentStudentName}
                studentClass={currentStudentClass}
                attemptIndex={currentAttemptIndex}
                correctAnswersCount={finalResult.correctCount}
                incorrectAnswersCount={finalResult.incorrectCount}
                score={finalResult.score}
                durationSeconds={finalResult.durationSeconds}
                answers={finalResult.answers}
                onRestart={() => setScreen("COVER")}
              />
            </motion.div>
          )}

          {screen === "ADMIN" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel
                records={records}
                onClose={() => setScreen("COVER")}
                onClearAll={handleClearAllRecords}
                onDeleteRecord={handleDeleteRecord}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Academic Institutional Footer */}
      <footer className="w-full text-center py-5 border-4 border-black bg-white shadow-[4px_4px_0px_#1A1A1A] max-w-4xl mx-auto relative z-20 rounded-none px-4">
        <p className="font-extrabold text-black font-mono text-xs uppercase tracking-wider">
          Mata Pelajaran: Kreatif, Inovasi dan Kewirausahaan (KIK)
        </p>
        <p className="mt-1.5 text-[10px] text-slate-700 font-mono font-semibold uppercase tracking-tight">
          Aplikasi Ujian Interaktif Mandiri Mandat Guru & Rekapitulasi Siswa • © 2026. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
