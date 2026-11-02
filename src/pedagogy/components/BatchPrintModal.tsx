import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  CheckSquare,
  Square,
  FileText,
  Layers,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Settings,
  Sparkles,
  HelpCircle,
  Eye,
  AlertCircle,
} from "lucide-react";
import { ExamConfigBlueprintJSON } from "../utils/examConfigStorage";
import { computeBookletImpositionSpreads } from "../utils/pdfExporter";

export interface BatchPrintItem {
  id: string;
  category: "CURRENT_DOCUMENT" | "SAVED_BLUEPRINT";
  titleAr: string;
  titleFr: string;
  badge: string;
  pagesEstimated: number;
  orientation: "PORTRAIT" | "LANDSCAPE";
  selected: boolean;
  descriptionAr: string;
  descriptionFr: string;
  blueprint?: ExamConfigBlueprintJSON;
}

export interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocTitle: string;
  trackLabel: string;
  examModel: "A" | "B" | "BOTH";
  savedBlueprints?: ExamConfigBlueprintJSON[];
  onExecuteBatchPrint: (items: BatchPrintItem[], options: BatchPrintOptions) => void;
}

export interface BatchPrintOptions {
  forcePageBreak: boolean;
  includeStudentWorkbookGrid: boolean;
  studentGridStyle: "SEYES_FRENCH" | "LINED_RULED" | "MILLIMETER_GRID" | "DOTTED_BOX";
  numberPagesSequentially: boolean;
  separateTeacherGuide: boolean;
  bookletMode: boolean;
  bookletBindingEdge: "RTL_RIGHT" | "LTR_LEFT";
  bookletAddFoldGuides: boolean;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  currentDocTitle,
  trackLabel,
  examModel,
  savedBlueprints = [],
  onExecuteBatchPrint,
}) => {
  const initialItems = useMemo<BatchPrintItem[]>(() => {
    const list: BatchPrintItem[] = [
      {
        id: "doc_model_a",
        category: "CURRENT_DOCUMENT",
        titleAr: "النموذج (أ) — موضوع الفرض المحروس للمترشح (Sujet Modèle A)",
        titleFr: "Sujet d'Épreuve — Modèle A (Format officiel A4)",
        badge: "Modèle A",
        pagesEstimated: 2,
        orientation: "PORTRAIT",
        selected: true,
        descriptionAr: "ورقة الفرض المحروس الرسمية النموذج A للتوزيع داخل القاعة.",
        descriptionFr: "Énoncé officiel destiné aux candidats pour le sujet A.",
      },
      {
        id: "doc_model_b",
        category: "CURRENT_DOCUMENT",
        titleAr: "النموذج (ب) — النسخة التوأمية الموازية لتفادي الغش (Sujet Modèle B)",
        titleFr: "Sujet Parallèle Isomorphe — Modèle B (Anti-fraude)",
        badge: "Modèle B",
        pagesEstimated: 2,
        orientation: "PORTRAIT",
        selected: examModel === "BOTH" || examModel === "B",
        descriptionAr: "نسخة مكافئة بنفس المعايير والأوزان مع معطيات عددية مغايرة لمنع التواصل بين الصفوف.",
        descriptionFr: "Sujet isomorphe conservant le même niveau avec variantes numériques.",
      },
      {
        id: "doc_solutions_annex",
        category: "CURRENT_DOCUMENT",
        titleAr: "الملحق الرسمي لعناصر الإجابة وسلم التنقيط المفصل (Corrigé & Barème)",
        titleFr: "Annexe Officielle : Corrigé Détaillé & Grille de Notation",
        badge: "Corrigé",
        pagesEstimated: 2,
        orientation: "PORTRAIT",
        selected: true,
        descriptionAr: "دليل التصحيح التفصيلي مع عناصر الإجابة وسلم التنقيط الجزئي [ن] للمصحح.",
        descriptionFr: "Barème détaillé question par question et démarches attendues.",
      },
      {
        id: "doc_eval_grid",
        category: "CURRENT_DOCUMENT",
        titleAr: "شبكة التقويم التوليفي وتفريغ نتائج القسم (Grille d'Évaluation)",
        titleFr: "Grille d'Évaluation Sommative & Bilan des Compétences",
        badge: "Évaluation",
        pagesEstimated: 1,
        orientation: "LANDSCAPE",
        selected: false,
        descriptionAr: "شبكة رصد نسب التحكم في الكفايات ومعدلات التلاميذ ومعدل القسم الإجمالي.",
        descriptionFr: "Tableau horizontal pour la saisie et le suivi des réussites par question.",
      },
      {
        id: "doc_remediation_sheet",
        category: "CURRENT_DOCUMENT",
        titleAr: "خطة الدعم البيداغوجي والمعالجة الفارقية (Fiche de Remédiation)",
        titleFr: "Dispositif de Soutien & Remédiation Différenciée (Note 142-08)",
        badge: "Remédiation",
        pagesEstimated: 1,
        orientation: "PORTRAIT",
        selected: false,
        descriptionAr: "تفييء المتعلمين إلى 3 مجموعات علاجية حسب مواطن التعثر ورصد الأخطاء المتكررة.",
        descriptionFr: "Groupes de besoin A/B/C et exercices ciblés d'après les erreurs du devoir.",
      },
      {
        id: "doc_cover_cahier_textes",
        category: "CURRENT_DOCUMENT",
        titleAr: "البطاقة التقنية والإحصائية لملف الأستاذ ودفتر النصوص (Fiche Technique)",
        titleFr: "Fiche Technique Officielle & Cahier de Textes / Inspection",
        badge: "Dossier",
        pagesEstimated: 1,
        orientation: "PORTRAIT",
        selected: false,
        descriptionAr: "ورقة الغلاف الرسمية المعتمدة لدى المفتش التربوي وإدارة المؤسسة.",
        descriptionFr: "Document administratif pour le cahier de textes et dossier d'inspection.",
      },
      {
        id: "doc_formula_sheet",
        category: "CURRENT_DOCUMENT",
        titleAr: "تذكرة القوانين والصيغ المرجعية المركزة (Formulaire de Mathématiques)",
        titleFr: "Formulaire & Aide-Mémoire Mathématique (Annexes)",
        badge: "Formulaire",
        pagesEstimated: 1,
        orientation: "PORTRAIT",
        selected: false,
        descriptionAr: "ملحق اختياري يرفق بالورقة يتضمن القواعد الرياضية الرسمية المعتمدة.",
        descriptionFr: "Formules officielles de dérivation, primitives, probabilités et trigonométrie.",
      },
    ];

    // إضافة الفروض المحفوظة مسبقاً في الخزانة
    savedBlueprints.forEach((bp, idx) => {
      list.push({
        id: `saved_bp_${idx}`,
        category: "SAVED_BLUEPRINT",
        titleAr: `خزانة الفروض: ${bp.meta.configName || "فرض محفوظ"} (${bp.identity.year})`,
        titleFr: `Archive : ${bp.meta.configName || "Devoir archivé"}`,
        badge: bp.examStructure.dsKey || "DS",
        pagesEstimated: 2,
        orientation: bp.appearanceAndExport.pageOrientation || "PORTRAIT",
        selected: false,
        descriptionAr: `فرض مخزن في الأرشيف لمسلك ${bp.examStructure.selectedTrackCode || trackLabel}.`,
        descriptionFr: "Configuration enregistrée dans le coffre-fort numérique.",
        blueprint: bp,
      });
    });

    return list;
  }, [examModel, savedBlueprints, trackLabel]);

  const [queue, setQueue] = useState<BatchPrintItem[]>(initialItems);
  const [options, setOptions] = useState<BatchPrintOptions>({
    forcePageBreak: true,
    includeStudentWorkbookGrid: false,
    studentGridStyle: "SEYES_FRENCH",
    numberPagesSequentially: true,
    separateTeacherGuide: true,
    bookletMode: false,
    bookletBindingEdge: "RTL_RIGHT",
    bookletAddFoldGuides: true,
  });

  const selectedItems = queue.filter((item) => item.selected);
  const totalEstimatedPages = selectedItems.reduce(
    (sum, item) => sum + item.pagesEstimated,
    0
  );

  const bookletPlan = useMemo(
    () =>
      computeBookletImpositionSpreads(
        Math.max(1, totalEstimatedPages),
        options.bookletBindingEdge
      ),
    [totalEstimatedPages, options.bookletBindingEdge]
  );

  if (!isOpen) return null;

  const handleToggleItem = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = (select: boolean) => {
    setQueue((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= queue.length) return;
    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[targetIndex];
    newQueue[targetIndex] = temp;
    setQueue(newQueue);
  };

  const handleStartPrint = () => {
    if (selectedItems.length === 0) return;
    onExecuteBatchPrint(selectedItems, options);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 no-print">
      <div
        dir="rtl"
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* الترويسة العلوية للمودال */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-cyan-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-serif text-lg font-black shadow-md">
              <Printer className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  Batch Print & Booklet Imposition
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  طابور الطباعة المجمعة وتخطيط الكتيب A4 → A5
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                طباعة حزمة الوثائق والفروض أو توليد كتيب مطوي تلقائي (Booklet)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم المودال القابل للتمرير */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-5">
          {/* شريط الإحصاءات السريعة وحالة الطابور */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center">
                <span className="font-mono font-black text-base text-indigo-950">
                  {selectedItems.length}
                </span>
                <span className="text-[9.5px] font-bold text-slate-500">وثائق</span>
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  حزمة الطباعة المجهزة: {currentDocTitle}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-indigo-900">{trackLabel}</span>
                  <span>·</span>
                  <span>
                    العدد التقديري:{" "}
                    <strong className="font-mono text-indigo-900">
                      ~{totalEstimatedPages} صفحات
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">
                    {options.bookletMode
                      ? `تخطيط كتيب مطوي (${bookletPlan.physicalA4Sheets} أوراق A4 ← ${bookletPlan.paddedBookletPages} ص A5)`
                      : "فواصل الصفحات والتوجيه مؤمنة"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                تحديد الكل
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>

          {/* خيارات تدبير الطباعة وفواصل الصفحات وكراسة التلميذ وتخطيط الكتيب */}
          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-3">
            <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-700" />
              <span>إعدادات الفصل الطباعي، كراسة التلميذ، وتخطيط الكتيب المطوي (Booklet):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-indigo-100 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={options.forcePageBreak}
                  onChange={(e) =>
                    setOptions({ ...options, forcePageBreak: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                />
                <span>فاصل صفحات إجباري (Page Break) بين كل وثيقة والأخرى</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-indigo-100 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={options.numberPagesSequentially}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      numberPagesSequentially: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                />
                <span>ترقيم تسلسلي تراكمي لكامل حزمة الطباعة (مثلاً 1 إلى 8)</span>
              </label>

              {/* خيار طباعة بتخطيط "كتيب" (Booklet) تلقائي لطي الورق A4 إلى A5 */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border-2 border-teal-600/40 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2.5 font-black text-teal-950 cursor-pointer text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={options.bookletMode}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          bookletMode: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-teal-700 accent-teal-700"
                    />
                    <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>
                      طباعة بتخطيط «كتيب» تلقائي (Booklet Imposition) — طي الورق A4 إلى A5
                    </span>
                  </label>
                  <span className="text-[10.5px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    ترتيب Saddle-Stitch تلقائي لمضاعفات 4 صفحات
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  يقوم هذا الخيار بترتيب صفحات الوثيقة تلقائياً بنظام <strong>(Saddle-Stitch Booklet)</strong> على أوراق <strong>A4 أفقية (Landscape)</strong> بحيث عند طباعتها على الوجهين (Recto/Verso) وطي الورقة من المنتصف تتحول إلى كتيب امتحان <strong>A5</strong> مرتب الصفحات بدقة.
                </p>

                {options.bookletMode && (
                  <div className="pt-2.5 border-t border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-700">
                          اتجاه طي الكتيب والغلاف:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setOptions({ ...options, bookletBindingEdge: "RTL_RIGHT" })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                            options.bookletBindingEdge === "RTL_RIGHT"
                              ? "bg-teal-900 text-white border-teal-950"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          طي عربي من اليمين (RTL — الصفحة 1 يميناً)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setOptions({ ...options, bookletBindingEdge: "LTR_LEFT" })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                            options.bookletBindingEdge === "LTR_LEFT"
                              ? "bg-teal-900 text-white border-teal-950"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          طي فرنسي/دولي من اليسار (LTR — المسالك الدولية)
                        </button>
                      </div>

                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.bookletAddFoldGuides}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              bookletAddFoldGuides: e.target.checked,
                            })
                          }
                          className="w-3.5 h-3.5 rounded text-teal-700 accent-teal-700"
                        />
                        <span>إدراج خط الطي الوسطي (✂) وصفحات المسودة التكميلية</span>
                      </label>
                    </div>

                    {/* معاينة خريطة ترتيب الصفحات للطي (Booklet Spread Map) */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="font-black text-slate-900">
                          خريطة ترتيب الصفحات التلقائية للطي (A4 Landscape → A5 Booklet):
                        </span>
                        <span className="font-mono font-bold text-teal-800">
                          {bookletPlan.originalPages} ص أصلية ← {bookletPlan.paddedBookletPages} ص كتيب ({bookletPlan.physicalA4Sheets} ورقة A4 وجه/ظهر)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        {bookletPlan.spreads.map((sp, sIdx) => (
                          <div
                            key={`${sp.sheetIndex}_${sp.side}_${sIdx}`}
                            className="bg-white p-2 rounded-lg border border-slate-200 text-center space-y-1.5"
                          >
                            <div className="text-[10px] font-black text-slate-700 border-b border-slate-100 pb-1">
                              {sp.sideLabelAr}
                            </div>
                            <div
                              dir="ltr"
                              className="grid grid-cols-2 gap-1 items-center font-mono text-[11px]"
                            >
                              <div
                                className={`py-1.5 px-1 rounded border ${
                                  sp.isLeftBlankPadding
                                    ? "bg-amber-50/70 border-amber-200 text-amber-800"
                                    : "bg-teal-50/70 border-teal-200 text-teal-950 font-black"
                                }`}
                              >
                                ص {sp.leftPageNumber}
                                {sp.isLeftBlankPadding && (
                                  <span className="block text-[8.5px] font-normal">
                                    (مسودة)
                                  </span>
                                )}
                              </div>
                              <div
                                className={`py-1.5 px-1 rounded border ${
                                  sp.isRightBlankPadding
                                    ? "bg-amber-50/70 border-amber-200 text-amber-800"
                                    : "bg-teal-50/70 border-teal-200 text-teal-950 font-black"
                                }`}
                              >
                                ص {sp.rightPageNumber}
                                {sp.isRightBlankPadding && (
                                  <span className="block text-[8.5px] font-normal">
                                    (مسودة)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* تفعيل كراسة التلميذ (Devoir sur table) مع أسطر التحرير الشبكية */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-white border border-indigo-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 font-black text-indigo-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeStudentWorkbookGrid}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          includeStudentWorkbookGrid: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                    />
                    <span>
                      ✍️ تحويل الفرض إلى «كراسة التلميذ» (Devoir sur table imprimable)
                    </span>
                  </label>
                  <span className="text-[10.5px] font-bold text-slate-500">
                    أسطر شبكية ومسطرة تحت كل سؤال ليكتب التلميذ حله مباشرة
                  </span>
                </div>

                {options.includeStudentWorkbookGrid && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      نوع الأسطر والشبكة المطبوعة:
                    </span>
                    {(
                      [
                        { id: "SEYES_FRENCH", label: "📓 دفتر مدرسي Seyès (2mm)" },
                        { id: "LINED_RULED", label: "📏 أسطر كلاسيكية مسطرة (8mm)" },
                        { id: "MILLIMETER_GRID", label: "📐 شبكة مليمترية هندسية" },
                        { id: "DOTTED_BOX", label: "⬝ نقاط رياضية (Pointillés)" },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() =>
                          setOptions({
                            ...options,
                            studentGridStyle: st.id,
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          options.studentGridStyle === st.id
                            ? "bg-indigo-950 text-amber-300 border-indigo-900 shadow-2xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قائمة الوثائق في طابور الطباعة */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-800 px-1">
              <span>الوثائق المدرجة في طابور الطباعة (يمكنك ترتيبها وتحديد ما ترغب بفرزه):</span>
              <span className="text-[11px] text-slate-500 font-normal">
                استخدم أزرار الأسهم لتقديم أو تأخير الوثيقة في أمر الطباعة
              </span>
            </div>

            <div className="space-y-2">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    item.selected
                      ? "bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-400/20"
                      : "bg-white/60 border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleItem(item.id)}
                      className="mt-0.5 text-indigo-700 hover:text-indigo-900 cursor-pointer shrink-0"
                    >
                      {item.selected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">
                          {item.titleAr}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {item.badge}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-900">
                          {item.orientation === "LANDSCAPE" ? "أفقي" : "عمودي A4"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (~{item.pagesEstimated} ص)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.descriptionAr}
                      </p>
                    </div>
                  </div>

                  {/* أزرار التقديم والتأخير في الطابور */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, "up")}
                      className="p-1 rounded text-slate-400 hover:text-indigo-900 disabled:opacity-30 cursor-pointer"
                      title="تقديم في الطابور"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === queue.length - 1}
                      onClick={() => handleMoveItem(index, "down")}
                      className="p-1 rounded text-slate-400 hover:text-indigo-900 disabled:opacity-30 cursor-pointer"
                      title="تأخير في الطابور"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* شريط الإجراءات السفلي */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-bold text-slate-700">
            {selectedItems.length > 0 ? (
              options.bookletMode ? (
                <span className="text-teal-900">
                  سيتم توليد <strong>كتيب مطوي تلقائي (Booklet A4 → A5)</strong> مرتب الصفحات في{" "}
                  <strong className="font-mono">{bookletPlan.physicalA4Sheets} أوراق A4 أفقية</strong>{" "}
                  ({bookletPlan.paddedBookletPages} صفحة A5).
                </span>
              ) : (
                <span>
                  سيتم إرسال{" "}
                  <strong className="text-indigo-950 font-black">
                    {selectedItems.length} وثائق
                  </strong>{" "}
                  إلى طابعة النظام مع إدراج فواصل الصفحات تلقائياً.
                </span>
              )
            ) : (
              <span className="text-rose-600">
                يرجى تحديد وثيقة واحدة على الأقل لبدء الطباعة المجمعة.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={handleStartPrint}
              className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center gap-2 transition disabled:opacity-40 cursor-pointer ${
                options.bookletMode
                  ? "bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white shadow-teal-700/20"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/20"
              }`}
            >
              {options.bookletMode ? (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>
                    تصدير وطباعة كتيب A4 → A5 ({bookletPlan.physicalA4Sheets} أوراق A4)
                  </span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>بدء الطباعة المجمعة الآن (~{totalEstimatedPages} صفحات)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
