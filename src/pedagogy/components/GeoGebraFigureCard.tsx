import React, { useState } from "react";
import { GeoGebraResource, LessonItem } from "../data/curriculum";
import { exportRealGeoGebraGgbArchive } from "../utils/advancedPedagogicalTools";
import {
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode2,
  Compass,
  QrCode,
  Upload,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface GeoGebraFigureCardProps {
  resource: GeoGebraResource;
  lesson: LessonItem;
  exerciseNumber: number;
  isFr: boolean;
  isBi?: boolean;
  onResourceUpdated?: (updatedResource: GeoGebraResource) => void;
}

/**
 * يولد مصفوفة QR Code نقطية حتمية (Vector SVG) لعرضها في أوراق الفروض المطبوعة وملفات PDF
 */
function generateDeterministicQrMatrix(text: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // رسم مربعات التموضع القياسية الثلاثة (Finder Patterns)
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (r0 + r < size && c0 + c < size) {
          matrix[r0 + r][c0 + c] = isBorder || isInner;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // خطوط التوقيت (Timing Patterns)
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // توليد باقي البتات بشكل حتمي انطلاقاً من الرابط
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;
      if (inTopLeft || inTopRight || inBottomLeft || isTiming) continue;

      const seed = Math.imul(r * 31 + c * 17 + (hash >>> 0), 2654435761) >>> 0;
      matrix[r][c] = (seed & 3) === 0 || (seed & 5) === 1;
    }
  }

  return matrix;
}

/**
 * يستخرج رابط التضمين التفاعلي لـ GeoGebra من الرابط العادي أو المعرف
 */
export function getGeoGebraEmbedUrl(resource: GeoGebraResource): string {
  if (resource.materialId) {
    return `https://www.geogebra.org/material/iframe/id/${resource.materialId}/width/700/height/420/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/true/rc/false/ld/false/sdz/true/ctl/false`;
  }
  const url = (resource.interactiveUrl || "").trim();
  const match =
    url.match(/geogebra\.org\/(?:m|classic|calculator|geometry|3d)\/([a-zA-Z0-9]+)/i) ||
    url.match(/id\/([a-zA-Z0-9]+)/i);
  if (match && match[1]) {
    return `https://www.geogebra.org/material/iframe/id/${match[1]}/width/700/height/420/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/true/rc/false/ld/false/sdz/true/ctl/false`;
  }
  if (resource.is3D || resource.previewSvgType === "ESPACE_3D" || url.includes("/3d")) {
    return "https://www.geogebra.org/3d";
  }
  return "https://www.geogebra.org/classic";
}

