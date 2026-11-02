/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * محدد التوجيهات والتعليمات الرسمية لإجراء الفروض المحروسة والامتحانات
 * Sélecteur de Consignes Officielles des Examens de Mathématiques
 */

import React from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  FileText,
  Percent,
  Scale,
  Sparkles,
} from "lucide-react";
import {
  DidacticConsigneItem,
  OFFICIAL_DIDACTIC_CONSIGNES,
} from "../data/didacticConsignes";

export interface ExamConsignesSelectorProps {
  selectedConsigneKeys: string[];
  onChangeConsigneKeys: (keys: string[]) => void;
  isFr?: boolean;
}

export const ExamConsignesSelector: React.FC<ExamConsignesSelectorProps> = ({
  selectedConsigneKeys,
  onChangeConsigneKeys,
  isFr = false,
}) => {
  const toggleKey = (key: string) => {
    if (selectedConsigneKeys.includes(key)) {
      onChangeConsigneKeys(selectedConsigneKeys.filter((k) => k !== key));
    } else {
      onChangeConsigneKeys([...selectedConsigneKeys, key]);
    }
  };

  return (
    <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 text-xs text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-700" />
          <span className="font-black text-slate-900">
            مكتبة التوجيهات والتعليمات الرسمية للامتحان (تظهر في الترويسة المطبوعة):
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
          {selectedConsigneKeys.length} مفعلة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {OFFICIAL_DIDACTIC_CONSIGNES.map((item) => {
          const isActive = selectedConsigneKeys.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleKey(item.key)}
              className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex items-start gap-2 ${
                isActive
                  ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-300 bg-slate-50"
                }`}
              >
                {isActive && <Check className="w-3 h-3" />}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="font-black text-[11px] block text-slate-900 truncate">
                  {isFr ? item.titleFr : item.titleAr}
                </span>
                <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                  {isFr ? item.bodyFr : item.bodyAr}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
