import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crop,
  Eye,
  EyeOff,
  FileCode2,
  FileText,
  FileUp,
  Highlighter,
  Layers,
  Loader2,
  MousePointerClick,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  Wand2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { EducationSystem, LessonItem } from "../data/curriculum";
import { MathText } from "./MathRenderer";

// Configure pdfjs worker safely for Vite + fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export type HighlightGenerationMode =
  | "ISOMORPHIC_EXERCISE"
  | "GRADUATED_QUESTIONS"
  | "REMEDIATION_DRILL"
  | "SYNTHESIS_EXTENSION";

export interface PdfTextItemBox {
  str: string;
  /** Normalized coordinates [0..1] on the page */
  nx: number;
  ny: number;
  nw: number;
  nh: number;
}

export interface PdfHighlightRegion {
  id: string;
  pageNumber: number;
  /** Normalized coordinates [0..1] relative to canvas width/height */
  nx: number;
  ny: number;
  nw: number;
  nh: number;
  extractedText: string;
  croppedImageDataUrl?: string;
  createdAt: string;
  color: "amber" | "cyan" | "emerald" | "rose";
}

export interface GeneratedHighlightQuestion {
  num: string;
  level: "N1" | "N2" | "N3";
  points: number;
  statementAr: string;
  statementFr: string;
  solutionAr: string;
  solutionFr: string;
  hintAr?: string;
  hintFr?: string;
}

export interface GeneratedHighlightExercise {
  titleAr: string;
  titleFr: string;
  detectedTopicAr: string;
  detectedTopicFr: string;
  extractedMathSummaryAr: string;
  extractedMathSummaryFr: string;
  targetLevel: "N1" | "N2" | "N3";
  suggestedPoints: number;
  questions: GeneratedHighlightQuestion[];
  fullLatexSnippet: string;
}

interface SamplePageBlock {
  id: string;
  badge: string;
  titleFr: string;
  titleAr: string;
  linesFr: string[];
  linesAr: string[];
  /** Normalized vertical band [nyStart, nyEnd] on the sample canvas */
  nyStart: number;
  nyEnd: number;
}

