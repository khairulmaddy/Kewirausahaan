import React, { useState } from "react";
import { StudentRecord } from "../types";
import { 
  Download, Trash2, Key, LogOut, Search, Filter, RefreshCw, 
  UserCheck, Award, Zap, Clock, ChevronDown, ChevronUp, FileSpreadsheet, Eye, EyeOff 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  records: StudentRecord[];
  onClose: () => void;
  onClearAll: () => void;
  onDeleteRecord: (id: string) => void;
}

export default function AdminPanel({ records, onClose, onClearAll, onDeleteRecord }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [attemptFilter, setAttemptFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  
  // Row expansion state for detailed answers inspect
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Kombinasi Username / Password salah. Petunjuk: gunakan admin & admin123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // 1. Calculate general aggregated statistics
  const totalSubmissions = records.length;
  const uniqueSiswa = Array.from(new Set(records.map((r) => r.name.toLowerCase().trim()))).length;
  
  const averageScore = totalSubmissions > 0 
    ? Math.round(records.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions) 
    : 0;

  const maxScore = totalSubmissions > 0 
    ? Math.max(...records.map((r) => r.score)) 
    : 0;

  const averageDuration = totalSubmissions > 0 
    ? Math.round(records.reduce((acc, curr) => acc + curr.durationSeconds, 0) / totalSubmissions) 
    : 0;

  // 2. Filter records dynamically based on active search/select states
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAttempt = 
      attemptFilter === "all" || r.attemptIndex.toString() === attemptFilter;

    let matchesScore = true;
    if (scoreFilter === "pass") {
      matchesScore = r.score >= 80;
    } else if (scoreFilter === "fail") {
      matchesScore = r.score < 80;
    }

    return matchesSearch && matchesAttempt && matchesScore;
  });

  // 3. Export to Excel (CSV with UTF-8 BOM, highly compatible)
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("Belum ada data nilai siswa untuk diekspor.");
      return;
    }

    // Prepare CSV header Row
    let csvContent = "No,Nama Lengkap,Kelas,Mata Pelajaran,Kesempatan Ujian Ke-,Jawaban Benar,Jawaban Salah,Skor Akhir (%),Durasi Pengerjaan (Detik),Tanggal Ujian\r\n";

    // Loop through individual records
    records.forEach((r, idx) => {
      const row = [
        idx + 1,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.studentClass.replace(/"/g, '""')}"`,
        `"${r.subject.replace(/"/g, '""')}"`,
        r.attemptIndex,
        r.correctAnswersCount,
        r.incorrectAnswersCount,
        r.score,
        r.durationSeconds,
        `"${r.timestamp}"`
      ];
      csvContent += row.join(",") + "\r\n";
    });

    // Prepend UTF-8 BOM representation to ensure flawless Excel columns slicing
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekapitulasi_Ujian_Kewirausahaan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleRowExpand = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  // --- RENDERING IF NOT LOGGED IN ---
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_#1A1A1A] rounded-none relative overflow-hidden">
          {/* Top border decorative styling */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF6B35]"></div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-300 border-4 border-black rounded-none flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#1A1A1A]">
              <Key className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-display font-black text-black uppercase tracking-tight">
              Gerbang Masuk Admin
            </h2>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-mono font-black border-2 border-black bg-blue-100 py-1 px-2 inline-block">
              [Kreatif, Inovasi & Kewirausahaan]
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-100 border-2 border-black text-black text-xs font-bold mb-4 leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Username Guru / Panitia
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-2.5 border-4 border-black rounded-none bg-white text-black font-semibold text-sm shadow-[3px_3px_0px_#1A1A1A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password admin..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 border-4 border-black rounded-none bg-white text-black font-semibold text-sm shadow-[3px_3px_0px_#1A1A1A] focus:outline-hidden pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-700 hover:text-black"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>



            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 border-4 border-black bg-white rounded-none text-black font-black uppercase text-xs shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px] transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#FF6B35] border-4 border-black text-black rounded-none font-display font-black uppercase text-xs shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                Masuk Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING MAIN LOGGED IN DASHBOARD ---
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <span id="admin-dashboard-logged-in"></span>
      {/* Top action header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-yellow-100 border-4 border-black rounded-none shadow-[8px_8px_0px_#1A1A1A] gap-4 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-black text-black uppercase tracking-tight">
            Panel Kontrol Admin & Rekap Guru
          </h2>
          <p className="text-xs text-slate-700 font-semibold font-mono mt-1">
            Merekapitulasi hasil uji kompetensi • Mata Pelajaran: Kreatif, Inovasi dan Kewirausahaan
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-green-300 hover:bg-green-400 border-4 border-black text-black rounded-none font-display font-black text-xs shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Format Excel (.CSV)
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 border-4 border-black bg-[#FF6B35] hover:bg-[#FF6B35]/85 text-black rounded-none font-display font-black text-xs shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1a1a1a] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar Guru
          </button>
        </div>
      </div>

      {/* Aggregate Stats bento layout */}
      <div id="stats-bento-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div id="stat-siswa-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-4 rounded-none">
          <div className="w-12 h-12 bg-teal-300 border-2 border-black rounded-none shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center text-black shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-black block uppercase tracking-wider">Siswa Unik</span>
            <span className="text-2xl font-display font-black text-black">{uniqueSiswa}</span>
          </div>
        </div>

        <div id="stat-kuis-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-4 rounded-none">
          <div className="w-12 h-12 bg-indigo-300 border-2 border-black rounded-none shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center text-black shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-black block uppercase tracking-wider">Sesi Ujian</span>
            <span className="text-2xl font-display font-black text-black">{totalSubmissions}</span>
          </div>
        </div>

        <div id="stat-skor-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-4 rounded-none">
          <div className="w-12 h-12 bg-green-300 border-2 border-black rounded-none shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center text-black shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-black block uppercase tracking-wider">Rata-Rata Skor</span>
            <span className="text-2xl font-display font-black text-black">{averageScore}%</span>
          </div>
        </div>

        <div id="stat-durasi-card" className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-4 rounded-none">
          <div className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-none shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center text-black shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-black block uppercase tracking-wider">Rata-Rata Kerja</span>
            <span className="text-lg font-display font-black text-black">
              {averageDuration} Detik
            </span>
          </div>
        </div>
      </div>

      {/* Main Database Table card */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#1A1A1A] rounded-none overflow-hidden">
        {/* Table header with filters controls */}
        <div className="p-6 border-b-4 border-black bg-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-black font-mono self-start lg:self-auto">
            [Daftar Submisi Penilaian ({filteredRecords.length} / {totalSubmissions})]
          </h3>

          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-48 lg:w-56">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-black" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="CARI NAMA / KELAS..."
                className="w-full bg-white border-2 border-black rounded-none pl-9 pr-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_#1A1A1A] focus:outline-hidden"
              />
            </div>

            {/* Filter Kesempatan (Attempt Index) */}
            <select
              value={attemptFilter}
              onChange={(e) => setAttemptFilter(e.target.value)}
              className="bg-white border-2 border-black rounded-none px-2 py-1.5 text-xs font-bold text-black cursor-pointer shadow-[2px_2px_0px_#1A1A1A] focus:outline-hidden uppercase"
            >
              <option value="all">Semua Kesempatan</option>
              <option value="1">Kesempatan 1</option>
              <option value="2">Kesempatan 2</option>
              <option value="3">Kesempatan 3</option>
            </select>

            {/* Filter Kelulusan */}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-white border-2 border-black rounded-none px-2 py-1.5 text-xs font-bold text-black cursor-pointer shadow-[2px_2px_0px_#1A1A1A] focus:outline-hidden uppercase"
            >
              <option value="all">Semua Status</option>
              <option value="pass">Skor Sempurna (&gt;= 80)</option>
              <option value="fail">Butuh Perbaikan (&lt; 80)</option>
            </select>
          </div>
        </div>

        {/* Data list table */}
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-black font-black uppercase font-mono bg-white">
            Tidak ditemukan data penilaian yang cocok dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F1EA] text-black uppercase tracking-wider font-black border-b-4 border-black">
                  <th className="py-3 px-4 w-12 text-center font-mono">No</th>
                  <th className="py-3 px-4">Siswa & Kelas</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Kesempatan</th>
                  <th className="py-3 px-4 text-center">Hasil (Benar/Salah)</th>
                  <th className="py-3 px-4 text-center">Durasi</th>
                  <th className="py-3 px-4">Tanggal Pencapaian</th>
                  <th className="py-3 px-4 text-center">Skor Ujian</th>
                  <th className="py-3 px-4 text-right pr-6 w-32">Pilihan</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {filteredRecords.map((r, index) => {
                  const isExpanded = expandedRowId === r.id;
                  const scorePassed = r.score >= 80;

                  return (
                    <React.Fragment key={r.id}>
                      <tr className={`hover:bg-amber-50/20 transition-colors ${isExpanded ? "bg-[#4ECDC4]/10" : ""}`}>
                        <td className="py-3.5 px-4 text-center font-black text-black font-mono">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-black text-black text-xs block uppercase">{r.name}</span>
                            <span className="text-[10px] text-slate-500 font-black font-mono uppercase">{r.studentClass}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-black uppercase">
                          {r.subject}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 border-2 border-black font-black uppercase text-[9px] shadow-[1.5px_1.5px_0px_#1A1A1A] ${
                            r.attemptIndex === 3 
                              ? "bg-indigo-300 text-black" 
                              : "bg-teal-300 text-black"
                          }`}>
                            Ke-{r.attemptIndex}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className="text-black font-black uppercase font-mono">
                            <span className="text-green-700 bg-green-100 px-1 border border-black font-black">{r.correctAnswersCount}</span> B /{" "}
                            <span className="text-red-700 bg-red-100 px-1 border border-black font-black">{r.incorrectAnswersCount}</span> S
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-black font-mono font-black uppercase">
                          {r.durationSeconds} Detik
                        </td>
                        <td className="py-3.5 px-4 text-[#1A1A1A] font-bold font-mono text-[11px]">
                          {r.timestamp}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-3 py-1 border-2 border-black text-xs font-display font-black leading-none shadow-[2px_2px_0px_#1A1A1A] ${
                            scorePassed 
                              ? "bg-green-300 text-black" 
                              : "bg-yellow-200 text-black"
                          }`}>
                            {r.score}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right pr-6">
                          <div className="inline-flex gap-1.5 justify-end w-full">
                            {/* Inspect Expand trigger button */}
                            <button
                              onClick={() => toggleRowExpand(r.id)}
                              className="p-1.5 text-black hover:bg-yellow-200 border-2 border-transparent hover:border-black rounded-none transition-all cursor-pointer"
                              title="Detail Jawaban Siswa"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Delete specific record */}
                            <button
                              onClick={() => {
                                if (confirm(`Hapus seluruh data siswa ${r.name} di kesempatan ke-${r.attemptIndex}?`)) {
                                  onDeleteRecord(r.id);
                                }
                              }}
                              className="p-1.5 text-black hover:bg-red-400 border-2 border-transparent hover:border-black rounded-none transition-all cursor-pointer"
                              title="Hapus Penilaian"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expansions Row containing the answer sheet chosen details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} className="bg-slate-100/50 p-0 border-t-2 border-b-2 border-black">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-12 py-5 overflow-hidden text-xs"
                              >
                                <h4 className="font-black text-black mb-3 uppercase tracking-wider font-mono">
                                  [Lembar Lembaran Jawaban Siswa]:
                                </h4>
                                <div className="space-y-3 max-w-4xl mt-3">
                                  {Object.keys(r.answers).map((key) => {
                                    const qId = parseInt(key, 10);
                                    const ansDetails = r.answers[qId];

                                    return (
                                      <div key={qId} className="p-3 bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_#1A1A1A] flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                          <p className="font-black text-black font-mono">
                                            SOAL ID #{qId}
                                          </p>
                                          <p className="text-[11px] font-bold text-slate-800 mt-1 uppercase">
                                            DIPILIH: <span className="font-black text-indigo-900 bg-indigo-50 px-1 border border-dashed border-indigo-400">{ansDetails.selected || "Kosong"}</span>
                                          </p>
                                          <p className="text-[11px] font-bold text-green-700 mt-0.5 uppercase">
                                            KUNCI: <span className="font-black bg-green-50 px-1 border border-dashed border-green-400">{ansDetails.correct}</span>
                                          </p>
                                        </div>

                                        <span className={`font-black px-2 py-0.5 border-2 border-black text-[9px] uppercase shadow-[1px_1px_0px_#1a1a1a] rounded-none ${
                                          ansDetails.isCorrect 
                                            ? "bg-green-300 text-black" 
                                            : "bg-red-300 text-black"
                                        }`}>
                                          {ansDetails.isCorrect ? "Benar" : "Salah"}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger Zone Controls (Wipe records) */}
      <div className="bg-red-100 border-4 border-black rounded-none p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[6px_6px_0px_#1A1A1A]">
        <div>
          <h4 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2 font-mono">
            <Trash2 className="w-5 h-5 text-red-700" />
            [Zona Bahaya Guru Admin]
          </h4>
          <p className="text-xs text-red-950 font-bold mt-1">
            Penghapusan data di bawah ini permanen dan tidak dapat dibatalkan kembali pada komputer ini.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm("🚨 PERINGATAN KERAS! Anda yakin ingin menghapus SELURUH database nilai semua siswa dari komputer ini secara permanen?")) {
              onClearAll();
            }
          }}
          className="px-4 py-2 border-4 border-black bg-red-400 hover:bg-red-500 text-black rounded-none font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1x_1x_0px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Bersihkan Semua Submisi Siswa
        </button>
      </div>
    </div>
  );
}
