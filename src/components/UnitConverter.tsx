import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Check, Copy } from 'lucide-react';

interface UnitConverterProps {
  onSendToCalculator: (val: string) => void;
}

interface ConversionType {
  id: string;
  name: string;
  category: string;
  formula: string;
  convert: (v: number) => number;
}

const CONVERSIONS: ConversionType[] = [
  // Original HTML options
  { id: 'mkm', name: 'Meter → Kilometer', category: 'Length', formula: 'val / 1000', convert: (v) => v / 1000 },
  { id: 'kmm', name: 'Kilometer → Meter', category: 'Length', formula: 'val * 1000', convert: (v) => v * 1000 },
  { id: 'cmkm', name: 'Centimeter → Kilometer', category: 'Length', formula: 'val / 100000', convert: (v) => v / 100000 },
  { id: 'kggram', name: 'Kilogram → Gram', category: 'Mass', formula: 'val * 1000', convert: (v) => v * 1000 },
  { id: 'gramkg', name: 'Gram → Kilogram', category: 'Mass', formula: 'val / 1000', convert: (v) => v / 1000 },
  { id: 'celsiusF', name: 'Celsius → Fahrenheit', category: 'Temperature', formula: '(val * 9/5) + 32', convert: (v) => (v * 9) / 5 + 32 },
  { id: 'fahrenheitC', name: 'Fahrenheit → Celsius', category: 'Temperature', formula: '(val - 32) * 5/9', convert: (v) => ((v - 32) * 5) / 9 },

  // Engineering extensions
  { id: 'mcm', name: 'Meter → Centimeter', category: 'Length', formula: 'val * 100', convert: (v) => v * 100 },
  { id: 'cmm', name: 'Centimeter → Meter', category: 'Length', formula: 'val / 100', convert: (v) => v / 100 },
  { id: 'mminch', name: 'Millimeter → Inch', category: 'Length', formula: 'val / 25.4', convert: (v) => v / 25.4 },
  { id: 'inchmm', name: 'Inch → Millimeter', category: 'Length', formula: 'val * 25.4', convert: (v) => v * 25.4 },
  { id: 'ftm', name: 'Feet → Meter', category: 'Length', formula: 'val * 0.3048', convert: (v) => v * 0.3048 },
  { id: 'mft', name: 'Meter → Feet', category: 'Length', formula: 'val / 0.3048', convert: (v) => v / 0.3048 },

  { id: 'kglb', name: 'Kilogram → Pound (lb)', category: 'Mass', formula: 'val * 2.20462', convert: (v) => v * 2.20462 },
  { id: 'lbkg', name: 'Pound (lb) → Kilogram', category: 'Mass', formula: 'val / 2.20462', convert: (v) => v / 2.20462 },

  { id: 'celsiusK', name: 'Celsius → Kelvin', category: 'Temperature', formula: 'val + 273.15', convert: (v) => v + 273.15 },
  { id: 'kelvinC', name: 'Kelvin → Celsius', category: 'Temperature', formula: 'val - 273.15', convert: (v) => v - 273.15 },

  { id: 'barpsi', name: 'Bar → PSI', category: 'Pressure', formula: 'val * 14.5038', convert: (v) => v * 14.5038 },
  { id: 'psibar', name: 'PSI → Bar', category: 'Pressure', formula: 'val / 14.5038', convert: (v) => v / 14.5038 },
  { id: 'barpa', name: 'Bar → Pascal (Pa)', category: 'Pressure', formula: 'val * 100000', convert: (v) => v * 100000 },
  { id: 'pabar', name: 'Pascal (Pa) → Bar', category: 'Pressure', formula: 'val / 100000', convert: (v) => v / 100000 },

  { id: 'wkw', name: 'Watts → Kilowatts (kW)', category: 'Power', formula: 'val / 1000', convert: (v) => v / 1000 },
  { id: 'kww', name: 'Kilowatts (kW) → Watts', category: 'Power', formula: 'val * 1000', convert: (v) => v * 1000 },
  { id: 'kwhp', name: 'Kilowatt (kW) → Horsepower (HP)', category: 'Power', formula: 'val * 1.34102', convert: (v) => v * 1.34102 },
  { id: 'hpkw', name: 'Horsepower (HP) → Kilowatt (kW)', category: 'Power', formula: 'val / 1.34102', convert: (v) => v / 1.34102 },

  { id: 'degrad', name: 'Degrees → Radians', category: 'Angle', formula: 'val * π / 180', convert: (v) => (v * Math.PI) / 180 },
  { id: 'raddeg', name: 'Radians → Degrees', category: 'Angle', formula: 'val * 180 / π', convert: (v) => (v * 180) / Math.PI },
];

