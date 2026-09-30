import React, { useState, useEffect } from 'react';
import { sound } from '../utils/soundFx';
import { PlayIcon, PauseIcon, RotateCcwIcon } from '../utils/icons';

function BodyMetrics({ onShowToast }) {
  // Weight Log State
  const [weight, setWeight] = useState('');
  const [metrics, setMetrics] = useState([
    { weight: 77.2, date: '01 Sep' },
    { weight: 76.8, date: '05 Sep' },
    { weight: 76.4, date: '09 Sep' },
    { weight: 75.9, date: '13 Sep' },
    { weight: 75.2, date: '17 Sep' },
    { weight: 74.8, date: '20 Sep' }
  ]);

  // PR Tracker State
  const [prs, setPrs] = useState([
    { lift: 'Bench Press', weight: 110, unit: 'kg', reps: 1, date: '14 Sep' },
    { lift: 'Deadlift', weight: 190, unit: 'kg', reps: 1, date: '18 Sep' },
    { lift: 'Back Squat', weight: 155, unit: 'kg', reps: 1, date: '10 Sep' },
    { lift: 'Weighted Pull-Up', weight: 35, unit: 'kg', reps: 3, date: '16 Sep' }
  ]);

  const [newPrLift, setNewPrLift] = useState('Bench Press');
  const [newPrWeight, setNewPrWeight] = useState('');

  // BMI & Macro Calculator State
  const [heightCm, setHeightCm] = useState(178);
  const [currentWeightKg, setCurrentWeightKg] = useState(75);
  const bmi = (currentWeightKg / ((heightCm / 100) ** 2)).toFixed(1);

  // Adjustable Workout Timer State
  const [workSec, setWorkSec] = useState(30);
  const [restSec, setRestSec] = useState(10);
  const [maxRounds, setMaxRounds] = useState(5);

  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'rest'
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [round, setRound] = useState(1);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (timerMode === 'work') {
              if (restSec > 0) {
                sound.playTimerBeep(true);
                setTimerMode('rest');
                return restSec;
              } else {
                if (round >= maxRounds) {
                  sound.playSuccess();
                  setIsTimerRunning(false);
                  setRound(1);
                  setTimerMode('work');
                  if (onShowToast) onShowToast('Workout completed!');
                  return workSec;
                } else {
                  sound.playTimerBeep(true);
                  setRound(r => r + 1);
                  return workSec;
                }
              }
            } else {
              if (round >= maxRounds) {
                sound.playSuccess();
                setIsTimerRunning(false);
                setRound(1);
                setTimerMode('work');
                if (onShowToast) onShowToast('Workout completed!');
                return workSec;
              } else {
                sound.playTimerBeep(false);
                setRound(r => r + 1);
                setTimerMode('work');
                return workSec;
              }
            }
          }
          if (prev <= 4) {
            sound.playTimerBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode, workSec, restSec, round, maxRounds, onShowToast]);

  const handleResetTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
    setTimerMode('work');
    setTimerSeconds(workSec);
    setRound(1);
  };

  const formatTimerDisplay = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleLogWeight = () => {
    if (!weight) return;
    sound.playSuccess();
    const now = new Date();
    const dateStr = now.toLocaleDateString([], { day: '2-digit', month: 'short' });
    const newEntry = { weight: parseFloat(weight), date: dateStr };
    setMetrics(prev => [...prev, newEntry]);
    setCurrentWeightKg(parseFloat(weight));
    setWeight('');
    if (onShowToast) onShowToast(`Logged weight: ${weight} kg`);
  };

  const handleUpdatePr = (e) => {
    e.preventDefault();
    if (!newPrWeight) return;
    sound.playSuccess();
    const now = new Date();
    const dateStr = now.toLocaleDateString([], { day: '2-digit', month: 'short' });
    setPrs(prev => prev.map(p => p.lift === newPrLift ? { ...p, weight: Number(newPrWeight), date: dateStr } : p));
    if (onShowToast) onShowToast(`Updated PR: ${newPrLift} -> ${newPrWeight} kg`);
    setNewPrWeight('');
  };

  // SVG Chart Calculation
  const minW = Math.min(...metrics.map(m => m.weight)) - 1;
  const maxW = Math.max(...metrics.map(m => m.weight)) + 1;
  const range = maxW - minW || 1;
  const chartHeight = 110;
  const chartWidth = 500;

  const points = metrics.map((m, i) => {
    const x = (i / (metrics.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((m.weight - minW) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Body Metrics & Training Tools
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Track body weight trends, personal bests, and run workout interval timers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Weight & PR Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Chart Card */}
          <div className="clean-card p-6 border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Weight Progress (kg)
                </h2>
                <p className="text-xs text-slate-400">
                  Latest: <span className="font-semibold text-emerald-400">{metrics[metrics.length - 1]?.weight} kg</span> • Net change: -2.4 kg
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 74.5"
                  className="clean-input w-28 text-xs font-mono"
                />
                <button
                  onClick={handleLogWeight}
                  className="btn-primary text-xs font-semibold cursor-pointer"
                >
                  Log Entry
                </button>
              </div>
            </div>

            {/* Clean SVG Area Line Chart */}
            <div className="h-32 w-full pt-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cleanWeightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#cleanWeightGrad)" />
                <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {metrics.map((m, i) => {
                  const x = (i / (metrics.length - 1 || 1)) * chartWidth;
                  const y = chartHeight - ((m.weight - minW) / range) * chartHeight;
                  return (
                    <circle key={i} cx={x} cy={y} r="3.5" fill="#111827" stroke="#10b981" strokeWidth="2" />
                  );
                })}
              </svg>
            </div>

            {/* Timeline */}
            <div className="flex justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
              {metrics.map((m, i) => (
                <span key={i} className="text-center">
                  <span className="block font-semibold text-white">{m.weight}</span>
                  <span className="text-[11px] text-slate-500">{m.date}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Personal Records (PR) Board */}
          <div className="clean-card p-6 border-slate-800">
            <div className="pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">
                Personal Records (1RM)
              </h2>
              <p className="text-xs text-slate-400">Your current personal bests on key compound movements</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {prs.map((pr) => (
                <div key={pr.lift} className="p-4 rounded-lg bg-[#0b0f19] border border-slate-800 text-center">
                  <span className="text-[11px] font-medium text-slate-400 uppercase block mb-1">{pr.lift}</span>
                  <span className="text-2xl font-bold text-white block">{pr.weight} <span className="text-xs font-normal text-slate-400">{pr.unit}</span></span>
                  <span className="text-[11px] text-slate-500 mt-1 block">{pr.date}</span>
                </div>
              ))}
            </div>

            {/* PR Update Form */}
            <form onSubmit={handleUpdatePr} className="p-4 rounded-lg bg-[#0b0f19] border border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-3">
              <select
                value={newPrLift}
                onChange={(e) => setNewPrLift(e.target.value)}
                className="clean-input flex-1 text-xs"
              >
                <option value="Bench Press">Bench Press</option>
                <option value="Deadlift">Deadlift</option>
                <option value="Back Squat">Back Squat</option>
                <option value="Weighted Pull-Up">Weighted Pull-Up</option>
              </select>

              <input
                type="number"
                value={newPrWeight}
                onChange={(e) => setNewPrWeight(e.target.value)}
                placeholder="Weight (kg)"
                className="clean-input w-32 text-xs"
                required
              />

              <button
                type="submit"
                className="btn-primary text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Update PR
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Workout Timer & BMI */}
        <div className="space-y-6">
          {/* Workout Interval Timer */}
          <div className="clean-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">
                Adjustable Workout Timer
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Round {round} of {maxRounds}
              </span>
            </div>

            <div className="text-center py-4">
              <span className="text-5xl font-bold font-mono tracking-tight text-white block">
                {formatTimerDisplay(timerSeconds)}
              </span>
              <p className={`text-xs font-bold uppercase tracking-wider mt-2 ${
                timerMode === 'work' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {timerMode === 'work' ? '⚡ Work Interval' : '☕ Rest Interval'}
              </p>
            </div>

            {/* Adjustable Controls (shown when idle/paused) */}
            {!isTimerRunning && (
              <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Work (sec)</label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={workSec}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setWorkSec(val);
                      if (timerMode === 'work') setTimerSeconds(val);
                    }}
                    className="clean-input w-full text-xs text-center py-1 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Rest (sec)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={restSec}
                    onChange={(e) => setRestSec(Math.max(0, Number(e.target.value)))}
                    className="clean-input w-full text-xs text-center py-1 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Rounds</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={maxRounds}
                    onChange={(e) => setMaxRounds(Math.max(1, Number(e.target.value)))}
                    className="clean-input w-full text-xs text-center py-1 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {isTimerRunning ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcwIcon size={14} />
              </button>
            </div>
          </div>

          {/* BMI & Nutrition Target Calculator */}
          <div className="clean-card p-6 border-slate-800">
            <h2 className="text-base font-semibold text-white mb-3">
              Body Mass Index & Targets
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="clean-input w-full text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                  className="clean-input w-full text-xs"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Calculated BMI:</span>
                <span className="font-semibold text-white">{bmi} (Normal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Protein:</span>
                <span className="font-semibold text-emerald-400">{(currentWeightKg * 2.2).toFixed(0)}g / day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hydration Target:</span>
                <span className="font-semibold text-white">{(currentWeightKg * 0.04).toFixed(1)} L / day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyMetrics;