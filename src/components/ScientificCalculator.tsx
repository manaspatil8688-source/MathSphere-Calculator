import React, { useEffect, useState, useCallback } from 'react';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { evaluateExpression, formatResult } from '../utils/calculator';
import { AngleMode, HistoryItem } from '../types';

interface ScientificCalculatorProps {
  displayValue: string;
  setDisplayValue: React.Dispatch<React.SetStateAction<string>>;
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  displayValue,
  setDisplayValue,
  onAddHistory,
}) => {
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [previousExpr, setPreviousExpr] = useState<string>('');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Append token to display
  const appendValue = useCallback((val: string) => {
    setDisplayValue((prev) => {
      // If error or 0, replace unless appending an operator or decimal
      if (prev === 'Error' || prev === 'Infinity' || prev === '-Infinity') {
        return val;
      }
      if (prev === '0') {
        if (val === '.') return '0.';
        if (['+', '-', '×', '÷', '*', '/', '%', '^'].includes(val)) {
          return '0' + val;
        }
        return val;
      }
      return prev + val;
    });
    setHasCalculated(false);
  }, [setDisplayValue]);

  // Clear display
  const clearAll = useCallback(() => {
    setDisplayValue('0');
    setPreviousExpr('');
    setHasCalculated(false);
  }, [setDisplayValue]);

  // Clear current input back to 0 without clearing previous expression
  const clearCurrent = useCallback(() => {
    setDisplayValue('0');
  }, [setDisplayValue]);

  // Backspace
  const backspace = useCallback(() => {
    setDisplayValue((prev) => {
      if (prev === 'Error' || prev.length <= 1) {
        return '0';
      }
      // Check if ending with multi-character function like 'sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt('
      const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt('];
      for (const fn of funcs) {
        if (prev.endsWith(fn)) {
          const sliced = prev.slice(0, -fn.length);
          return sliced === '' ? '0' : sliced;
        }
      }
      return prev.slice(0, -1);
    });
  }, [setDisplayValue]);

  // Toggle DEG / RAD
  const toggleAngle = useCallback(() => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  }, []);

  // Calculate
  const calculate = useCallback(() => {
    if (displayValue === 'Error') return;

    const expr = displayValue;
    const { success, result, rawValue } = evaluateExpression(expr, angleMode === 'DEG');

    if (success) {
      setPreviousExpr(`${expr} =`);
      setDisplayValue(result);
      setHasCalculated(true);
      onAddHistory({
        expression: expr,
        result: result,
      });
    } else {
      setPreviousExpr(`${expr} =`);
      setDisplayValue('Error');
    }
  }, [displayValue, angleMode, onAddHistory, setDisplayValue]);

  // Memory operations
  const memoryAdd = useCallback(() => {
    const num = parseFloat(displayValue);
    if (!isNaN(num)) {
      setMemory((prev) => prev + num);
    }
  }, [displayValue]);

  const memorySubtract = useCallback(() => {
    const num = parseFloat(displayValue);
    if (!isNaN(num)) {
      setMemory((prev) => prev - num);
    }
  }, [displayValue]);

  const memoryRecall = useCallback(() => {
    setDisplayValue(formatResult(memory));
  }, [memory, setDisplayValue]);

  const memoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  // Copy result to clipboard
  const copyDisplay = useCallback(() => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [displayValue]);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or select
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        appendValue(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        appendValue('.');
      } else if (e.key === '+') {
        e.preventDefault();
        appendValue('+');
      } else if (e.key === '-') {
        e.preventDefault();
        appendValue('-');
      } else if (e.key === '*') {
        e.preventDefault();
        appendValue('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendValue('÷');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        appendValue(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        appendValue('^');
      } else if (e.key === '%') {
        e.preventDefault();
        appendValue('%');
      } else if (e.key === '!' ) {
        e.preventDefault();
        appendValue('!');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendValue, calculate, backspace, clearAll]);

  return (
    <div id="calculator-section" className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-700/80 transition-colors">
      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 px-1">
        <div className="flex items-center gap-2">
          <button
            id="toggle-angle-btn"
            type="button"
            onClick={toggleAngle}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-400 font-bold transition cursor-pointer"
            title="Click to toggle between Degree and Radian"
          >
            {angleMode}
          </button>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Trig Mode: <strong className="text-slate-700 dark:text-slate-200">{angleMode === 'DEG' ? 'Degrees (°)' : 'Radians (rad)'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-200/60 dark:border-amber-800/40">
            <span className="text-xs font-semibold">M:</span>
            <span id="memoryValue" className="font-mono text-xs font-bold truncate max-w-[100px]">
              {formatResult(memory)}
            </span>
          </div>

          <button
            id="copy-display-btn"
            type="button"
            onClick={copyDisplay}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition cursor-pointer"
            title="Copy current value"
            aria-label="Copy display value"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Screen Display */}
      <div className="relative mb-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 text-right shadow-inner">
        {/* Previous expression history note */}
        <div className="min-h-[1.25rem] text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 truncate select-none">
          {previousExpr || '\u00A0'}
        </div>
        
        {/* Active display */}
        <input
          id="display"
          type="text"
          value={displayValue}
          readOnly
          className="w-full bg-transparent border-0 text-right font-mono font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight focus:outline-none cursor-default select-all"
          aria-label="Calculator display"
        />
      </div>

      {/* Calculator Buttons Grid (5 Columns) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {/* Row 1: Memory & Clear */}
        <button
          id="btn-mc"
          type="button"
          onClick={memoryClear}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition active:scale-95 cursor-pointer"
          title="Memory Clear"
        >
          MC
        </button>
        <button
          id="btn-mr"
          type="button"
          onClick={memoryRecall}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition active:scale-95 cursor-pointer"
          title="Memory Recall"
        >
          MR
        </button>
        <button
          id="btn-m-plus"
          type="button"
          onClick={memoryAdd}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition active:scale-95 cursor-pointer"
          title="Memory Add"
        >
          M+
        </button>
        <button
          id="btn-m-minus"
          type="button"
          onClick={memorySubtract}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition active:scale-95 cursor-pointer"
          title="Memory Subtract"
        >
          M−
        </button>
        <button
          id="btn-ac"
          type="button"
          onClick={clearAll}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-xs sm:text-sm bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 transition active:scale-95 cursor-pointer"
          title="All Clear"
        >
          AC
        </button>

        {/* Row 2: Scientific Trig, Log, Angle mode */}
        <button
          id="btn-sin"
          type="button"
          onClick={() => appendValue('sin(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
        >
          sin
        </button>
        <button
          id="btn-cos"
          type="button"
          onClick={() => appendValue('cos(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
        >
          cos
        </button>
        <button
          id="btn-tan"
          type="button"
          onClick={() => appendValue('tan(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
        >
          tan
        </button>
        <button
          id="btn-log"
          type="button"
          onClick={() => appendValue('log(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Common Logarithm (base 10)"
        >
          log
        </button>
        <button
          id="btn-deg-rad"
          type="button"
          onClick={toggleAngle}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-xs sm:text-sm bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
          title="Toggle DEG / RAD"
        >
          DEG/RAD
        </button>

        {/* Row 3: Square root, Powers, Ln, Factorial */}
        <button
          id="btn-sqrt"
          type="button"
          onClick={() => appendValue('sqrt(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-sm sm:text-base bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Square Root"
        >
          √
        </button>
        <button
          id="btn-sqr"
          type="button"
          onClick={() => appendValue('^2')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Square"
        >
          x²
        </button>
        <button
          id="btn-pow"
          type="button"
          onClick={() => appendValue('^')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Power xʸ"
        >
          xʸ
        </button>
        <button
          id="btn-ln"
          type="button"
          onClick={() => appendValue('ln(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Natural Logarithm (base e)"
        >
          ln
        </button>
        <button
          id="btn-fact"
          type="button"
          onClick={() => appendValue('!')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-xs sm:text-sm bg-indigo-100/80 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 transition active:scale-95 cursor-pointer"
          title="Factorial"
        >
          n!
        </button>

        {/* Row 4: Constants, Parentheses, Backspace */}
        <button
          id="btn-pi"
          type="button"
          onClick={() => appendValue('π')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-serif text-sm sm:text-base bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
          title="Pi (≈ 3.14159)"
        >
          π
        </button>
        <button
          id="btn-e"
          type="button"
          onClick={() => appendValue('e')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-serif text-sm sm:text-base bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
          title="Euler's Number (≈ 2.71828)"
        >
          e
        </button>
        <button
          id="btn-paren-open"
          type="button"
          onClick={() => appendValue('(')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-sm sm:text-base bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
        >
          (
        </button>
        <button
          id="btn-paren-close"
          type="button"
          onClick={() => appendValue(')')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-semibold text-sm sm:text-base bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
        >
          )
        </button>
        <button
          id="btn-backspace"
          type="button"
          onClick={backspace}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl flex items-center justify-center font-bold text-sm bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition active:scale-95 cursor-pointer"
          title="Backspace"
          aria-label="Backspace"
        >
          ⌫
        </button>

        {/* Row 5: 7 8 9 ÷ % */}
        <button
          id="btn-7"
          type="button"
          onClick={() => appendValue('7')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          7
        </button>
        <button
          id="btn-8"
          type="button"
          onClick={() => appendValue('8')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          8
        </button>
        <button
          id="btn-9"
          type="button"
          onClick={() => appendValue('9')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          9
        </button>
        <button
          id="btn-div"
          type="button"
          onClick={() => appendValue('÷')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-800 dark:text-sky-200 transition active:scale-95 cursor-pointer"
          title="Division"
        >
          ÷
        </button>
        <button
          id="btn-pct"
          type="button"
          onClick={() => appendValue('%')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-sm sm:text-base bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-800 dark:text-sky-200 transition active:scale-95 cursor-pointer"
          title="Percentage"
        >
          %
        </button>

        {/* Row 6: 4 5 6 × − */}
        <button
          id="btn-4"
          type="button"
          onClick={() => appendValue('4')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          4
        </button>
        <button
          id="btn-5"
          type="button"
          onClick={() => appendValue('5')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          5
        </button>
        <button
          id="btn-6"
          type="button"
          onClick={() => appendValue('6')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          6
        </button>
        <button
          id="btn-mult"
          type="button"
          onClick={() => appendValue('×')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-800 dark:text-sky-200 transition active:scale-95 cursor-pointer"
          title="Multiplication"
        >
          ×
        </button>
        <button
          id="btn-minus"
          type="button"
          onClick={() => appendValue('-')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-800 dark:text-sky-200 transition active:scale-95 cursor-pointer"
          title="Subtraction"
        >
          −
        </button>

        {/* Row 7: 1 2 3 + = */}
        <button
          id="btn-1"
          type="button"
          onClick={() => appendValue('1')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          1
        </button>
        <button
          id="btn-2"
          type="button"
          onClick={() => appendValue('2')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          2
        </button>
        <button
          id="btn-3"
          type="button"
          onClick={() => appendValue('3')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          3
        </button>
        <button
          id="btn-plus"
          type="button"
          onClick={() => appendValue('+')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-800 dark:text-sky-200 transition active:scale-95 cursor-pointer"
          title="Addition"
        >
          +
        </button>
        <button
          id="btn-equal-row7"
          type="button"
          onClick={calculate}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
          title="Calculate Equals"
        >
          =
        </button>

        {/* Row 8: 0 (span 2), ., C, = */}
        <button
          id="btn-0"
          type="button"
          onClick={() => appendValue('0')}
          className="col-span-2 min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-base sm:text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          0
        </button>
        <button
          id="btn-dot"
          type="button"
          onClick={() => appendValue('.')}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600/70 text-slate-900 dark:text-white transition active:scale-95 cursor-pointer"
        >
          .
        </button>
        <button
          id="btn-c"
          type="button"
          onClick={clearCurrent}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 transition active:scale-95 cursor-pointer"
          title="Clear Current Entry"
        >
          C
        </button>
        <button
          id="btn-equal"
          type="button"
          onClick={calculate}
          className="min-h-[46px] sm:min-h-[50px] rounded-xl font-bold text-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
          title="Calculate Equals"
        >
          =
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Tip: Use keyboard numbers, + − * / % ^, Enter for =, Esc for AC</span>
        <span className="hidden sm:inline">Diploma Engineering Standard</span>
      </div>
    </div>
  );
};
