import React, { useState, useEffect, useRef } from "react";
import { Question, StudentRecord } from "../types";
import { ORIGINAL_QUESTIONS, shuffleArray } from "../data";
import { Timer, ArrowRight, CheckCircle2, XCircle, Info, BookOpen, User, HelpCircle, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizScreenProps {
  studentName: string;
  studentClass: string;
  attemptIndex: number;
  onFinishQuiz: (
    correctCount: number,
    incorrectCount: number,
    score: number,
    durationSeconds: number,
    answers: StudentRecord["answers"]
  ) => void;
  onQuit: () => void;
}

interface PreparedQuestion extends Question {
  originalIndex: number; // to keep track in database
  arrangedOptions: { key: string; text: string }[];
}

export default function QuizScreen({
  studentName,
  studentClass,
  attemptIndex,
  onFinishQuiz,
  onQuit,
}: QuizScreenProps) {
  // 1. Prepare questions list based on attempt type
  const [preparedQuestions, setPreparedQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // States of selection
  const [selectedKey, setSelectedKey] = useState<string | null>(null); // current selection key ('A', 'B' ...)
  const [isChecked, setIsChecked] = useState(false); // is answer submitted/revealed (for attempt 1 & 2)
  
  // Student selection state recorder
  const [sessionAnswers, setSessionAnswers] = useState<StudentRecord["answers"]>({});

  // Stopwatch state
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize questions
  useEffect(() => {
    let list: PreparedQuestion[] = ORIGINAL_QUESTIONS.map((q, idx) => ({
      ...q,
      originalIndex: idx,
      arrangedOptions: [...q.options],
    }));

    if (attemptIndex === 3) {
      // Shuffling questions
      list = shuffleArray(list);
      // Shuffling options within each question
      list = list.map((q) => {
        const shuffled = shuffleArray(q.options);
        return {
          ...q,
          arrangedOptions: shuffled,
        };
      });
    }

    setPreparedQuestions(list);
  }, [attemptIndex]);

  // Start stopwatch
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (preparedQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Menyiapkan Lembar Soal Ujian...
      </div>
    );
  }

  const currentQuestion = preparedQuestions[currentIdx];
  const isLastQuestion = currentIdx === preparedQuestions.length - 1;

  // Formatting stopwatch
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  // Check the correct text matching for selection since options in Chance 3 can shift keys (A to E)
  const isOptionCorrectText = (optionText: string) => {
    const originalQuestion = ORIGINAL_QUESTIONS.find((q) => q.id === currentQuestion.id);
    if (!originalQuestion) return false;
    const correctOptionObject = originalQuestion.options.find(
      (opt) => opt.key === originalQuestion.correctKey
    );
    return correctOptionObject?.text === optionText;
  };

  const currentOriginalCorrectKey = () => {
    const orig = ORIGINAL_QUESTIONS.find((q) => q.id === currentQuestion.id);
    return orig ? orig.correctKey : "B";
  };

  const handleSelectOption = (key: string) => {
    if (isChecked && attemptIndex < 3) return; // locked once checked in learn-mode
    setSelectedKey(key);
  };

  const handleCheckAnswer = () => {
    if (!selectedKey) return;
    setIsChecked(true);

    // Find the chosen option details
    const chosenOption = currentQuestion.arrangedOptions.find((o) => o.key === selectedKey);
    const isCorrect = chosenOption ? isOptionCorrectText(chosenOption.text) : false;

    // Record answer details
    setSessionAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: chosenOption?.text || "",
        correct: ORIGINAL_QUESTIONS.find((q) => q.id === currentQuestion.id)?.options.find(
          (o) => o.key === currentQuestion.correctKey
        )?.text || "",
        isCorrect,
      },
    }));
  };

  const handleNext = () => {
    if (attemptIndex === 3) {
      // In attempt 3, save directly on next
      const chosenOption = currentQuestion.arrangedOptions.find((o) => o.key === selectedKey);
      const isCorrect = chosenOption ? isOptionCorrectText(chosenOption.text) : false;

      const updatedAnswers = {
        ...sessionAnswers,
        [currentQuestion.id]: {
          selected: chosenOption?.text || "",
          correct: ORIGINAL_QUESTIONS.find((q) => q.id === currentQuestion.id)?.options.find(
            (o) => o.key === currentQuestion.correctKey
          )?.text || "",
          isCorrect,
        },
      };

      setSessionAnswers(updatedAnswers);

      if (isLastQuestion) {
        finishQuizAction(updatedAnswers);
        return;
      }
    } else {
      // In attempt 1 & 2
      if (isLastQuestion) {
        finishQuizAction(sessionAnswers);
        return;
      }
    }

    // Progress to next question
    setCurrentIdx((prev) => prev + 1);
    setSelectedKey(null);
    setIsChecked(false);
  };

  const finishQuizAction = (allAnswers: StudentRecord["answers"]) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const totalQuestions = preparedQuestions.length;
    let correctCount = 0;

    preparedQuestions.forEach((q) => {
      if (allAnswers[q.id]?.isCorrect) {
        correctCount++;
      }
    });

    const incorrectCount = totalQuestions - correctCount;
    const finalScore = Math.round((correctCount / totalQuestions) * 100);

    onFinishQuiz(correctCount, incorrectCount, finalScore, seconds, allAnswers);
  };

  // Render the option item with appropriate high contrast coloring
  const getOptionClasses = (optionKey: string, optionText: string) => {
    const isSelected = selectedKey === optionKey;
    let baseStyles = "w-full p-4 text-left border-4 border-black rounded-none transition-all cursor-pointer font-bold text-base outline-hidden select-none flex items-start gap-3 shadow-[4px_4px_0px_#1A1A1A] ";

    if (attemptIndex < 3 && isChecked) {
      const isThisCorrect = isOptionCorrectText(optionText);
      if (isThisCorrect) {
        return baseStyles + "bg-green-300 text-black border-4 border-black";
      }
      if (isSelected && !isThisCorrect) {
        return baseStyles + "bg-red-400 text-black border-4 border-black";
      }
      return baseStyles + "bg-slate-100 border-[#1A1A1A]/30 text-slate-400 opacity-50 cursor-not-allowed shadow-none";
    }

    if (isSelected) {
      if (attemptIndex === 3) {
        return baseStyles + "bg-indigo-300 text-black translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1A1A1A]";
      }
      return baseStyles + "bg-yellow-300 text-black translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#1A1A1A]";
    }

    // Default State - highly visible dark text color on white background
    return baseStyles + "bg-white text-black hover:bg-amber-50/50 hover:shadow-[5px_5px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px]";
  };

  const progressPercentage = ((currentIdx + 1) / preparedQuestions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top Floating Student & Stopwatch Bar */}
      <span id="quiz-header-anchor"></span>
      <div 
        id="top-stats-bar" 
        className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#1A1A1A] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-teal-300 flex items-center justify-center text-black shrink-0 font-black font-display text-lg shadow-[2px_2px_0px_#1A1A1A]">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-black text-base uppercase tracking-tight">{studentName}</span>
              <span className="text-xs px-2 py-0.5 bg-yellow-200 border-2 border-black font-black text-black uppercase shadow-[1px_1px_0px_#1A1A1A]">
                Kelas: {studentClass}
              </span>
            </div>
            <span className="text-xs text-slate-700 flex items-center gap-1.5 mt-1 font-mono font-bold">
              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-black text-center uppercase border-2 border-black shadow-[1px_1px_0px_#1A1A1A] ${
                attemptIndex === 3 ? "bg-indigo-300 text-black" : "bg-teal-300 text-black"
              }`}>
                KESP #{attemptIndex}
              </span>
              • {attemptIndex === 3 ? "Mode Ujian Acak (Pembahasan Tertutup)" : "Pembahasan Terbuka"}
            </span>
          </div>
        </div>

        {/* Stopwatch Display Panel */}
        <div className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black font-mono text-sm shadow-[3px_3px_0px_#4ECDC4] font-black self-end md:self-auto uppercase">
          <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Timer: {formatTime(seconds)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-4 border-black h-6 w-full rounded-none overflow-hidden mb-6 relative shadow-[4px_4px_0px_#1A1A1A]">
        <div
          className={`h-full transition-all duration-350 border-r-4 border-black ${
            attemptIndex === 3 ? "bg-indigo-400" : "bg-[#FF6B35]"
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-black uppercase tracking-widest bg-white/20">
          PROGRES: {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#1A1A1A] rounded-none">
        <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-dashed border-black">
          <span className="text-xs font-black uppercase tracking-wider text-black font-mono">
            SOAL {currentIdx + 1} DARI {preparedQuestions.length}
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
            ID Soal: #{currentQuestion.id}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-display font-black text-black leading-relaxed mb-8 uppercase tracking-tight">
          {currentQuestion.questionText}
        </h3>

        {/* Answer Options Grid */}
        <div className="space-y-4 mb-8">
          {currentQuestion.arrangedOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelectOption(opt.key)}
              className={getOptionClasses(opt.key, opt.text)}
              disabled={isChecked && attemptIndex < 3}
            >
              <div className="flex items-start gap-4 w-full">
                <span className={`flex items-center justify-center w-7 h-7 border-2 border-black font-black text-sm shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_#1A1A1A] ${
                  selectedKey === opt.key
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}>
                  {opt.key}
                </span>
                <span className="leading-relaxed leading-6 flex-1 pr-2 font-bold text-slate-900">{opt.text}</span>

                {/* Status Indicator Icon for Learn Mode */}
                {attemptIndex < 3 && isChecked && (
                  <div className="shrink-0 ml-1 mt-0.5">
                    {isOptionCorrectText(opt.text) ? (
                      <CheckCircle2 className="w-5 h-5 text-black fill-green-400" />
                    ) : (
                      selectedKey === opt.key && <XCircle className="w-5 h-5 text-black fill-red-400" />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Pembahasan Card (Exclusive for Attempt 1 & 2) */}
        <AnimatePresence>
          {attemptIndex < 3 && isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 mb-8 overflow-hidden"
            >
              <div className="p-5 bg-teal-100/30 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] rounded-none">
                <div className="flex items-center gap-2 mb-3 text-black font-black text-sm uppercase tracking-tight border-b-2 border-dashed border-black pb-1.5">
                  <BookOpen className="w-5 h-5 text-black" />
                  <h4>REDAKSI PEMBAHASAN GURU:</h4>
                </div>
                <p className="text-black font-semibold text-sm md:text-base leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="mt-4 pt-3 border-t-2 border-dashed border-black flex flex-wrap gap-2 text-[10px] font-mono font-black uppercase">
                  <span className="px-2 py-1 bg-yellow-300 border border-black shadow-[1px_1px_0px_#1A1A1A] text-black">
                    Pilihan Kunci: {currentOriginalCorrectKey()}
                  </span>
                  <span className="px-2 py-1 bg-green-300 border border-black shadow-[1px_1px_0px_#1A1A1A] text-black">
                    {sessionAnswers[currentQuestion.id]?.isCorrect ? "Jawaban Anda Benar" : "Jawaban Anda Kurang Tepat"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Bar footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
          <button
            onClick={onQuit}
            className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#FF6B35] underline underline-offset-4 transition-colors w-full sm:w-auto text-center sm:text-left py-2 font-mono"
          >
            Batal & Keluar Ke Halaman Utama
          </button>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            {/* Learn Mode: Show "Periksa Jawaban" before "Lanjut" */}
            {attemptIndex < 3 && !isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedKey}
                className={`w-full sm:w-auto px-6 py-3 border-4 border-black font-display font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all ${
                  !selectedKey
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none border-dashed"
                    : "bg-[#4ECDC4] text-black"
                }`}
              >
                <Info className="w-4 h-4" />
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={attemptIndex === 3 && !selectedKey}
                className={`w-full sm:w-auto px-6 py-3 border-4 border-black font-display font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all ${
                  attemptIndex === 3 && !selectedKey
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none border-dashed"
                    : attemptIndex === 3
                    ? "bg-indigo-400 text-black"
                    : "bg-green-300 text-black"
                }`}
              >
                <span>
                  {isLastQuestion
                    ? "Selesaikan Ujian"
                    : attemptIndex === 3
                    ? "Simpan & Lanjut"
                    : "Lanjut ke Soal Berikutnya"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
