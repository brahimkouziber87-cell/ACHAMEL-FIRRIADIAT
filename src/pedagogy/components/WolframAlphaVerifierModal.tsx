import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  ExternalLink,
  FilePlus2,
  ImagePlus,
  Layers,
  LineChart,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { InsertedFigure } from "../data/curriculum";
import {
  formatMathTypography,
  WOLFRAM_HIGH_SCHOOL_PRESETS,
  WolframPresetItem,
} from "../utils/latexPackagesAndMath";
import { MathText } from "./MathRenderer";

export interface WolframPodItem {
  id: string;
  titleAr: string;
  titleFr: string;
  plaintext: string;
  latex?: string;
}

export interface WolframVerificationResult {
  isValid: boolean;
  validitySummaryAr: string;
  validitySummaryFr: string;
  inputLatex: string;
  exactResult: string;
  exactResultLatex: string;
  numericalApproximation: string;
  domain: string;
  difficultyLevel: "N1" | "N2" | "N3";
  suggestedPoints: number;
  pods: WolframPodItem[];
  stepByStepAr: string;
  stepByStepFr: string;
  suggestedQuestionAr: string;
  suggestedQuestionFr: string;
}

interface WolframAlphaVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackLabel: string;
  selectedAiModel: "gemini-3.8-flash" | "gemini-4-argon";
  lessons?: Array<{ lessonAr: string; lessonFr: string }>;
  onInsertVerifiedQuestion?: (payload: {
    questionAr: string;
    questionFr: string;
    solutionAr: string;
    solutionFr: string;
    points: number;
    level: "N1" | "N2" | "N3";
    latexCode: string;
    targetLessonIndex?: number;
  }) => void;
  onInsertFigureToExam?: (fig: InsertedFigure) => void;
}

const QUICK_MATH_TOKENS = [
  { label: "lim x→0", token: "limit of (...) as x -> 0" },
  { label: "lim x→+∞", token: "limit of (...) as x -> +infinity" },
  { label: "∫ f(x)dx", token: "integrate (...) dx from x = 0 to 1" },
  { label: "d/dx", token: "derivative of (...)" },
  { label: "ln(x)", token: "ln(x)" },
  { label: "e^(x)", token: "e^(x)" },
  { label: "√(x)", token: "sqrt(x)" },
  { label: "z ∈ ℂ", token: "solve z^2 - 2z + 2 = 0 over complex" },
  { label: "y'' + ay' + by = 0", token: "y'' - 3y' + 2y = e^x" },
  { label: "a ≡ b [n]", token: "solve 17x = 1 mod 43" },
];

interface WolframPlotPreset {
  id: string;
  labelAr: string;
  labelFr: string;
  badge: string;
  expr: string;
  secondaryExpr: string;
  formulaDisplay: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  tangentX0: number;
  asymptoteX?: number;
}

const WOLFRAM_PLOT_PRESETS: WolframPlotPreset[] = [
  {
    id: "exp_bac",
    labelAr: "دالة أسية (وطني 2Bac)",
    labelFr: "f(x) = (x - 1)e^x + 1",
    badge: "2Bac PC/SVT",
    expr: "(x - 1)*exp(x) + 1",
    secondaryExpr: "1",
    formulaDisplay: "f(x) = (x - 1)e^x + 1",
    xMin: -3.5,
    xMax: 2.2,
    yMin: -1.5,
    yMax: 4.5,
    tangentX0: 0,
  },
  {
    id: "ln_bac",
    labelAr: "دالة لوغاريتمية ومنصف",
    labelFr: "f(x) = x - 1 - ln(x)",
    badge: "2Bac / المتتاليات",
    expr: "x - 1 - ln(x)",
    secondaryExpr: "x",
    formulaDisplay: "f(x) = x - 1 - ln(x)",
    xMin: -0.5,
    xMax: 4.5,
    yMin: -1,
    yMax: 4,
    tangentX0: 1,
    asymptoteX: 0,
  },
  {
    id: "cubic_1bac",
    labelAr: "دالة حدودية من الدرجة 3",
    labelFr: "f(x) = x^3 - 3x + 1",
    badge: "1Bac / TCS",
    expr: "x^3 - 3*x + 1",
    secondaryExpr: "",
    formulaDisplay: "f(x) = x^3 - 3x + 1",
    xMin: -2.8,
    xMax: 2.8,
    yMin: -3.2,
    yMax: 4.2,
    tangentX0: -1,
  },
  {
    id: "rational_oblique",
    labelAr: "دالة جذرية ومقارب مائل",
    labelFr: "f(x) = x - 1 + 1/(x - 1)",
    badge: "1Bac / 2Bac",
    expr: "x - 1 + 1/(x - 1)",
    secondaryExpr: "x - 1",
    formulaDisplay: "f(x) = x - 1 + 1/(x - 1)",
    xMin: -2.5,
    xMax: 4.5,
    yMin: -4.5,
    yMax: 4.5,
    tangentX0: 2,
    asymptoteX: 1,
  },
  {
    id: "ln_over_x",
    labelAr: "دالة لوغاريتمية كسرية",
    labelFr: "f(x) = 2*ln(x)/x + 1",
    badge: "2Bac SM/PC",
    expr: "2*ln(x)/x + 1",
    secondaryExpr: "1",
    formulaDisplay: "f(x) = 2ln(x)/x + 1",
    xMin: -0.5,
    xMax: 6,
    yMin: -2.5,
    yMax: 3.5,
    tangentX0: Math.E,
    asymptoteX: 0,
  },
  {
    id: "radical_branch",
    labelAr: "دالة لاجذرية وفرع لا نهائي",
    labelFr: "f(x) = sqrt(x^2 + 1) - x",
    badge: "2Bac SM",
    expr: "sqrt(x^2 + 1) - x",
    secondaryExpr: "-2*x",
    formulaDisplay: "f(x) = √(x² + 1) - x",
    xMin: -3,
    xMax: 3.5,
    yMin: -1,
    yMax: 5.5,
    tangentX0: 0,
  },
];

/**
 * تحويل ذكي لأي صيغة رياضية مكتوبة بصيغة Wolfram أو الرياضيات الطبيعية إلى تعبير قابل للحساب العددي بدقة
 */
