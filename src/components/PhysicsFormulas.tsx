import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface PhysicsFormulasProps {
  onSendToCalculator: (val: string) => void;
}

export const PhysicsFormulas: React.FC<PhysicsFormulasProps> = ({ onSendToCalculator }) => {
  // Ohm's Law state
  const [ohmMode, setOhmMode] = useState<'V' | 'I' | 'R'>('V');
  const [ohmVal1, setOhmVal1] = useState<string>('2'); // I or V
  const [ohmVal2, setOhmVal2] = useState<string>('10'); // R or I or R
  const [ohmResult, setOhmResult] = useState<string | null>(null);

  // Force state
  const [mass, setMass] = useState<string>('10');
  const [acceleration, setAcceleration] = useState<string>('9.8');
  const [forceResult, setForceResult] = useState<string | null>(null);

  // Power state (Mechanical)
  const [work, setWork] = useState<string>('500');
  const [time, setTime] = useState<string>('5');
  const [powerResult, setPowerResult] = useState<string | null>(null);

  // Electrical Power state
  const [elecVolt, setElecVolt] = useState<string>('220');
  const [elecCurr, setElecCurr] = useState<string>('5');
  const [elecPowerResult, setElecPowerResult] = useState<string | null>(null);

  // Kinetic Energy state
  const [keMass, setKeMass] = useState<string>('1000');
  const [keVel, setKeVel] = useState<string>('20');
  const [keResult, setKeResult] = useState<string | null>(null);

  // Resistors Series/Parallel
  const [r1, setR1] = useState<string>('10');
  const [r2, setR2] = useState<string>('20');
  const [resistorResult, setResistorResult] = useState<{ series: number; parallel: number } | null>(null);

  // Ohm's Law calculation
  const calculateOhm = () => {
    const v1 = parseFloat(ohmVal1);
    const v2 = parseFloat(ohmVal2);
    if (isNaN(v1) || isNaN(v2)) return;

    if (ohmMode === 'V') {
      // V = I * R
      const V = v1 * v2;
      setOhmResult(`Voltage (V) = ${Number(V.toFixed(4))} V`);
    } else if (ohmMode === 'I') {
      // I = V / R
      if (v2 === 0) {
        setOhmResult('Resistance cannot be zero.');
        return;
      }
      const I = v1 / v2;
      setOhmResult(`Current (I) = ${Number(I.toFixed(4))} A`);
    } else {
      // R = V / I
      if (v2 === 0) {
        setOhmResult('Current cannot be zero.');
        return;
      }
      const R = v1 / v2;
      setOhmResult(`Resistance (R) = ${Number(R.toFixed(4))} Ω`);
    }
  };

  // Force calculation
  const calculateForce = () => {
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);
    if (isNaN(m) || isNaN(a)) return;
    const f = m * a;
    setForceResult(`${Number(f.toFixed(4))} N`);
  };

  // Mechanical Power
  const calculatePower = () => {
    const w = parseFloat(work);
    const t = parseFloat(time);
    if (isNaN(w) || isNaN(t)) return;
    if (t === 0) {
      setPowerResult('Time cannot be zero.');
      return;
    }
    const p = w / t;
    const hp = p / 745.7;
    setPowerResult(`${Number(p.toFixed(4))} W (${Number(hp.toFixed(3))} HP)`);
  };

  // Electrical Power
  const calculateElecPower = () => {
    const v = parseFloat(elecVolt);
    const i = parseFloat(elecCurr);
    if (isNaN(v) || isNaN(i)) return;
    const p = v * i;
    setElecPowerResult(`${Number(p.toFixed(4))} W (${Number((p / 1000).toFixed(4))} kW)`);
  };

  // Kinetic Energy
  const calculateKE = () => {
    const m = parseFloat(keMass);
    const v = parseFloat(keVel);
    if (isNaN(m) || isNaN(v)) return;
    const ke = 0.5 * m * v * v;
    setKeResult(`${Number(ke.toFixed(4))} Joules (J)`);
  };

  // Resistors
  const calculateResistors = () => {
    const res1 = parseFloat(r1);
    const res2 = parseFloat(r2);
    if (isNaN(res1) || isNaN(res2) || res1 <= 0 || res2 <= 0) return;
    const series = res1 + res2;
    const parallel = (res1 * res2) / (res1 + res2);
    setResistorResult({
      series: Number(series.toFixed(4)),
      parallel: Number(parallel.toFixed(4)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⚡</span> Physics & Electrical Formulas
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">Engineering solvers with units</span>
      </div>

      {/* 1. Ohm's Law */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Ohm's Law</h3>
            <p className="text-sm font-mono text-blue-600 dark:text-blue-400">V = I × R &nbsp;|&nbsp; I = V / R &nbsp;|&nbsp; R = V / I</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Solve for:</span>
            <select
              value={ohmMode}
              onChange={(e) => {
                setOhmMode(e.target.value as 'V' | 'I' | 'R');
                setOhmResult(null);
              }}
              className="w-auto px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="V">Voltage (V)</option>
              <option value="I">Current (I)</option>
              <option value="R">Resistance (R)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {ohmMode === 'V' ? 'Current I (Amperes, A)' : 'Voltage V (Volts, V)'}
            </label>
            <input
              id="current"
              type="number"
              value={ohmVal1}
              onChange={(e) => setOhmVal1(e.target.value)}
              placeholder={ohmMode === 'V' ? 'Current I' : 'Voltage V'}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {ohmMode === 'R' ? 'Current I (Amperes, A)' : 'Resistance R (Ohms, Ω)'}
            </label>
            <input
              id="resistance"
              type="number"
              value={ohmVal2}
              onChange={(e) => setOhmVal2(e.target.value)}
              placeholder={ohmMode === 'R' ? 'Current I' : 'Resistance R'}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          id="ohm-calc-btn"
          type="button"
          onClick={calculateOhm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          {ohmMode === 'V' ? 'Calculate Voltage' : ohmMode === 'I' ? 'Calculate Current' : 'Calculate Resistance'}
        </button>

        {ohmResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <span id="ohmResult" className="font-semibold text-slate-900 dark:text-white text-base">
              {ohmResult}
            </span>
            <button
              type="button"
              onClick={() => {
                const match = ohmResult.match(/=\s*([0-9.-]+)/);
                if (match) onSendToCalculator(match[1]);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Use in Calculator
            </button>
          </div>
        )}
      </div>

      {/* 2. Force (Newton's Second Law) */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Force (Newton's Second Law)</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">F = m × a</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Mass m (kg)</label>
            <input
              id="mass"
              type="number"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              placeholder="Mass (kg)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Acceleration a (m/s²)</label>
            <input
              id="acceleration"
              type="number"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value)}
              placeholder="Acceleration (m/s²)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          id="force-calc-btn"
          type="button"
          onClick={calculateForce}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Calculate Force
        </button>

        {forceResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <span id="forceResult" className="font-semibold text-slate-900 dark:text-white text-base">
              Force = {forceResult}
            </span>
            <button
              type="button"
              onClick={() => {
                const num = parseFloat(forceResult);
                if (!isNaN(num)) onSendToCalculator(num.toString());
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Use in Calculator
            </button>
          </div>
        )}
      </div>

      {/* 3. Mechanical Power */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Mechanical Power</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">P = W / t &nbsp;|&nbsp; 1 HP ≈ 745.7 Watts</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Work Done W (Joules, J)</label>
            <input
              id="work"
              type="number"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="Work (J)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Time taken t (seconds, s)</label>
            <input
              id="time"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (s)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          id="power-calc-btn"
          type="button"
          onClick={calculatePower}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Calculate Power
        </button>

        {powerResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <span id="powerResult" className="font-semibold text-slate-900 dark:text-white text-base">
              Power = {powerResult}
            </span>
            <button
              type="button"
              onClick={() => {
                const num = parseFloat(powerResult);
                if (!isNaN(num)) onSendToCalculator(num.toString());
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Use in Calculator
            </button>
          </div>
        )}
      </div>

      {/* 4. Electrical Power */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Electrical Power</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">P = V × I &nbsp;=&nbsp; I²R &nbsp;=&nbsp; V² / R</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Voltage V (Volts)</label>
            <input
              id="elec-volt"
              type="number"
              value={elecVolt}
              onChange={(e) => setElecVolt(e.target.value)}
              placeholder="e.g. 220"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Current I (Amperes)</label>
            <input
              id="elec-curr"
              type="number"
              value={elecCurr}
              onChange={(e) => setElecCurr(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={calculateElecPower}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Calculate Electrical Power
        </button>

        {elecPowerResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">
              Power = <strong className="text-blue-600 dark:text-blue-400 text-base">{elecPowerResult}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 5. Resistors in Series and Parallel */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resistors in Series & Parallel</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">
          R_series = R₁ + R₂ &nbsp;|&nbsp; R_parallel = (R₁ × R₂) / (R₁ + R₂)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Resistor R₁ (Ω)</label>
            <input
              id="resistor-1"
              type="number"
              value={r1}
              onChange={(e) => setR1(e.target.value)}
              placeholder="Resistor 1"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Resistor R₂ (Ω)</label>
            <input
              id="resistor-2"
              type="number"
              value={r2}
              onChange={(e) => setR2(e.target.value)}
              placeholder="Resistor 2"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={calculateResistors}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Calculate Equivalent Resistances
        </button>

        {resistorResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Series Equivalent (R₁ + R₂): <strong className="text-blue-600 dark:text-blue-400">{resistorResult.series} Ω</strong></span>
              <button
                type="button"
                onClick={() => onSendToCalculator(resistorResult.series.toString())}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Send to Calc
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Parallel Equivalent: <strong className="text-emerald-600 dark:text-emerald-400">{resistorResult.parallel} Ω</strong></span>
              <button
                type="button"
                onClick={() => onSendToCalculator(resistorResult.parallel.toString())}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Send to Calc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
