import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Archive,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FileCode2,
  FileJson,
  FolderOpen,
  Laptop,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { isLocalEncryptionEnabled } from "../utils/cryptoStorage";
import { CURRICULUM_DB } from "../data/curriculum";
import {
  capturePortableLocalStorageSnapshot,
  deleteExamArchiveFromIndexedDB,
  downloadExamConfigAsJSON,
  ExamConfigBlueprintJSON,
  exportAllArchivesBackupJSON,
  importArchivesBatchToIndexedDB,
  loadExamArchivesFromIndexedDB,
  loadSavedConfigVault,
  restorePortableLocalStorageSnapshot,
  saveExamArchiveToIndexedDB,
  SavedLocalConfigPreset,
  validateAndNormalizeExamConfigJSON,
} from "../utils/examConfigStorage";

export interface ExamConfigStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlueprint: ExamConfigBlueprintJSON;
  onApplyBlueprint: (
    blueprint: ExamConfigBlueprintJSON,
    options: { keepCurrentIdentity: boolean }
  ) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}

export const ExamConfigStorageModal: React.FC<ExamConfigStorageModalProps> = ({
  isOpen,
  onClose,
  currentBlueprint,
  onApplyBlueprint,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<"EXPORT" | "IMPORT" | "VAULT">(
    "EXPORT"
  );
  const [configName, setConfigName] = useState<string>(
    currentBlueprint.meta.configName || ""
  );
  const [configNotes, setConfigNotes] = useState<string>(
    currentBlueprint.meta.notes || ""
  );
  const [includeExtendedStorageSnapshot, setIncludeExtendedStorageSnapshot] =
    useState<boolean>(true);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // حالة الاستيراد والفحص والسحب والإفلات
  const [rawJsonInput, setRawJsonInput] = useState<string>("");
  const [keepCurrentIdentity, setKeepCurrentIdentity] =
    useState<boolean>(false);
  const [restoreStorageSnapshotOnImport, setRestoreStorageSnapshotOnImport] =
    useState<boolean>(true);
  const [importedFileName, setImportedFileName] = useState<string>("");
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [validationState, setValidationState] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    blueprint?: ExamConfigBlueprintJSON;
    bundledArchives?: SavedLocalConfigPreset[];
  } | null>(null);

  // خزانة القوالب المحفوظة محلياً
  const [vaultPresets, setVaultPresets] = useState<SavedLocalConfigPreset[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfigName(currentBlueprint.meta.configName);
      setConfigNotes(currentBlueprint.meta.notes || "");
      loadExamArchivesFromIndexedDB()
        .then((presets) => setVaultPresets(presets))
        .catch(() => setVaultPresets(loadSavedConfigVault()));
    }
  }, [isOpen, currentBlueprint]);

  if (!isOpen) return null;

  const portableSnapshot = includeExtendedStorageSnapshot
    ? capturePortableLocalStorageSnapshot()
    : undefined;

  const preparedBlueprint: ExamConfigBlueprintJSON = {
    ...currentBlueprint,
    meta: {
      ...currentBlueprint.meta,
      schemaVersion: "3.0.0",
      exportedAt: new Date().toISOString(),
      configName:
        configName.trim() ||
        `${currentBlueprint.examStructure.selectedTrackCode} - ${currentBlueprint.examStructure.dsKey}`,
      notes: configNotes.trim(),
      deviceHint:
        typeof navigator !== "undefined" ? navigator.platform || "Web" : "Web",
    },
    workspaceExtensions: {
      ...(currentBlueprint.workspaceExtensions || {}),
      localStorageSnapshot: portableSnapshot,
    },
  };

  const trackInfo =
    CURRICULUM_DB[currentBlueprint.examStructure.selectedTrackCode] ||
    CURRICULUM_DB["2BAC_PC"];

  // تحميل ملف JSON مباشرة على جهاز الأستاذ
  const handleDownloadJsonFile = () => {
    const safeTitle = (configName.trim() || "Workspace_Maths_Studio")
      .replace(/[^\w\u0600-\u06FF\-_]+/g, "_")
      .slice(0, 45);
    const fileName = `${safeTitle}_${currentBlueprint.examStructure.selectedTrackCode}_${currentBlueprint.examStructure.dsKey}.json`;
    downloadExamConfigAsJSON(preparedBlueprint, fileName);
    onNotify(
      "success",
      `تم تصدير وتحميل ملف مساحة العمل الشاملة (${fileName}) بنجاح! يمكنك فتحه على أي حاسوب أو هاتف لاستكمال عملك.`
    );
  };

  // نسخ كود JSON إلى الحافظة
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(preparedBlueprint, null, 2)
      );
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
      onNotify("info", "تم نسخ حالة مساحة العمل الكاملة (JSON) إلى الحافظة.");
    } catch {
      onNotify("error", "تعذر النسخ إلى الحافظة.");
    }
  };

  // حفظ في الخزانة المحلية السريعة و IndexedDB
  const handleSaveToVault = async () => {
    const newPreset: SavedLocalConfigPreset = {
      id: `preset_${Date.now()}`,
      title:
        configName.trim() ||
        `${trackInfo.labelAr} (${currentBlueprint.examStructure.dsKey})`,
      savedAt: new Date().toISOString(),
      trackCode: currentBlueprint.examStructure.selectedTrackCode,
      module: currentBlueprint.examStructure.activeModule,
      blueprint: preparedBlueprint,
    };
    const updated = await saveExamArchiveToIndexedDB(newPreset);
    setVaultPresets(updated);
    setActiveTab("VAULT");
    onNotify(
      "success",
      `تم حفظ مساحة العمل « ${newPreset.title} » في الخزانة الموسعة (IndexedDB) بنجاح!`
    );
  };

  const processImportedJsonContent = (content: string, fileName?: string) => {
    if (fileName) setImportedFileName(fileName);
    setRawJsonInput(content);
    try {
      const parsed = JSON.parse(content);
      const res = validateAndNormalizeExamConfigJSON(parsed);
      setValidationState({
        valid: res.valid,
        errors: res.errors,
        warnings: res.warnings,
        blueprint: res.normalizedBlueprint,
        bundledArchives: res.bundledArchives,
      });
    } catch {
      setValidationState({
        valid: false,
        errors: [
          "تعذر قراءة صيغة JSON: الملف تالف أو لا يتبع صيغة JSON القياسية.",
        ],
        warnings: [],
      });
    }
  };

  // معالجة رفع ملف JSON من حاسوب أو هاتف الأستاذ
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      processImportedJsonContent(content, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // دعم السحب والإفلات المباشر لملف JSON
  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      processImportedJsonContent(content, file.name);
    };
    reader.readAsText(file);
  };

  // فحص النص الملصق يدوياً
  const handleValidateRawText = (text: string) => {
    setRawJsonInput(text);
    if (!text.trim()) {
      setValidationState(null);
      return;
    }
    processImportedJsonContent(text);
  };

  // تطبيق مساحة العمل المستوردة على التطبيق
  const handleConfirmImport = async () => {
    if (!validationState?.valid || !validationState.blueprint) return;

    if (
      restoreStorageSnapshotOnImport &&
      validationState.blueprint.workspaceExtensions?.localStorageSnapshot
    ) {
      restorePortableLocalStorageSnapshot(
        validationState.blueprint.workspaceExtensions.localStorageSnapshot
      );
    }

    if (
      validationState.bundledArchives &&
      validationState.bundledArchives.length > 0
    ) {
      const merged = await importArchivesBatchToIndexedDB(
        validationState.bundledArchives
      );
      setVaultPresets(merged);
    }

    onApplyBlueprint(validationState.blueprint, { keepCurrentIdentity });
    onClose();
  };

  const extCount =
    Object.keys(
      currentBlueprint.workspaceExtensions?.geoGebraResourcesMap || {}
    ).length +
    (currentBlueprint.workspaceExtensions?.insertedFigures?.length || 0) +
    (currentBlueprint.workspaceExtensions?.attachedPythonAlgorithms?.length ||
      0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* ترويسة النافذة */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-mono text-base font-black shadow-md shrink-0">
              {"{ }"}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/70">
                  Full Workspace State JSON
                </span>
                <span className="text-xs text-cyan-300 font-mono font-bold">
                  Schema v3.0.0 · Cross-Device Sync
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white truncate">
                حفظ واستيراد مساحة العمل الكاملة بين الأجهزة (ملف JSON شامل)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadJsonFile}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="تنزيل فوري لحالة مساحة العمل الكاملة كملف JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير سريع (.json)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* شريط التبويبات الثلاثية */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200 shrink-0 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("EXPORT")}
            className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "EXPORT"
                ? "bg-slate-900 text-amber-300 shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-white/70"
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>1. تصدير مساحة العمل (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("IMPORT")}
            className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "IMPORT"
                ? "bg-slate-900 text-cyan-300 shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-white/70"
            }`}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span>2. استيراد مساحة عمل (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("VAULT")}
            className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "VAULT"
                ? "bg-slate-900 text-emerald-300 shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-white/70"
            }`}
          >
            <Archive className="w-3.5 h-3.5 shrink-0" />
            <span>3. خزانة مساحاتي ({vaultPresets.length})</span>
          </button>
        </div>

        {/* محتوى التبويب الفعال */}
        <div className="p-4 sm:p-5 overflow-y-auto studio-scroll flex-1 space-y-4 text-xs">
          {activeTab === "EXPORT" && (
            <div className="space-y-4">
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-black text-amber-950 text-xs">
                    نقل مساحة العمل الكاملة بين الحاسوب واللوحة الرقمية والهاتف
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    يحفظ ملف <strong>Workspace JSON v3.0</strong> كافة إعداداتك:{" "}
                    <strong>الهوية والشعار</strong>،{" "}
                    <strong>الدروس والأوزان والأسئلة المخصصة وسلم التنقيط</strong>،{" "}
                    <strong>مصفوفة التخصيص 2D وتقييمات التلاميذ</strong>،{" "}
                    <strong>الخطوط وحزمة tcolorbox والتدرج اللوني</strong>، بالإضافة إلى{" "}
                    <strong>أنشطة GeoGebra والأشكال الهندسية وخوارزميات Python</strong>.
                  </p>
                </div>
              </div>

              {/* حقول تسمية ملف مساحة العمل وملاحظات الأستاذ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-black text-slate-800 block">
                    اسم ملف مساحة العمل :
                  </label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="مثال: فرض محروس رقم 1 - 2BAC PC (المتتاليات والاتصال)"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-black text-slate-800 block">
                    ملاحظة تذكيرية أو اسم الجهاز (اختياري) :
                  </label>
                  <input
                    type="text"
                    value={configNotes}
                    onChange={(e) => setConfigNotes(e.target.value)}
                    placeholder="مثال: نسخة العمل من حاسوب المنزل - جاهزة للطباعة بالمؤسسة"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              {/* خيار تضمين البيانات الممتدة والذاكرة المحلية */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExtendedStorageSnapshot}
                  onChange={(e) =>
                    setIncludeExtendedStorageSnapshot(e.target.checked)
                  }
                  className="w-4 h-4 rounded accent-indigo-700"
                />
                <div>
                  <span className="font-black text-slate-900 block">
                    تضمين لقطة الذاكرة المحلية الممتدة (تقييمات التلاميذ في مصفوفة 2D، سجل التصدير، وتفضيلات المحرك)
                  </span>
                  <span className="text-[10.5px] text-slate-600">
                    يضمن نقل جميع بياناتك المخزنة محلياً عند فتح الملف على متصفح أو جهاز آخر.
                  </span>
                </div>
              </label>

              {/* بطاقة الملخص الحي لما سيتم حفظه في ملف JSON */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-700" />
                    <span>مكونات مساحة العمل المضمنة في الملف:</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200">
                    {currentBlueprint.examStructure.selectedTrackCode} ·{" "}
                    {currentBlueprint.examStructure.semester} ·{" "}
                    {currentBlueprint.examStructure.dsKey}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-cyan-700" />
                      <span>التنقيط والمستويات</span>
                    </div>
                    <div className="font-black text-slate-900 font-mono text-[11px]">
                      N1:{currentBlueprint.gradingAndLessons.n1}% · N2:
                      {currentBlueprint.gradingAndLessons.n2}% · N3:
                      {currentBlueprint.gradingAndLessons.n3}%
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      ✓ يشمل سلم 20/20 ومصفوفة 2D
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                      <span>الدروس والأسئلة</span>
                    </div>
                    <div className="font-black text-slate-900">
                      {
                        currentBlueprint.gradingAndLessons.selectedLessonRefs
                          .length
                      }{" "}
                      دروس مفعلة
                    </div>
                    <div className="text-[10px] text-slate-600 truncate">
                      {currentBlueprint.gradingAndLessons.selectedLessonRefs
                        .map((r) => `${r.lessonAr} (${r.weight}%)`)
                        .join(" ، ")}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>المظهر وحزمة LaTeX</span>
                    </div>
                    <div className="font-black text-slate-900 font-mono text-[11px]">
                      Modèle {currentBlueprint.examStructure.examModel} ·{" "}
                      {currentBlueprint.appearanceAndExport.latexPackageTheme}
                    </div>
                    <div className="text-[10px] text-slate-600 truncate">
                      الخط: {currentBlueprint.appearanceAndExport.docFontFamily}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-emerald-700" />
                      <span>الملحقات والذاكرة</span>
                    </div>
                    <div className="font-black text-slate-900">
                      {extCount} ملحقات تفاعلية
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      {portableSnapshot
                        ? `✓ ${Object.keys(portableSnapshot).length} سجلات محلية`
                        : "إعدادات الوثيقة فقط"}
                    </div>
                  </div>
                </div>

                {/* معاينة سريعة لكود JSON */}
                <details className="group">
                  <summary className="cursor-pointer text-[11px] font-bold text-indigo-800 hover:underline flex items-center gap-1.5 select-none">
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>
                      معاينة البنية البرمجية الكاملة لملف مساحة العمل (JSON v3.0)
                    </span>
                  </summary>
                  <pre
                    dir="ltr"
                    className="mt-2 p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[10.5px] max-h-44 overflow-auto leading-relaxed"
                  >
                    {JSON.stringify(preparedBlueprint, null, 2)}
                  </pre>
                </details>
              </div>

              {/* أزرار التصدير والحفظ */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveToVault}
                    className="px-3.5 py-2.5 rounded-xl font-black text-xs bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Archive className="w-4 h-4" />
                    <span>حفظ في خزانة المتصفح</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-3 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span>نسخ JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadJsonFile}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف مساحة العمل الكاملة (.json)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "IMPORT" && (
            <div className="space-y-4">
              {/* منطقة رفع الملف أو السحب والإفلات */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDropFile}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition cursor-pointer space-y-2 ${
                  isDraggingOver
                    ? "border-cyan-500 bg-cyan-100/70 scale-[0.99]"
                    : "border-cyan-600/60 hover:border-cyan-600 bg-cyan-50/40 hover:bg-cyan-50/80"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-cyan-700 text-white flex items-center justify-center mx-auto shadow-sm">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div className="font-black text-sm text-slate-900">
                  {importedFileName
                    ? `الملف المحدد: ${importedFileName}`
                    : "اضغط لاختيار ملف مساحة العمل (.json) أو اسحبه وأفلته هنا"}
                </div>
                <p className="text-[11px] text-slate-600">
                  يدعم ملفات مساحة العمل الفردية (v3.0 / v2.0) وملفات النسخ الاحتياطي الشامل للأرشيف
                </p>
              </div>

              {/* خيارات الاستيراد */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepCurrentIdentity}
                    onChange={(e) => setKeepCurrentIdentity(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-indigo-700"
                  />
                  <div>
                    <span className="font-black text-slate-900 block">
                      الاحتفاظ باسم المؤسسة والأستاذ الحالي
                    </span>
                    <span className="text-[10.5px] text-slate-600">
                      مفيد عند استيراد فرض من زميل مع الإبقاء على ترويسة مؤسستك.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restoreStorageSnapshotOnImport}
                    onChange={(e) =>
                      setRestoreStorageSnapshotOnImport(e.target.checked)
                    }
                    className="w-4 h-4 mt-0.5 rounded accent-indigo-700"
                  />
                  <div>
                    <span className="font-black text-slate-900 block">
                      استعادة بيانات التقييم والذاكرة المرفقة
                    </span>
                    <span className="text-[10.5px] text-slate-600">
                      يسترجع تقييمات التلاميذ في مصفوفة 2D وسجل العمل من الجهاز السابق.
                    </span>
                  </div>
                </label>
              </div>

              {/* حقل لصق أو مراجعة محتوى JSON */}
              <div className="space-y-1.5">
                <label className="font-black text-slate-700 block">
                  محتوى ملف JSON (للتحقق أو اللصق المباشر):
                </label>
                <textarea
                  dir="ltr"
                  rows={4}
                  value={rawJsonInput}
                  onChange={(e) => handleValidateRawText(e.target.value)}
                  placeholder='{"meta": {"appIdentifier": "pedagogical-math-studio-lycee", "schemaVersion": "3.0.0"}, ...}'
                  className="w-full border border-slate-300 rounded-xl p-3 font-mono text-[11px] bg-slate-950 text-cyan-200 focus:border-cyan-500 outline-none"
                />
              </div>

              {/* نتيجة الفحص والتدقيق المسبق للملف */}
              {validationState && (
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    validationState.valid
                      ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                      : "bg-rose-50/90 border-rose-300 text-rose-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xs">
                      {validationState.valid ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>
                            ✓ ملف مساحة عمل صالح وجاهز للتحميل:{" "}
                            {validationState.blueprint?.meta.configName}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                          <span>خطأ في بنية ملف JSON المستورد</span>
                        </>
                      )}
                    </div>
                  </div>

                  {validationState.errors.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-1 font-semibold">
                      {validationState.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}

                  {validationState.warnings.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-1 font-semibold">
                      {validationState.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  )}

                  {validationState.valid && validationState.blueprint && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/80 text-[11px]">
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 block text-[10px]">
                          المسلك والفصل:
                        </span>
                        <strong className="font-mono">
                          {
                            validationState.blueprint.examStructure
                              .selectedTrackCode
                          }{" "}
                          · {validationState.blueprint.examStructure.semester} (
                          {validationState.blueprint.examStructure.dsKey})
                        </strong>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 block text-[10px]">
                          المستويات المهارية:
                        </span>
                        <strong className="font-mono">
                          {validationState.blueprint.gradingAndLessons.n1}% /{" "}
                          {validationState.blueprint.gradingAndLessons.n2}% /{" "}
                          {validationState.blueprint.gradingAndLessons.n3}%
                        </strong>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 block text-[10px]">
                          نمط الفرض:
                        </span>
                        <strong>
                          Modèle{" "}
                          {validationState.blueprint.examStructure.examModel} ·{" "}
                          {
                            validationState.blueprint.examStructure
                              .dsStructureMode
                          }
                        </strong>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 block text-[10px]">
                          البيانات الممتدة:
                        </span>
                        <strong>
                          {validationState.bundledArchives
                            ? `${validationState.bundledArchives.length} قوالب أرشيف`
                            : validationState.blueprint.workspaceExtensions
                                ?.localStorageSnapshot
                            ? "تشمل لقطة الذاكرة ✓"
                            : "إعدادات كاملة ✓"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={!validationState?.valid}
                  onClick={handleConfirmImport}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition ${
                    validationState?.valid
                      ? "bg-cyan-700 hover:bg-cyan-600 text-white cursor-pointer shadow-md"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>تحميل وتطبيق مساحة العمل الآن</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "VAULT" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-black text-slate-900 text-xs">
                  أرشيف مساحات العمل والقوالب المحفوظة (IndexedDB & Local) (
                  {vaultPresets.length})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await exportAllArchivesBackupJSON(preparedBlueprint);
                      onNotify(
                        "success",
                        "تم تصدير النسخة الاحتياطية الشاملة لمساحة العمل وجميع القوالب المحفوظة بنجاح!"
                      );
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-50 text-indigo-950 border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="تصدير مساحة العمل الحالية مع جميع القوالب المحفوظة في ملف JSON احتياطي موحد"
                  >
                    <FileJson className="w-3.5 h-3.5 text-indigo-700" />
                    <span>نسخ احتياطي شامل للكل (.json)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToVault}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>+ حفظ مساحة العمل الحالية</span>
                  </button>
                </div>
              </div>

              {isLocalEncryptionEnabled() && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-bold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>الخزانة المحلية محمية بنظام التشفير التلقائي المعتمد AES-GCM (256-bit).</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    Encrypted Web Crypto
                  </span>
                </div>
              )}

              {vaultPresets.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <Archive className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-black text-slate-700">
                    لا توجد مساحات عمل محفوظة في خزانتك المحلية بعد
                  </div>
                  <p className="text-[11px] text-slate-500">
                    اضغط على «+ حفظ مساحة العمل الحالية» للرجوع إلى إعداداتك المفضلة بضغطة زر أو تصديرها كملف JSON.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {vaultPresets.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-950 text-xs">
                            {item.title}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                            {item.trackCode} ·{" "}
                            {item.blueprint.examStructure.dsKey}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            Modèle {item.blueprint.examStructure.examModel}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-500">
                          حُفظ بتاريخ:{" "}
                          {new Date(item.savedAt).toLocaleString("ar-MA")} ·
                          الدروس:{" "}
                          {
                            item.blueprint.gradingAndLessons.selectedLessonRefs
                              .length
                          }{" "}
                          · التنقيط: {item.blueprint.gradingAndLessons.n1}% /{" "}
                          {item.blueprint.gradingAndLessons.n2}% /{" "}
                          {item.blueprint.gradingAndLessons.n3}%
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              item.blueprint.workspaceExtensions
                                ?.localStorageSnapshot
                            ) {
                              restorePortableLocalStorageSnapshot(
                                item.blueprint.workspaceExtensions
                                  .localStorageSnapshot
                              );
                            }
                            onApplyBlueprint(item.blueprint, {
                              keepCurrentIdentity: false,
                            });
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl font-black text-[11px] bg-indigo-700 hover:bg-indigo-600 text-white transition cursor-pointer"
                        >
                          استرجاع وتطبيق
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            downloadExamConfigAsJSON(
                              item.blueprint,
                              `Workspace_${item.trackCode}_${item.blueprint.examStructure.dsKey}.json`
                            )
                          }
                          title="تنزيل كملف JSON"
                          className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const next =
                              await deleteExamArchiveFromIndexedDB(item.id);
                            setVaultPresets(next);
                            onNotify(
                              "info",
                              "تم حذف القالب من الخزانة بنجاح."
                            );
                          }}
                          title="حذف القالب"
                          className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
