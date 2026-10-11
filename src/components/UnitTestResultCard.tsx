import React, { useState } from 'react';
import { Award, Printer, CheckCircle2, RotateCcw, Edit3, Sparkles } from 'lucide-react';
import { UnitTestResultData } from '../types';

const defaultResultData: UnitTestResultData = {
  studentName: 'MANAS KALPESH PATIL',
  className: 'FYCO – First Year Computer Engineering',
  academicYear: 'Academic Session 2026–2027',
  testTitle: 'UNIT TEST RESULT',
  subjects: [
    { id: '1', subject: 'Mathematics', marksObtained: 30, totalMarks: 30 },
    { id: '2', subject: 'Physics', marksObtained: 15, totalMarks: 15 },
    { id: '3', subject: 'Chemistry', marksObtained: 15, totalMarks: 15 },
    { id: '4', subject: 'English', marksObtained: 21, totalMarks: 30 },
  ],
  statusLabel: 'DISTINCTION / OUTSTANDING',
  note: 'Performance evaluated based on semester unit test evaluation criteria.',
};

export const UnitTestResultCard: React.FC = () => {
  const [data, setData] = useState<UnitTestResultData>(defaultResultData);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate totals dynamically
  const totalObtained = data.subjects.reduce((sum, s) => sum + Number(s.marksObtained || 0), 0);
  const totalMax = data.subjects.reduce((sum, s) => sum + Number(s.totalMarks || 0), 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1).replace('.0', '') : '0';

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setData(defaultResultData);
    setIsEditing(false);
  };

  const updateSubjectMarks = (id: string, obtained: number, max: number) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) =>
        sub.id === id ? { ...sub, marksObtained: obtained, totalMarks: max } : sub
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm print:hidden">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Unit Test Result Card
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official academic assessment scorecard • High-resolution portrait layout
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              isEditing
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Done Editing' : 'Customize Marks'}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Reset to default data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Quick Edit Drawer if editing */}
      {isEditing && (
        <div className="bg-blue-50 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-4 print:hidden animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Student Name
              </label>
              <input
                type="text"
                value={data.studentName}
                onChange={(e) => setData({ ...data, studentName: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Class / Department
              </label>
              <input
                type="text"
                value={data.className}
                onChange={(e) => setData({ ...data, className: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subject Scores:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <span className="font-semibold flex-1 text-slate-800 dark:text-slate-200">
                    {sub.subject}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={sub.totalMarks}
                    value={sub.marksObtained}
                    onChange={(e) =>
                      updateSubjectMarks(sub.id, Number(e.target.value), sub.totalMarks)
                    }
                    className="w-16 bg-slate-50 dark:bg-slate-800 text-center font-bold px-2 py-1 rounded border border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    min="1"
                    value={sub.totalMarks}
                    onChange={(e) =>
                      updateSubjectMarks(sub.id, sub.marksObtained, Number(e.target.value))
                    }
                    className="w-16 bg-slate-50 dark:bg-slate-800 text-center px-2 py-1 rounded border border-slate-300 dark:border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESULT CARD CANVAS (PORTRAIT FORMAT) ================= */}
      <div className="flex justify-center">
        <div
          id="academic-result-card"
          className="w-full max-w-[580px] bg-white text-slate-900 shadow-2xl rounded-2xl border-4 border-slate-200/90 overflow-hidden relative print:border-none print:shadow-none print:m-0 print:max-w-none transition-all"
          style={{ minHeight: '740px' }}
        >
          {/* Top Status Banner - Mandatory Unofficial Notice */}
          <div className="bg-slate-900 text-amber-300 py-1.5 px-4 text-center font-mono font-bold tracking-widest text-[11px] uppercase border-b-2 border-amber-400/40">
            ✦ SAMPLE – UNOFFICIAL ✦
          </div>

          {/* Academic Header with Subtle Blue Gradient */}
          <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white px-8 pt-8 pb-6 border-b border-blue-100 text-center relative overflow-hidden">
            {/* Subtle decorative background watermark */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/50 rounded-full blur-2xl pointer-events-none"></div>

            {/* Academic Motif Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-3 border-2 border-white">
              <Award className="w-8 h-8" />
            </div>

            {/* Test Title */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 uppercase font-serif mb-1">
              {data.testTitle}
            </h1>
            <p className="text-xs font-semibold text-blue-700 tracking-widest uppercase">
              Academic Assessment Statement
            </p>
          </div>

          {/* Student Profile Section - Highlighted Name */}
          <div className="px-8 py-6 bg-slate-50/70 border-b border-slate-200 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-blue-600 to-indigo-600"></div>

              <div className="pl-3">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Student Name
                </span>
                {/* Main Highlight: Student Name */}
                <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
                  {data.studentName}
                </h2>

                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400">Class: </span>
                    <span className="font-bold text-slate-800">{data.className}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{data.academicYear}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="px-8 py-6">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Subject Performance</span>
              <span className="text-slate-400 font-normal">Maximum / Obtained</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4 text-center">Max Marks</th>
                    <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.subjects.map((sub, idx) => {
                    const isPerfect = sub.marksObtained === sub.totalMarks;
                    return (
                      <tr
                        key={sub.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                      >
                        <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {sub.subject}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-500 font-mono">
                          {sub.totalMarks}
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono text-base text-slate-900">
                          {sub.marksObtained}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isPerfect ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> 100%
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              Passed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 font-bold text-slate-800 border-t-2 border-slate-200">
                    <td className="py-3 px-4 uppercase text-xs tracking-wider">
                      Aggregate Total
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{totalMax}</td>
                    <td className="py-3 px-4 text-center font-mono text-base text-blue-700">
                      {totalObtained}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500">
                      {totalObtained} / {totalMax}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* MAIN HIGHLIGHT: OVERALL RESULT 90% */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Shimmer accent */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="space-y-1 text-center sm:text-left z-10">
                <span className="text-xs uppercase tracking-widest text-blue-200 font-bold block">
                  Final Evaluated Standing
                </span>
                <div className="text-sm font-semibold text-white/90">
                  OVERALL RESULT:
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {data.statusLabel}
                </div>
              </div>

              {/* Huge Highlight: 90% */}
              <div className="z-10 text-center sm:text-right bg-white/10 px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono drop-shadow">
                  {percentage}%
                </div>
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mt-0.5">
                  Aggregate Score
                </div>
              </div>
            </div>

            {/* Academic Notes & Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-1">
              <p className="text-[11px] text-slate-500">
                {data.note}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Generated via MathSphere Academic Suite • SAMPLE – UNOFFICIAL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
