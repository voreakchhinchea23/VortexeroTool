import React, { useState, useMemo } from 'react';
import { Activity, Flame, Heart, Scale, User, Target, ChevronRight } from 'lucide-react';

export const BmiCalorieCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [activity, setActivity] = useState<number>(1.375); // Light exercise
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');

  // Convert values based on selected unit
  const heightInCm = unit === 'metric' ? heightCm : heightFt * 30.48 + heightIn * 2.54;
  const weightInKg = unit === 'metric' ? weightKg : weightLbs * 0.453592;

  // Health Calculations
  const { bmi, bmiCategory, bmiColor, bmr, tdee, targetCalories, macros } = useMemo(() => {
    // 1. BMI Calculation = weight (kg) / (height (m))^2
    const heightM = heightInCm / 100;
    const computedBmi = heightM > 0 ? weightInKg / (heightM * heightM) : 0;

    let category = 'Normal Weight';
    let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

    if (computedBmi < 18.5) {
      category = 'Underweight';
      color = 'text-sky-500 bg-sky-500/10 border-sky-500/30';
    } else if (computedBmi < 25) {
      category = 'Normal Healthy Weight';
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    } else if (computedBmi < 30) {
      category = 'Overweight';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    } else {
      category = 'Obesity Range';
      color = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    }

    // 2. BMR (Mifflin-St Jeor Equation)
    // Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
    // Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
    let computedBmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age;
    if (gender === 'male') {
      computedBmr += 5;
    } else {
      computedBmr -= 161;
    }

    // 3. TDEE = BMR * Activity Multiplier
    const computedTdee = computedBmr * activity;

    // 4. Target Calories based on Goal
    let target = computedTdee;
    if (goal === 'cut') {
      target = computedTdee - 500; // 500 kcal deficit
    } else if (goal === 'bulk') {
      target = computedTdee + 350; // 350 kcal surplus
    }

    // 5. Recommended Macros (Balanced / High Protein)
    // Protein: ~2g per kg of bodyweight (4 kcal/g)
    // Fat: ~25% of total calories (9 kcal/g)
    // Carbs: Remaining calories (4 kcal/g)
    const proteinGrams = Math.round(weightInKg * 2);
    const proteinCals = proteinGrams * 4;
    const fatCals = target * 0.25;
    const fatGrams = Math.round(fatCals / 9);
    const carbCals = Math.max(0, target - proteinCals - fatCals);
    const carbGrams = Math.round(carbCals / 4);

    return {
      bmi: computedBmi,
      bmiCategory: category,
      bmiColor: color,
      bmr: Math.round(computedBmr),
      tdee: Math.round(computedTdee),
      targetCalories: Math.round(target),
      macros: {
        protein: proteinGrams,
        carbs: carbGrams,
        fats: fatGrams,
      },
    };
  }, [heightInCm, weightInKg, age, gender, activity, goal]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Bio Input Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale size={18} className="text-teal-500" />
              Body Parameters
            </h2>

            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setUnit('metric')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  unit === 'metric' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  unit === 'imperial' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Imperial (lbs/ft)
              </button>
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Age (Years)
              </label>
              <input
                type="number"
                min="10"
                max="110"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Height & Weight Inputs */}
          {unit === 'metric' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="260"
                  value={heightCm || ''}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="350"
                  value={weightKg || ''}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Feet (ft)
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={heightFt || ''}
                  onChange={(e) => setHeightFt(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Inches (in)
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={heightIn || ''}
                  onChange={(e) => setHeightIn(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="50"
                  max="750"
                  value={weightLbs || ''}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Activity Level */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Daily Physical Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={1.2}>Sedentary (Desk Job / Little or No Exercise)</option>
              <option value={1.375}>Lightly Active (Workouts 1-3 days/week)</option>
              <option value={1.55}>Moderately Active (Workouts 3-5 days/week)</option>
              <option value={1.725}>Very Active (Hard Workouts 6-7 days/week)</option>
              <option value={1.9}>Extra Active (Physical Labor / 2x Daily Training)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Body Composition Goal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('cut')}
                className={`py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'cut'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Fat Loss (-500)
              </button>
              <button
                type="button"
                onClick={() => setGoal('maintain')}
                className={`py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'maintain'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Maintain Weight
              </button>
              <button
                type="button"
                onClick={() => setGoal('bulk')}
                className={`py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'bulk'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Muscle Gain (+350)
              </button>
            </div>
          </div>
        </div>

        {/* Health & Nutrition Output Card */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900/90 to-[#071318] border border-teal-500/30 text-white shadow-xl flex flex-col justify-between space-y-6">
          {/* BMI Gauge Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                Body Mass Index (BMI)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${bmiColor}`}>
                {bmiCategory}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tight text-white">
                {bmi.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">kg/m²</span>
            </div>

            {/* BMI Category Progress Bar */}
            <div className="mt-3">
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-sky-400 w-1/4" title="Underweight (< 18.5)" />
                <div className="h-full bg-emerald-400 w-1/4" title="Normal (18.5 - 24.9)" />
                <div className="h-full bg-amber-400 w-1/4" title="Overweight (25 - 29.9)" />
                <div className="h-full bg-rose-500 w-1/4" title="Obese (30+)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>35.0</span>
              </div>
            </div>
          </div>

          {/* Caloric Intake Stats */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">BMR (Basal)</span>
              <p className="text-base font-extrabold text-white mt-0.5">{bmr} kcal</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TDEE (Burn)</span>
              <p className="text-base font-extrabold text-teal-300 mt-0.5">{tdee} kcal</p>
            </div>
            <div className="p-3 rounded-2xl bg-teal-500/15 border border-teal-500/30">
              <span className="text-[10px] font-bold text-teal-400 uppercase">Target Daily</span>
              <p className="text-base font-black text-white mt-0.5">{targetCalories} kcal</p>
            </div>
          </div>

          {/* Macro Split Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-700/60">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              Recommended Daily Macronutrients
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
                <span className="text-[11px] font-extrabold text-indigo-300 uppercase">Protein</span>
                <p className="text-lg font-black text-white">{macros.protein}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{(macros.protein * 4)} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <span className="text-[11px] font-extrabold text-amber-300 uppercase">Carbs</span>
                <p className="text-lg font-black text-white">{macros.carbs}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{(macros.carbs * 4)} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30">
                <span className="text-[11px] font-extrabold text-rose-300 uppercase">Fats</span>
                <p className="text-lg font-black text-white">{macros.fats}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{(macros.fats * 9)} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
