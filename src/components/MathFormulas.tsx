import React, { useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';

interface MathFormulasProps {
  onSendToCalculator: (value: string) => void;
}

export const MathFormulas: React.FC<MathFormulasProps> = ({ onSendToCalculator }) => {
  // Quadratic equation state
  const [qa, setQa] = useState<string>('1');
  const [qb, setQb] = useState<string>('-5');
  const [qc, setQc] = useState<string>('6');
  const [quadResult, setQuadResult] = useState<{
    d: number;
    text: string;
    root1?: number;
    root2?: number;
  } | null>(null);

  // Pythagoras state
  const [pa, setPa] = useState<string>('3');
  const [pb, setPb] = useState<string>('4');
  const [pythResult, setPythResult] = useState<string | null>(null);

  // Circle state
  const [radius, setRadius] = useState<string>('5');
  const [circleResult, setCircleResult] = useState<{ area: number; circum: number } | null>(null);

  // Trig triangle state
  const [trigOpp, setTrigOpp] = useState<string>('3');
  const [trigAdj, setTrigAdj] = useState<string>('4');
  const [trigResult, setTrigResult] = useState<{
    hyp: number;
    sin: number;
    cos: number;
    tan: number;
    angleDeg: number;
  } | null>(null);

  // Simple Interest state
  const [siP, setSiP] = useState<string>('10000');
  const [siR, setSiR] = useState<string>('7.5');
  const [siT, setSiT] = useState<string>('2');
  const [siResult, setSiResult] = useState<{ interest: number; total: number } | null>(null);

  // Quadratic Solver
  const solveQuadratic = () => {
    const a = parseFloat(qa);
    const b = parseFloat(qb);
    const c = parseFloat(qc);

    if (isNaN(a) || isNaN(b) || isNaN(c)) return;
    if (a === 0) {
      if (b === 0) {
        setQuadResult({ d: 0, text: 'No solution (invalid equation 0 = 0)' });
      } else {
        const root = -c / b;
        setQuadResult({ d: 0, text: `Linear equation: x = ${Number(root.toFixed(6))}`, root1: root });
      }
      return;
    }

    const d = b * b - 4 * a * c;
    if (d > 0) {
      const r1 = (-b + Math.sqrt(d)) / (2 * a);
      const r2 = (-b - Math.sqrt(d)) / (2 * a);
      setQuadResult({
        d,
        root1: r1,
        root2: r2,
        text: `Two Real Roots: x₁ = ${Number(r1.toFixed(6))}, x₂ = ${Number(r2.toFixed(6))}`,
      });
    } else if (d === 0) {
      const r = -b / (2 * a);
      setQuadResult({
        d,
        root1: r,
        root2: r,
        text: `One Real Root (repeated): x = ${Number(r.toFixed(6))}`,
      });
    } else {
      const realPart = (-b / (2 * a)).toFixed(4);
      const imagPart = (Math.sqrt(-d) / (2 * a)).toFixed(4);
      setQuadResult({
        d,
        text: `Complex Roots: x = ${realPart} ± ${Math.abs(Number(imagPart))}i`,
      });
    }
  };

  // Pythagoras solver
  const solvePythagoras = () => {
    const a = parseFloat(pa);
    const b = parseFloat(pb);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return;
    const c = Math.sqrt(a * a + b * b);
    setPythResult(Number(c.toFixed(6)).toString());
  };

  // Circle area & perimeter
  const solveCircle = () => {
    const r = parseFloat(radius);
    if (isNaN(r) || r < 0) return;
    const area = Math.PI * r * r;
    const circum = 2 * Math.PI * r;
    setCircleResult({
      area: Number(area.toFixed(4)),
      circum: Number(circum.toFixed(4)),
    });
  };

  // Trigonometry solver
  const solveTrig = () => {
    const opp = parseFloat(trigOpp);
    const adj = parseFloat(trigAdj);
    if (isNaN(opp) || isNaN(adj) || opp <= 0 || adj <= 0) return;
    const hyp = Math.sqrt(opp * opp + adj * adj);
    const angleRad = Math.atan2(opp, adj);
    const angleDeg = (angleRad * 180) / Math.PI;

    setTrigResult({
      hyp: Number(hyp.toFixed(4)),
      sin: Number((opp / hyp).toFixed(4)),
      cos: Number((adj / hyp).toFixed(4)),
      tan: Number((opp / adj).toFixed(4)),
      angleDeg: Number(angleDeg.toFixed(2)),
    });
  };

  // Simple Interest solver
  const solveSimpleInterest = () => {
    const P = parseFloat(siP);
    const R = parseFloat(siR);
    const T = parseFloat(siT);
    if (isNaN(P) || isNaN(R) || isNaN(T)) return;

    const interest = (P * R * T) / 100;
    const total = P + interest;
    setSiResult({
      interest: Number(interest.toFixed(2)),
      total: Number(total.toFixed(2)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📐</span> Diploma Maths Formulas & Solvers
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">Step-by-step engineering calculation</span>
      </div>

      {/* 1. Quadratic Equation */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quadratic Equation</h3>
            <p className="text-sm font-mono text-blue-600 dark:text-blue-400">ax² + bx + c = 0 &nbsp;|&nbsp; x = (-b ± √(b² − 4ac)) / 2a</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 my-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Coefficient a</label>
            <input
              id="quad-a"
              type="number"
              value={qa}
              onChange={(e) => setQa(e.target.value)}
              placeholder="e.g. 1"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Coefficient b</label>
            <input
              id="quad-b"
              type="number"
              value={qb}
              onChange={(e) => setQb(e.target.value)}
              placeholder="e.g. -5"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Constant c</label>
            <input
              id="quad-c"
              type="number"
              value={qc}
              onChange={(e) => setQc(e.target.value)}
              placeholder="e.g. 6"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="solve-quadratic-btn"
            type="button"
            onClick={solveQuadratic}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            Solve Equation
          </button>
        </div>

        {quadResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
              Discriminant Δ = b² − 4ac = ({qb})² − 4({qa})({qc}) = <strong>{quadResult.d}</strong>
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{quadResult.text}</div>
            {quadResult.root1 !== undefined && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSendToCalculator(quadResult.root1!.toString())}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" /> Send x₁ ({quadResult.root1}) to Calc
                </button>
                {quadResult.root2 !== undefined && quadResult.root2 !== quadResult.root1 && (
                  <button
                    type="button"
                    onClick={() => onSendToCalculator(quadResult.root2!.toString())}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" /> Send x₂ ({quadResult.root2}) to Calc
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Pythagoras Theorem */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pythagoras Theorem</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">c² = a² + b² &nbsp;→&nbsp; c = √(a² + b²)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Side a</label>
            <input
              id="pyth-a"
              type="number"
              value={pa}
              onChange={(e) => setPa(e.target.value)}
              placeholder="Side a"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Side b</label>
            <input
              id="pyth-b"
              type="number"
              value={pb}
              onChange={(e) => setPb(e.target.value)}
              placeholder="Side b"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="solve-pythagoras-btn"
            type="button"
            onClick={solvePythagoras}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            Calculate Hypotenuse (c)
          </button>
        </div>

        {pythResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">
              Hypotenuse c = <strong className="text-blue-600 dark:text-blue-400 text-base">{pythResult}</strong>
            </span>
            <button
              type="button"
              onClick={() => onSendToCalculator(pythResult)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Use in Calculator
            </button>
          </div>
        )}
      </div>

      {/* 3. Area of Circle & Geometric Properties */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Area & Circumference of Circle</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">Area A = πr² &nbsp;|&nbsp; Circumference C = 2πr</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Radius (r)</label>
            <input
              id="circle-r"
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Radius"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              id="calc-circle-btn"
              type="button"
              onClick={solveCircle}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
            >
              Compute Area & Perimeter
            </button>
          </div>
        </div>

        {circleResult && (
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span>Area (A = π × {radius}²): <strong className="text-blue-600 dark:text-blue-400">{circleResult.area} sq units</strong></span>
              <button
                type="button"
                onClick={() => onSendToCalculator(circleResult.area.toString())}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Send Area
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Circumference (C = 2π × {radius}): <strong className="text-emerald-600 dark:text-emerald-400">{circleResult.circum} units</strong></span>
              <button
                type="button"
                onClick={() => onSendToCalculator(circleResult.circum.toString())}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Send Circumference
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Trigonometry Reference & Calculator */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Trigonometry & Right Triangle Ratios</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          sin θ = Opp / Hyp &nbsp;•&nbsp; cos θ = Adj / Hyp &nbsp;•&nbsp; tan θ = Opp / Adj
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Opposite Side</label>
            <input
              id="trig-opp"
              type="number"
              value={trigOpp}
              onChange={(e) => setTrigOpp(e.target.value)}
              placeholder="Opposite"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Adjacent Side</label>
            <input
              id="trig-adj"
              type="number"
              value={trigAdj}
              onChange={(e) => setTrigAdj(e.target.value)}
              placeholder="Adjacent"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          id="calc-trig-btn"
          type="button"
          onClick={solveTrig}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Compute Ratios & Angle (θ)
        </button>

        {trigResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Angle θ</span>
              <strong className="text-slate-900 dark:text-white text-base">{trigResult.angleDeg}°</strong>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Hypotenuse</span>
              <strong className="text-slate-900 dark:text-white text-base">{trigResult.hyp}</strong>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">sin θ</span>
              <strong className="text-slate-900 dark:text-white text-base">{trigResult.sin}</strong>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">cos θ / tan θ</span>
              <strong className="text-slate-900 dark:text-white text-base">{trigResult.cos} / {trigResult.tan}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 5. Simple Interest */}
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Simple Interest (SI)</h3>
        <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3">SI = (P × R × T) / 100 &nbsp;|&nbsp; Amount = P + SI</p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Principal (P)</label>
            <input
              id="si-p"
              type="number"
              value={siP}
              onChange={(e) => setSiP(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Rate % (R)</label>
            <input
              id="si-r"
              type="number"
              value={siR}
              onChange={(e) => setSiR(e.target.value)}
              placeholder="e.g. 7.5"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Time yrs (T)</label>
            <input
              id="si-t"
              type="number"
              value={siT}
              onChange={(e) => setSiT(e.target.value)}
              placeholder="e.g. 2"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          id="calc-si-btn"
          type="button"
          onClick={solveSimpleInterest}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          Calculate Simple Interest
        </button>

        {siResult && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm flex items-center justify-between">
            <div>
              <div>Interest SI: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">{siResult.interest}</strong></div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Maturity Amount: <strong>{siResult.total}</strong></div>
            </div>
            <button
              type="button"
              onClick={() => onSendToCalculator(siResult.interest.toString())}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Send SI to Calc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
