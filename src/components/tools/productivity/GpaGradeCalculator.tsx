import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Target,
  Award,
  Copy,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';
import {
  GRADE_SCALE_4_0,
  GRADE_SCALE_4_3,
  percentToGpa4,
  calculateGpaSummary,
  calculateFinalExamNeeded,
} from '../../../utils/everydayUtils';

type TabMode = 'gpa' | 'final_exam' | 'weighted';
type GpaScale = '4.0' | '4.3' | 'percent';

interface CourseRow {
  id: string;
  name: string;
  credits: number;
  letter: string;
  percent: number;
}

interface SyllabusComponent {
  id: string;
  name: string;
  weight: number;
  score: number;
}

export const GpaGradeCalculator: React.FC = () => {
  const [tab, setTab] = useState<TabMode>('gpa');

  // Tab 1: GPA Calculator
  const [scale, setScale] = useState<GpaScale>('4.0');
  const [priorGpa, setPriorGpa] = useState<string>('');
  const [priorCredits, setPriorCredits] = useState<string>('');
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Mathematics / Calculus', credits: 4, letter: 'A', percent: 94 },
    { id: '2', name: 'English Composition', credits: 3, letter: 'A-', percent: 91 },
    { id: '3', name: 'Computer Science', credits: 4, letter: 'B+', percent: 88 },
    { id: '4', name: 'World History', credits: 3, letter: 'A', percent: 95 },
  ]);

  // Tab 2: Final Exam Target
  const [currentGrade, setCurrentGrade] = useState<number>(84);
  const [desiredGrade, setDesiredGrade] = useState<number>(90);
  const [finalWeight, setFinalWeight] = useState<number>(25);

  // Tab 3: Weighted Course Grade
  const [components, setComponents] = useState<SyllabusComponent[]>([
    { id: '1', name: 'Homework & Assignments', weight: 20, score: 92 },
    { id: '2', name: 'Quizzes & Labs', weight: 15, score: 86 },
    { id: '3', name: 'Midterm Exam', weight: 30, score: 83 },
    { id: '4', name: 'Final Exam / Project', weight: 35, score: 89 },
  ]);

  const { copyToClipboard } = useClipboard();

  const gpaScaleMap = scale === '4.3' ? GRADE_SCALE_4_3 : GRADE_SCALE_4_0;
  const maxGpa = scale === '4.3' ? 4.3 : 4.0;

  const gpaSummary = useMemo(() => {
    const mapped = courses.map((c) => {
      const pts = scale === 'percent' ? percentToGpa4(c.percent).gpa : (gpaScaleMap[c.letter] ?? 0);
      return { id: c.id, name: c.name, credits: c.credits, gradePoints: pts };
    });
    return calculateGpaSummary(mapped, Number(priorGpa) || 0, Number(priorCredits) || 0);
  }, [courses, scale, gpaScaleMap, priorGpa, priorCredits]);

  const finalResult = useMemo(() => {
    return calculateFinalExamNeeded(currentGrade, desiredGrade, finalWeight);
  }, [currentGrade, desiredGrade, finalWeight]);

  const weightedResult = useMemo(() => {
    const totalWeight = components.reduce((s, c) => s + Math.max(0, c.weight), 0);
    const earnedWeighted = components.reduce((s, c) => s + Math.max(0, c.weight) * Math.max(0, c.score), 0);
    const avg = totalWeight > 0 ? earnedWeighted / totalWeight : 0;
    const gradeInfo = percentToGpa4(avg);
    return { totalWeight, avg: Number(avg.toFixed(2)), letter: gradeInfo.letter, gpa: gradeInfo.gpa };
  }, [components]);

  const getAcademicStanding = (gpa: number) => {
    if (gpa >= 3.85) return { label: 'Summa Cum Laude / Highest Honors', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
    if (gpa >= 3.5) return { label: 'Dean’s List / Magna Cum Laude', color: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40' };
    if (gpa >= 3.0) return { label: 'Good Academic Standing (Honors)', color: 'text-sky-300 bg-sky-500/20 border-sky-500/40' };
    if (gpa >= 2.0) return { label: 'Satisfactory Standing', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    return { label: 'Academic Probation Warning', color: 'text-rose-300 bg-rose-500/20 border-rose-500/40' };
  };

  const standing = getAcademicStanding(gpaSummary.cumulativeGpa);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { id: 'gpa', label: 'Semester & Cumulative GPA', icon: GraduationCap },
          { id: 'final_exam', label: 'Final Exam Target Score', icon: Target },
          { id: 'weighted', label: 'Weighted Syllabus Grade', icon: BarChart3 },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabMode)}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon size={17} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GPA Calculator */}
      {tab === 'gpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Course List</h2>
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                {(['4.0', '4.3', 'percent'] as GpaScale[]).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setScale(sc)}
                    className={`px-3 py-1 rounded-lg cursor-pointer ${
                      scale === sc ? 'bg-violet-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    {sc === 'percent' ? '% Scale' : `${sc} Scale`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 grid grid-cols-12 gap-2.5 items-center"
                >
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) =>
                      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, name: e.target.value } : c)))
                    }
                    placeholder="Course Name"
                    className="col-span-5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  />

                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={course.credits}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((c) => (c.id === course.id ? { ...c, credits: Number(e.target.value) } : c))
                        )
                      }
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-center"
                      title="Credit hours"
                    />
                  </div>

                  <div className="col-span-3">
                    {scale === 'percent' ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={course.percent}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((c) => (c.id === course.id ? { ...c, percent: Number(e.target.value) } : c))
                          )
                        }
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-center"
                      />
                    ) : (
                      <select
                        value={course.letter}
                        onChange={(e) =>
                          setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, letter: e.target.value } : c)))
                        }
                        className="w-full px-2 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
                      >
                        {Object.entries(gpaScaleMap).map(([letter, pts]) => (
                          <option key={letter} value={letter}>
                            {letter} ({pts.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    disabled={courses.length <= 1}
                    onClick={() => setCourses((prev) => prev.filter((c) => c.id !== course.id))}
                    className="col-span-1 flex justify-center text-slate-400 hover:text-rose-500 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setCourses((prev) => [
                  ...prev,
                  { id: `${Date.now()}`, name: `Course ${prev.length + 1}`, credits: 3, letter: 'A', percent: 90 },
                ])
              }
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Course</span>
            </button>

            {/* Optional Prior Cumulative GPA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Prior Cumulative GPA (Optional)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={maxGpa}
                  value={priorGpa}
                  onChange={(e) => setPriorGpa(e.target.value)}
                  placeholder="Previous GPA (e.g. 3.45)"
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(e.target.value)}
                  placeholder="Completed Credits (e.g. 45)"
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* GPA Summary Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-violet-950/50 via-slate-900/95 to-[#0d0a1a] border border-violet-500/30 text-white shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-violet-300">GPA Summary</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${standing.color}`}>
                {standing.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Semester GPA</span>
                <p className="text-4xl font-black font-mono text-white mt-1">{gpaSummary.semesterGpa.toFixed(2)}</p>
                <span className="text-[11px] text-slate-400">out of {maxGpa.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Cumulative GPA</span>
                <p className="text-4xl font-black font-mono text-violet-300 mt-1">{gpaSummary.cumulativeGpa.toFixed(2)}</p>
                <span className="text-[11px] text-slate-400">{gpaSummary.totalCredits} total credits</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Term Credits</span>
                <p className="text-base font-extrabold font-mono mt-0.5">{gpaSummary.semesterCredits}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Quality Points</span>
                <p className="text-base font-extrabold font-mono mt-0.5">{gpaSummary.totalQualityPoints}</p>
              </div>
            </div>

            <button
              onClick={() =>
                copyToClipboard(
                  `Semester GPA: ${gpaSummary.semesterGpa.toFixed(2)} (${gpaSummary.semesterCredits} credits)\nCumulative GPA: ${gpaSummary.cumulativeGpa.toFixed(2)} (${gpaSummary.totalCredits} total credits)`,
                  'GPA summary copied!'
                )
              }
              className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy GPA Report</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Final Exam Target Score */}
      {tab === 'final_exam' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={17} className="text-violet-500" />
              What Score Do I Need on the Final?
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Current Course Grade (%)</label>
              <input
                type="number"
                min="0"
                max="150"
                step="0.5"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Target Overall Grade (%)</label>
              <input
                type="number"
                min="0"
                max="120"
                step="0.5"
                value={desiredGrade}
                onChange={(e) => setDesiredGrade(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500 uppercase">Final Exam Weight</span>
                <span className="font-mono text-violet-500">{finalWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                value={finalWeight}
                onChange={(e) => setFinalWeight(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-violet-950/50 via-slate-900/95 to-[#0d0a1a] border border-violet-500/30 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-violet-300">Required Final Score</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-200 border border-violet-500/30">
                {finalResult.status === 'guaranteed'
                  ? 'Already Guaranteed'
                  : finalResult.status === 'extra_credit'
                  ? 'Needs >100% (Extra Credit)'
                  : finalResult.status === 'challenging'
                  ? 'High Effort Required'
                  : 'Achievable'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-white">
                {finalResult.requiredScore <= 0 ? '0%' : `${finalResult.requiredScore}%`}
              </span>
              <span className="text-xs text-slate-400">on final exam</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">If you score 100%</span>
                <p className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">{finalResult.maxPossibleGrade}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">If you score 0%</span>
                <p className="text-base font-extrabold font-mono text-amber-400 mt-0.5">{finalResult.minPossibleGrade}%</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Final Outcome Preview</span>
              {[60, 75, 85, 95].map((hypo) => {
                const w = finalWeight / 100;
                const finalCourse = currentGrade * (1 - w) + hypo * w;
                return (
                  <div key={hypo} className="flex justify-between font-mono text-slate-300">
                    <span>Score {hypo}% on Final →</span>
                    <strong className="text-white">{finalCourse.toFixed(1)}% ({percentToGpa4(finalCourse).letter})</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Weighted Course Grade */}
      {tab === 'weighted' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Syllabus Weight Components</h2>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  weightedResult.totalWeight === 100
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}
              >
                Total Weight: {weightedResult.totalWeight}%
              </span>
            </div>

            <div className="space-y-2.5">
              {components.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 grid grid-cols-12 gap-2.5 items-center"
                >
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) =>
                      setComponents((prev) => prev.map((x) => (x.id === comp.id ? { ...x, name: e.target.value } : x)))
                    }
                    className="col-span-5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  />
                  <div className="col-span-3 relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={comp.weight}
                      onChange={(e) =>
                        setComponents((prev) => prev.map((x) => (x.id === comp.id ? { ...x, weight: Number(e.target.value) } : x)))
                      }
                      className="w-full px-2.5 py-2 pr-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%w</span>
                  </div>
                  <div className="col-span-3 relative">
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={comp.score}
                      onChange={(e) =>
                        setComponents((prev) => prev.map((x) => (x.id === comp.id ? { ...x, score: Number(e.target.value) } : x)))
                      }
                      className="w-full px-2.5 py-2 pr-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                  </div>
                  <button
                    disabled={components.length <= 1}
                    onClick={() => setComponents((prev) => prev.filter((x) => x.id !== comp.id))}
                    className="col-span-1 flex justify-center text-slate-400 hover:text-rose-500 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setComponents((prev) => [...prev, { id: `${Date.now()}`, name: 'Extra Assignment', weight: 10, score: 90 }])
              }
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Assessment Category</span>
            </button>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-violet-950/50 via-slate-900/95 to-[#0d0a1a] border border-violet-500/30 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-violet-300">Weighted Grade</span>
              <Award size={18} className="text-amber-400" />
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-white">{weightedResult.avg}%</span>
              <span className="px-3 py-1 rounded-xl bg-violet-500/25 border border-violet-400/40 text-lg font-black text-violet-200">
                {weightedResult.letter}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Equivalent GPA Point Value: <strong className="font-mono text-white">{weightedResult.gpa.toFixed(1)}</strong> (4.0 scale)
            </p>

            {weightedResult.totalWeight !== 100 && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>Weights currently sum to {weightedResult.totalWeight}%. Grade is normalized over entered weights.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