export const UnitConverter: React.FC<UnitConverterProps> = ({ onSendToCalculator }) => {
  const [conversionType, setConversionType] = useState<string>('mkm');
  const [inputValue, setInputValue] = useState<string>('1000');
  const [resultText, setResultText] = useState<string>('');
  const [numericResult, setNumericResult] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedConversion = CONVERSIONS.find((c) => c.id === conversionType) || CONVERSIONS[0];

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResultText('Please enter a valid number');
      setNumericResult(null);
      return;
    }

    const res = selectedConversion.convert(val);
    const formatted = Number(res.toFixed(6));
    setNumericResult(formatted);
    setResultText(`Result = ${formatted}`);
  };

  const copyResult = () => {
    if (numericResult === null) return;
    navigator.clipboard.writeText(numericResult.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🔄</span> Engineering Unit Converter
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">High precision conversion</span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Conversion Category & Type
          </label>
          <select
            id="conversion"
            value={conversionType}
            onChange={(e) => {
              setConversionType(e.target.value);
              setResultText('');
              setNumericResult(null);
            }}
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <optgroup label="Standard Units (User Quick Select)">
              <option value="mkm">Meter → Kilometer</option>
              <option value="kmm">Kilometer → Meter</option>
              <option value="cmkm">Centimeter → Kilometer</option>
              <option value="kggram">Kilogram → Gram</option>
              <option value="gramkg">Gram → Kilogram</option>
              <option value="celsiusF">Celsius → Fahrenheit</option>
              <option value="fahrenheitC">Fahrenheit → Celsius</option>
            </optgroup>
            <optgroup label="Length / Dimensions">
              <option value="mcm">Meter → Centimeter</option>
              <option value="cmm">Centimeter → Meter</option>
              <option value="mminch">Millimeter → Inch</option>
              <option value="inchmm">Inch → Millimeter</option>
              <option value="ftm">Feet → Meter</option>
              <option value="mft">Meter → Feet</option>
            </optgroup>
            <optgroup label="Mass & Weight">
              <option value="kglb">Kilogram → Pound (lb)</option>
              <option value="lbkg">Pound (lb) → Kilogram</option>
            </optgroup>
            <optgroup label="Temperature">
              <option value="celsiusK">Celsius → Kelvin</option>
              <option value="kelvinC">Kelvin → Celsius</option>
            </optgroup>
            <optgroup label="Pressure (Fluid & Mechanical)">
              <option value="barpsi">Bar → PSI</option>
              <option value="psibar">PSI → Bar</option>
              <option value="barpa">Bar → Pascal (Pa)</option>
              <option value="pabar">Pascal (Pa) → Bar</option>
            </optgroup>
            <optgroup label="Power & Electrical">
              <option value="wkw">Watts → Kilowatts (kW)</option>
              <option value="kww">Kilowatts (kW) → Watts</option>
              <option value="kwhp">Kilowatt (kW) → Horsepower (HP)</option>
              <option value="hpkw">Horsepower (HP) → Kilowatt (kW)</option>
            </optgroup>
            <optgroup label="Angles">
              <option value="degrad">Degrees → Radians</option>
              <option value="raddeg">Radians → Degrees</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Input Value to Convert
          </label>
          <input
            id="convertValue"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConvert();
            }}
            placeholder="Enter value"
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          id="convert-btn"
          type="button"
          onClick={handleConvert}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm active:scale-95"
        >
          Convert
        </button>

        {resultText && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 id="convertResult" className="text-lg font-bold text-slate-900 dark:text-white">
                {resultText}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Formula: {selectedConversion.name} ({selectedConversion.formula})
              </p>
            </div>

            {numericResult !== null && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md font-medium cursor-pointer transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={() => onSendToCalculator(numericResult.toString())}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-md font-medium cursor-pointer transition border border-blue-200 dark:border-blue-800"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Send to Calc
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