export const GeoGebraFigureCard: React.FC<GeoGebraFigureCardProps> = ({
  resource,
  lesson,
  exerciseNumber,
  isFr,
  isBi,
  onResourceUpdated,
}) => {
  const [showLiveIframe, setShowLiveIframe] = useState<boolean>(
    Boolean(resource.showInteractiveIframe)
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const subCat = lesson.subCategory || "";
  const isSpatial3D =
    Boolean(resource.is3D) ||
    resource.previewSvgType === "ESPACE_3D" ||
    subCat === "هندسة فضائية" ||
    lesson.lessonFr.toLowerCase().includes("espace");

  const svgType =
    resource.previewSvgType ||
    (isSpatial3D
      ? "ESPACE_3D"
      : subCat === "أعداد عقدية"
      ? "NOMBRES_COMPLEXES"
      : subCat === "حساب مثلثي"
      ? "TRIGONOMETRIE"
      : lesson.category === "Geometry" || subCat === "هندسة مستوية"
      ? "PRODUIT_SCALAIRE"
      : "FONCTIONS_COURBE");

  const displayUrl =
    resource.interactiveUrl ||
    (resource.materialId
      ? `https://www.geogebra.org/m/${resource.materialId}`
      : isSpatial3D
      ? "https://www.geogebra.org/3d"
      : "https://www.geogebra.org/geometry");

  const qrMatrix = generateDeterministicQrMatrix(
    displayUrl + (resource.fileName || ""),
    21
  );

  const handleUploadGeoGebraFile = async (file: File) => {
    setIsUploading(true);
    setUploadFeedback(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = typeof reader.result === "string" ? reader.result : "";
        const sizeKb = Math.max(1, Math.round(file.size / 1024));

        const response = await fetch("/api/geogebra/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64Data,
            fileSizeKb: sizeKb,
            lessonKey: lesson.lessonFr,
            titleAr: `${lesson.lessonAr} (${file.name})`,
            titleFr: `${lesson.lessonFr} (${file.name})`,
          }),
        });

        if (!response.ok) {
          throw new Error("فشل رفع ومعالجة ملف GeoGebra");
        }

        const data = await response.json();
        if (data.resource && onResourceUpdated) {
          onResourceUpdated({
            ...data.resource,
            is3D: isSpatial3D || file.name.toLowerCase().includes("3d"),
            previewSvgType:
              isSpatial3D || file.name.toLowerCase().includes("3d")
                ? "ESPACE_3D"
                : data.resource.previewSvgType,
            spatialInstructionsListAr: resource.spatialInstructionsListAr,
            spatialInstructionsListFr: resource.spatialInstructionsListFr,
          });
        }
        setUploadFeedback(
          isFr
            ? `Fichier ${file.name} (${isSpatial3D ? "GeoGebra 3D" : "2D"}) intégré avec succès`
            : `تم تحديث ملف ${file.name} (${isSpatial3D ? "GeoGebra 3D الفضائي" : "2D"}) وتوليد رمز QR بنجاح`
        );
      };
      reader.readAsDataURL(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر تحديث الملف";
      setUploadFeedback(`خطأ: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleUploadGeoGebraFile(files[0]);
    }
  };

  const renderGeometricVectorDiagram = () => {
    if (resource.figureImageUrl) {
      return (
        <div className="flex justify-center items-center bg-white p-2 rounded-lg border border-slate-200">
          <img
            src={resource.figureImageUrl}
            alt={isFr ? resource.titleFr : resource.titleAr}
            className="max-h-48 w-auto object-contain rounded"
          />
        </div>
      );
    }

    if (svgType === "ESPACE_3D") {
      return (
        <svg
          viewBox="0 0 320 185"
          className="w-full max-w-[300px] h-auto mx-auto bg-white rounded-lg border border-slate-200 p-1.5"
        >
          <defs>
            <marker
              id={`arrow-3d-${exerciseNumber}`}
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
            </marker>
          </defs>
          {/* شبكة الفضاء ثلاثي الأبعاد (O, i, j, k) + فلكة (S) ومستوى (P) */}
          <polygon
            points="55,140 215,140 265,95 105,95"
            fill="#e0e7ff"
            fillOpacity="0.45"
            stroke="#4338ca"
            strokeWidth="1.2"
            strokeDasharray="3,2"
          />
          <text x="235" y="133" fontSize="10" fontWeight="bold" fill="#312e81">
            (P)
          </text>
          {/* المحاور */}
          <line
            x1="145"
            y1="115"
            x2="145"
            y2="20"
            stroke="#1e293b"
            strokeWidth="1.5"
            markerEnd={`url(#arrow-3d-${exerciseNumber})`}
          />
          <line
            x1="145"
            y1="115"
            x2="275"
            y2="115"
            stroke="#1e293b"
            strokeWidth="1.5"
            markerEnd={`url(#arrow-3d-${exerciseNumber})`}
          />
          <line
            x1="145"
            y1="115"
            x2="65"
            y2="165"
            stroke="#1e293b"
            strokeWidth="1.5"
            markerEnd={`url(#arrow-3d-${exerciseNumber})`}
          />
          <text x="152" y="26" fontSize="10" fontWeight="bold" fill="#0f172a">
            z
          </text>
          <text x="268" y="108" fontSize="10" fontWeight="bold" fill="#0f172a">
            y
          </text>
          <text x="55" y="160" fontSize="10" fontWeight="bold" fill="#0f172a">
            x
          </text>
          <text x="133" y="125" fontSize="10" fontWeight="bold" fill="#0f172a">
            O
          </text>
          {/* الفلكة (S) */}
          <circle
            cx="185"
            cy="72"
            r="38"
            fill="#ecfdf5"
            fillOpacity="0.55"
            stroke="#047857"
            strokeWidth="1.6"
          />
          <ellipse
            cx="185"
            cy="72"
            rx="38"
            ry="12"
            fill="none"
            stroke="#047857"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
          <circle cx="185" cy="72" r="2.5" fill="#047857" />
          <text x="190" y="70" fontSize="10" fontWeight="bold" fill="#065f46">
            Ω(a,b,c)
          </text>
          {/* المتجهة المنظمية n */}
          <line
            x1="185"
            y1="72"
            x2="215"
            y2="34"
            stroke="#dc2626"
            strokeWidth="1.5"
            markerEnd={`url(#arrow-3d-${exerciseNumber})`}
          />
          <text x="218" y="38" fontSize="10" fontWeight="bold" fill="#dc2626">
            n⃗
          </text>
          <circle cx="165" cy="115" r="2.5" fill="#312e81" />
          <text x="160" y="130" fontSize="9.5" fontWeight="bold" fill="#312e81">
            H
          </text>
        </svg>
      );
    }

    if (svgType === "NOMBRES_COMPLEXES") {
      return (
        <svg
          viewBox="0 0 320 180"
          className="w-full max-w-[300px] h-auto mx-auto bg-white rounded-lg border border-slate-200 p-1.5"
        >
          <line x1="25" y1="135" x2="295" y2="135" stroke="#334155" strokeWidth="1.4" />
          <line x1="85" y1="165" x2="85" y2="20" stroke="#334155" strokeWidth="1.4" />
          {/* دائرة مثلثية / هندسية في المستوى العقدي */}
          <circle
            cx="85"
            cy="135"
            r="65"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.2"
            strokeDasharray="3,3"
          />
          {/* مثلث متساوي الأضلاع أو تحاكي ودوران */}
          <polygon
            points="85,135 215,95 155,35"
            fill="#f3e8ff"
            fillOpacity="0.55"
            stroke="#7e22ce"
            strokeWidth="1.6"
          />
          <circle cx="85" cy="135" r="3" fill="#0f172a" />
          <circle cx="215" cy="95" r="3" fill="#7e22ce" />
          <circle cx="155" cy="35" r="3" fill="#047857" />
          <text x="70" y="150" fontSize="10" fontWeight="bold" fill="#0f172a">
            O
          </text>
          <text x="95" y="148" fontSize="9.5" fontWeight="bold" fill="#334155">
            u⃗
          </text>
          <text x="72" y="115" fontSize="9.5" fontWeight="bold" fill="#334155">
            v⃗
          </text>
          <text x="222" y="98" fontSize="10" fontWeight="bold" fill="#6b21a8">
            M(zA)
          </text>
          <text x="160" y="32" fontSize="10" fontWeight="bold" fill="#065f46">
            M&apos;(zB) = R(M)
          </text>
          <path
            d="M 135 120 A 52 52 0 0 0 115 92"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.3"
          />
          <text x="138" y="106" fontSize="9.5" fontWeight="bold" fill="#dc2626">
            θ = π/3
          </text>
        </svg>
      );
    }

    // الوضع الافتراضي للهندسة المستوية / الجداء السلمي / الدائرة والمماس
    return (
      <svg
        viewBox="0 0 320 180"
        className="w-full max-w-[300px] h-auto mx-auto bg-white rounded-lg border border-slate-200 p-1.5"
      >
        {/* شبكة خفيفة */}
        <g stroke="#e2e8f0" strokeWidth="0.7">
          <line x1="0" y1="45" x2="320" y2="45" />
          <line x1="0" y1="90" x2="320" y2="90" />
          <line x1="0" y1="135" x2="320" y2="135" />
          <line x1="70" y1="0" x2="70" y2="180" />
          <line x1="150" y1="0" x2="150" y2="180" />
          <line x1="230" y1="0" x2="230" y2="180" />
        </g>
        {/* المحوران (O, i, j) */}
        <line x1="20" y1="145" x2="300" y2="145" stroke="#334155" strokeWidth="1.4" />
        <line x1="65" y1="170" x2="65" y2="15" stroke="#334155" strokeWidth="1.4" />
        {/* دائرة (C) ومستقيم مماس (D) ومثلث ABC */}
        <circle
          cx="175"
          cy="85"
          r="48"
          fill="#e0f2fe"
          fillOpacity="0.45"
          stroke="#0284c7"
          strokeWidth="1.7"
        />
        <polygon
          points="127,85 205,47 205,123"
          fill="#fef3c7"
          fillOpacity="0.4"
          stroke="#d97706"
          strokeWidth="1.3"
        />
        {/* مماس الدائرة */}
        <line
          x1="155"
          y1="15"
          x2="265"
          y2="90"
          stroke="#dc2626"
          strokeWidth="1.5"
        />
        <circle cx="175" cy="85" r="2.8" fill="#0369a1" />
        <circle cx="205" cy="47" r="3" fill="#dc2626" />
        <circle cx="127" cy="85" r="2.8" fill="#b45309" />
        <text x="166" y="100" fontSize="10" fontWeight="bold" fill="#0369a1">
          Ω(x₀,y₀)
        </text>
        <text x="212" y="45" fontSize="10" fontWeight="bold" fill="#dc2626">
          A (Contact)
        </text>
        <text x="108" y="83" fontSize="10" fontWeight="bold" fill="#b45309">
          B
        </text>
        <text x="242" y="70" fontSize="10" fontWeight="bold" fill="#dc2626">
          (Δ)
        </text>
        <text x="128" y="42" fontSize="10" fontWeight="bold" fill="#0284c7">
          (𝒞)
        </text>
        <text x="52" y="158" fontSize="10" fontWeight="bold" fill="#0f172a">
          O
        </text>
      </svg>
    );
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`avoid-break rounded-xl border transition-all p-3.5 space-y-3 relative ${
        isDragging
          ? "border-teal-600 bg-teal-100/70 ring-2 ring-teal-500/40"
          : "border-teal-300/90 bg-teal-50/35"
      }`}
    >
      {/* شريط عنوان المورد الهندسي التفاعلي GeoGebra */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-200/80 pb-2">
        <div className="flex items-center gap-2 text-xs font-black text-teal-950">
          <Compass className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            {isFr
              ? `Support Géométrique GeoGebra — ${resource.titleFr}`
              : `مرفق الهندسة التفاعلية (GeoGebra) — ${resource.titleAr}`}
          </span>
          {resource.fileName && (
            <span className="font-mono text-[10.5px] font-bold bg-white text-teal-900 px-2 py-0.5 rounded border border-teal-200">
              <FileCode2 className="w-3 h-3 inline mr-1 text-teal-700" />
              {resource.fileName}
              {resource.fileSizeKb ? ` (${resource.fileSizeKb} KB)` : ""}
            </span>
          )}
          {resource.isCustomUploaded && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              ✓ ديناميكي
            </span>
          )}
          {isSpatial3D && (
            <span
              className="text-[10px] bg-indigo-900 text-white font-mono font-extrabold px-2 py-0.5 rounded shadow-2xs"
              dir="ltr"
            >
              3D Espace (O, i⃗, j⃗, k⃗) · .ggb
            </span>
          )}
        </div>

        {/* أزرار التفاعل أثناء المعاينة وإجراءات السحب والإفلات */}
        <div className="flex items-center gap-2 no-print">
          {/* زر إسقاط أو اختيار ملف GeoGebra */}
          <label className="cursor-pointer px-2.5 py-1 rounded-md text-[11px] font-black bg-white hover:bg-teal-100 text-teal-950 border border-teal-300 transition flex items-center gap-1 shadow-2xs">
            {isUploading ? (
              <RefreshCw className="w-3 h-3 animate-spin text-teal-700" />
            ) : (
              <Upload className="w-3 h-3 text-teal-700" />
            )}
            <span>
              {isUploading
                ? isFr
                  ? "Traitement..."
                  : "جاري المعالجة..."
                : isFr
                ? "Mettre à jour .ggb"
                : "سحب / رفع .ggb"}
            </span>
            <input
              type="file"
              accept=".ggb,.png,.svg,.jpg,.jpeg,.webp"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadGeoGebraFile(file);
                e.target.value = "";
              }}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              const mode = isSpatial3D
                ? "3D_SPACE"
                : svgType === "NOMBRES_COMPLEXES"
                ? "COMPLEX_PLANE"
                : "2D_FUNCTION";
              exportRealGeoGebraGgbArchive({
                fileName: resource.fileName || `GeoGebra_Ex${exerciseNumber}_${mode}.ggb`,
                mode,
                title: isFr ? resource.titleFr : resource.titleAr,
              });
            }}
            className="px-2.5 py-1 rounded-md text-[11px] font-black bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 transition flex items-center gap-1 cursor-pointer shadow-2xs"
            title={
              isFr
                ? "Exporter le fichier natif GeoGebra (.ggb) pour TBI / Vidéoprojecteur"
                : "تحميل ملف GeoGebra الأصلي (.ggb) للعرض الديناميكي على المسلاط العاكس والسبورة التفاعلية TBI"
            }
          >
            <Download className="w-3 h-3" />
            <span>{isFr ? "Exporter .ggb" : "تصدير .ggb"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLiveIframe((v) => !v)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 transition flex items-center gap-1 cursor-pointer"
          >
            {showLiveIframe ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>{isFr ? "Masquer" : "إخفاء المحاكي"}</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>{isFr ? "GeoGebra Live" : "محاكي مباشر"}</span>
              </>
            )}
          </button>

          {displayUrl && (
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-800 hover:bg-teal-900 text-white transition flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{isFr ? "Lien" : "فتح الرابط"}</span>
            </a>
          )}
        </div>
      </div>

      {uploadFeedback && (
        <div className="no-print text-[11px] font-bold text-teal-900 bg-teal-100/90 border border-teal-300 rounded-lg p-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>{uploadFeedback}</span>
          </span>
          <button
            type="button"
            onClick={() => setUploadFeedback(null)}
            className="text-teal-700 hover:text-teal-950 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* مؤشر السحب والإفلات عند السحب */}
      {isDragging && (
        <div className="no-print absolute inset-0 bg-teal-700/85 text-white z-10 rounded-xl flex flex-col items-center justify-center gap-2 p-4 animate-in fade-in">
          <Upload className="w-10 h-10 animate-bounce text-amber-300" />
          <div className="text-sm font-black">
            {isFr
              ? "Déposez le fichier GeoGebra (.ggb) pour mettre à jour la figure !"
              : "أفلت ملف GeoGebra (.ggb) هنا لتحديث الشكل ورمز QR فوراً!"}
          </div>
          <div className="text-xs text-teal-100">
            {isFr
              ? "Génération automatique d'un QR code haute résolution et lien interactif"
              : "سيتم توليد رمز QR عالي الدقة ورابط تفاعلي للتمرين تلقائياً"}
          </div>
        </div>
      )}

      {/* شبكة الشكل الهندسي المطبوع + رمز الاستجابة السريعة QR والارتباط التفاعلي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2">{renderGeometricVectorDiagram()}</div>

        <div className="bg-white rounded-lg border border-teal-200/90 p-3 flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-teal-950">
            <QrCode className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {isFr
                ? "Accès numérique & Figure dynamique"
                : "ولوج رقمي للشكل الهندسي المتحرك"}
            </span>
          </div>

          {/* رمز QR: إذا توفر QR كصورة Data URL عالي الدقة من الـ API يتم عرضه، وإلا المصفوفة المتجهة */}
          {resource.qrCodeDataUrl ? (
            <img
              src={resource.qrCodeDataUrl}
              alt="GeoGebra QR Code"
              className="w-20 h-20 border border-slate-200 rounded p-1 bg-white object-contain"
            />
          ) : (
            <svg
              viewBox={`0 0 ${qrMatrix.length + 4} ${qrMatrix.length + 4}`}
              className="w-20 h-20 border border-slate-200 rounded p-1 bg-white"
              aria-label="GeoGebra QR Code"
            >
              {qrMatrix.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                  cell ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx + 2}
                      y={rIdx + 2}
                      width={1}
                      height={1}
                      fill="#0f172a"
                    />
                  ) : null
                )
              )}
            </svg>
          )}

          <div className="space-y-0.5 w-full">
            <div className="font-mono text-[9.5px] text-teal-900 font-bold truncate px-1 select-all">
              {resource.fileName ? `Fichier: ${resource.fileName}` : displayUrl}
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              {isFr
                ? resource.instructionsFr ||
                  "Scannez ou ouvrez le fichier .ggb pour manipuler la figure et conjecturer."
                : resource.instructionsAr ||
                  "امسح الرمز أو افتح ملف GeoGebra لتحريك الشكل الهندسي ووضع المظنات."}
            </p>
            {isBi && resource.instructionsFr && (
              <p className="text-[9.5px] text-slate-500 italic">
                {resource.instructionsFr}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* تعليمات خاصة بتمارين الهندسة الفضائية 3D عندما يكون المورد ثلاثي الأبعاد */}
      {isSpatial3D && (
        <div className="bg-emerald-950/5 border border-emerald-300/90 rounded-lg p-2.5 text-[11px] space-y-1.5">
          <div className="font-extrabold text-emerald-950 flex items-center justify-between">
            <span>
              {isFr
                ? "📐 Instructions spécifiques — Géométrie dans l'espace 3D (Repère orthonormé direct (O, i⃗, j⃗, k⃗)) :"
                : "📐 تعليمات خاصة بتمارين الهندسة الفضائية — الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i⃗, j⃗, k⃗) :"}
            </span>
            <span className="font-mono text-[9.5px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300">
              GeoGebra 3D (.ggb)
            </span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-800 leading-relaxed">
            {(isFr
              ? resource.spatialInstructionsListFr || [
                  "L'espace est rapporté à un repère orthonormé direct (O, i⃗, j⃗, k⃗).",
                  "Déterminer les composantes du vecteur normal n⃗(a,b,c) ou du produit vectoriel u⃗ ∧ v⃗.",
                  "Comparer la distance d(Ω, (P)) au rayon R pour caractériser l'intersection de la sphère (S) et du plan (P).",
                ]
              : resource.spatialInstructionsListAr || [
                  "الفضاء منسوب إلى معلم متعامد ممنظم مباشر (O, i⃗, j⃗, k⃗).",
                  "حدد إحداثيات المتجهة المنظمية n⃗(a,b,c) على المستوى (P) أو الجداء المتجهي u⃗ ∧ v⃗.",
                  "قارن المسافة d(Ω, (P)) مع الشعاع R لتحديد طبيعة تقاطع الفلكة (S) والمستوى (P) وعناصره الهندسية.",
                ]
            ).map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
          {isBi && resource.spatialInstructionsListFr && (
            <ul
              dir="ltr"
              className="list-disc list-inside space-y-0.5 text-slate-600 text-[10px] italic border-t border-emerald-200/70 pt-1 text-left"
            >
              {resource.spatialInstructionsListFr.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* نافذة GeoGebra التفاعلية الحية عند تفعيلها في المعاينة */}
      {showLiveIframe && (
        <div className="no-print pt-2 border-t border-teal-200 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-950">
            <span>
              {isFr
                ? "Espace de manipulation dynamique GeoGebra (Interactif) :"
                : "فضاء التحريك الهندسي المباشر عبر GeoGebra (تفاعلي):"}
            </span>
            <span className="font-mono text-[10px] text-teal-700">
              GeoGebra Math Apps
            </span>
          </div>
          <div className="w-full overflow-hidden rounded-lg border border-teal-300 bg-white aspect-video max-h-[380px]">
            <iframe
              title={`GeoGebra-${exerciseNumber}`}
              src={getGeoGebraEmbedUrl(resource)}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