const BUILTIN_SAMPLE_PDF_PAGES: Array<{
  pageNumber: number;
  headerFr: string;
  headerAr: string;
  blocks: SamplePageBlock[];
}> = [
  {
    pageNumber: 1,
    headerFr:
      "Royaume du Maroc · Examen National & Devoir Surveillé N°1 — 2BAC Sciences Mathématiques / PC",
    headerAr:
      "المملكة المغربية · الفرض المحروس النموذجي رقم 1 — الثانية بكالوريا علوم رياضية وفيزيائية",
    blocks: [
      {
        id: "sample_p1_b1",
        badge: "Exercice 1 (5 pts) — Suites Numériques",
        titleFr: "Exercice 1 (5 points) : Suite récurrente homographique",
        titleAr: "التمرين الأول (5 نقط): المتتاليات العددية الترجعية",
        linesFr: [
          "Soit (u_n) la suite numérique définie par u_0 = 2 et u_{n+1} = (4u_n - 1)/(u_n + 2) pour tout n de N.",
          "1) Calculer u_1 et u_2, puis montrer par récurrence que u_n > 1 pour tout n de N. (1.5 pt)",
          "2) Étudier la monotonie de la suite (u_n) et en déduire qu'elle est convergente. (1.5 pt)",
          "3) On pose v_n = 1/(u_n - 1). Montrer que (v_n) est arithmétique de raison r = 1/3 et calculer lim u_n. (2 pts)",
        ],
        linesAr: [
          "نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = (4u_n - 1)/(u_n + 2) لكل n من N.",
          "1) أحسب u_1 و u_2 ثم بين بالترجع أن u_n > 1 لكل n من N. (1.5 ن)",
          "2) أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة. (1.5 ن)",
          "3) نضع v_n = 1/(u_n - 1). بين أن (v_n) متتالية حسابية أساسها r = 1/3 ثم أحسب lim u_n. (2 ن)",
        ],
        nyStart: 0.14,
        nyEnd: 0.42,
      },
      {
        id: "sample_p1_b2",
        badge: "Exercice 2 (5 pts) — Nombres Complexes",
        titleFr: "Exercice 2 (5 points) : Nombres complexes et Rotation plane",
        titleAr: "التمرين الثاني (5 نقط): الأعداد العقدية والتحويلات النقطية",
        linesFr: [
          "1) Résoudre dans l'ensemble C l'équation : z² - 2√3 z + 4 = 0. (1.5 pt)",
          "2) Dans le plan complexe rapporté à un repère orthonormé direct (O, u, v), on considère A(√3 + i), B(√3 - i) et C(2i).",
          "   Écrire a et b sous forme exponentielle et placer les points A, B et C. (1.75 pt)",
          "3) Montrer que C est l'image de A par la rotation R de centre O et d'angle π/3 et en déduire la nature de OAC. (1.75 pt)",
        ],
        linesAr: [
          "1) حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0. (1.5 ن)",
          "2) نعتبر في المستوى العقدي النقط A و B و C التي ألحاقها a = √3 + i و b = √3 - i و c = 2i. أكتب a على الشكل الأسي. (1.75 ن)",
          "3) بين أن C صورة A بالدوران R الذي مركزه O وزاويته π/3 واستنتج طبيعة المثلث OAC. (1.75 ن)",
        ],
        nyStart: 0.44,
        nyEnd: 0.69,
      },
      {
        id: "sample_p1_b3",
        badge: "Problème (10 pts) — Analyse & Calcul Intégral",
        titleFr: "Problème (10 points) : Étude de fonction logarithme et Aire",
        titleAr: "المسألة التوليفية (10 نقط): دراسة دالة لوغاريتمية وحساب التكامل",
        linesFr: [
          "Soit f la fonction définie sur ]0, +∞[ par : f(x) = x - 1 + ln(x)/x et (C_f) sa courbe dans un repère orthonormé (||i|| = 2 cm).",
          "1) Calculer lim_{x→0+} f(x) et lim_{x→+∞} f(x). Montrer que (Δ): y = x - 1 est asymptote oblique à (C_f). (3 pts)",
          "2) Calculer f'(x) sur ]0, +∞[ et dresser le tableau de variations complet de f. (3.5 pts)",
          "3) Calculer l'intégrale I = ∫_1^e (ln(x)/x) dx et en déduire l'aire du domaine plan compris entre (C_f), (Δ), x=1 et x=e. (3.5 pts)",
        ],
        linesAr: [
          "نعتبر الدالة العددية f المعرفة على ]0, +∞[ بـ: f(x) = x - 1 + ln(x)/x ومنحناها (C_f) في معلم متعامد ممنظم (||i|| = 2 cm).",
          "1) أحسب النهايتين عند 0+ وعند +∞ وبين أن المستقيم (Δ): y = x - 1 مقارب مائل للمنحنى (C_f). (3 ن)",
          "2) أحسب المشتقة f'(x) على ]0, +∞[ وضع جدول تغيرات الدالة f. (3.5 ن)",
          "3) أحسب التكامل I = ∫_1^e (ln(x)/x) dx واستنتج بـ cm² مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x=1 و x=e. (3.5 ن)",
        ],
        nyStart: 0.71,
        nyEnd: 0.96,
      },
    ],
  },
  {
    pageNumber: 2,
    headerFr:
      "Page 2/2 · Géométrie dans l'Espace & Calcul des Probabilités — Session Baccalauréat",
    headerAr:
      "الصفحة 2/2 · الهندسة الفضائية وحساب الاحتمالات — دورة البكالوريا",
    blocks: [
      {
        id: "sample_p2_b1",
        badge: "Exercice 4 (5 pts) — Géométrie dans l'Espace",
        titleFr: "Exercice 4 : Produit scalaire, Plan et Sphère dans l'espace",
        titleAr: "التمرين الرابع: الهندسة الفضائية (الفلكة والمستوى والجداء السلمي)",
        linesFr: [
          "Dans l'espace rapporté à un repère orthonormé direct (O, i, j, k), on considère le plan (P): 2x - y + 2z - 3 = 0",
          "et la sphère (S) d'équation : x² + y² + z² - 2x + 2y - 4z - 3 = 0.",
          "1) Déterminer le centre Ω et le rayon R de la sphère (S), puis calculer la distance d(Ω, (P)). (2 pts)",
          "2) Montrer que le plan (P) coupe la sphère (S) suivant un cercle (Γ) dont on précisera le rayon r et le centre H. (3 pts)",
        ],
        linesAr: [
          "في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i, j, k)، نعتبر المستوى (P): 2x - y + 2z - 3 = 0",
          "والفلكة (S) التي معادلتها الديكارتية: x² + y² + z² - 2x + 2y - 4z - 3 = 0.",
          "1) حدد المركز Ω والشعاع R للفلكة (S)، ثم أحسب مسافة المركز Ω عن المستوى (P). (2 ن)",
          "2) بين أن المستوى (P) يقطع الفلكة (S) وفق دائرة (Γ) محدداً شعاعها r ومثلث إحداثيات مركزها H. (3 ن)",
        ],
        nyStart: 0.14,
        nyEnd: 0.52,
      },
      {
        id: "sample_p2_b2",
        badge: "Exercice 5 (5 pts) — Calcul des Probabilités",
        titleFr: "Exercice 5 : Tirage simultané, Probabilité conditionnelle et Variable aléatoire",
        titleAr: "التمرين الخامس: حساب الاحتمالات والمتغيرات العشوائية",
        linesFr: [
          "Une urne contient 5 boules blanches et 3 boules noires indiscernables au toucher. On tire simultanément 3 boules.",
          "1) Montrer que le nombre de tirages possibles est Card(Ω) = 56. (1 pt)",
          "2) Calculer la probabilité de A : « Obtenir 3 boules de même couleur » et B : « Au moins une boule blanche ». (2 pts)",
          "3) Soit X la variable aléatoire égale au nombre de boules noires tirées. Déterminer la loi de X et son espérance E(X). (2 pts)",
        ],
        linesAr: [
          "يحتوي صندوق على 5 كرات بيضاء و 3 كرات سوداء لا يمكن التمييز بينها باللمس. نسحب عشوائياً وفي آن واحد 3 كرات.",
          "1) بين أن عدد السحبات الممكنة هو Card(Ω) = 56. (1 ن)",
          "2) أحسب احتمال الحدث A: «سحب 3 كرات من نفس اللون» والحدث B: «سحب كرة بيضاء على الأقل». (2 ن)",
          "3) ليكن X المتغير العشوائي الذي يربط كل سحبة بعدد الكرات السوداء المسحوبة. حدد قانون احتمال X وأمله الرياضي E(X). (2 ن)",
        ],
        nyStart: 0.55,
        nyEnd: 0.94,
      },
    ],
  },
];

export interface PdfDocumentHighlighterStudioProps {
  targetTrackCode: string;
  trackLabel: string;
  educationSystem: EducationSystem;
  selectedAiModel: "gemini-3.8-flash" | "gemini-4-argon";
  initialUploadedFile?: {
    name: string;
    mimeType: string;
    base64?: string;
    arrayBuffer?: ArrayBuffer;
  } | null;
  onInsertLessonToExam?: (lesson: LessonItem) => void;
  onInsertQuestionToExam?: (payload: {
    questionAr: string;
    questionFr: string;
    solutionAr: string;
    solutionFr: string;
    points?: number;
    level?: "N1" | "N2" | "N3";
  }) => void;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

export const PdfDocumentHighlighterStudio: React.FC<
  PdfDocumentHighlighterStudioProps
> = ({
  trackLabel,
  educationSystem,
  selectedAiModel,
  initialUploadedFile,
  onInsertLessonToExam,
  onInsertQuestionToExam,
  onNotify,
}) => {
  // Document source state: "BUILTIN_SAMPLE" | "UPLOADED_PDF" | "UPLOADED_IMAGE"
  const [docSourceType, setDocSourceType] = useState<
    "BUILTIN_SAMPLE" | "UPLOADED_PDF" | "UPLOADED_IMAGE"
  >("BUILTIN_SAMPLE");
  const [docName, setDocName] = useState<string>(
    "Sujet_Officiel_Bac_2BAC_SM_PC.pdf"
  );
  const [numPages, setNumPages] = useState<number>(
    BUILTIN_SAMPLE_PDF_PAGES.length
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);

  // Loaded PDF document proxy or image URL
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [pageTextItems, setPageTextItems] = useState<PdfTextItemBox[]>([]);

  // Canvas & Marquee Highlighting State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [interactionTool, setInteractionTool] = useState<
    "RECT_MARQUEE" | "SECTION_CLICK"
  >("RECT_MARQUEE");
  const [autoTriggerAi, setAutoTriggerAi] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ nx: number; ny: number } | null>(
    null
  );
  const [dragCurrent, setDragCurrent] = useState<{
    nx: number;
    ny: number;
  } | null>(null);

