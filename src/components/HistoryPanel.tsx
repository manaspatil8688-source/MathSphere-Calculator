import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Calculator, Copy, Trash2, Check } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSendToCalculator: (val: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onSendToCalculator,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyItem = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🕘</span> Calculation History
        </h2>
        {history.length > 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {history.length} {history.length === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div id="historyList" className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No calculations yet.
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={item.id}
                className="history-item flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500/50 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                    {index + 1}. {item.expression} =
                  </div>
                  <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {item.result}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => copyItem(item.id, item.result)}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                    title="Copy Result"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToCalculator(item.result)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded font-medium transition cursor-pointer border border-blue-200 dark:border-blue-800"
                    title="Insert result into calculator"
                  >
                    <Calculator className="w-3 h-3" />
                    Use
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600 flex justify-end">
            <button
              id="clear-history-btn"
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-900 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