function evaluateWolframMathExpr(rawExpr: string, xVal: number): number {
  const cleaned = rawExpr.trim();
  if (!cleaned) return NaN;

  try {
    let expr = cleaned
      // إزالة البادئات مثل f(x) = أو y = أو plot
      .replace(/^(?:plot\s+)?(?:[fghy]\s*\(\s*x\s*\)|y)\s*=\s*/i, "")
      .replace(/\\ln/g, "ln")
      .replace(/\\exp/g, "exp")
      .replace(/\\sin/g, "sin")
      .replace(/\\cos/g, "cos")
      .replace(/\\tan/g, "tan")
      .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "(($1)/($2))")
      .replace(/π|pi\b/gi, "Math.PI")
      // تحويل e^(...) أو e^x إلى exp(...)
      .replace(/\be\s*\^\s*\(([^)]+)\)/g, "exp($1)")
      .replace(/\be\s*\^\s*([a-zA-Z0-9_]+)/g, "exp($1)")
      // ضرب ضمني مثل 3x أو 2(x+1) أو (x-1)(x+1) أو x ln(x)
      .replace(/(\d)\s*([x(])/g, "$1*$2")
      .replace(/(\))\s*(\()/g, "$1*$2")
      .replace(/(\))\s*([a-zA-Z0-9])/g, "$1*$2")
      .replace(/\bx\s*(\()/g, "x*$1")
      .replace(/(\d)\s*(ln|log|exp|sin|cos|tan|sqrt|abs)\b/g, "$1*$2")
      .replace(/\bx\s*(ln|log|exp|sin|cos|tan|sqrt|abs)\b/g, "x*$1")
      .replace(/\^/g, "**")
      .replace(/\bln\s*\(/g, "Math.log(")
      .replace(/\blog\s*\(/g, "Math.log10(")
      .replace(/\bexp\s*\(/g, "Math.exp(")
      .replace(/\bsin\s*\(/g, "Math.sin(")
      .replace(/\bcos\s*\(/g, "Math.cos(")
      .replace(/\btan\s*\(/g, "Math.tan(")
      .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
      .replace(/\babs\s*\(/g, "Math.abs(")
      .replace(/\be\b/g, "Math.E");

    const fn = new Function("x", `"use strict"; return (${expr});`);
    const y = Number(fn(xVal));
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

/**
 * استخلاص تعبير الدالة القابل للرسم تلقائياً من استعلام WolframAlpha العام (مثل النهايات أو التكامل أو المشتقة)
 */
function extractPlottableFunctionFromQuery(rawQuery: string): string | null {
  const q = rawQuery.trim();
  if (!q) return null;

  // Limit query: limit of EXPR as x -> ...
  const limMatch = q.match(/limit\s+of\s+(.+?)\s+as\s+x\s*->/i);
  if (limMatch && limMatch[1]) return limMatch[1].trim();

  // Integrate query: integrate EXPR dx ...
  const intMatch = q.match(/integrate\s+(.+?)\s+dx/i);
  if (intMatch && intMatch[1]) return intMatch[1].trim();

  // Derivative query: derivative of EXPR
  const derMatch = q.match(/derivative\s+of\s+(.+)$/i);
  if (derMatch && derMatch[1]) return derMatch[1].trim();

  // Solve equation in x: solve EXPR = 0
  const solveMatch = q.match(/solve\s+([^=]+?)\s*=\s*0/i);
  if (solveMatch && solveMatch[1] && solveMatch[1].includes("x")) {
    return solveMatch[1].trim();
  }

  // Direct function in x
  if (q.includes("x") && !q.includes("y'") && !q.includes("mod")) {
    return q.replace(/^(?:plot\s+)?(?:[fghy]\s*\(\s*x\s*\)|y)\s*=\s*/i, "").trim();
  }

  return null;
}

export const WolframAlphaVerifierModal: React.FC<
  WolframAlphaVerifierModalProps
> = ({
  isOpen,
  onClose,
  trackLabel,
  selectedAiModel,
  lessons = [],
  onInsertVerifiedQuestion,
  onInsertFigureToExam,
}) => {
  const [query, setQuery] = useState<string>(
    WOLFRAM_HIGH_SCHOOL_PRESETS[0].query
  );
  const [operationType, setOperationType] = useState<string>("VERIFY_AND_SOLVE");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<WolframVerificationResult | null>(null);
  const [engineSource, setEngineSource] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [insertedSuccess, setInsertedSuccess] = useState<boolean>(false);
  const [targetLessonIndex, setTargetLessonIndex] = useState<number>(0);
  const [customPoints, setCustomPoints] = useState<number>(1.5);
  const [customLevel, setCustomLevel] = useState<"N1" | "N2" | "N3">("N2");

  // ============================================================================
  // حالات مختبر الرسم البياني للدوال والمعادلات (Wolfram Function Plotter State)
  // ============================================================================
  const [plotExpr, setPlotExpr] = useState<string>(WOLFRAM_PLOT_PRESETS[0].expr);
  const [secondaryExpr, setSecondaryExpr] = useState<string>(
    WOLFRAM_PLOT_PRESETS[0].secondaryExpr
  );
  const [formulaLabel, setFormulaLabel] = useState<string>(
    WOLFRAM_PLOT_PRESETS[0].formulaDisplay
  );
  const [xMin, setXMin] = useState<number>(WOLFRAM_PLOT_PRESETS[0].xMin);
  const [xMax, setXMax] = useState<number>(WOLFRAM_PLOT_PRESETS[0].xMax);
  const [yMin, setYMin] = useState<number>(WOLFRAM_PLOT_PRESETS[0].yMin);
  const [yMax, setYMax] = useState<number>(WOLFRAM_PLOT_PRESETS[0].yMax);
  const [tangentX0, setTangentX0] = useState<number>(
    WOLFRAM_PLOT_PRESETS[0].tangentX0
  );
  const [asymptoteX, setAsymptoteX] = useState<string>("");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showTangentAtX0, setShowTangentAtX0] = useState<boolean>(true);
  const [showExtremaDots, setShowExtremaDots] = useState<boolean>(true);
  const [plotColorMode, setPlotColorMode] = useState<"ACADEMIC_COLOR" | "EXAM_BW">(
    "ACADEMIC_COLOR"
  );
  const [figureTargetExerciseId, setFigureTargetExerciseId] = useState<string>("ex_0");
  const [figureWidthPercent, setFigureWidthPercent] = useState<number>(75);
  const [figureAlignment, setFigureAlignment] = useState<"center" | "right" | "left">(
    "center"
  );
  const [plotInsertedSuccess, setPlotInsertedSuccess] = useState<boolean>(false);

  // توليد منحنى الدالة (Function Plot SVG) عالي الدقة مع المماس والمقاربات والمعلم المتعامد الممنظم (O, i, j)
  const generatedPlotData = useMemo(() => {
    const width = 720;
    const height = 400;
    const padLeft = 48;
    const padRight = 28;
    const padTop = 36;
    const padBottom = 38;
    const pW = width - padLeft - padRight;
    const pH = height - padTop - padBottom;

    const safeXMin = Number.isFinite(xMin) ? xMin : -4;
    const safeXMax = Number.isFinite(xMax) && xMax > safeXMin + 0.2 ? xMax : safeXMin + 6;
    const safeYMin = Number.isFinite(yMin) ? yMin : -3;
    const safeYMax = Number.isFinite(yMax) && yMax > safeYMin + 0.2 ? yMax : safeYMin + 6;

    const mapX = (x: number) =>
      padLeft + ((x - safeXMin) / (safeXMax - safeXMin)) * pW;
    const mapY = (y: number) =>
      padTop + pH - ((y - safeYMin) / (safeYMax - safeYMin)) * pH;

    const isBW = plotColorMode === "EXAM_BW";
    const curvePrimaryColor = isBW ? "#0f172a" : "#1d4ed8";
    const curveSecondaryColor = isBW ? "#475569" : "#d97706";
    const tangentColor = isBW ? "#1e293b" : "#059669";
    const asymptoteColor = isBW ? "#334155" : "#dc2626";
    const gridColor = isBW ? "#e2e8f0" : "#e2e8f0";
    const subGridColor = "#f1f5f9";

    let svgBody = `
      <defs>
        <clipPath id="wolframPlotClip">
          <rect x="${padLeft}" y="${padTop}" width="${pW}" height="${pH}" rx="6"/>
        </clipPath>
        <marker id="axisArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0f172a"/>
        </marker>
        <marker id="vecArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0f172a"/>
        </marker>
        <marker id="tanEnd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="${tangentColor}"/>
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="#ffffff"/>
      <rect x="${padLeft}" y="${padTop}" width="${pW}" height="${pH}" rx="6" fill="#ffffff" stroke="#334155" stroke-width="1.4"/>
    `;

    // 1. Grid lines (Sub-grid 0.5 & Main integer grid)
    if (showGrid) {
      for (let gx = Math.ceil(safeXMin * 2) / 2; gx <= Math.floor(safeXMax * 2) / 2; gx += 0.5) {
        if (Math.abs(gx % 1) > 0.01) {
          const px = mapX(gx);
          svgBody += `<line x1="${px.toFixed(1)}" y1="${padTop}" x2="${px.toFixed(1)}" y2="${padTop + pH}" stroke="${subGridColor}" stroke-width="0.7"/>`;
        }
      }
      for (let gy = Math.ceil(safeYMin * 2) / 2; gy <= Math.floor(safeYMax * 2) / 2; gy += 0.5) {
        if (Math.abs(gy % 1) > 0.01) {
          const py = mapY(gy);
          svgBody += `<line x1="${padLeft}" y1="${py.toFixed(1)}" x2="${padLeft + pW}" y2="${py.toFixed(1)}" stroke="${subGridColor}" stroke-width="0.7"/>`;
        }
      }

      for (let gx = Math.ceil(safeXMin); gx <= Math.floor(safeXMax); gx++) {
        const px = mapX(gx);
        svgBody += `<line x1="${px.toFixed(1)}" y1="${padTop}" x2="${px.toFixed(1)}" y2="${padTop + pH}" stroke="${gridColor}" stroke-width="1"/>`;
      }
      for (let gy = Math.ceil(safeYMin); gy <= Math.floor(safeYMax); gy++) {
        const py = mapY(gy);
        svgBody += `<line x1="${padLeft}" y1="${py.toFixed(1)}" x2="${padLeft + pW}" y2="${py.toFixed(1)}" stroke="${gridColor}" stroke-width="1"/>`;
      }
    }

    // 2. Axes (Ox) and (Oy) + Orthonormal basis (O, i, j)
    const ox = mapX(0);
    const oy = mapY(0);
    const clampedOy = Math.min(padTop + pH, Math.max(padTop, oy));
    const clampedOx = Math.min(padLeft + pW, Math.max(padLeft, ox));

    // X-Axis
    svgBody += `<line x1="${padLeft}" y1="${clampedOy.toFixed(1)}" x2="${padLeft + pW}" y2="${clampedOy.toFixed(1)}" stroke="#0f172a" stroke-width="1.7" marker-end="url(#axisArrow)"/>`;
    // Y-Axis
    svgBody += `<line x1="${clampedOx.toFixed(1)}" y1="${padTop + pH}" x2="${clampedOx.toFixed(1)}" y2="${padTop}" stroke="#0f172a" stroke-width="1.7" marker-end="url(#axisArrow)"/>`;

    // Tick labels
    for (let gx = Math.ceil(safeXMin); gx <= Math.floor(safeXMax); gx++) {
      if (gx === 0) continue;
      const px = mapX(gx);
      const labelY = Math.min(padTop + pH - 6, Math.max(padTop + 14, clampedOy + 15));
      svgBody += `
        <line x1="${px.toFixed(1)}" y1="${(clampedOy - 3).toFixed(1)}" x2="${px.toFixed(1)}" y2="${(clampedOy + 3).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>
        <text x="${px.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="bold" fill="#334155">${gx}</text>
      `;
    }

    for (let gy = Math.ceil(safeYMin); gy <= Math.floor(safeYMax); gy++) {
      if (gy === 0) continue;
      const py = mapY(gy);
      const labelX = Math.min(padLeft + pW - 14, Math.max(padLeft + 16, clampedOx - 8));
      svgBody += `
        <line x1="${(clampedOx - 3).toFixed(1)}" y1="${py.toFixed(1)}" x2="${(clampedOx + 3).toFixed(1)}" y2="${py.toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>
        <text x="${labelX.toFixed(1)}" y="${(py + 3.5).toFixed(1)}" text-anchor="end" font-family="monospace" font-size="10.5" font-weight="bold" fill="#334155">${gy}</text>
      `;
    }

    // Origin O and unit vectors i, j
    if (ox >= padLeft && ox <= padLeft + pW && oy >= padTop && oy <= padTop + pH) {
      svgBody += `<text x="${(ox - 10).toFixed(1)}" y="${(oy + 14).toFixed(1)}" font-family="serif" font-weight="bold" font-style="italic" font-size="13" fill="#0f172a">O</text>`;
      if (1 >= safeXMin && 1 <= safeXMax) {
        svgBody += `
          <line x1="${ox.toFixed(1)}" y1="${oy.toFixed(1)}" x2="${mapX(1).toFixed(1)}" y2="${oy.toFixed(1)}" stroke="#0f172a" stroke-width="2.5" marker-end="url(#vecArrow)"/>
          <text x="${((ox + mapX(1)) / 2).toFixed(1)}" y="${(oy - 6).toFixed(1)}" text-anchor="middle" font-family="serif" font-weight="bold" font-style="italic" font-size="12" fill="#0f172a">i⃗</text>
        `;
      }
      if (1 >= safeYMin && 1 <= safeYMax) {
        svgBody += `
          <line x1="${ox.toFixed(1)}" y1="${oy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${mapY(1).toFixed(1)}" stroke="#0f172a" stroke-width="2.5" marker-end="url(#vecArrow)"/>
          <text x="${(ox + 10).toFixed(1)}" y="${((oy + mapY(1)) / 2 + 4).toFixed(1)}" font-family="serif" font-weight="bold" font-style="italic" font-size="12" fill="#0f172a">j⃗</text>
        `;
      }
    }

    // Axis end labels x and y
    svgBody += `
      <text x="${padLeft + pW - 10}" y="${(clampedOy - 8).toFixed(1)}" font-family="serif" font-weight="bold" font-style="italic" font-size="13" fill="#0f172a">x</text>
      <text x="${(clampedOx + 12).toFixed(1)}" y="${padTop + 14}" font-family="serif" font-weight="bold" font-style="italic" font-size="13" fill="#0f172a">y</text>
    `;

    // Clipped Curve Area
    svgBody += `<g clip-path="url(#wolframPlotClip)">`;

    // Vertical Asymptote x = a if specified
    if (asymptoteX.trim() !== "" && Number.isFinite(Number(asymptoteX))) {
      const axVal = Number(asymptoteX);
      const axPx = mapX(axVal);
      svgBody += `<line x1="${axPx.toFixed(1)}" y1="${padTop}" x2="${axPx.toFixed(1)}" y2="${padTop + pH}" stroke="${asymptoteColor}" stroke-width="1.6" stroke-dasharray="6,4"/>`;
    }

    // Secondary curve g(x) / Oblique asymptote / y = x
    if (secondaryExpr.trim().length > 0) {
      const secSteps = 220;
      let secSeg: string[] = [];
      const secSegments: string[] = [];
      for (let i = 0; i <= secSteps; i++) {
        const xv = safeXMin + (i / secSteps) * (safeXMax - safeXMin);
        const yv = evaluateWolframMathExpr(secondaryExpr, xv);
        if (Number.isFinite(yv) && Math.abs(yv) < 1e4) {
          secSeg.push(`${mapX(xv).toFixed(1)},${mapY(yv).toFixed(1)}`);
        } else {
          if (secSeg.length > 1) secSegments.push(secSeg.join(" "));
          secSeg = [];
        }
      }
      if (secSeg.length > 1) secSegments.push(secSeg.join(" "));
      secSegments.forEach((pts) => {
        svgBody += `<polyline fill="none" stroke="${curveSecondaryColor}" stroke-width="1.7" stroke-dasharray="6,4" points="${pts}"/>`;
      });
    }

    // Primary Curve (C_f) with discontinuity jump protection
    const steps = 400;
    let currentSegment: string[] = [];
    const segments: string[] = [];
    let prevY: number | null = null;
    const ySpan = safeYMax - safeYMin;

    const detectedExtrema: Array<{ x: number; y: number; kind: "MAX" | "MIN" }> = [];
    let prevSlope: number | null = null;

    for (let i = 0; i <= steps; i++) {
      const xv = safeXMin + (i / steps) * (safeXMax - safeXMin);
      const yv = evaluateWolframMathExpr(plotExpr, xv);

      if (
        Number.isFinite(yv) &&
        yv >= safeYMin - ySpan * 1.5 &&
        yv <= safeYMax + ySpan * 1.5
      ) {
        // Check for vertical asymptote jump
        if (prevY !== null && Math.abs(yv - prevY) > ySpan * 1.2) {
          if (currentSegment.length > 1) segments.push(currentSegment.join(" "));
          currentSegment = [];
        }
        currentSegment.push(`${mapX(xv).toFixed(1)},${mapY(yv).toFixed(1)}`);

        // Numerical derivative sign change detection for local extrema
        const h = (safeXMax - safeXMin) / 1000;
        const yNext = evaluateWolframMathExpr(plotExpr, xv + h);
        if (Number.isFinite(yNext)) {
          const slope = (yNext - yv) / h;
          if (
            prevSlope !== null &&
            Math.abs(slope) < 25 &&
            Math.abs(prevSlope) < 25 &&
            yv >= safeYMin &&
            yv <= safeYMax
          ) {
            if (prevSlope > 0 && slope <= 0 && detectedExtrema.length < 5) {
              detectedExtrema.push({ x: xv, y: yv, kind: "MAX" });
            } else if (prevSlope < 0 && slope >= 0 && detectedExtrema.length < 5) {
              detectedExtrema.push({ x: xv, y: yv, kind: "MIN" });
            }
          }
          prevSlope = slope;
        }
        prevY = yv;
      } else {
        if (currentSegment.length > 1) segments.push(currentSegment.join(" "));
        currentSegment = [];
        prevY = null;
        prevSlope = null;
      }
    }
    if (currentSegment.length > 1) segments.push(currentSegment.join(" "));

    segments.forEach((pts) => {
      svgBody += `<polyline fill="none" stroke="${curvePrimaryColor}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>`;
    });

    // Extrema markers & horizontal tangent segments
    if (showExtremaDots) {
      detectedExtrema.forEach((ext) => {
        const exPx = mapX(ext.x);
        const eyPx = mapY(ext.y);
        svgBody += `
          <line x1="${(exPx - 24).toFixed(1)}" y1="${eyPx.toFixed(1)}" x2="${(exPx + 24).toFixed(1)}" y2="${eyPx.toFixed(1)}" stroke="${tangentColor}" stroke-width="1.8" marker-start="url(#tanEnd)" marker-end="url(#tanEnd)"/>
          <circle cx="${exPx.toFixed(1)}" cy="${eyPx.toFixed(1)}" r="3.8" fill="${tangentColor}" stroke="#ffffff" stroke-width="1.2"/>
        `;
      });
    }

    // Tangent at user-specified x0
    let tangentInfo: {
      x0: number;
      y0: number;
      slope: number;
      equation: string;
    } | null = null;

    if (showTangentAtX0 && Number.isFinite(tangentX0)) {
      const y0 = evaluateWolframMathExpr(plotExpr, tangentX0);
      const h = 1e-5;
      const yPlus = evaluateWolframMathExpr(plotExpr, tangentX0 + h);
      const yMinus = evaluateWolframMathExpr(plotExpr, tangentX0 - h);
      const slope = (yPlus - yMinus) / (2 * h);

      if (Number.isFinite(y0) && Number.isFinite(slope) && Math.abs(slope) < 1e3) {
        const dx = (safeXMax - safeXMin) * 0.16;
        const x1 = tangentX0 - dx;
        const y1 = y0 + slope * (x1 - tangentX0);
        const x2 = tangentX0 + dx;
        const y2 = y0 + slope * (x2 - tangentX0);

        const tx0 = mapX(tangentX0);
        const ty0 = mapY(y0);

        // Dashed projection lines to axes
        svgBody += `
          <line x1="${tx0.toFixed(1)}" y1="${ty0.toFixed(1)}" x2="${tx0.toFixed(1)}" y2="${clampedOy.toFixed(1)}" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="${tx0.toFixed(1)}" y1="${ty0.toFixed(1)}" x2="${clampedOx.toFixed(1)}" y2="${ty0.toFixed(1)}" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="${mapX(x1).toFixed(1)}" y1="${mapY(y1).toFixed(1)}" x2="${mapX(x2).toFixed(1)}" y2="${mapY(y2).toFixed(1)}" stroke="${tangentColor}" stroke-width="2" marker-start="url(#tanEnd)" marker-end="url(#tanEnd)"/>
          <circle cx="${tx0.toFixed(1)}" cy="${ty0.toFixed(1)}" r="4.5" fill="#ffffff" stroke="${tangentColor}" stroke-width="2.2"/>
        `;

        const intercept = y0 - slope * tangentX0;
        const mRound = Number(slope.toFixed(2));
        const bRound = Number(intercept.toFixed(2));
        const eqStr =
          Math.abs(mRound) < 0.001
            ? `y = ${ Number(y0.toFixed(2)) }`
            : `y = ${mRound}x ${bRound >= 0 ? `+ ${bRound}` : `- ${Math.abs(bRound)}`}`;

        tangentInfo = {
          x0: Number(tangentX0.toFixed(2)),
          y0: Number(y0.toFixed(2)),
          slope: mRound,
          equation: eqStr,
        };
      }
    }

    svgBody += `</g>`;

    // Header Legend Badge on the Plot
    const cleanLabel = (formulaLabel || `f(x) = ${plotExpr}`).slice(0, 42);
    svgBody += `
      <g transform="translate(${padLeft + 10}, ${padTop + 10})">
        <rect x="0" y="0" width="${Math.max(195, cleanLabel.length * 7.2 + 44)}" height="${secondaryExpr.trim() ? 44 : 26}" rx="5" fill="#ffffff" fill-opacity="0.94" stroke="#cbd5e1" stroke-width="1.1"/>
        <line x1="10" y1="13" x2="28" y2="13" stroke="${curvePrimaryColor}" stroke-width="2.6"/>
        <text x="34" y="17" font-family="serif" font-weight="bold" font-size="12" fill="#0f172a">(C_f) : ${cleanLabel}</text>
        ${
          secondaryExpr.trim()
            ? `<line x1="10" y1="31" x2="28" y2="31" stroke="${curveSecondaryColor}" stroke-width="1.8" stroke-dasharray="4,3"/>
               <text x="34" y="35" font-family="serif" font-weight="bold" font-size="11" fill="#475569">(Δ) : y = ${secondaryExpr.trim()}</text>`
            : ""
        }
      </g>
    `;

    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%">${svgBody}</svg>`;
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;

    const tikzSnippet = [
      "% الشكل التوضيحي المولد عبر مختبر WolframAlpha (PGFPlots / TikZ)",
      "\\begin{center}",
      "\\begin{tikzpicture}[scale=0.92]",
      "  \\begin{axis}[",
      "    axis lines = middle,",
      "    grid = both,",
      `    xmin = ${safeXMin}, xmax = ${safeXMax},`,
      `    ymin = ${safeYMin}, ymax = ${safeYMax},`,
      "    xlabel = {$x$}, ylabel = {$y$},",
      "    samples = 200",
      "  ]",
      `    \\addplot[domain=${safeXMin}:${safeXMax}, ultra thick, blue] {${plotExpr}};`,
      secondaryExpr.trim()
        ? `    \\addplot[domain=${safeXMin}:${safeXMax}, dashed, thick, orange] {${secondaryExpr.trim()}};`
        : "",
      `    \\node[above right, blue] at (axis cs:${((safeXMin + safeXMax) / 2).toFixed(1)},${(safeYMax - 0.8).toFixed(1)}) {$(\\mathcal{C}_f): ${cleanLabel}$};`,
      "  \\end{axis}",
      "\\end{tikzpicture}",
      "\\end{center}",
    ]
      .filter(Boolean)
      .join("\n");

    return {
      svgMarkup,
      svgDataUrl,
      tikzSnippet,
      tangentInfo,
      hasValidPoints: segments.length > 0,
      detectedExtremaCount: detectedExtrema.length,
    };
  }, [
    plotExpr,
    secondaryExpr,
    formulaLabel,
    xMin,
    xMax,
    yMin,
    yMax,
    tangentX0,
    asymptoteX,
    showGrid,
    showTangentAtX0,
    showExtremaDots,
    plotColorMode,
  ]);

  if (!isOpen) return null;

  const handleSyncQueryToPlotter = (rawQ: string) => {
    const extracted = extractPlottableFunctionFromQuery(rawQ);
    if (extracted) {
      setPlotExpr(extracted);
      setFormulaLabel(`f(x) = ${extracted}`);
    }
  };

  const handleVerifyFormula = async (customQuery?: string, customOp?: string) => {
    const targetQuery = (customQuery ?? query).trim();
    if (!targetQuery) return;

    handleSyncQueryToPlotter(targetQuery);
    setIsLoading(true);
    setErrorMsg(null);
    setInsertedSuccess(false);

    try {
      const response = await fetch("/api/wolfram/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: targetQuery,
          operationType: customOp ?? operationType,
          trackLabel,
          modelChoice: selectedAiModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.verification) {
        throw new Error(data.error || "تعذر الاتصال بمحرك التحقق الرياضي");
      }

      setResult(data.verification);
      setEngineSource(data.source || "WolframSymbolic Engine");
      if (data.verification.suggestedPoints) {
        setCustomPoints(Number(data.verification.suggestedPoints) || 1.5);
      }
      if (data.verification.difficultyLevel) {
        setCustomLevel(data.verification.difficultyLevel);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "خطأ أثناء فحص الصيغة الرياضية"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: WolframPresetItem) => {
    setQuery(preset.query);
    setOperationType(preset.operationType);
    handleVerifyFormula(preset.query, preset.operationType);
  };

  const handleSelectPlotPreset = (p: WolframPlotPreset) => {
    setPlotExpr(p.expr);
    setSecondaryExpr(p.secondaryExpr);
    setFormulaLabel(p.formulaDisplay);
    setXMin(p.xMin);
    setXMax(p.xMax);
    setYMin(p.yMin);
    setYMax(p.yMax);
    setTangentX0(p.tangentX0);
    setAsymptoteX(p.asymptoteX !== undefined ? String(p.asymptoteX) : "");
  };

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInsertIntoExam = () => {
    if (!result || !onInsertVerifiedQuestion) return;
    onInsertVerifiedQuestion({
      questionAr:
        result.suggestedQuestionAr ||
        `أحسب وتحقق من صحة النتيجة الرياضية التالية: ${query}`,
      questionFr:
        result.suggestedQuestionFr ||
        `Calculer et vérifier le résultat mathématique suivant : ${query}`,
      solutionAr: result.stepByStepAr || result.exactResult,
      solutionFr: result.stepByStepFr || result.exactResult,
      points: customPoints,
      level: customLevel,
      latexCode: result.inputLatex || query,
      targetLessonIndex,
    });
    setInsertedSuccess(true);
    setTimeout(() => setInsertedSuccess(false), 3000);
  };

  // إدراج المنحنى البياني المولد مباشرة كشكل توضيحي في ورقة الفرض A4
  const handleInsertFunctionPlotToExam = (alsoInsertGraphicalQuestion = false) => {
    if (!onInsertFigureToExam) return;

    const cleanFormula = formulaLabel.trim() || `f(x) = ${plotExpr}`;
    const newFigure: InsertedFigure = {
      id: `fig_wolfram_plot_${Date.now()}`,
      exerciseId: figureTargetExerciseId,
      titleAr: `الشكل المرفق: التمثيل المبياني (C_f) للدالة ${cleanFormula} في معلم متعامد ممنظم (O, i⃗, j⃗)`,
      titleFr: `Figure ci-jointe : Courbe représentative (C_f) de ${cleanFormula} dans un repère orthonormé (O, i⃗, j⃗)`,
      dataUrl: generatedPlotData.svgDataUrl,
      caption: `التمثيل المبياني (C_f) المولد عبر مختبر WolframAlpha للدالة ${cleanFormula}${
        generatedPlotData.tangentInfo
          ? ` مع المماس (T) عند الأفصول x₀ = ${generatedPlotData.tangentInfo.x0} (${generatedPlotData.tangentInfo.equation})`
          : ""
      }.`,
      showCaption: true,
      borderStyle: "academic",
      widthPercent: figureWidthPercent,
      alignment: figureAlignment,
    };

    onInsertFigureToExam(newFigure);

    if (alsoInsertGraphicalQuestion && onInsertVerifiedQuestion) {
      const exMatch = figureTargetExerciseId.match(/^ex_(\d+)$/);
      const targetIdx = exMatch ? Number(exMatch[1]) : targetLessonIndex;
      const tanTextAr = generatedPlotData.tangentInfo
        ? ` ومعادلة المماس (T) عند النقطة ذات الأفصول x₀ = ${generatedPlotData.tangentInfo.x0}`
        : "";
      const tanTextFr = generatedPlotData.tangentInfo
        ? ` ainsi que l'équation de la tangente (T) au point d'abscisse x₀ = ${generatedPlotData.tangentInfo.x0}`
        : "";

      onInsertVerifiedQuestion({
        questionAr: `بقراءة مبيانية من المنحنى (C_f) المرفق للدالة ${cleanFormula} في المعلم المتعامد الممنظم (O, i⃗, j⃗)، حدد جدول تغيرات الدالة f ورتابتها على مجال الدراسة${tanTextAr}.`,
        questionFr: `Par lecture graphique de la courbe (C_f) ci-jointe de ${cleanFormula} dans le repère orthonormé (O, i⃗, j⃗), dresser le tableau de variations de f${tanTextFr}.`,
        solutionAr: `من خلال المنحنى (C_f) الممثل للدالة ${cleanFormula} على المجال [${xMin}, ${xMax}]${
          generatedPlotData.tangentInfo
            ? `، نجد f(${generatedPlotData.tangentInfo.x0}) = ${generatedPlotData.tangentInfo.y0} والعدد المشتق f'(${generatedPlotData.tangentInfo.x0}) = ${generatedPlotData.tangentInfo.slope} ومنه معادلة المماس: ${generatedPlotData.tangentInfo.equation}.`
            : "."
        }`,
        solutionFr: `Par lecture graphique sur [${xMin}, ${xMax}] de (C_f) : ${cleanFormula}${
          generatedPlotData.tangentInfo
            ? `, on lit f(${generatedPlotData.tangentInfo.x0}) = ${generatedPlotData.tangentInfo.y0} et f'(${generatedPlotData.tangentInfo.x0}) = ${generatedPlotData.tangentInfo.slope}, d'où la tangente (T) : ${generatedPlotData.tangentInfo.equation}.`
            : "."
        }`,
        points: 1.5,
        level: "N2",
        latexCode: generatedPlotData.tikzSnippet,
        targetLessonIndex: targetIdx,
      });
    }

    setPlotInsertedSuccess(true);
    setTimeout(() => setPlotInsertedSuccess(false), 3200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 flex flex-col w-full max-w-6xl max-h-[93vh] overflow-hidden">
        {/* شريط العنوان العلوي بطابع WolframAlpha البرتقالي/النيلي */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gradient-to-r from-orange-950 via-slate-900 to-indigo-950 text-white border-b border-orange-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-400 shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/30 text-orange-200 border border-orange-400/40">
                  WolframAlpha · Symbolic Verifier & Function Plotter
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  {trackLabel}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                مختبر WolframAlpha للتحقق الرمزي وتوليد المنحنيات البيانية للمعادلات (Function Plot)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم المختبر القابل للتمرير */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-5">
          {/* ====================================================================
              القسم الجديد المدمج: مختبر توليد الرسم البياني للمعادلة (Function Plot)
              لإدراج المنحنى كشكل توضيحي مباشرة في ورقة الفرض
             ==================================================================== */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border-2 border-orange-500/40 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      راسم المعادلات والمنحنيات البيانية المباشر (Wolfram Function Plotter)
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      (C_f) · Repère (O, i⃗, j⃗)
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-300">
                    أدخل أي معادلة أو دالة رياضية لتوليد منحناها البياني بدقة عالية مع المماسات والمقاربات وإدراجه كشكل توضيحي في ورقة الفرض A4
                  </p>
                </div>
              </div>

              {/* أزرار دوال مرجعية سريعة للرسم البياني */}
              <div className="flex flex-wrap items-center gap-1.5">
                {WOLFRAM_PLOT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPlotPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      plotExpr === p.expr
                        ? "bg-orange-500 text-slate-950 border-orange-300 shadow-xs"
                        : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/15"
                    }`}
                    title={p.labelFr}
                  >
                    {p.labelAr}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* عمود إدخال المعادلة وضبط المعلم والمماس والإدراج */}
              <div className="lg:col-span-5 space-y-3.5 bg-white/5 p-3.5 rounded-xl border border-white/10">
                {/* 1. إدخال صيغة المعادلة الرئيسية f(x) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-orange-200 flex items-center justify-between">
                    <span>معادلة الدالة الرئيسية f(x) المراد رسمها:</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Ex: (x-1)*exp(x)+1
                    </span>
                  </label>
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <span className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono font-bold text-xs text-orange-400 shrink-0">
                      f(x) =
                    </span>
                    <input
                      type="text"
                      value={plotExpr}
                      onChange={(e) => {
                        setPlotExpr(e.target.value);
                        setFormulaLabel(`f(x) = ${e.target.value}`);
                      }}
                      placeholder="x^3 - 3*x + 1  |  x - 1 - ln(x)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-600 focus:border-orange-400 focus:outline-none font-mono text-xs text-white"
                    />
                  </div>

                  {/* أزرار دوال سريعة الإدراج في المعادلة */}
                  <div className="flex flex-wrap gap-1 pt-0.5" dir="ltr">
                    {[
                      { lbl: "x²", val: "x^2" },
                      { lbl: "x³", val: "x^3" },
                      { lbl: "e^x", val: "exp(x)" },
                      { lbl: "ln(x)", val: "ln(x)" },
                      { lbl: "√(x)", val: "sqrt(x)" },
                      { lbl: "1/x", val: "1/x" },
                      { lbl: "sin(x)", val: "sin(x)" },
                      { lbl: "cos(x)", val: "cos(x)" },
                      { lbl: "|x|", val: "abs(x)" },
                    ].map((tok) => (
                      <button
                        key={tok.lbl}
                        type="button"
                        onClick={() => {
                          const next = plotExpr ? `${plotExpr} + ${tok.val}` : tok.val;
                          setPlotExpr(next);
                          setFormulaLabel(`f(x) = ${next}`);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-orange-500/30 text-slate-200 border border-slate-700 font-mono text-[10.5px] cursor-pointer transition"
                      >
                        +{tok.lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. معادلة مستقيم مقارب أو منصف أول (Δ): y = g(x) + تسمية المنحنى */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      منصف / مقارب مائل (Δ): y =
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={secondaryExpr}
                      onChange={(e) => setSecondaryExpr(e.target.value)}
                      placeholder="Ex: x  أو  x - 1"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-orange-400 focus:outline-none font-mono text-xs text-amber-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      تسمية المنحنى على الشكل:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formulaLabel}
                      onChange={(e) => setFormulaLabel(e.target.value)}
                      placeholder="f(x) = ..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-orange-400 focus:outline-none font-mono text-xs text-cyan-200"
                    />
                  </div>
                </div>

                {/* 3. ضبط مجال محور الأفاصيل [xMin, xMax] ومحور الأراتيب [yMin, yMax] */}
                <div className="grid grid-cols-4 gap-1.5 pt-1" dir="ltr">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">
                      x_min
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={xMin}
                      onChange={(e) => setXMin( parseFloat(e.target.value) || -4 )}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">
                      x_max
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={xMax}
                      onChange={(e) => setXMax( parseFloat(e.target.value) || 4 )}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">
                      y_min
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={yMin}
                      onChange={(e) => setYMin( parseFloat(e.target.value) || -3 )}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">
                      y_max
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={yMax}
                      onChange={(e) => setYMax( parseFloat(e.target.value) || 4 )}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-white text-center"
                    />
                  </div>
                </div>

                {/* 4. نقطة المماس x0 والمقارب العمودي ونمط الألوان */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[10.5px] font-bold text-emerald-300 block">
                      أفصول المماس x₀:
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      dir="ltr"
                      value={tangentX0}
                      onChange={(e) => setTangentX0(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-300 text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-rose-300 block">
                      مقارب عمودي x=a:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={asymptoteX}
                      onChange={(e) => setAsymptoteX(e.target.value)}
                      placeholder="مثال: 0 أو 1"
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-rose-300 text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-300 block">
                      نمط الطباعة:
                    </label>
                    <select
                      value={plotColorMode}
                      onChange={(e) =>
                        setPlotColorMode(
                          e.target.value as "ACADEMIC_COLOR" | "EXAM_BW"
                        )
                      }
                      className="w-full px-1.5 py-1 rounded bg-slate-950 border border-slate-700 text-[11px] font-bold text-white"
                    >
                      <option value="ACADEMIC_COLOR">ملون أكاديمي</option>
                      <option value="EXAM_BW">أبيض وأسود رسمي</option>
                    </select>
                  </div>
                </div>

                {/* خيارات إظهار العناصر الهندسية */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="accent-orange-500"
                    />
                    <span>شبكة المعلم الممنظم</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTangentAtX0}
                      onChange={(e) => setShowTangentAtX0(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>المماس عند x₀</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showExtremaDots}
                      onChange={(e) => setShowExtremaDots(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>المطاريف الأفقية</span>
                  </label>
                </div>

                {/* 5. تحديد التمرين الهدف وحجم الشكل وإدراجه في الفرض */}
                <div className="pt-2.5 border-t border-white/15 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                        موضع إدراج الشكل التوضيحي في ورقة الفرض:
                      </label>
                      <select
                        value={figureTargetExerciseId}
                        onChange={(e) => setFigureTargetExerciseId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white"
                      >
                        {lessons.map((l, idx) => (
                          <option key={idx} value={`ex_${idx}`}>
                            التمرين {idx + 1} : {l.lessonAr}
                          </option>
                        ))}
                        <option value="prob_synthese">
                          المسألة التوليفية الشاملة (Problème de Synthèse)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                        عرض الشكل (%):
                      </label>
                      <div className="flex items-center gap-1">
                        <select
                          value={figureWidthPercent}
                          onChange={(e) => setFigureWidthPercent(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-amber-300"
                        >
                          <option value={50}>50% (مدمج)</option>
                          <option value={75}>75% (قياسي)</option>
                          <option value={85}>85% (واضح)</option>
                          <option value={100}>100% (كامل)</option>
                        </select>
                        <select
                          value={figureAlignment}
                          onChange={(e) =>
                            setFigureAlignment(
                              e.target.value as "center" | "right" | "left"
                            )
                          }
                          className="bg-slate-950 border border-slate-700 rounded-lg px-1.5 py-1.5 text-[11px] font-bold text-slate-200"
                          title="محاذاة الشكل"
                        >
                          <option value="center">وسط</option>
                          <option value="right">يمين</option>
                          <option value="left">يسار</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الإدراج الفوري في ورقة الفرض */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      disabled={!generatedPlotData.hasValidPoints}
                      onClick={() => handleInsertFunctionPlotToExam(false)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <ImagePlus className="w-4 h-4" />
                      <span>إدراج المنحنى كشكل توضيحي في ورقة الفرض</span>
                    </button>

                    <button
                      type="button"
                      disabled={!generatedPlotData.hasValidPoints}
                      onClick={() => handleInsertFunctionPlotToExam(true)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
                      title="إدراج الشكل المبياني مع سؤال قراءة مبيانية وعناصر إجابته في التمرين المختار"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      <span>+ سؤال قراءة مبيانية</span>
                    </button>
                  </div>

                  {plotInsertedSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>
                        ✓ تم توليد وإدراج منحنى الدالة (C_f) كشكل توضيحي داخل ورقة الفرض بنجاح! يمكنك معاينته وتعديل حجمه في الورقة.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* عمود المعاينة الحية للمنحنى المبياني (SVG Vector Plot Preview) */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="bg-white rounded-xl p-3 border-2 border-slate-200 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-slate-700">
                    <span className="text-xs font-extrabold flex items-center gap-1.5 text-slate-900">
                      <Sliders className="w-3.5 h-3.5 text-orange-600" />
                      معاينة الشكل التوضيحي الجاهز للطباعة (Vector SVG · 300 DPI):
                    </span>
                    <div className="flex items-center gap-2">
                      {generatedPlotData.tangentInfo && (
                        <span
                          dir="ltr"
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          (T): {generatedPlotData.tangentInfo.equation}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(generatedPlotData.tikzSnippet, "plot_tikz")
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-900 border border-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          {copiedField === "plot_tikz"
                            ? "تم نسخ كود TikZ ✓"
                            : "نسخ كود PGFPlots/TikZ"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* لوحة الرسم البياني */}
                  <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white flex items-center justify-center">
                    <img
                      src={generatedPlotData.svgDataUrl}
                      alt={`Function plot for ${plotExpr}`}
                      className="w-full h-auto max-h-[340px] object-contain select-none"
                    />
                  </div>

                  {/* شريط المعلومات التحليلية للمنحنى أسفل الرسم */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">مجال التمثيل: </span>
                      <span dir="ltr" className="font-mono">
                        x ∈ [{xMin}, {xMax}] · y ∈ [{yMin}, {yMax}]
                      </span>
                    </div>
                    {generatedPlotData.tangentInfo && (
                      <div>
                        <span className="font-bold text-emerald-800">نقطة التماس: </span>
                        <span dir="ltr" className="font-mono text-emerald-900 font-semibold">
                          A({generatedPlotData.tangentInfo.x0}, {generatedPlotData.tangentInfo.y0}) · f'({generatedPlotData.tangentInfo.x0}) = {generatedPlotData.tangentInfo.slope}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-indigo-900">المطاريف المرصودة: </span>
                      <span className="font-mono font-bold">
                        {generatedPlotData.detectedExtremaCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. صندوق الإدخال الرياضي الرمزي وشريط الرموز السريعة */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-orange-600" />
                أدخل الصيغة الرياضية، النهاية، التكامل، المعادلة التفاضلية أو العقدية المراد التحقق من صحتها (وتحديث الرسم تلقائياً):
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Supports: LaTeX · Wolfram Syntax · Natural Math
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                dir="ltr"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyFormula();
                }}
                placeholder="Ex: limit of (ln(1+x)-x)/x^2 as x->0  |  integrate x^2*ln(x) dx from 1 to e"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-500 focus:outline-none font-mono text-sm bg-slate-50/70 text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleSyncQueryToPlotter(query)}
                className="px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                title="نقل الدالة من حقل الاستعلام إلى راسم المنحنيات أعلاه"
              >
                <LineChart className="w-4 h-4 text-indigo-700" />
                <span>رسم المعادلة</span>
              </button>
              <button
                type="button"
                disabled={isLoading || !query.trim()}
                onClick={() => handleVerifyFormula()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحساب الرمزي والتحقق...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    تحقق وحلل عبر WolframAlpha
                  </>
                )}
              </button>
            </div>

            {/* أزرار الإدراج السريع للعمليات الرياضية */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1" dir="ltr">
              {QUICK_MATH_TOKENS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(item.token)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 border border-slate-200 font-mono text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. نماذج صيغ رياضية مرجعية جاهزة للسلك الثانوي التأهيلي (2BAC SM/PC & Mission) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                أمثلة صيغ ومسائل مرجعية جاهزة للفحص الفوري (السلك الثانوي التأهيلي والبعثة):
              </span>
              <span className="text-[11px] text-slate-500">انقر للفحص الفوري</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {WOLFRAM_HIGH_SCHOOL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                    query === preset.query
                      ? "bg-orange-50/90 border-orange-500 ring-1 ring-orange-400"
                      : "bg-slate-50/70 border-slate-200 hover:border-orange-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                      {preset.trackBadge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {preset.categoryAr}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {preset.titleAr}
                  </div>
                  <div
                    dir="ltr"
                    className="text-[11px] font-mono text-orange-800 bg-white px-2 py-1 rounded border border-slate-200 truncate"
                  >
                    {preset.query}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 3. عرض نتائج التحقق وكبسولات WolframAlpha Pods */}
          {result && (
            <div className="space-y-4">
              {/* بطاقة الخلاصة العليا وحالة الصحة الرياضية */}
              <div
                className={`p-5 rounded-2xl border-2 shadow-sm space-y-4 ${
                  result.isValid
                    ? "bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white border-emerald-500/50"
                    : "bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white border-rose-500/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/15 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        result.isValid
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                      }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200">
                          {result.isValid
                            ? "✓ صيغة رياضية صحيحة ومتسقة"
                            : "⚠ تنبيه في الصياغة أو مجال التعريف"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-300">
                          المصدر: {engineSource}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mt-1">
                        {result.validitySummaryAr}
                      </p>
                      <p className="text-xs text-slate-300 italic" dir="ltr">
                        {result.validitySummaryFr}
                      </p>
                    </div>
                  </div>

                  {/* لوحة وخيارات الإدراج المباشر في الفرض المحروس مع رابط WolframAlpha.com */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    {/* رابط خارجي لمعاينة الرسم البياني والتفكيك على WolframAlpha.com */}
                    <a
                      href={`https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
                      title="فتح الاستعلام مباشرة على موقع WolframAlpha الرسمي لمعاينة الرسوم البيانية التفاعلية"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                      <span>معاينة WolframAlpha.com</span>
                    </a>

                    {onInsertVerifiedQuestion && (
                      <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/15">
                        {/* تحديد التمرين الهدف إذا توفرت الدروس */}
                        {lessons.length > 1 && (
                          <select
                            value={targetLessonIndex}
                            onChange={(e) => setTargetLessonIndex(Number(e.target.value))}
                            className="bg-slate-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-white/20 focus:outline-none"
                            title="اختر التمرين المراد إدراج هذا السؤال فيه"
                          >
                            {lessons.map((l, lIdx) => (
                              <option key={lIdx} value={lIdx}>
                                التمرين {lIdx + 1} : {l.lessonAr}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* ضبط التنقيط والمستوى */}
                        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-white/20 text-[11px] font-bold">
                          <label className="text-slate-300">نقط:</label>
                          <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            max="10"
                            value={customPoints}
                            onChange={(e) => setCustomPoints(parseFloat(e.target.value) || 1.0)}
                            className="w-12 bg-slate-800 text-amber-300 px-1 py-0.5 rounded text-center font-mono font-bold focus:outline-none"
                          />
                          <select
                            value={customLevel}
                            onChange={(e) => setCustomLevel(e.target.value as "N1" | "N2" | "N3")}
                            className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded text-[10.5px] font-mono font-bold focus:outline-none"
                          >
                            <option value="N1">N1 (تطبيق)</option>
                            <option value="N2">N2 (توليف)</option>
                            <option value="N3">N3 (تعمق)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={handleInsertIntoExam}
                          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {insertedSuccess ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-950" />
                              <span>تم الإدراج بنجاح ✓</span>
                            </>
                          ) : (
                            <>
                              <FilePlus2 className="w-4 h-4" />
                              <span>إدراج السؤال بالفرض</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* الشبكة السريعة: الصيغة LaTeX + النتيجة المضبوطة + التقريب العددي + المجال */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="text-slate-300 font-semibold flex items-center justify-between">
                      <span>النتيجة المضبوطة (Exact Result)</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(result.exactResult, "exact")}
                        className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "exact" ? "تم" : "نسخ"}
                      </button>
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono font-black text-base text-amber-300 break-words"
                    >
                      <MathText text={result.exactResult} inline />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="text-slate-300 font-semibold">
                      التقريب العددي (Numerical Value)
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono font-bold text-sm text-emerald-300 break-words"
                    >
                      {result.numericalApproximation || "—"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="text-slate-300 font-semibold">
                      حيز التعريف والدراسة (Domain)
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono font-bold text-sm text-cyan-200 break-words"
                    >
                      <MathText text={result.domain || "\\mathbb{R}"} inline />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="text-slate-300 font-semibold flex items-center justify-between">
                      <span>كود LaTeX المعتمد</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(result.inputLatex, "latex")}
                        className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5"
                      >
                        <Code2 className="w-3 h-3" />
                        {copiedField === "latex" ? "تم النسخ ✓" : "نسخ LaTeX"}
                      </button>
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono text-xs text-indigo-200 break-all"
                    >
                      {result.inputLatex}
                    </div>
                  </div>
                </div>
              </div>

              {/* كبسولات WolframAlpha التفصيلية (Pods) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(result.pods || []).map((pod, idx) => (
                  <div
                    key={pod.id || idx}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-extrabold text-orange-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-orange-600" />
                        {pod.titleAr}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {pod.titleFr}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                      <MathText text={pod.plaintext} />
                    </div>
                    {pod.latex && (
                      <div
                        dir="ltr"
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-indigo-900 overflow-x-auto"
                      >
                        <MathText text={`$${pod.latex}$`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* خطوات البرهان المفصل والسؤال المقترح للفرض */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <h4 className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      خطوات البرهان الرياضي المفصل (Step-by-Step Solution)
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `${result.stepByStepAr}\n\n${result.stepByStepFr}`,
                          "proof"
                        )
                      }
                      className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedField === "proof" ? "تم النسخ ✓" : "نسخ الحل"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    <MathText text={result.stepByStepAr} />
                  </div>
                  {result.stepByStepFr && (
                    <div
                      dir="ltr"
                      className="text-xs text-slate-600 italic leading-relaxed whitespace-pre-line pt-2 border-t border-slate-100"
                    >
                      <MathText text={result.stepByStepFr} />
                    </div>
                  )}
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-indigo-200/70 pb-1.5">
                      <h4 className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-indigo-700" />
                        صياغة السؤال المقترح للإدراج في الفرض المحروس
                      </h4>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                        {result.suggestedPoints || 1.5} ن · {result.difficultyLevel || "N2"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-relaxed">
                      <MathText text={result.suggestedQuestionAr} />
                    </div>
                    <div
                      dir="ltr"
                      className="text-xs font-semibold text-slate-700 leading-relaxed font-sans bg-white p-2.5 rounded-xl border border-indigo-100"
                    >
                      <MathText text={result.suggestedQuestionFr} />
                    </div>
                  </div>

                  {onInsertVerifiedQuestion && (
                    <button
                      type="button"
                      onClick={handleInsertIntoExam}
                      className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      اعتماد وإدراج هذا السؤال مع عناصر إجابته في الورقة الحالية
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