  // Saved highlights & active highlight
  const [highlights, setHighlights] = useState<PdfHighlightRegion[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    null
  );
  const [editableHighlightText, setEditableHighlightText] =
    useState<string>("");
  const [activeCroppedImg, setActiveCroppedImg] = useState<string | undefined>(
    undefined
  );

  // AI Generation State
  const [generationMode, setGenerationMode] = useState<HighlightGenerationMode>(
    "ISOMORPHIC_EXERCISE"
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [generatedExercise, setGeneratedExercise] =
    useState<GeneratedHighlightExercise | null>(null);
  const [aiModelUsedLabel, setAiModelUsedLabel] = useState<string>("");
  const [showSolutions, setShowSolutions] = useState<boolean>(true);
  const [copiedLatex, setCopiedLatex] = useState<boolean>(false);
  const [insertedSuccessBadge, setInsertedSuccessBadge] = useState<
    string | null
  >(null);

  // Draw the built-in multi-page sample PDF onto the canvas with crisp mathematical typography
  const renderBuiltinSamplePageToCanvas = useCallback(
    (pageNum: number, scale: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pageData =
        BUILTIN_SAMPLE_PDF_PAGES[pageNum - 1] || BUILTIN_SAMPLE_PDF_PAGES[0];

      const baseW = 780;
      const baseH = 1060;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(baseW * scale * dpr);
      canvas.height = Math.round(baseH * scale * dpr);
      canvas.style.width = `${Math.round(baseW * scale)}px`;
      canvas.style.height = `${Math.round(baseH * scale)}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.scale(scale * dpr, scale * dpr);

      // White paper background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, baseW, baseH);

      // Subtle academic border
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.strokeRect(18, 18, baseW - 36, baseH - 36);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 0.75;
      ctx.strokeRect(22, 22, baseW - 44, baseH - 44);

      // Official Exam Header Box
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(32, 32, baseW - 64, 78);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(32, 32, baseW - 64, 78);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 13px 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.fillText(pageData.headerFr, 46, 56);

      ctx.fillStyle = "#1e1b4b";
      ctx.font = "bold 14px 'Cairo', 'Amiri', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(pageData.headerAr, baseW - 46, 82);

      ctx.fillStyle = "#475569";
      ctx.font = "italic 11px 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.fillText(
        "Astuce : Tracez un cadre de surlignage (Drag & Highlight) sur n'importe quel exercice pour générer un exercice IA correspondant.",
        46,
        100
      );

      const extractedBoxes: PdfTextItemBox[] = [];

      // Render each mathematical exercise block
      pageData.blocks.forEach((blk, idx) => {
        const yTop = Math.round(blk.nyStart * baseH);
        const yBottom = Math.round(blk.nyEnd * baseH);
        const boxH = yBottom - yTop;

        // Block container
        ctx.fillStyle = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
        ctx.fillRect(36, yTop, baseW - 72, boxH);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.strokeRect(36, yTop, baseW - 72, boxH);

        // Top accent bar for block
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(36, yTop, baseW - 72, 28);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 12px 'Times New Roman', serif";
        ctx.textAlign = "left";
        ctx.fillText(blk.titleFr, 48, yTop + 18);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12.5px 'Cairo', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(blk.titleAr, baseW - 48, yTop + 18);

        // French lines
        let curY = yTop + 48;
        ctx.fillStyle = "#0f172a";
        ctx.font = "12.5px 'Times New Roman', serif";
        ctx.textAlign = "left";
        blk.linesFr.forEach((line) => {
          ctx.fillText(line, 48, curY, baseW - 96);
          extractedBoxes.push({
            str: line,
            nx: 48 / baseW,
            ny: (curY - 12) / baseH,
            nw: (baseW - 96) / baseW,
            nh: 18 / baseH,
          });
          curY += 22;
        });

        // Divider line between FR and AR
        curY += 4;
        ctx.strokeStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.moveTo(48, curY - 8);
        ctx.lineTo(baseW - 48, curY - 8);
        ctx.stroke();

        // Arabic lines
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 13px 'Cairo', 'Amiri', sans-serif";
        ctx.textAlign = "right";
        blk.linesAr.forEach((line) => {
          ctx.fillText(line, baseW - 48, curY, baseW - 96);
          extractedBoxes.push({
            str: line,
            nx: 48 / baseW,
            ny: (curY - 12) / baseH,
            nw: (baseW - 96) / baseW,
            nh: 18 / baseH,
          });
          curY += 24;
        });
      });

      // Footer
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `Doc2App Math Studio — Page ${pageNum} / ${BUILTIN_SAMPLE_PDF_PAGES.length}`,
        baseW / 2,
        baseH - 28
      );

      ctx.restore();
      setPageTextItems(extractedBoxes);
    },
    []
  );

  // Render an actual uploaded PDF page via pdfjs-dist
  const renderUploadedPdfPageToCanvas = useCallback(
    async (pageNum: number, scale: number) => {
      const pdfDoc = pdfDocRef.current;
      const canvas = canvasRef.current;
      if (!pdfDoc || !canvas) return;

      setIsRenderingPage(true);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const displayViewport = page.getViewport({ scale: scale * 1.25 });
        const renderViewport = page.getViewport({ scale: scale * 1.25 * dpr });

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(displayViewport.width)}px`;
        canvas.style.height = `${Math.floor(displayViewport.height)}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({
            canvasContext: ctx,
            viewport: renderViewport,
            canvas,
          } as any).promise;
        }

        // Extract positioned text items for automatic highlight text extraction
        const textContent = await page.getTextContent();
        const boxes: PdfTextItemBox[] = [];
        for (const item of textContent.items) {
          if ("str" in item && item.str.trim()) {
            const tx = pdfjsLib.Util.transform(
              displayViewport.transform,
              item.transform
            );
            const x = tx[4];
            const y = tx[5];
            const w = (item.width || 40) * scale * 1.25;
            const h = Math.max(12, Math.hypot(tx[2], tx[3]));
            boxes.push({
              str: item.str,
              nx: Math.max(0, Math.min(1, x / displayViewport.width)),
              ny: Math.max(0, Math.min(1, (y - h) / displayViewport.height)),
              nw: Math.max(0.01, Math.min(1, w / displayViewport.width)),
              nh: Math.max(0.01, Math.min(1, h / displayViewport.height)),
            });
          }
        }
        setPageTextItems(boxes);
      } catch {
        // Fallback to sample page if PDF stream is corrupted
        renderBuiltinSamplePageToCanvas(1, scale);
      } finally {
        setIsRenderingPage(false);
      }
    },
    [renderBuiltinSamplePageToCanvas]
  );

  // Render an uploaded image onto the canvas so marquee highlighting & cropping work identically
  const renderUploadedImageToCanvas = useCallback(
    (imgUrl: string, scale: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setIsRenderingPage(true);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const baseW = 780;
        const aspect = img.height / Math.max(1, img.width);
        const baseH = Math.max(500, Math.round(baseW * aspect));
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(baseW * scale * dpr);
        canvas.height = Math.round(baseH * scale * dpr);
        canvas.style.width = `${Math.round(baseW * scale)}px`;
        canvas.style.height = `${Math.round(baseH * scale)}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        setPageTextItems([]);
        setIsRenderingPage(false);
      };
      img.onerror = () => {
        setIsRenderingPage(false);
      };
      img.src = imgUrl;
    },
    []
  );

  // Trigger AI Exercise Generation from Highlighted Section
  const triggerAiExerciseFromHighlight = useCallback(
    async (params: {
      highlightedText: string;
      croppedImageBase64?: string;
      modeOverride?: HighlightGenerationMode;
      pageNum?: number;
    }) => {
      const activeMode = params.modeOverride || generationMode;
      setIsGeneratingAi(true);
      try {
        const response = await fetch("/api/generate-exercise-from-highlight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            highlightedText: params.highlightedText,
            croppedImageBase64: params.croppedImageBase64,
            generationMode: activeMode,
            trackLabel,
            educationSystem,
            pageNumber: params.pageNum || currentPage,
            documentName: docName,
            modelChoice: selectedAiModel,
          }),
        });

        const data = await response.json();
        if (data?.exercise) {
          setGeneratedExercise(data.exercise);
          setAiModelUsedLabel(data.modelUsed || selectedAiModel);
          onNotify?.(
            "success",
            `تم توليد التمرين الرياضي المقابل للمقطع المظلل (« ${data.exercise.titleAr} ») بنجاح!`
          );
        }
      } catch {
        onNotify?.(
          "error",
          "تعذر الاتصال بالخادم لتوليد التمرين من المقطع المظلل."
        );
      } finally {
        setIsGeneratingAi(false);
      }
    },
    [
      generationMode,
      trackLabel,
      educationSystem,
      currentPage,
      docName,
      selectedAiModel,
      onNotify,
    ]
  );

  // Load initialUploadedFile if passed from parent
  useEffect(() => {
    if (!initialUploadedFile) return;

    const loadInitial = async () => {
      setDocName(initialUploadedFile.name);
      if (
        initialUploadedFile.mimeType === "application/pdf" ||
        initialUploadedFile.name.toLowerCase().endsWith(".pdf")
      ) {
        try {
          let uint8: Uint8Array | null = null;
          if (initialUploadedFile.arrayBuffer) {
            uint8 = new Uint8Array(initialUploadedFile.arrayBuffer);
          } else if (initialUploadedFile.base64) {
            const commaIdx = initialUploadedFile.base64.indexOf(",");
            const rawB64 =
              commaIdx !== -1
                ? initialUploadedFile.base64.slice(commaIdx + 1)
                : initialUploadedFile.base64;
            const binStr = atob(rawB64);
            uint8 = new Uint8Array(binStr.length);
            for (let i = 0; i < binStr.length; i++) {
              uint8[i] = binStr.charCodeAt(i);
            }
          }
          if (uint8) {
            const loadingTask = pdfjsLib.getDocument({ data: uint8 });
            const pdf = await loadingTask.promise;
            pdfDocRef.current = pdf;
            setDocSourceType("UPLOADED_PDF");
            setNumPages(pdf.numPages);
            setCurrentPage(1);
            setHighlights([]);
          }
        } catch {
          setDocSourceType("BUILTIN_SAMPLE");
        }
      } else if (initialUploadedFile.base64) {
        setUploadedImageUrl(initialUploadedFile.base64);
        setDocSourceType("UPLOADED_IMAGE");
        setNumPages(1);
        setCurrentPage(1);
        setHighlights([]);
      }
    };
    loadInitial();
  }, [initialUploadedFile]);

  // Re-render current page whenever source, page, or zoom changes
  useEffect(() => {
    if (docSourceType === "UPLOADED_PDF" && pdfDocRef.current) {
      renderUploadedPdfPageToCanvas(currentPage, zoomScale);
    } else if (docSourceType === "UPLOADED_IMAGE" && uploadedImageUrl) {
      renderUploadedImageToCanvas(uploadedImageUrl, zoomScale);
    } else {
      renderBuiltinSamplePageToCanvas(currentPage, zoomScale);
    }
  }, [
    docSourceType,
    currentPage,
    zoomScale,
    uploadedImageUrl,
    renderUploadedPdfPageToCanvas,
    renderUploadedImageToCanvas,
    renderBuiltinSamplePageToCanvas,
  ]);

  // Pre-populate an initial highlight on first mount so the user immediately sees how it works
  useEffect(() => {
    if (highlights.length === 0 && docSourceType === "BUILTIN_SAMPLE") {
      const sampleBlk = BUILTIN_SAMPLE_PDF_PAGES[0].blocks[0];
      const initText = [
        sampleBlk.titleAr,
        ...sampleBlk.linesAr,
        sampleBlk.titleFr,
        ...sampleBlk.linesFr,
      ].join("\n");
      const initHighlight: PdfHighlightRegion = {
        id: "hl_init_1",
        pageNumber: 1,
        nx: 0.045,
        ny: sampleBlk.nyStart,
        nw: 0.91,
        nh: sampleBlk.nyEnd - sampleBlk.nyStart,
        extractedText: initText,
        createdAt: new Date().toLocaleTimeString("ar-MA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: "amber",
      };
      setHighlights([initHighlight]);
      setActiveHighlightId(initHighlight.id);
      setEditableHighlightText(initText);
      triggerAiExerciseFromHighlight({
        highlightedText: initText,
        pageNum: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle uploading a PDF or image directly inside the viewer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocName(file.name);
    setHighlights([]);
    setActiveHighlightId(null);

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      setIsRenderingPage(true);
      try {
        const arrayBuf = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuf),
        });
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setDocSourceType("UPLOADED_PDF");
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        onNotify?.(
          "success",
          `تم فتح ملف PDF « ${file.name} » (${pdf.numPages} صفحات) في العارض التفاعلي — قم بتظليل أي تمرين أو فقرة لتوليد تمارين موازية بالذكاء الاصطناعي!`
        );
      } catch {
        onNotify?.(
          "error",
          "تعذر قراءة ملف PDF المرفوع، تأكد من سلامة الملف."
        );
      } finally {
        setIsRenderingPage(false);
      }
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : "";
        setUploadedImageUrl(dataUrl);
        setDocSourceType("UPLOADED_IMAGE");
        setNumPages(1);
        setCurrentPage(1);
        onNotify?.(
          "success",
          `تم فتح الوثيقة المصورة « ${file.name} » — ظلل أي منطقة بالماوس لاستخراج الصيغ وتوليد التمرين بالذكاء الاصطناعي!`
        );
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Convert pointer event to normalized [0..1] canvas coordinates
  const getNormalizedCoords = (
    e: React.PointerEvent<HTMLDivElement>
  ): { nx: number; ny: number } => {
    const el = overlayRef.current;
    if (!el) return { nx: 0, ny: 0 };
    const rect = el.getBoundingClientRect();
    const nx = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width))
    );
    const ny = Math.max(
      0,
      Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height))
    );
    return { nx, ny };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactionTool !== "RECT_MARQUEE") return;
    const coords = getNormalizedCoords(e);
    setIsDragging(true);
    setDragStart(coords);
    setDragCurrent(coords);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart) return;
    setDragCurrent(getNormalizedCoords(e));
  };

  const handlePointerUp = () => {
    if (!isDragging || !dragStart || !dragCurrent) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);

    const nx = Math.min(dragStart.nx, dragCurrent.nx);
    const ny = Math.min(dragStart.ny, dragCurrent.ny);
    const nw = Math.abs(dragCurrent.nx - dragStart.nx);
    const nh = Math.abs(dragCurrent.ny - dragStart.ny);

    setDragStart(null);
    setDragCurrent(null);

    // Ignore accidental tiny clicks (< 2% width or height)
    if (nw < 0.025 || nh < 0.02) {
      return;
    }

    // 1. Crop the highlighted region from the rendered PDF canvas
    let croppedDataUrl: string | undefined;
    const canvas = canvasRef.current;
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      try {
        const sx = Math.floor(nx * canvas.width);
        const sy = Math.floor(ny * canvas.height);
        const sw = Math.max(16, Math.floor(nw * canvas.width));
        const sh = Math.max(16, Math.floor(nh * canvas.height));

        const offscreen = document.createElement("canvas");
        offscreen.width = sw;
        offscreen.height = sh;
        const offCtx = offscreen.getContext("2d");
        if (offCtx) {
          offCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
          croppedDataUrl = offscreen.toDataURL("image/png");
        }
      } catch {
        croppedDataUrl = undefined;
      }
    }

    // 2. Extract intersecting text items from the page
    const matchedStrings: string[] = [];
    for (const box of pageTextItems) {
      const boxCenterX = box.nx + box.nw / 2;
      const boxCenterY = box.ny + box.nh / 2;
      const intersects =
        (boxCenterX >= nx - 0.03 &&
          boxCenterX <= nx + nw + 0.03 &&
          boxCenterY >= ny - 0.02 &&
          boxCenterY <= ny + nh + 0.02) ||
        (box.ny + box.nh >= ny &&
          box.ny <= ny + nh &&
          box.nx + box.nw >= nx &&
          box.nx <= nx + nw);
      if (intersects) {
        matchedStrings.push(box.str);
      }
    }

    const extractedText = matchedStrings.join(" ").trim();
    const colors: Array<"amber" | "cyan" | "emerald" | "rose"> = [
      "amber",
      "cyan",
      "emerald",
      "rose",
    ];
    const newHighlight: PdfHighlightRegion = {
      id: `hl_${Date.now()}`,
      pageNumber: currentPage,
      nx,
      ny,
      nw,
      nh,
      extractedText:
        extractedText ||
        `مقطع رياضي مظلل من الصفحة ${currentPage} في الوثيقة (${docName})`,
      croppedImageDataUrl: croppedDataUrl,
      createdAt: new Date().toLocaleTimeString("ar-MA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      color: colors[highlights.length % colors.length],
    };

    setHighlights((prev) => [newHighlight, ...prev]);
    setActiveHighlightId(newHighlight.id);
    setEditableHighlightText(newHighlight.extractedText);
    setActiveCroppedImg(croppedDataUrl);

    if (autoTriggerAi) {
      triggerAiExerciseFromHighlight({
        highlightedText: newHighlight.extractedText,
        croppedImageBase64: croppedDataUrl,
        pageNum: currentPage,
      });
    }
  };

  // Quick-highlight a structured section block
  const handleSelectStructuredBlock = (blk: SamplePageBlock) => {
    const fullText = [
      blk.titleAr,
      ...blk.linesAr,
      blk.titleFr,
      ...blk.linesFr,
    ].join("\n");

    let croppedDataUrl: string | undefined;
    const canvas = canvasRef.current;
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      try {
        const sx = Math.floor(0.045 * canvas.width);
        const sy = Math.floor(blk.nyStart * canvas.height);
        const sw = Math.floor(0.91 * canvas.width);
        const sh = Math.floor((blk.nyEnd - blk.nyStart) * canvas.height);
        const offscreen = document.createElement("canvas");
        offscreen.width = sw;
        offscreen.height = sh;
        const offCtx = offscreen.getContext("2d");
        if (offCtx) {
          offCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
          croppedDataUrl = offscreen.toDataURL("image/png");
        }
      } catch {
        croppedDataUrl = undefined;
      }
    }

    const newHighlight: PdfHighlightRegion = {
      id: `hl_blk_${Date.now()}`,
      pageNumber: currentPage,
      nx: 0.045,
      ny: blk.nyStart,
      nw: 0.91,
      nh: blk.nyEnd - blk.nyStart,
      extractedText: fullText,
      croppedImageDataUrl: croppedDataUrl,
      createdAt: new Date().toLocaleTimeString("ar-MA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      color: "cyan",
    };

    setHighlights((prev) => [newHighlight, ...prev]);
    setActiveHighlightId(newHighlight.id);
    setEditableHighlightText(fullText);
    setActiveCroppedImg(croppedDataUrl);

    triggerAiExerciseFromHighlight({
      highlightedText: fullText,
      croppedImageBase64: croppedDataUrl,
      pageNum: currentPage,
    });
  };

  // Convert generated exercise into a full LessonItem and insert into the active exam
  const handleInsertFullExerciseIntoExam = () => {
    if (!generatedExercise || !onInsertLessonToExam) return;

    const lessonItem: LessonItem = {
      lessonAr: generatedExercise.titleAr,
      lessonFr: generatedExercise.titleFr,
      hours: "2h",
      weight: 25,
      capacitiesAr: [
        generatedExercise.detectedTopicAr,
        "توظيف المهارات المستخرجة من المقطع المظلل في الوثيقة",
      ],
      capacitiesFr: [
        generatedExercise.detectedTopicFr,
        "Mobiliser les compétences ciblées par la section surlignée",
      ],
      sampleExerciseAr: generatedExercise.questions.map(
        (q, idx) => `${idx + 1}) ${q.statementAr}`
      ),
      sampleExerciseFr: generatedExercise.questions.map(
        (q, idx) => `${idx + 1}) ${q.statementFr}`
      ),
      sampleSolutionAr: generatedExercise.questions.map(
        (q, idx) => `${idx + 1}) ${q.solutionAr}`
      ),
      sampleSolutionFr: generatedExercise.questions.map(
        (q, idx) => `${idx + 1}) ${q.solutionFr}`
      ),
      customQuestionBaremes: generatedExercise.questions.map((q) => q.points),
      customQuestionLevels: generatedExercise.questions.map((q) => q.level),
    };

    onInsertLessonToExam(lessonItem);
    setInsertedSuccessBadge("FULL_EX");
    setTimeout(() => setInsertedSuccessBadge(null), 2600);
  };

  const handleCopyLatex = async () => {
    if (!generatedExercise) return;
    await navigator.clipboard.writeText(generatedExercise.fullLatexSnippet);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2200);
  };

  const currentPageHighlights = highlights.filter(
    (h) => h.pageNumber === currentPage
  );

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border-2 border-indigo-500/40 shadow-xl overflow-hidden">
      {/* شريط العنوان العلوي للعارض التفاعلي */}
      <div className="bg-gradient-to-l from-indigo-950 via-slate-900 to-slate-950 px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Highlighter className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-white">
                عارض وثائق PDF التفاعلي وتوليد التمارين بالتظليل الذكي (Interactive PDF Highlighter & AI Generator)
              </h3>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Multimodal Vision + Text AI
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              ارفع أي ملف PDF أو وثيقة مصورة، ثم <strong>ظلل بالماوس أي فقرة أو تمرين أو منحنى على الصفحة</strong> ليقوم الذكاء الاصطناعي فوراً بتوليد تمرين رياضي موازٍ مع الحل وسلم التنقيط!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition inline-flex items-center gap-1.5 shadow-sm">
            <FileUp className="w-4 h-4" />
            <span>رفع ملف PDF أو وثيقة للتظليل</span>
            <input
              type="file"
              accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {docSourceType !== "BUILTIN_SAMPLE" && (
            <button
              type="button"
              onClick={() => {
                setDocSourceType("BUILTIN_SAMPLE");
                setDocName("Sujet_Officiel_Bac_2BAC_SM_PC.pdf");
                setNumPages(BUILTIN_SAMPLE_PDF_PAGES.length);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              استعادة ملف PDF النموذجي المدمج
            </button>
          )}
        </div>
      </div>

      {/* الشبكة الرئيسية: يسار/يمين — عارض PDF التفاعلي (7 أعمدة) + محرك توليد التمارين من المقطع المظلل (5 أعمدة) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x xl:divide-x-reverse divide-slate-800">
        {/* ====================================================================
            القسم الأول (7 أعمدة): عارض PDF التفاعلي مع طبقة التظليل بالماوس
           ==================================================================== */}
        <div className="xl:col-span-7 flex flex-col bg-slate-900/70">
          {/* شريط أدوات العارض (التنقل بين الصفحات، التكبير، أداة التظليل) */}
          <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* أزرار وضع التظليل */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setInteractionTool("RECT_MARQUEE")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer ${
                  interactionTool === "RECT_MARQUEE"
                    ? "bg-amber-500 text-slate-950 shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
                title="اسحب بالماوس لرسم مستطيل تظليل حول أي تمرين أو صيغة رياضية في صفحة PDF"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>تظليل حر بالماوس (Drag Box)</span>
              </button>
              <button
                type="button"
                onClick={() => setInteractionTool("SECTION_CLICK")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer ${
                  interactionTool === "SECTION_CLICK"
                    ? "bg-cyan-500 text-slate-950 shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
                title="اختر فقرة أو تمريناً بنقرة واحدة أو ظلل النص مباشرة"
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>تحديد الفقرات السريع</span>
              </button>
            </div>

            {/* التنقل بين الصفحات */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-40 text-slate-200 cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] font-bold text-amber-300 px-1.5">
                صفحة {currentPage} / {numPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-40 text-slate-200 cursor-pointer"
                title="الصفحة الموالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* التكبير والتصغير + التوليد التلقائي */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setZoomScale((z) => Math.max(0.65, Number((z - 0.15).toFixed(2))))
                  }
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="تصغير الصفحة"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] font-bold text-slate-200 w-11 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomScale((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))
                  }
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="تكبير الصفحة"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTriggerAi}
                  onChange={(e) => setAutoTriggerAi(e.target.checked)}
                  className="accent-emerald-500 w-3.5 h-3.5"
                />
                <span>توليد فوري عند التظليل</span>
              </label>
            </div>
          </div>

          {/* شريط المقاطع السريعة القابلة للنقر المباشر */}
          {docSourceType === "BUILTIN_SAMPLE" && (
            <div className="px-3.5 py-2 bg-indigo-950/40 border-b border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="font-bold text-indigo-200 flex items-center gap-1">
                <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                <span>تظليل سريع لمقاطع الصفحة {currentPage}:</span>
              </span>
              {(
                BUILTIN_SAMPLE_PDF_PAGES[currentPage - 1]?.blocks ||
                BUILTIN_SAMPLE_PDF_PAGES[0].blocks
              ).map((blk) => (
                <button
                  key={blk.id}
                  type="button"
                  onClick={() => handleSelectStructuredBlock(blk)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 font-bold transition cursor-pointer"
                >
                  {blk.badge}
                </button>
              ))}
            </div>
          )}

          {/* حاوية صفحة PDF والتظليل التفاعلي */}
          <div className="relative flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-950/90 max-h-[680px] studio-scroll select-none">
            {isRenderingPage && (
              <div className="absolute inset-0 z-30 bg-slate-950/75 flex flex-col items-center justify-center gap-2 text-amber-300 font-bold text-xs">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري رسم صفحة PDF واستخراج الطبقات الرياضية...</span>
              </div>
            )}

            <div className="relative inline-block shadow-2xl rounded-lg overflow-hidden border-2 border-slate-700">
              {/* لوحة رسم صفحة PDF */}
              <canvas ref={canvasRef} className="block bg-white" />

              {/* طبقة التظليل التفاعلية فوق صفحة PDF */}
              <div
                ref={overlayRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`absolute inset-0 z-20 ${
                  interactionTool === "RECT_MARQUEE"
                    ? "cursor-crosshair"
                    : "cursor-pointer"
                }`}
              >
                {/* المناطق المظللة المحفوظة في هذه الصفحة */}
                {currentPageHighlights.map((hl, idx) => {
                  const isSelected = hl.id === activeHighlightId;
                  const colorClasses =
                    hl.color === "amber"
                      ? "bg-amber-400/25 border-amber-500"
                      : hl.color === "cyan"
                      ? "bg-cyan-400/25 border-cyan-500"
                      : hl.color === "emerald"
                      ? "bg-emerald-400/25 border-emerald-500"
                      : "bg-rose-400/25 border-rose-500";

                  return (
                    <div
                      key={hl.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHighlightId(hl.id);
                        setEditableHighlightText(hl.extractedText);
                        setActiveCroppedImg(hl.croppedImageDataUrl);
                        triggerAiExerciseFromHighlight({
                          highlightedText: hl.extractedText,
                          croppedImageBase64: hl.croppedImageDataUrl,
                          pageNum: hl.pageNumber,
                        });
                      }}
                      style={{
                        left: `${hl.nx * 100}%`,
                        top: `${hl.ny * 100}%`,
                        width: `${hl.nw * 100}%`,
                        height: `${hl.nh * 100}%`,
                      }}
                      className={`absolute border-2 rounded-md transition-all group ${colorClasses} ${
                        isSelected
                          ? "ring-2 ring-indigo-600 shadow-lg"
                          : "hover:opacity-90"
                      }`}
                    >
                      <div className=" -top-6 right-0 absolute flex items-center gap-1 bg-slate-950/95 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap">
                        <span className="text-amber-300 font-mono">
                          #{currentPageHighlights.length - idx}
                        </span>
                        <span>مقطع مظلل</span>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setHighlights((prev) =>
                              prev.filter((item) => item.id !== hl.id)
                            );
                          }}
                          className="text-rose-400 hover:text-rose-300 ml-1 cursor-pointer"
                          title="حذف التظليل"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* مستطيل التظليل الجاري سحبه بالماوس */}
                {isDragging && dragStart && dragCurrent && (
                  <div
                    style={{
                      left: `${Math.min(dragStart.nx, dragCurrent.nx) * 100}%`,
                      top: `${Math.min(dragStart.ny, dragCurrent.ny) * 100}%`,
                      width: `${Math.abs(dragCurrent.nx - dragStart.nx) * 100}%`,
                      height: `${Math.abs(dragCurrent.ny - dragStart.ny) * 100}%`,
                    }}
                    className="absolute border-2 border-dashed border-indigo-600 bg-amber-300/35 rounded-md pointer-events-none flex items-end justify-center pb-1"
                  >
                    <span className="bg-indigo-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded shadow">
                      أفلت الفأرة لتوليد التمرين المقابل بالذكاء الاصطناعي ✨
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* شريط التوجيه السفلي للعارض */}
          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-slate-200">{docName}</span>
              <span>·</span>
              <span>
                عدد المقاطع المظللة: <strong className="text-amber-300">{highlights.length}</strong>
              </span>
            </div>
            <div>
              اسحب المؤشر فوق أي معادلة أو تمرين أو جدول تغيرات لتظليله وتحويله إلى تمرين جديد.
            </div>
          </div>
        </div>

        {/* ====================================================================
            القسم الثاني (5 أعمدة): لوحة الذكاء الاصطناعي وتوليد التمارين من التظليل
           ==================================================================== */}
        <div className="xl:col-span-5 flex flex-col bg-slate-950 p-4 space-y-4 max-h-[800px] overflow-y-auto studio-scroll">
          {/* 1. معاينة المقطع المظلل ونمط التوليد */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                <Highlighter className="w-4 h-4" />
                <span>المقطع المظلل المستخرج من الوثيقة (ص. {currentPage})</span>
              </div>
              {highlights.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHighlights([])}
                  className="text-[10.5px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>مسح التظليلات</span>
                </button>
              )}
            </div>

            {/* صورة مصغرة للمنطقة المقصوصة من صفحة PDF */}
            {activeCroppedImg && (
              <div className="bg-white rounded-lg p-1.5 border border-slate-700 max-h-28 overflow-hidden flex items-center justify-center">
                <img
                  src={activeCroppedImg}
                  alt="Highlighted PDF Section"
                  className="max-h-24 object-contain"
                />
              </div>
            )}

            {/* النص المستخرج القابل للتعديل أو الإغناء */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                <span>النص أو الصيغ الرياضية المستخرجة من منطقة التظليل:</span>
                <span className="font-mono text-cyan-400">قابل للتعديل</span>
              </div>
              <textarea
                rows={3}
                value={editableHighlightText}
                onChange={(e) => setEditableHighlightText(e.target.value)}
                placeholder="ظلل أي منطقة على صفحة PDF أو اكتب/عدل النص الرياضي هنا..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-xs text-slate-100 font-mono leading-relaxed focus:border-amber-400 outline-none"
              />
            </div>

            {/* اختيار نمط التوليد الديداكتيكي */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                نمط توليد التمرين الرياضي بالذكاء الاصطناعي:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    {
                      id: "ISOMORPHIC_EXERCISE" as HighlightGenerationMode,
                      label: "1. تمرين موازٍ (Clone Isomorphe)",
                    },
                    {
                      id: "GRADUATED_QUESTIONS" as HighlightGenerationMode,
                      label: "2. أسئلة متدرجة (N1→N2→N3)",
                    },
                    {
                      id: "REMEDIATION_DRILL" as HighlightGenerationMode,
                      label: "3. تمرين دعم ومعالجة مركزة",
                    },
                    {
                      id: "SYNTHESIS_EXTENSION" as HighlightGenerationMode,
                      label: "4. توسيع توليفي (Type Bac)",
                    },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setGenerationMode(m.id);
                      triggerAiExerciseFromHighlight({
                        highlightedText: editableHighlightText,
                        croppedImageBase64: activeCroppedImg,
                        modeOverride: m.id,
                        pageNum: currentPage,
                      });
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-right border transition cursor-pointer ${
                      generationMode === m.id
                        ? "bg-indigo-600/30 border-indigo-400 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={() =>
                triggerAiExerciseFromHighlight({
                  highlightedText: editableHighlightText,
                  croppedImageBase64: activeCroppedImg,
                  pageNum: currentPage,
                })
              }
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-l from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تحليل المقطع المظلل وتوليد التمرين والحلول...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد تمرين رياضي جديد من المقطع المظلل</span>
                </>
              )}
            </button>
          </div>

          {/* 2. عرض التمرين المولد بالذكاء الاصطناعي وأزرار الإدراج في الفرض */}
          {generatedExercise && (
            <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-xl p-4 space-y-3.5">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{generatedExercise.detectedTopicAr}</span>
                  </div>
                  <h4 className="text-xs font-black text-white">
                    {generatedExercise.titleAr}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400" dir="ltr">
                    {generatedExercise.titleFr}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10.5px] font-bold px-2 py-0.5 rounded">
                    {generatedExercise.suggestedPoints} ن
                  </span>
                  <span className="bg-indigo-950 text-cyan-300 border border-indigo-700 font-mono text-[10.5px] font-bold px-2 py-0.5 rounded">
                    {generatedExercise.targetLevel}
                  </span>
                </div>
              </div>

              {/* قائمة الأسئلة المولدة مع الحلول */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">
                    الأسئلة المولدة ({generatedExercise.questions.length} أسئلة):
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSolutions((v) => !v)}
                    className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {showSolutions ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>إخفاء عناصر الإجابة</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>إظهار عناصر الإجابة</span>
                      </>
                    )}
                  </button>
                </div>

                {generatedExercise.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-indigo-600 text-white font-mono text-[10.5px] font-black px-2 py-0.5 rounded">
                          سؤال {q.num || qIdx + 1}
                        </span>
                        <span className="text-[10.5px] font-mono text-amber-300 font-bold">
                          [{q.points} ن · {q.level}]
                        </span>
                      </div>

                      {onInsertQuestionToExam && (
                        <button
                          type="button"
                          onClick={() => {
                            onInsertQuestionToExam({
                              questionAr: q.statementAr,
                              questionFr: q.statementFr,
                              solutionAr: q.solutionAr,
                              solutionFr: q.solutionFr,
                              points: q.points,
                              level: q.level,
                            });
                            setInsertedSuccessBadge(`Q_${qIdx}`);
                            setTimeout(() => setInsertedSuccessBadge(null), 2200);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          {insertedSuccessBadge === `Q_${qIdx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-300" />
                              <span>أُدرج السؤال!</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3 h-3 text-emerald-400" />
                              <span>إدراج هذا السؤال</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="text-slate-100 leading-relaxed font-semibold">
                      <MathText text={q.statementAr} />
                    </div>
                    <div
                      dir="ltr"
                      className="text-slate-300 leading-relaxed font-mono text-[11px] border-t border-slate-900 pt-1.5"
                    >
                      <MathText text={q.statementFr} />
                    </div>

                    {showSolutions && (
                      <div className="bg-emerald-950/35 border border-emerald-700/40 rounded-lg p-2.5 space-y-1 text-[11px]">
                        <div className="font-black text-emerald-300">
                          ✓ عناصر الإجابة والبرهان:
                        </div>
                        <div className="text-emerald-100 leading-relaxed">
                          <MathText text={q.solutionAr} />
                        </div>
                        <div
                          dir="ltr"
                          className="text-emerald-200/90 font-mono text-[10.5px] pt-1 border-t border-emerald-800/40"
                        >
                          <MathText text={q.solutionFr} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* أزرار الإدراج الكامل ونسخ كود LaTeX */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                {onInsertLessonToExam && (
                  <button
                    type="button"
                    onClick={handleInsertFullExerciseIntoExam}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {insertedSuccessBadge === "FULL_EX" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم إدراج التمرين كاملاً في ورقة الفرض A4!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>إدراج التمرين كاملاً في الفرض الحالي (A4)</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyLatex}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLatex ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">تم نسخ LaTeX</span>
                    </>
                  ) : (
                    <>
                      <FileCode2 className="w-4 h-4 text-amber-400" />
                      <span>نسخ LaTeX</span>
                    </>
                  )}
                </button>
              </div>

              {aiModelUsedLabel && (
                <div className="text-[10px] text-slate-400 font-mono text-left" dir="ltr">
                  Engine: {aiModelUsedLabel}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
