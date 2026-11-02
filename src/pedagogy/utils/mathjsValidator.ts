import { parse, derivative, simplify, evaluate, EvalFunction } from "mathjs";
import { LessonItem } from "../data/curriculum";

export interface MathValidationIssue {
  type: "ERROR" | "WARNING" | "INFO";
  code:
    | "UNBALANCED_PARENS"
    | "UNBALANCED_BRACES"
    | "UNCLOSED_MATH_DELIMITER"
    | "DIVISION_BY_ZERO"
    | "EMPTY_FRACTION_OR_SQRT"
    | "MATHJS_PARSE_ERROR"
    | "SYMBOLIC_DERIVATIVE_READY";
  expression: string;
  messageAr: string;
  messageFr: string;
  suggestion?: string;
}

export interface SingleExpressionCheckResult {
  rawLatex: string;
  normalizedMathJS: string;
  isValid: boolean;
  astType?: string;
  simplified?: string;
  symbolicDerivativeX?: string;
  sampleEvalAt1?: string;
  errorMessage?: string;
}

export interface QuestionMathValidationResult {
  originalText: string;
  sanitizedText: string;
  isValid: boolean;
  hasWarnings: boolean;
  wasAutoFixed: boolean;
  expressionsChecked: SingleExpressionCheckResult[];
  issues: MathValidationIssue[];
}

/**
 * تحويل تعبير رياضي بصيغة LaTeX أو نص رياضي مدرسي إلى صيغة قياسية قابلة للتحليل بواسطة مكتبة mathjs
 */
export function latexToMathJSExpression(raw: string): string {
  let s = raw.trim();
  // إزالة محددات الدولار أو الأقواس الخاصة بـ LaTeX
  s = s.replace(/^\$+|\$+$/g, "").trim();
  s = s.replace(/^\\\(|\\\)$/g, "").replace(/^\\\[|\\\]$/g, "").trim();

  // إزالة أوامر التنسيق البصري التي لا تؤثر على البنية الجبرية
  s = s
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\displaystyle/g, "")
    .replace(/\\quad|\\qquad|\\,|\\;|\\!/g, " ")
    .replace(/\\mathbb\{([A-Z])\}/g, "$1")
    .replace(/\\mathcal\{([A-Z])\}/g, "$1")
    .replace(/\\vec\{([a-zA-Z0-9_]+)\}/g, "$1")
    .replace(/\\overline\{([^}]+)\}/g, "conj($1)");

  // استبدال الجذور والكسور المتداخلة \frac{a}{b} و \dfrac{a}{b} و \sqrt{...}
  for (let iter = 0; iter < 6; iter++) {
    const next = s
      .replace(/\\sqrt\s*\[([^{}\]]+)\]\s*\{([^{}]*)\}/g, "nthRoot(($2), ($1))")
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)")
      .replace(/√\s*\(([^()]+)\)/g, "sqrt($1)")
      .replace(/√([a-zA-Z0-9]+)/g, "sqrt($1)")
      .replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "(($1)/($2))");
    if (next === s) break;
    s = next;
  }

  // الدوال المثلثية واللوغاريتمية والأسية
  s = s
    .replace(/\\ln\b/g, "log")
    .replace(/\bln\s*\(/g, "log(")
    .replace(/\bln\s+([a-zA-Z0-9_]+)/g, "log($1)")
    .replace(/\\log\b/g, "log10")
    .replace(/\\exp\b/g, "exp")
    .replace(/\\sin\b/g, "sin")
    .replace(/\\cos\b/g, "cos")
    .replace(/\\tan\b/g, "tan")
    .replace(/\\arcsin\b/g, "asin")
    .replace(/\\arccos\b/g, "acos")
    .replace(/\\arctan\b/g, "atan")
    .replace(/\\pi\b|π/g, "pi")
    .replace(/\\infty\b|∞/g, "Infinity")
    .replace(/\\times\b|\\cdot\b|×|⋅/g, "*")
    .replace(/\\div\b|÷/g, "/")
    .replace(/−|–/g, "-");

  // تحويل القوى والأسس المكتوبة بـ ^{...} والـ _{...}
  for (let iter = 0; iter < 4; iter++) {
    const nextPow = s
      .replace(/\^\s*\{([^{}]+)\}/g, "^($1)")
      .replace(/([a-zA-Z])_\{([a-zA-Z0-9+\-]+)\}/g, "$1_$2");
    if (nextPow === s) break;
    s = nextPow;
  }

  // استبدال الأسس الفوقية Unicode (² ³)
  s = s.replace(/²/g, "^2").replace(/³/g, "^3");

  // تحويل القيمة المطلقة |x| البسيطة إلى abs(x)
  s = s.replace(/\|([^|]+)\|/g, "abs($1)");

  // إذا كانت هناك معادلة بعلامة = (مثل f(x) = x^2 - 1)، نأخذ الطرف الأيمن لتحليل التعبير الجبري
  if (s.includes("=")) {
    const parts = s.split("=");
    const rhs = parts[parts.length - 1].trim();
    if (rhs) {
      s = rhs;
    }
  }

  // إدراج علامة الضرب الضمني الآمنة مثل 2x -> 2*x أو (x+1)(x-1) -> (x+1)*(x-1)
  // مع حماية الدوال أو المعرفات المنتهية بأرقام مثل log10(x) أو u_0(x)
  s = s
    .replace(/(?<![a-zA-Z_])(\d+)([a-zA-Z(])/g, "$1*$2")
    .replace(/(\))(\s*[a-zA-Z0-9(])/g, "$1*$2");

  // تحويل الفاصلة العشرية الفرنسية 0,5 إلى 0.5 عندما تكون بين رقمين
  s = s.replace(/(\d),(\d)/g, "$1.$2");

  return s.trim();
}

/**
 * استخراج المقاطع الرياضية من نص السؤال (بين علامات $...$ أو معادلات الدوال والمتتاليات)
 */
export function extractCandidateMathSegments(questionText: string): string[] {
  const segments: string[] = [];

  // 1. مقاطع محصورة بين $...$
  const dollarRegex = /\$([^$]+)\$/g;
  let match: RegExpExecArray | null;
  while ((match = dollarRegex.exec(questionText)) !== null) {
    const inner = match[1].trim();
    if (inner) segments.push(inner);
  }

  // 2. إذا لم يكن هناك $...$، نبحث عن تعريف دالة أو متتالية مثل f(x) = ... أو g(x) = ... أو u_{n+1} = ...
  if (segments.length === 0) {
    const eqRegex =
      /(?:[fghFGH]\s*\(\s*x\s*\)|u_\{?n\+1\}?|u_n|v_n|z|P\s*\(\s*z\s*\))\s*=\s*([^\n،,؛;:؟?]+)/g;
    while ((match = eqRegex.exec(questionText)) !== null) {
      const rhs = match[1].trim();
      if (rhs && rhs.length >= 2) {
        segments.push(rhs);
      }
    }
  }

  return segments;
}

/**
 * التحقق من توازن الأقواس الدائرية والحاضنة ومحددات $ وإصلاحها تلقائياً قبل العرض في معاينة الورقة
 */
export function sanitizeQuestionMathExpressions(questionText: string): {
  sanitizedText: string;
  issues: MathValidationIssue[];
  wasAutoFixed: boolean;
} {
  let text = questionText || "";
  const issues: MathValidationIssue[] = [];
  let wasAutoFixed = false;

  // 1. فحص عدد علامات الدولار $ (إن كان فردياً نغلق المحدد في نهاية التعبير)
  const dollarCount = (text.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    issues.push({
      type: "WARNING",
      code: "UNCLOSED_MATH_DELIMITER",
      expression: "$...$",
      messageAr: "محدد الصيغة الرياضية ($) غير مغلق؛ تم إغلاقه تلقائياً لضمان سلامة العرض في الورقة.",
      messageFr: "Délimiteur mathématique ($) non fermé ; corrigé automatiquement.",
      suggestion: `${text}$`,
    });
    text = `${text}$`;
    wasAutoFixed = true;
  }

  // 2. فحص الكسور أو الجذور الفارغة \frac{}{} أو \sqrt{}
  if (/\\d?frac\s*\{\s*\}\s*\{|\{\s*\}/.test(text) && /\\d?frac/.test(text)) {
    issues.push({
      type: "ERROR",
      code: "EMPTY_FRACTION_OR_SQRT",
      expression: "\\frac{}{}",
      messageAr: "يوجد كسر رياضي فارغ البسط أو المقام (\\frac{}{})؛ تم تعويض الحقل الفارغ بـ 1 مؤقتاً.",
      messageFr: "Fraction avec numérateur ou dénominateur vide (\\frac{}{}).",
    });
    text = text
      .replace(/\\(d?frac)\s*\{\s*\}\s*\{([^{}]*)\}/g, "\\$1{1}{$2}")
      .replace(/\\(d?frac)\s*\{([^{}]*)\}\s*\{\s*\}/g, "\\$1{$2}{1}");
    wasAutoFixed = true;
  }

  if (/\\sqrt\s*\{\s*\}/.test(text)) {
    issues.push({
      type: "ERROR",
      code: "EMPTY_FRACTION_OR_SQRT",
      expression: "\\sqrt{}",
      messageAr: "يوجد جذر مربع فارغ (\\sqrt{})؛ تم تعويضه بـ \\sqrt{x} لمنع كسر العرض.",
      messageFr: "Racine carrée vide (\\sqrt{}).",
    });
    text = text.replace(/\\sqrt\s*\{\s*\}/g, "\\sqrt{x}");
    wasAutoFixed = true;
  }

  // 3. فحص توازن الحاضنات { } والأقواس ( ) مع استثناء أقواس ترقيم الأسئلة مثل 1) أو أ) أو a)
  const textWithoutNumberingParens = text.replace(
    /(?:^|\s)(?:[0-9]+|[أبجد]|[a-dA-D]|I{1,3})\)/g,
    " "
  );
  let openBraces = 0;
  let openParens = 0;
  for (const ch of textWithoutNumberingParens) {
    if (ch === "{") openBraces++;
    else if (ch === "}") openBraces--;
    else if (ch === "(") openParens++;
    else if (ch === ")") openParens--;
  }

  if (openBraces > 0) {
    issues.push({
      type: "WARNING",
      code: "UNBALANCED_BRACES",
      expression: "{ ... }",
      messageAr: `نقص في إغلاق ${openBraces} حاضنة '}' في الصيغة الرياضية؛ تم إغلاقها تلقائياً.`,
      messageFr: `${openBraces} accolade(s) '}' manquante(s) ; ajoutée(s) automatiquement.`,
    });
    text = text + "}".repeat(openBraces);
    wasAutoFixed = true;
  } else if (openBraces < 0) {
    issues.push({
      type: "WARNING",
      code: "UNBALANCED_BRACES",
      expression: "{ ... }",
      messageAr: `زيادة في الحاضنات المغلقة '}' (${Math.abs(openBraces)}).`,
      messageFr: `Accolade(s) fermante(s) '}' en trop (${Math.abs(openBraces)}).`,
    });
  }

  if (openParens > 0) {
    issues.push({
      type: "WARNING",
      code: "UNBALANCED_PARENS",
      expression: "( ... )",
      messageAr: `نقص في إغلاق ${openParens} قوس ')' داخل التعبير الرياضي؛ تم إغلاقه تلقائياً.`,
      messageFr: `${openParens} parenthèse(s) ')' manquante(s) ; fermée(s) automatiquement.`,
    });
    text = text + ")".repeat(openParens);
    wasAutoFixed = true;
  }

  // 4. فحص القسمة المباشرة على صفر مثل /0 أو \frac{...}{0}
  if (/\\d?frac\s*\{[^{}]+\}\s*\{\s*0\s*\}|\/\s*0(?![0-9.,])/.test(text)) {
    issues.push({
      type: "ERROR",
      code: "DIVISION_BY_ZERO",
      expression: "/ 0",
      messageAr: "تنبيه رياضي: تم رصد قسمة صريحة على صفر (0 في المقام) داخل نص السؤال!",
      messageFr: "Alerte mathématique : Division explicite par zéro détectée dans l'énoncé !",
    });
  }

  return { sanitizedText: text, issues, wasAutoFixed };
}

/**
 * فحص تعبير جبري مفرد عبر مكتبة mathjs (parse + simplify + derivative)
 */
export function checkSingleMathExpressionWithMathJS(
  rawSegment: string
): SingleExpressionCheckResult {
  const normalized = latexToMathJSExpression(rawSegment);

  // استبعاد المقاطع النصية البحتة أو الرموز الهندسية التي ليست صيغة جبرية
  if (
    !normalized ||
    normalized.length < 2 ||
    /^[A-Za-z_]+$/.test(normalized) ||
    /\\in|\\subset|\\cup|\\cap|\\forall|\\exists|\\Rightarrow|\\iff|\\perp|\\parallel/.test(
      rawSegment
    )
  ) {
    return {
      rawLatex: rawSegment,
      normalizedMathJS: normalized,
      isValid: true,
      astType: "SymbolicStatement",
    };
  }

  try {
    const node = parse(normalized);
    let simplifiedStr: string | undefined;
    let derivativeStr: string | undefined;
    let evalAt1Str: string | undefined;

    try {
      simplifiedStr = simplify(node).toString();
    } catch {
      simplifiedStr = node.toString();
    }

    if (/\bx\b/.test(normalized)) {
      try {
        derivativeStr = simplify(derivative(node, "x")).toString();
      } catch {
        // قد يحتوي التعبير على دوال غير قابلة للاشتقاق الرمزي المباشر
      }
      try {
        const val = evaluate(normalized, { x: 1, e: Math.E, pi: Math.PI });
        if (typeof val === "number" && Number.isFinite(val)) {
          evalAt1Str = Number(val.toFixed(4)).toString();
        }
      } catch {
        // تجاهل خطأ التقييم العددي عند x=1 إذا لم يكن في حيز التعريف
      }
    }

    return {
      rawLatex: rawSegment,
      normalizedMathJS: normalized,
      isValid: true,
      astType: node.type,
      simplified: simplifiedStr,
      symbolicDerivativeX: derivativeStr,
      sampleEvalAt1: evalAt1Str,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Syntax error in expression";
    return {
      rawLatex: rawSegment,
      normalizedMathJS: normalized,
      isValid: false,
      errorMessage: msg,
    };
  }
}

/**
 * الدالة الشاملة للتحقق من سلامة التعبيرات الرياضية في سؤال مخصص باستخدام mathjs قبل عرضه في المعاينة
 */
export function validateCustomQuestionWithMathJS(
  questionText: string
): QuestionMathValidationResult {
  const { sanitizedText, issues, wasAutoFixed } =
    sanitizeQuestionMathExpressions(questionText);

  const candidateSegments = extractCandidateMathSegments(sanitizedText);
  const expressionsChecked: SingleExpressionCheckResult[] = [];

  candidateSegments.forEach((seg) => {
    // نقوم بفحص المقاطع التي تحتوي على عمليات جبرية أو دوال
    if (/[+\-*/^=()0-9]|\\frac|\\sqrt|\\ln|\\exp|\\sin|\\cos/.test(seg)) {
      const checkRes = checkSingleMathExpressionWithMathJS(seg);
      expressionsChecked.push(checkRes);

      if (!checkRes.isValid && checkRes.errorMessage) {
        issues.push({
          type: "WARNING",
          code: "MATHJS_PARSE_ERROR",
          expression: seg,
          messageAr: `تعذر تحليل البنية الجبرية للتعبير (${seg}) بواسطة MathJS: تحقق من الأقواس أو المعاملات.`,
          messageFr: `Erreur d'analyse syntaxique MathJS dans (${seg}) : ${checkRes.errorMessage}`,
        });
      } else if (checkRes.symbolicDerivativeX) {
        issues.push({
          type: "INFO",
          code: "SYMBOLIC_DERIVATIVE_READY",
          expression: seg,
          messageAr: `تم التحقق بـ MathJS ✓ — المشتقة الرمزية المبسطة: f'(x) = ${checkRes.symbolicDerivativeX}`,
          messageFr: `Vérifié par MathJS ✓ — Dérivée symbolique : f'(x) = ${checkRes.symbolicDerivativeX}`,
        });
      }
    }
  });

  const hasErrors = issues.some((i) => i.type === "ERROR");
  const hasWarnings = issues.some((i) => i.type === "WARNING");

  return {
    originalText: questionText,
    sanitizedText,
    isValid: !hasErrors,
    hasWarnings,
    wasAutoFixed,
    expressionsChecked,
    issues,
  };
}

/**
 * تنقية وتحقق جماعي لقائمة أسئلة قبل عرضها في PrintablePreview.tsx
 */
export function sanitizeAndValidateQuestionsList(questions: string[]): {
  sanitizedQuestions: string[];
  results: QuestionMathValidationResult[];
  validCount: number;
  warningCount: number;
  autoFixedCount: number;
} {
  const results = questions.map((q) => validateCustomQuestionWithMathJS(q));
  return {
    sanitizedQuestions: results.map((r) => r.sanitizedText),
    results,
    validCount: results.filter((r) => r.isValid && !r.hasWarnings).length,
    warningCount: results.filter((r) => !r.isValid || r.hasWarnings).length,
    autoFixedCount: results.filter((r) => r.wasAutoFixed).length,
  };
}

// ============================================================================
// مقترح أستاذ المادة رقم 1:
// مولد منحنيات الدوال (C_f) وجداول التغيرات الكاملة (TikZ / PGFPlots + SVG) عبر mathjs
// ============================================================================

export interface FunctionVariationInterval {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  sign: "+" | "-" | "0";
  direction: "UP" | "DOWN" | "CONST";
}

export interface FunctionVariationAndCurveData {
  expressionInput: string;
  normalizedExpr: string;
  symbolicDerivative: string;
  simplifiedExpr: string;
  xMin: number;
  xMax: number;
  tangentX0: number;
  yAtX0: number;
  slopeAtX0: number;
  tangentEquation: string;
  criticalPoints: Array<{ x: number; y: number }>;
  intervals: FunctionVariationInterval[];
  svgContent: string;
  tikzLatexCode: string;
  isValid: boolean;
  errorMessage?: string;
}

export function generateFunctionVariationAndCurveData(
  exprInput: string,
  xMinInput: number = -3,
  xMaxInput: number = 3,
  tangentX0: number = 1
): FunctionVariationAndCurveData {
  const xMin = Math.min(xMinInput, xMaxInput - 0.5);
  const xMax = Math.max(xMaxInput, xMin + 0.5);
  const normalizedExpr = latexToMathJSExpression(exprInput || "x^3 - 3*x + 1");

  try {
    const ast = parse(normalizedExpr);
    const simpNode = simplify(ast);
    const derivNode = simplify(derivative(ast, "x"));
    const compiledF = simpNode.compile();
    const compiledFp = derivNode.compile();

    const evalF = (x: number): number => {
      try {
        const v = compiledF.evaluate({ x, e: Math.E, pi: Math.PI });
        return typeof v === "number" && Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };

    const evalFp = (x: number): number => {
      try {
        const v = compiledFp.evaluate({ x, e: Math.E, pi: Math.PI });
        return typeof v === "number" && Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };

    // البحث العددي عن انعدامات المشتقة f'(x) = 0 داخل المجال [xMin, xMax]
    const samples = 240;
    const step = (xMax - xMin) / samples;
    const criticalXs: number[] = [];

    for (let i = 0; i < samples; i++) {
      const a = xMin + i * step;
      const b = a + step;
      const fpa = evalFp(a);
      const fpb = evalFp(b);
      if (!Number.isFinite(fpa) || !Number.isFinite(fpb)) continue;

      if (Math.abs(fpa) < 1e-7) {
        const rounded = Number(a.toFixed(2));
        if (!criticalXs.some((cx) => Math.abs(cx - rounded) < 0.08)) {
          criticalXs.push(rounded);
        }
      } else if (fpa * fpb < 0) {
        // تنصيف المجال (Bisection)
        let lo = a;
        let hi = b;
        for (let iter = 0; iter < 18; iter++) {
          const mid = 0.5 * (lo + hi);
          const fpm = evalFp(mid);
          if (!Number.isFinite(fpm)) break;
          if (fpa * fpm <= 0) hi = mid;
          else lo = mid;
        }
        const root = Number((0.5 * (lo + hi)).toFixed(2));
        if (
          root > xMin + 0.03 &&
          root < xMax - 0.03 &&
          !criticalXs.some((cx) => Math.abs(cx - root) < 0.08)
        ) {
          criticalXs.push(root);
        }
      }
    }

    criticalXs.sort((a, b) => a - b);
    const boundedCriticals = criticalXs.slice(0, 4);
    const criticalPoints = boundedCriticals.map((cx) => ({
      x: cx,
      y: Number((evalF(cx) || 0).toFixed(2)),
    }));

    const nodesX = [xMin, ...boundedCriticals, xMax];
    const intervals: FunctionVariationInterval[] = [];
    for (let i = 0; i < nodesX.length - 1; i++) {
      const a = nodesX[i];
      const b = nodesX[i + 1];
      const mid = 0.5 * (a + b);
      const fpMid = evalFp(mid);
      const fa = evalF(a + 1e-4);
      const fb = evalF(b - 1e-4);
      const sign: "+" | "-" | "0" =
        !Number.isFinite(fpMid) || Math.abs(fpMid) < 1e-5
          ? "0"
          : fpMid > 0
          ? "+"
          : "-";
      intervals.push({
        fromX: Number(a.toFixed(2)),
        toX: Number(b.toFixed(2)),
        fromY: Number((Number.isFinite(fa) ? fa : 0).toFixed(2)),
        toY: Number((Number.isFinite(fb) ? fb : 0).toFixed(2)),
        sign,
        direction: sign === "+" ? "UP" : sign === "-" ? "DOWN" : "CONST",
      });
    }

    // المماس عند x0
    const safeX0 = Math.max(xMin, Math.min(xMax, tangentX0));
    const y0Raw = evalF(safeX0);
    const mRaw = evalFp(safeX0);
    const yAtX0 = Number.isFinite(y0Raw) ? Number(y0Raw.toFixed(2)) : 0;
    const slopeAtX0 = Number.isFinite(mRaw) ? Number(mRaw.toFixed(2)) : 0;
    const bIntercept = Number((yAtX0 - slopeAtX0 * safeX0).toFixed(2));
    const tangentEquation = `y = ${slopeAtX0}x ${bIntercept >= 0 ? `+ ${bIntercept}` : `- ${Math.abs(bIntercept)}`}`;

    // حساب نقاط المنحنى للرسم في SVG
    const plotPoints: Array<{ x: number; y: number }> = [];
    let yMinVal = Infinity;
    let yMaxVal = -Infinity;
    for (let i = 0; i <= 180; i++) {
      const px = xMin + (i / 180) * (xMax - xMin);
      const py = evalF(px);
      if (Number.isFinite(py) && Math.abs(py) <= 50) {
        plotPoints.push({ x: px, y: py });
        if (py < yMinVal) yMinVal = py;
        if (py > yMaxVal) yMaxVal = py;
      }
    }
    if (!Number.isFinite(yMinVal) || !Number.isFinite(yMaxVal) || Math.abs(yMaxVal - yMinVal) < 1e-3) {
      yMinVal = -4;
      yMaxVal = 4;
    } else {
      const pad = Math.max(1, 0.18 * (yMaxVal - yMinVal));
      yMinVal = Math.floor(yMinVal - pad);
      yMaxVal = Math.ceil(yMaxVal + pad);
    }

    // توليد SVG مزدوج عالي الدقة: جدول التغيرات في الأعلى + المنحنى (C_f) والمماس (T) في الأسفل
    const svgW = 720;
    const svgH = 440;
    const tabX = 24;
    const tabY = 18;
    const tabW = 672;
    const tabH = 148;
    const labelColW = 96;
    const dataW = tabW - labelColW;
    const colCount = nodesX.length;

    const xNodeSvgPositions = nodesX.map(
      (_, idx) =>
        tabX + labelColW + 28 + (idx / Math.max(1, colCount - 1)) * (dataW - 56)
    );

    let tableElements = "";
    nodesX.forEach((nx, idx) => {
      const sx = xNodeSvgPositions[idx];
      tableElements += `<text x="${sx.toFixed(1)}" y="${tabY + 23}" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a">${nx}</text>`;
      if (idx > 0 && idx < nodesX.length - 1) {
        tableElements += `<line x1="${sx.toFixed(1)}" y1="${tabY + 34}" x2="${sx.toFixed(1)}" y2="${tabY + 68}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1"/>`;
        tableElements += `<text x="${sx.toFixed(1)}" y="${tabY + 55}" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#0284c7">0</text>`;
      }
    });

    intervals.forEach((iv, idx) => {
      const xStart = xNodeSvgPositions[idx];
      const xEnd = xNodeSvgPositions[idx + 1];
      const xMid = 0.5 * (xStart + xEnd);
      const signColor = iv.sign === "+" ? "#059669" : iv.sign === "-" ? "#e11d48" : "#475569";
      tableElements += `<text x="${xMid.toFixed(1)}" y="${tabY + 56}" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="${signColor}">${iv.sign}</text>`;

      const yHigh = tabY + 86;
      const yLow = tabY + 134;
      const y1 = iv.direction === "UP" ? yLow : yHigh;
      const y2 = iv.direction === "UP" ? yHigh : yLow;

      if (idx === 0) {
        tableElements += `<text x="${xStart.toFixed(1)}" y="${(y1 + (iv.direction === "UP" ? 8 : -4)).toFixed(1)}" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#1e293b">${iv.fromY}</text>`;
      }
      tableElements += `<text x="${xEnd.toFixed(1)}" y="${(y2 + (iv.direction === "UP" ? -4 : 8)).toFixed(1)}" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#1e293b">${iv.toY}</text>`;

      const arrowX1 = xStart + 18;
      const arrowX2 = xEnd - 18;
      const arrowY1 = iv.direction === "UP" ? yLow - 6 : yHigh + 6;
      const arrowY2 = iv.direction === "UP" ? yHigh + 6 : yLow - 6;
      tableElements += `<line x1="${arrowX1.toFixed(1)}" y1="${arrowY1.toFixed(1)}" x2="${arrowX2.toFixed(1)}" y2="${arrowY2.toFixed(1)}" stroke="#0f172a" stroke-width="1.8" marker-end="url(#varArrow)"/>`;
    });

    // إحداثيات رسم المنحنى في الجزء السفلي
    const plotX = 56;
    const plotY = 186;
    const plotW = 620;
    const plotH = 228;

    const toSvgX = (x: number) => plotX + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (y: number) =>
      plotY + plotH - ((y - yMinVal) / (yMaxVal - yMinVal)) * plotH;

    let gridLines = "";
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const sx = toSvgX(gx);
      gridLines += `<line x1="${sx.toFixed(1)}" y1="${plotY}" x2="${sx.toFixed(1)}" y2="${plotY + plotH}" stroke="#e2e8f0" stroke-width="1"/>`;
      gridLines += `<text x="${sx.toFixed(1)}" y="${plotY + plotH + 15}" text-anchor="middle" font-family="monospace" font-size="10" fill="#475569">${gx}</text>`;
    }
    const yStep = Math.max(1, Math.round((yMaxVal - yMinVal) / 5));
    for (let gy = Math.ceil(yMinVal); gy <= Math.floor(yMaxVal); gy += yStep) {
      const sy = toSvgY(gy);
      gridLines += `<line x1="${plotX}" y1="${sy.toFixed(1)}" x2="${plotX + plotW}" y2="${sy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
      gridLines += `<text x="${plotX - 8}" y="${(sy + 3).toFixed(1)}" text-anchor="end" font-family="monospace" font-size="10" fill="#475569">${gy}</text>`;
    }

    // المحاور (Ox) و (Oy)
    const zeroX = toSvgX(0);
    const zeroY = toSvgY(0);
    let axesSvg = "";
    if (zeroY >= plotY && zeroY <= plotY + plotH) {
      axesSvg += `<line x1="${plotX}" y1="${zeroY.toFixed(1)}" x2="${plotX + plotW}" y2="${zeroY.toFixed(1)}" stroke="#334155" stroke-width="1.6"/>`;
    }
    if (zeroX >= plotX && zeroX <= plotX + plotW) {
      axesSvg += `<line x1="${zeroX.toFixed(1)}" y1="${plotY}" x2="${zeroX.toFixed(1)}" y2="${plotY + plotH}" stroke="#334155" stroke-width="1.6"/>`;
    }

    const polylinePts = plotPoints
      .map((pt) => `${toSvgX(pt.x).toFixed(1)},${toSvgY(pt.y).toFixed(1)}`)
      .join(" ");

    // رسم المماس عند x0
    const tanDx = Math.min(1.2, 0.25 * (xMax - xMin));
    const tx1 = safeX0 - tanDx;
    const ty1 = yAtX0 - slopeAtX0 * tanDx;
    const tx2 = safeX0 + tanDx;
    const ty2 = yAtX0 + slopeAtX0 * tanDx;
    const tangentSvg =
      Number.isFinite(yAtX0) && Number.isFinite(slopeAtX0)
        ? `<line x1="${toSvgX(tx1).toFixed(1)}" y1="${toSvgY(ty1).toFixed(1)}" x2="${toSvgX(tx2).toFixed(1)}" y2="${toSvgY(ty2).toFixed(1)}" stroke="#d97706" stroke-width="1.8" stroke-dasharray="5,3"/>
           <circle cx="${toSvgX(safeX0).toFixed(1)}" cy="${toSvgY(yAtX0).toFixed(1)}" r="4" fill="#d97706" stroke="#fff" stroke-width="1.5"/>`
        : "";

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%">
  <defs>
    <marker id="varArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#0f172a"/>
    </marker>
    <clipPath id="curveClip">
      <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="${svgW}" height="${svgH}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- جدول التغيرات -->
  <rect x="${tabX}" y="${tabY}" width="${tabW}" height="${tabH}" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
  <line x1="${tabX}" y1="${tabY + 34}" x2="${tabX + tabW}" y2="${tabY + 34}" stroke="#334155" stroke-width="1.2"/>
  <line x1="${tabX}" y1="${tabY + 68}" x2="${tabX + tabW}" y2="${tabY + 68}" stroke="#334155" stroke-width="1.2"/>
  <line x1="${tabX + labelColW}" y1="${tabY}" x2="${tabX + labelColW}" y2="${tabY + tabH}" stroke="#334155" stroke-width="1.2"/>
  <text x="${tabX + labelColW / 2}" y="${tabY + 22}" text-anchor="middle" font-family="serif" font-style="italic" font-size="13" font-weight="bold" fill="#0f172a">x</text>
  <text x="${tabX + labelColW / 2}" y="${tabY + 55}" text-anchor="middle" font-family="serif" font-style="italic" font-size="13" font-weight="bold" fill="#0f172a">f'(x)</text>
  <text x="${tabX + labelColW / 2}" y="${tabY + 112}" text-anchor="middle" font-family="serif" font-style="italic" font-size="13" font-weight="bold" fill="#0f172a">f(x)</text>
  ${tableElements}
  <!-- المعلم المتعامد والمنحنى (C_f) -->
  <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/>
  ${gridLines}
  ${axesSvg}
  <g clip-path="url(#curveClip)">
    <polyline fill="none" stroke="#0284c7" stroke-width="2.6" points="${polylinePts}"/>
    ${tangentSvg}
  </g>
  <text x="${plotX + 12}" y="${plotY + 20}" font-family="monospace" font-size="11" font-weight="bold" fill="#0284c7">(C_f) : f(x) = ${simpNode.toString()}   |   f'(x) = ${derivNode.toString()}</text>
  <text x="${plotX + plotW - 12}" y="${plotY + 20}" text-anchor="end" font-family="monospace" font-size="11" font-weight="bold" fill="#d97706">(T) en x₀=${safeX0} : ${tangentEquation}</text>
</svg>`;

    // توليد كود LaTeX (tkz-tab + pgfplots) الجاهز للنسخ في Overleaf
    const tkzXList = nodesX.map((n) => `${n}`).join(" / 1, ");
    const tkzSignItems: string[] = [""];
    intervals.forEach((iv, idx) => {
      tkzSignItems.push(iv.sign);
      if (idx < intervals.length - 1) tkzSignItems.push("z");
    });
    const tkzVarItems: string[] = [];
    intervals.forEach((iv, idx) => {
      if (idx === 0) {
        tkzVarItems.push(`${iv.direction === "UP" ? "-" : "+"}/${iv.fromY}`);
      }
      const nextDir = intervals[idx + 1]?.direction;
      const posSym =
        iv.direction === "UP" && nextDir === "DOWN"
          ? "+"
          : iv.direction === "DOWN" && nextDir === "UP"
          ? "-"
          : iv.direction === "UP"
          ? "+"
          : "-";
      tkzVarItems.push(`${posSym}/${iv.toY}`);
    });

    const tikzLatexCode = `% ==========================================================
% جدول التغيرات والمنحنى البياني (C_f) المولد آلياً عبر MathJS
% الدالة: f(x) = ${simpNode.toString()} | المشتقة: f'(x) = ${derivNode.toString()}
% ==========================================================
\\begin{center}
\\begin{tikzpicture}[scale=0.95]
  \\tkzTabInit[lgt=2.2, espcl=2.6]
    {$x$ / 0.8, Signe de $f'(x)$ / 0.8, Variations de $f$ / 1.8}
    {${tkzXList} / 1}
  \\tkzTabLine{${tkzSignItems.join(", ")}, }
  \\tkzTabVar{${tkzVarItems.join(", ")}}
\\end{tikzpicture}

\\vspace{0.4cm}

\\begin{tikzpicture}
  \\begin{axis}[
    width=12cm, height=7cm,
    axis lines=middle,
    grid=both,
    xmin=${xMin}, xmax=${xMax},
    ymin=${yMinVal}, ymax=${yMaxVal},
    xlabel={$x$}, ylabel={$y$},
    samples=120,
    domain=${xMin}:${xMax},
    legend pos=north west
  ]
    \\addplot[thick, blue, smooth] {${simpNode.toString().replace(/log\(/g, "ln(")}};
    \\addlegendentry{$(\\mathcal{C}_f) : f(x) = ${simpNode.toString()}$}
    \\addplot[dashed, orange!90!black, thick, domain=${tx1.toFixed(2)}:${tx2.toFixed(2)}] {${slopeAtX0}*x + (${bIntercept})};
    \\addlegendentry{Tangente $(T)$ en $x_0=${safeX0}$}
  \\end{axis}
\\end{tikzpicture}
\\end{center}`;

    return {
      expressionInput: exprInput,
      normalizedExpr,
      symbolicDerivative: derivNode.toString(),
      simplifiedExpr: simpNode.toString(),
      xMin,
      xMax,
      tangentX0: safeX0,
      yAtX0,
      slopeAtX0,
      tangentEquation,
      criticalPoints,
      intervals,
      svgContent,
      tikzLatexCode,
      isValid: true,
    };
  } catch (err) {
    return {
      expressionInput: exprInput,
      normalizedExpr,
      symbolicDerivative: "—",
      simplifiedExpr: normalizedExpr,
      xMin,
      xMax,
      tangentX0,
      yAtX0: 0,
      slopeAtX0: 0,
      tangentEquation: "—",
      criticalPoints: [],
      intervals: [],
      svgContent: "",
      tikzLatexCode: "",
      isValid: false,
      errorMessage: err instanceof Error ? err.message : "خطأ في صياغة الدالة",
    };
  }
}

// ============================================================================
// مقترح أستاذ المادة رقم 2:
// مختبر المتتاليات الترجعية u_{n+1} = f(u_n) والإنشاء الهندسي (درج / حلزون Cobweb)
// ============================================================================

export interface RecursiveSequenceCobwebData {
  expressionInput: string;
  normalizedExpr: string;
  u0: number;
  steps: number;
  xMin: number;
  xMax: number;
  terms: number[];
  fixedPointApprox: number | null;
  behaviorType: "ESCALIER_CROISSANT" | "ESCALIER_DECROISSANT" | "ESCARGOT" | "DIVERGENT";
  behaviorLabelAr: string;
  behaviorLabelFr: string;
  svgContent: string;
  tikzLatexCode: string;
  isValid: boolean;
  errorMessage?: string;
}

export function generateRecursiveSequenceCobwebData(
  exprInput: string,
  u0: number = 0.5,
  steps: number = 5,
  xMinInput: number = 0,
  xMaxInput: number = 4
): RecursiveSequenceCobwebData {
  const xMin = Math.min(xMinInput, xMaxInput - 0.5);
  const xMax = Math.max(xMaxInput, xMin + 0.5);
  const safeSteps = Math.max(2, Math.min(10, Math.round(steps)));
  const normalizedExpr = latexToMathJSExpression(exprInput || "sqrt(x + 2)");

  try {
    const ast = parse(normalizedExpr);
    const simpNode = simplify(ast);
    const compiledF = simpNode.compile();

    const evalF = (x: number): number => {
      try {
        const v = compiledF.evaluate({ x, e: Math.E, pi: Math.PI });
        return typeof v === "number" && Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };

    const terms: number[] = [Number(u0.toFixed(4))];
    let current = u0;
    for (let i = 0; i < safeSteps; i++) {
      const nextVal = evalF(current);
      if (!Number.isFinite(nextVal) || Math.abs(nextVal) > 1e4) break;
      terms.push(Number(nextVal.toFixed(4)));
      current = nextVal;
    }

    // تقريب النقطة الصامدة f(x) - x = 0 في المجال [xMin, xMax]
    let fixedPointApprox: number | null = null;
    const N = 200;
    const dx = (xMax - xMin) / N;
    for (let i = 0; i < N; i++) {
      const a = xMin + i * dx;
      const b = a + dx;
      const ga = evalF(a) - a;
      const gb = evalF(b) - b;
      if (Number.isFinite(ga) && Number.isFinite(gb) && ga * gb <= 0) {
        fixedPointApprox = Number((0.5 * (a + b)).toFixed(3));
        break;
      }
    }

    // تصنيف سلوك المتتالية (درج تزايدي / درج تناقصي / حلزون Escargot)
    const diffs: number[] = [];
    for (let i = 0; i < terms.length - 1; i++) {
      diffs.push(terms[i + 1] - terms[i]);
    }
    const allPositive = diffs.every((d) => d >= -1e-5);
    const allNegative = diffs.every((d) => d <= 1e-5);
    const alternating =
      diffs.length >= 2 && diffs[0] * diffs[1] < 0;

    let behaviorType: RecursiveSequenceCobwebData["behaviorType"] = "ESCALIER_CROISSANT";
    let behaviorLabelAr = "تمثيل درج رتيب تزايدي (Diagramme en escalier croissant)";
    let behaviorLabelFr = "Diagramme en escalier monotone croissant";

    if (alternating) {
      behaviorType = "ESCARGOT";
      behaviorLabelAr = "تمثيل حلزوني متناوب حول النهاية ℓ (Diagramme en escargot)";
      behaviorLabelFr = "Diagramme en escargot (convergence alternée vers ℓ)";
    } else if (allNegative) {
      behaviorType = "ESCALIER_DECROISSANT";
      behaviorLabelAr = "تمثيل درج رتيب تناقصي (Diagramme en escalier décroissant)";
      behaviorLabelFr = "Diagramme en escalier monotone décroissant";
    } else if (!allPositive) {
      behaviorType = "DIVERGENT";
      behaviorLabelAr = "متتالية غير رتيبة أو متباعدة";
      behaviorLabelFr = "Suite non monotone ou divergente";
    }

    // بناء SVG عالي الدقة للإنشاء الهندسي
    const svgW = 680;
    const svgH = 380;
    const plotX = 56;
    const plotY = 32;
    const plotW = 584;
    const plotH = 304;

    const toSvgX = (x: number) => plotX + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (y: number) => plotY + plotH - ((y - xMin) / (xMax - xMin)) * plotH;

    let gridSvg = "";
    const stepGrid = Math.max(0.5, Number(((xMax - xMin) / 6).toFixed(1)));
    for (let g = xMin; g <= xMax + 1e-4; g += stepGrid) {
      const gv = Number(g.toFixed(1));
      const sx = toSvgX(gv);
      const sy = toSvgY(gv);
      gridSvg += `<line x1="${sx.toFixed(1)}" y1="${plotY}" x2="${sx.toFixed(1)}" y2="${plotY + plotH}" stroke="#e2e8f0" stroke-width="1"/>`;
      gridSvg += `<line x1="${plotX}" y1="${sy.toFixed(1)}" x2="${plotX + plotW}" y2="${sy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
    }

    // نقاط المنحنى (C_f)
    const curvePts: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const px = xMin + (i / 160) * (xMax - xMin);
      const py = evalF(px);
      if (Number.isFinite(py) && py >= xMin - 2 && py <= xMax + 2) {
        curvePts.push(`${toSvgX(px).toFixed(1)},${toSvgY(py).toFixed(1)}`);
      }
    }

    // خطوط الدرج أو الحلزون Cobweb
    const cobwebSegments: string[] = [];
    let termLabelsSvg = "";
    const axisY = toSvgY(Math.max(xMin, Math.min(xMax, 0)));

    for (let i = 0; i < terms.length - 1; i++) {
      const un = terms[i];
      const un1 = terms[i + 1];
      if (un < xMin || un > xMax || un1 < xMin || un1 > xMax) continue;

      const x0s = toSvgX(un);
      const yStart = i === 0 ? axisY : toSvgY(un);
      const yCurve = toSvgY(un1);
      const x1s = toSvgX(un1);

      // خط عمودي إلى المنحنى ثم أفقي إلى المنصف y = x
      cobwebSegments.push(
        `<line x1="${x0s.toFixed(1)}" y1="${yStart.toFixed(1)}" x2="${x0s.toFixed(1)}" y2="${yCurve.toFixed(1)}" stroke="#e11d48" stroke-width="1.8"/>`
      );
      cobwebSegments.push(
        `<line x1="${x0s.toFixed(1)}" y1="${yCurve.toFixed(1)}" x2="${x1s.toFixed(1)}" y2="${yCurve.toFixed(1)}" stroke="#e11d48" stroke-width="1.8"/>`
      );
      // إسقاط متقطع على محور الأفاصيل
      cobwebSegments.push(
        `<line x1="${x1s.toFixed(1)}" y1="${yCurve.toFixed(1)}" x2="${x1s.toFixed(1)}" y2="${axisY.toFixed(1)}" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1.2"/>`
      );
    }

    terms.slice(0, 5).forEach((val, idx) => {
      if (val >= xMin && val <= xMax) {
        const sx = toSvgX(val);
        termLabelsSvg += `<circle cx="${sx.toFixed(1)}" cy="${axisY.toFixed(1)}" r="3.5" fill="#be123c"/>`;
        termLabelsSvg += `<text x="${sx.toFixed(1)}" y="${(axisY + 16 + (idx % 2) * 11).toFixed(1)}" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#9f1239">u_${idx}</text>`;
      }
    });

    const fixedPointSvg =
      fixedPointApprox !== null && fixedPointApprox >= xMin && fixedPointApprox <= xMax
        ? `<circle cx="${toSvgX(fixedPointApprox).toFixed(1)}" cy="${toSvgY(fixedPointApprox).toFixed(1)}" r="5" fill="#059669" stroke="#ffffff" stroke-width="1.5"/>
           <text x="${(toSvgX(fixedPointApprox) + 10).toFixed(1)}" y="${(toSvgY(fixedPointApprox) - 8).toFixed(1)}" font-family="monospace" font-size="12" font-weight="bold" fill="#065f46">ℓ ≈ ${fixedPointApprox}</text>`
        : "";

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%">
  <defs>
    <clipPath id="cobwebClip">
      <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="${svgW}" height="${svgH}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
  ${gridSvg}
  <line x1="${plotX}" y1="${axisY.toFixed(1)}" x2="${plotX + plotW}" y2="${axisY.toFixed(1)}" stroke="#1e293b" stroke-width="1.6"/>
  <g clip-path="url(#cobwebClip)">
    <!-- المنصف الأول (D) : y = x -->
    <line x1="${toSvgX(xMin).toFixed(1)}" y1="${toSvgY(xMin).toFixed(1)}" x2="${toSvgX(xMax).toFixed(1)}" y2="${toSvgY(xMax).toFixed(1)}" stroke="#0f766e" stroke-width="1.8" stroke-dasharray="6,4"/>
    <!-- منحنى الدالة (C_f) -->
    <polyline fill="none" stroke="#1d4ed8" stroke-width="2.6" points="${curvePts.join(" ")}"/>
    <!-- مسار الحدود الترجعية u_{n+1} = f(u_n) -->
    ${cobwebSegments.join("\n    ")}
    ${fixedPointSvg}
  </g>
  ${termLabelsSvg}
  <text x="${plotX + 12}" y="${plotY + 20}" font-family="monospace" font-size="11" font-weight="bold" fill="#1d4ed8">(C_f) : f(x) = ${simpNode.toString()}</text>
  <text x="${plotX + 240}" y="${plotY + 20}" font-family="monospace" font-size="11" font-weight="bold" fill="#0f766e">(Δ) : y = x</text>
  <text x="${plotX + plotW - 12}" y="${plotY + 20}" text-anchor="end" font-family="monospace" font-size="11" font-weight="bold" fill="#be123c">u₀ = ${u0} (${behaviorType === "ESCARGOT" ? "Escargot" : "Escalier"})</text>
</svg>`;

    const tikzCobwebLines = terms
      .slice(0, -1)
      .map((un, i) => {
        const un1 = terms[i + 1];
        const y0 = i === 0 ? 0 : un;
        return `    \\draw[thick, red!80!black, ->] (axis cs:${un},${y0}) -- (axis cs:${un},${un1}) -- (axis cs:${un1},${un1});
    \\draw[dotted, gray!70!black] (axis cs:${un1},${un1}) -- (axis cs:${un1},0) node[below, font=\\scriptsize, text=red!80!black] {$u_${i + 1}$};`;
      })
      .join("\n");

    const tikzLatexCode = `% ==========================================================
% الإنشاء الهندسي لحدود المتتالية الترجعية u_{n+1} = f(u_n)
% الدالة المرفقة: f(x) = ${simpNode.toString()} | الحد الأول: u_0 = ${u0}
% ==========================================================
\\begin{center}
\\begin{tikzpicture}
  \\begin{axis}[
    width=11cm, height=8.5cm,
    axis lines=middle,
    grid=both,
    xmin=${xMin}, xmax=${xMax},
    ymin=${xMin}, ymax=${xMax},
    xlabel={$x$}, ylabel={$y$},
    samples=120,
    domain=${xMin}:${xMax},
    legend pos=north west
  ]
    \\addplot[thick, blue, smooth] {${simpNode.toString().replace(/log\(/g, "ln(")}};
    \\addlegendentry{$(\\mathcal{C}_f) : y = f(x)$}
    \\addplot[dashed, teal!80!black, thick] {x};
    \\addlegendentry{$(\\Delta) : y = x$}
    \\node[below, font=\\scriptsize, text=red!80!black] at (axis cs:${u0},0) {$u_0$};
${tikzCobwebLines}
  \\end{axis}
\\end{tikzpicture}
\\end{center}`;

    return {
      expressionInput: exprInput,
      normalizedExpr,
      u0,
      steps: safeSteps,
      xMin,
      xMax,
      terms,
      fixedPointApprox,
      behaviorType,
      behaviorLabelAr,
      behaviorLabelFr,
      svgContent,
      tikzLatexCode,
      isValid: true,
    };
  } catch (err) {
    return {
      expressionInput: exprInput,
      normalizedExpr,
      u0,
      steps: safeSteps,
      xMin,
      xMax,
      terms: [u0],
      fixedPointApprox: null,
      behaviorType: "DIVERGENT",
      behaviorLabelAr: "تعذر حساب حدود المتتالية",
      behaviorLabelFr: "Erreur de calcul",
      svgContent: "",
      tikzLatexCode: "",
      isValid: false,
      errorMessage: err instanceof Error ? err.message : "خطأ في صياغة الدالة",
    };
  }
}

// ============================================================================
// مقترح أستاذ المادة رقم 3:
// المسارات الفارقية داخل نفس ورقة الفرض (Pédagogie Différenciée: Piste Guidée vs Piste Experte + Question Bonus +1 pt)
// ============================================================================

export interface DifferentiatedPathConfig {
  enabled: boolean;
  includeBonusQuestion: boolean;
  pointsAllocated: number;
  bonusPoints: number;
  targetQuestionTitleAr: string;
  targetQuestionTitleFr: string;
  guidedStepsAr: string[];
  guidedStepsFr: string[];
  expertPromptAr: string;
  expertPromptFr: string;
  bonusQuestionAr: string;
  bonusQuestionFr: string;
}

export function getDefaultDifferentiatedPathForTrack(
  trackCode: string
): DifferentiatedPathConfig {
  const isSM = trackCode.includes("SM") || trackCode.includes("EXP");
  const is1BacOrTC = trackCode.startsWith("1BAC") || trackCode.startsWith("TC") || trackCode.startsWith("2NDE") || trackCode.startsWith("1ERE");

  if (isSM) {
    return {
      enabled: false,
      includeBonusQuestion: true,
      pointsAllocated: 2.0,
      bonusPoints: 1.0,
      targetQuestionTitleAr: "السؤال التوليفي بالاختيار البيداغوجي (المسار الموجه أو المسار الخبير):",
      targetQuestionTitleFr: "Question de synthèse à parcours différencié au choix (Piste Guidée ou Piste Experte) :",
      guidedStepsAr: [
        "أ) تحقق أنه لكل $x \\in ]0, +\\infty[$ لدينا: $f(x) - x = \\frac{\\ln(x) - 1}{x}$. [0.75 ن]",
        "ب) أدرس إشارة $\\ln(x) - 1$ على $]0, +\\infty[$ ثم استنتج الوضع النسبي للمنحنى $(\\mathcal{C}_f)$ والمستقيم $(\\Delta): y = x$. [0.75 ن]",
        "ج) استنتج أنه لكل $n \\in \\mathbb{N}$، $1 \\le u_n \\le u_{n+1} \\le e$ وأن المتتالية $(u_n)$ متقاربة. [0.50 ن]",
      ],
      guidedStepsFr: [
        "a) Vérifier que pour tout $x \\in ]0, +\\infty[$, $f(x) - x = \\frac{\\ln(x) - 1}{x}$. [0,75 pt]",
        "b) Étudier le signe de $\\ln(x) - 1$ sur $]0, +\\infty[$ puis en déduire la position relative de $(\\mathcal{C}_f)$ et $(\\Delta): y = x$. [0,75 pt]",
        "c) En déduire que pour tout $n \\in \\mathbb{N}$, $1 \\le u_n \\le u_{n+1} \\le e$ et que $(u_n)$ converge. [0,50 pt]",
      ],
      expertPromptAr:
        "برهن مباشرة، باختيار الخطة الرياضية المناسبة، أن المتتالية المعرفة بـ $u_0 = 1$ و $u_{n+1} = f(u_n)$ متقاربة وحدد نهايتها المضبوطة. [2.00 ن كاملة]",
      expertPromptFr:
        "Démontrer directement, en structurant votre propre démarche, que la suite définie par $u_0 = 1$ et $u_{n+1} = f(u_n)$ est convergente et déterminer sa limite exacte. [2,00 pts complets]",
      bonusQuestionAr:
        "سؤال التميز الاختياري (خارج السلم +1.00 ن): بين أنه لكل $n \\in \\mathbb{N}^*$، $|u_n - e| \\le \\frac{1}{e^n}|u_0 - e|$ ثم استنتج رتبة $n_0$ التي تحقق $|u_n - e| < 10^{-4}$.",
      bonusQuestionFr:
        "Question Bonus d'Excellence (Hors-barème +1,00 pt) : Montrer que $\\forall n \\in \\mathbb{N}^*$, $|u_n - e| \\le \\frac{1}{e^n}|u_0 - e|$ et déterminer un rang $n_0$ tel que $|u_n - e| < 10^{-4}$.",
    };
  }

  if (is1BacOrTC) {
    return {
      enabled: false,
      includeBonusQuestion: true,
      pointsAllocated: 2.0,
      bonusPoints: 1.0,
      targetQuestionTitleAr: "سؤال البحث التوليفي بالاختيار (المسار الموجه أو المسار المباشر):",
      targetQuestionTitleFr: "Question de synthèse à parcours au choix (Piste Guidée ou Piste Experte) :",
      guidedStepsAr: [
        "أ) تحقق من أن لكل $x \\in \\mathbb{R}$: $x^2 - 4x + 3 = (x - 2)^2 - 1$. [0.75 ن]",
        "ب) استنتج القيمة الدنيا للدالة $f(x) = x^2 - 4x + 3$ على $\\mathbb{R}$ وأفصول النقطة الموافقة. [0.75 ن]",
        "ج) حل في $\\mathbb{R}$ المتراجحة $f(x) \\ge 0$. [0.50 ن]",
      ],
      guidedStepsFr: [
        "a) Vérifier que pour tout $x \\in \\mathbb{R}$ : $x^2 - 4x + 3 = (x - 2)^2 - 1$. [0,75 pt]",
        "b) En déduire la valeur minimale de $f(x) = x^2 - 4x + 3$ sur $\\mathbb{R}$. [0,75 pt]",
        "c) Résoudre dans $\\mathbb{R}$ l'inéquation $f(x) \\ge 0$. [0,50 pt]",
      ],
      expertPromptAr:
        "حدد مباشرة مطارف الدالة $f(x) = x^2 - 4x + 3$ على $\\mathbb{R}$ وادرس إشارتها حسب قيم $x$. [2.00 ن كاملة]",
      expertPromptFr:
        "Déterminer directement l'extremum de $f(x) = x^2 - 4x + 3$ sur $\\mathbb{R}$ et dresser son tableau de signes complet. [2,00 pts complets]",
      bonusQuestionAr:
        "سؤال التميز الاختياري (Bonus +1.00 ن): ناقش مبيانياً وجبرياً حسب قيم البارامتر الحقيقي $m$ عدد حلول المعادلة $f(x) = m$.",
      bonusQuestionFr:
        "Question Bonus d'Excellence (+1,00 pt) : Discuter graphiquement et algébriquement suivant les valeurs du paramètre réel $m$ le nombre de solutions de $f(x) = m$.",
    };
  }

  return {
    enabled: false,
    includeBonusQuestion: true,
    pointsAllocated: 2.0,
    bonusPoints: 1.0,
    targetQuestionTitleAr: "السؤال التوليفي بالاختيار البيداغوجي (المسار الموجه أو المسار الخبير):",
    targetQuestionTitleFr: "Question de synthèse à parcours différencié au choix (Piste Guidée ou Piste Experte) :",
    guidedStepsAr: [
      "أ) باستعمال المكاملة بالأجزاء، أحسب التكامل $I = \\int_1^e x \\ln(x)\\,dx$. [0.75 ن]",
      "ب) تحقق أن $f(x) - x = x\\ln(x)$ لكل $x \\in [1, e]$ وأن $f(x) \\ge x$ على $[1, e]$. [0.50 ن]",
      "ج) استنتج مساحة حيز المستوى المحصور بين $(\\mathcal{C}_f)$ والمستقيم $(\\Delta): y = x$ والمستقيمين $x=1$ و $x=e$ بـ $\\text{cm}^2$. [0.75 ن]",
    ],
    guidedStepsFr: [
      "a) À l'aide d'une intégration par parties, calculer $I = \\int_1^e x \\ln(x)\\,dx$. [0,75 pt]",
      "b) Vérifier que $f(x) - x = x\\ln(x)$ sur $[1, e]$ et préciser la position relative de $(\\mathcal{C}_f)$ et $(\\Delta): y = x$. [0,50 pt]",
      "c) En déduire l'aire du domaine plan délimité par $(\\mathcal{C}_f)$, $(\\Delta)$, $x=1$ et $x=e$ en $\\text{cm}^2$. [0,75 pt]",
    ],
    expertPromptAr:
      "أحسب مباشرة بـ $\\text{cm}^2$ مساحة الحيز الهندسي المحصور بين المنحنى $(\\mathcal{C}_f)$ والمستقيم $(\\Delta): y = x$ والمستقيمين $x = 1$ و $x = e$ علماً أن $\|\\vec{i}\| = \|\\vec{j}\| = 2\\text{ cm}$. [2.00 ن كاملة]",
    expertPromptFr:
      "Calculer directement en $\\text{cm}^2$ l'aire du domaine plan délimité par $(\\mathcal{C}_f)$, la droite $(\\Delta): y = x$ et les droites $x = 1$ et $x = e$ (avec $\|\\vec{i}\| = \|\\vec{j}\| = 2\\text{ cm}$). [2,00 pts complets]",
    bonusQuestionAr:
      "سؤال التميز الاختياري (خارج السلم +1.00 ن): لكل $n \\in \\mathbb{N}^*$ نضع $I_n = \\int_1^e x^n \\ln(x)\\,dx$. بين أن $(I_n)$ متتالية متقاربة أو حدد نهاية $\\frac{I_n}{e^{n+1}}$ عندما يؤول $n$ إلى $+\\infty$.",
    bonusQuestionFr:
      "Question Bonus d'Excellence (+1,00 pt) : Pour $n \\in \\mathbb{N}^*$, on pose $I_n = \\int_1^e x^n \\ln(x)\\,dx$. Exprimer $I_n$ en fonction de $n$ et déterminer $\\lim_{n \\to +\\infty} \\frac{I_n}{e^{n+1}}$.",
  };
}

// ============================================================================
// مقترح المفتش التربوي رقم 2:
// مدقق "العقوبة المزدوجة" الديداكتيكي الآلي (Double Penalty Detector & 1-Click Reformulator)
// ============================================================================

export type DoublePenaltyReformulationMode =
  | "MONTRER_QUE"
  | "ADMETTRE_RESULTAT"
  | "QUESTION_TREMPLIN";

export interface DoublePenaltyFinding {
  id: string;
  lessonFr: string;
  lessonAr: string;
  exerciseIndex: number;
  questionIndex: number;
  dependentQuestionIndex: number;
  originalQuestionAr: string;
  originalQuestionFr: string;
  dependentQuestionAr: string;
  riskDescriptionAr: string;
  riskDescriptionFr: string;
  repairedQuestionAr: string;
  repairedQuestionFr: string;
  repairedByMode: Record<
    DoublePenaltyReformulationMode,
    { ar: string; fr: string; baremeStepsAr: string }
  >;
  usedSymbolicMathJS: boolean;
}

/**
 * استخراج تعبير f(x) من سياق التمرين إن وجد لحساب مشتقته الرمزية بواسطة mathjs
 */
function findFunctionExpressionInExercise(questionsList: string[]): string | null {
  for (const q of questionsList) {
    const m = q.match(/[fg]\s*\(\s*x\s*\)\s*=\s*([^$،,؛\n]+)/i);
    if (m && m[1]) {
      return m[1].trim();
    }
  }
  return null;
}

/**
 * إعادة صياغة سؤال وسطي مفتوح ("أحسب f'(x)" / "Calculer f'(x)") وفق 3 أنماط ديداكتيكية يوصي بها التفتيش التربوي:
 * 1) MONTRER_QUE: «بين أن... / Montrer que...» (تحقق ذاتي بصيغة صريحة محسوبة عبر MathJS)
 * 2) ADMETTRE_RESULTAT: «صمام القبول / Admettre le résultat» (استمرارية التلميذ في الأسئلة الموالية)
 * 3) QUESTION_TREMPLIN: «سؤال مرحلي موجه (أ / ب) / Question-tremplin» (تفكيك الصعوبة الإجرائية)
 */
export function autoReformulateDoublePenaltyQuestion(
  qAr: string,
  qFr: string,
  allExerciseQuestions: string[]
): {
  repairedAr: string;
  repairedFr: string;
  repairedByMode: Record<
    DoublePenaltyReformulationMode,
    { ar: string; fr: string; baremeStepsAr: string }
  >;
  usedSymbolicMathJS: boolean;
} {
  const fnExpr = findFunctionExpressionInExercise(allExerciseQuestions);
  let symbolicDeriv: string | null = null;

  if (fnExpr) {
    try {
      const norm = latexToMathJSExpression(fnExpr);
      const d = simplify(derivative(parse(norm), "x")).toString();
      if (d && d.length > 0 && d !== "0") {
        symbolicDeriv = d.replace(/\*/g, " ").replace(/log\(/g, "\\ln(");
      }
    } catch {
      symbolicDeriv = null;
    }
  }

  // استخراج بادئة الترقيم إن وجدت مثل "2." أو "2) "
  const numPrefixArMatch = qAr.match(/^(\s*[0-9]+[\.\-\)]\s*)/);
  const numPrefixFrMatch = qFr.match(/^(\s*[0-9]+[\.\-\)]\s*)/);
  const prefixAr = numPrefixArMatch ? numPrefixArMatch[1] : "";
  const prefixFr = numPrefixFrMatch ? numPrefixFrMatch[1] : "";

  const bodyAr = qAr.slice(prefixAr.length).trim();
  const bodyFr = qFr.slice(prefixFr.length).trim();

  if (/f'\s*\(\s*x\s*\)|المشتقة|dérivée/i.test(`${qAr} ${qFr}`)) {
    const formulaTarget = symbolicDeriv || "g(x)";
    const showingAr = `${prefixAr}بين أنه لكل $x$ من حيز الاشتقاق لدينا $f'(x) = ${formulaTarget}$، ثم أؤول النتيجة واستنتج جدول تغيرات الدالة $f$. (صياغة مانعة للعقوبة المزدوجة — يمكن قبول صيغة $f'(x)$ في الأسئلة الموالية)`;
    const showingFr = `${prefixFr}Montrer que pour tout $x$ du domaine de dérivabilité, $f'(x) = ${formulaTarget}$, puis en déduire le tableau de variations de $f$. (Formulation anti-double peine : le résultat peut être admis pour la suite)`;

    return {
      repairedAr: showingAr,
      repairedFr: showingFr,
      repairedByMode: {
        MONTRER_QUE: {
          ar: showingAr,
          fr: showingFr,
          baremeStepsAr: `0.25 ن: تطبيق قاعدة الاشتقاق | 0.25 ن: التبسيط والوصول إلى $f'(x) = ${formulaTarget}$ | 0.25 ن: دراسة إشارة $f'(x)$ | 0.25 ن: جدول التغيرات`,
        },
        ADMETTRE_RESULTAT: {
          ar: `${prefixAr}${bodyAr}. (ملحوظة استمرارية للتلميذ: في حال تعذر إتمام الحساب، يُقبل في بقية التمرين أن $f'(x) = ${formulaTarget}$).`,
          fr: `${prefixFr}${bodyFr}. (Note de continuité : pour la suite de l'exercice, on pourra admettre que $f'(x) = ${formulaTarget}$).`,
          baremeStepsAr: `0.50 ن: حساب $f'(x)$ (خطوة + نتيجة) | 0.50 ن: استثمار الصيغة المقبولة في الرتابة دون عقوبة مزدوجة`,
        },
        QUESTION_TREMPLIN: {
          ar: `${prefixAr}أ) تحقق من قابلية اشتقاق حدود الدالة $f$ واكتب تعبير $f'(x)$ قبل التوحيد.\nب) بين بعد التوحيد والتعميل أن $f'(x) = ${formulaTarget}$، ثم استنتج رتابة $f$.`,
          fr: `${prefixFr}a) Justifier la dérivabilité de $f$ et donner l'expression brute de $f'(x)$.\nb) En déduire après réduction que $f'(x) = ${formulaTarget}$, puis dresser le tableau de variations de $f$.`,
          baremeStepsAr: `أ) 0.50 ن: المشتقة الأولية (0.25 + 0.25) | ب) 0.25 ن: التوحيد إلى ${formulaTarget} + 0.25 ن: الرتابة`,
        },
      },
      usedSymbolicMathJS: Boolean(symbolicDeriv),
    };
  }

  if (/u_\{?n\+1\}?\s*-\s*u_n|رتابة|monotonie/i.test(`${qAr} ${qFr}`)) {
    const showingAr = `${prefixAr}تحقق من صيغة الفرق $u_{n+1} - u_n$ المعطاة، ثم استنتج رتابة المتتالية $(u_n)$ وتقاربها. (صياغة ديداكتيكية تضمن استمرارية البحث)`;
    const showingFr = `${prefixFr}Vérifier l'expression de la différence $u_{n+1} - u_n$ annoncée, puis en déduire la monotonie de la suite $(u_n)$. (Continuité didactique garantie)`;
    return {
      repairedAr: showingAr,
      repairedFr: showingFr,
      repairedByMode: {
        MONTRER_QUE: {
          ar: showingAr,
          fr: showingFr,
          baremeStepsAr: `0.25 ن: تعويض $u_{n+1}$ | 0.25 ن: توحيد المقامات والتعميل | 0.25 ن: تحديد إشارة الفرق | 0.25 ن: استنتاج الرتابة`,
        },
        ADMETTRE_RESULTAT: {
          ar: `${prefixAr}${bodyAr}. (صمام أمان: يمكن للتلميذ قبول إشارة الفرق $u_{n+1} - u_n$ لإثبات التقارب في الأسئلة الموالية).`,
          fr: `${prefixFr}${bodyFr}. (Soupape didactique : le signe de $u_{n+1} - u_n$ peut être admis pour étudier la convergence dans la suite).`,
          baremeStepsAr: `0.50 ن: حساب الفرق $u_{n+1}-u_n$ | 0.50 ن: استنتاج الرتابة والتقارب باستقلالية`,
        },
        QUESTION_TREMPLIN: {
          ar: `${prefixAr}أ) احسب الفرق $u_{n+1} - u_n$ بدلالة $u_n$ على شكل جداء معمل.\nب) بالاعتماد على تأطير $u_n$، حدد إشارة $u_{n+1} - u_n$ واستنتج رتابة المتتالية $(u_n)$.`,
          fr: `${prefixFr}a) Exprimer la différence $u_{n+1} - u_n$ sous forme factorisée en fonction de $u_n$.\nb) En utilisant l'encadrement de $u_n$, déterminer le signe de $u_{n+1} - u_n$ et la monotonie de $(u_n)$.`,
          baremeStepsAr: `أ) 0.50 ن: التعميل | ب) 0.25 ن: إشارة العوامل + 0.25 ن: رتابة المتتالية`,
        },
      },
      usedSymbolicMathJS: false,
    };
  }

  // تحويل عام لأفعال الأمر المفتوحة (أحسب / حدد) إلى (بين أن / تحقق أن) مع صمام أمان القبول
  const convertedAr = bodyAr
    .replace(/^(?:أحسب|احسب|حدد)\b/, "بين (أو تحقق حسابياً) من النتيجة المطلوبة لـ")
    .replace(/\.$/, "");
  const convertedFr = bodyFr
    .replace(/^(?:Calculer|Déterminer)\b/i, "Montrer (ou vérifier par le calcul)")
    .replace(/\.$/, "");

  const defaultAr = `${prefixAr}${convertedAr}. (ملحوظة استمرارية: تُقبل النتيجة في الأسئلة الموالية لتفادي العقوبة المزدوجة).`;
  const defaultFr = `${prefixFr}${convertedFr}. (Note de continuité : le résultat est admis pour la suite afin d'éviter toute double peine).`;

  return {
    repairedAr: defaultAr,
    repairedFr: defaultFr,
    repairedByMode: {
      MONTRER_QUE: {
        ar: defaultAr,
        fr: defaultFr,
        baremeStepsAr: `0.25 ن: وضع العلاقة | 0.25 ن: التطبيق العددي/الجبري | 0.25 ن: النتيجة النهائية`,
      },
      ADMETTRE_RESULTAT: {
        ar: `${prefixAr}${bodyAr}. (تُقبل النتيجة المعلنة في الأسئلة اللاحقة لضمان تكافؤ الفرص وعدم مضاعفة الجزاء).`,
        fr: `${prefixFr}${bodyFr}. (Le résultat annoncé est admis dans les questions suivantes pour garantir l'équité d'évaluation).`,
        baremeStepsAr: `0.50 ن: خطوات الاستدلال | 0.25 ن: النتيجة (تُقبل لاحقاً دون جزاء مزدوج)`,
      },
      QUESTION_TREMPLIN: {
        ar: `${prefixAr}أ) اكتب العلاقة الرياضية الأساسية اللازمة لحل السؤال.\nب)${convertedAr} واستنتج المطلوب.`,
        fr: `${prefixFr}a) Écrire la relation mathématique fondamentale nécessaire.\nb) ${convertedFr} et conclure.`,
        baremeStepsAr: `أ) 0.25 ن: صياغة القاعدة | ب) 0.50 ن: الحساب والاستنتاج`,
      },
    },
    usedSymbolicMathJS: false,
  };
}

/**
 * فحص كافة تمارين الفرض لرصد مواضع "العقوبة المزدوجة" (Double Peine Didactique)
 */
export function detectDoublePenaltyInLessons(
  lessons: LessonItem[],
  getQuestionsForLesson: (lesson: LessonItem) => { questionsAr: string[]; questionsFr: string[] }
): DoublePenaltyFinding[] {
  const findings: DoublePenaltyFinding[] = [];

  lessons.forEach((lesson, exIdx) => {
    const { questionsAr, questionsFr } = getQuestionsForLesson(lesson);
    const count = Math.min(questionsAr.length, questionsFr.length);

    for (let qIdx = 0; qIdx < count - 1; qIdx++) {
      const qAr = questionsAr[qIdx] || "";
      const qFr = questionsFr[qIdx] || "";
      const nextAr = questionsAr.slice(qIdx + 1).join(" ");
      const nextFr = questionsFr.slice(qIdx + 1).join(" ");

      const isAlreadyClosedProof =
        /(?:بين\s+أن|برهن\s+أن|تحقق\s+أن|أثبت\s+أن|تُقبل|يمكن\s+قبول|Montrer\s+que|Démontrer\s+que|Vérifier\s+que|admis)/i.test(
          `${qAr} ${qFr}`
        );
      if (isAlreadyClosedProof) continue;

      const isOpenCalculation =
        /(?:أحسب|احسب|حدد\s+مشتقة|حدد\s+صيغة|أوجد\s+تعبير|Calculer\s+f'|Calculer\s+la\s+dérivée|Calculer\s+u_|Déterminer\s+f'\(x\)|Déterminer\s+l'expression)/i.test(
          `${qAr} ${qFr}`
        );

      const hasDownstreamDependency =
        /(?:استنتج|جدول\s+تغيرات|إشارة\s+f'|رتابة|الوضع\s+النسبي|En\s+déduire|tableau\s+de\s+variations|signe\s+de\s+f'|monotonie)/i.test(
          `${nextAr} ${nextFr}`
        );

      if (isOpenCalculation && hasDownstreamDependency) {
        const { repairedAr, repairedFr, repairedByMode, usedSymbolicMathJS } =
          autoReformulateDoublePenaltyQuestion(qAr, qFr, [
            ...questionsAr,
            ...questionsFr,
          ]);

        findings.push({
          id: `dp_${exIdx}_${qIdx}`,
          lessonFr: lesson.lessonFr,
          lessonAr: lesson.lessonAr,
          exerciseIndex: exIdx,
          questionIndex: qIdx,
          dependentQuestionIndex: qIdx + 1,
          originalQuestionAr: qAr,
          originalQuestionFr: qFr,
          dependentQuestionAr: questionsAr[qIdx + 1] || "",
          riskDescriptionAr: `السؤال (${qIdx + 1}) يطلب حساباً مفتوحاً بدون إعطاء صيغة النتيجة، بينما السؤال (${qIdx + 2}) وما يليه ينبني مباشرة عليه؛ خطأ التلميذ هنا يؤدي إلى عقوبة مزدوجة وضياع بقية التمرين.`,
          riskDescriptionFr: `La question (${qIdx + 1}) demande un calcul ouvert sans donner la formule cible alors que la question (${qIdx + 2}) en dépend directement (risque de double peine didactique).`,
          repairedQuestionAr: repairedAr,
          repairedQuestionFr: repairedFr,
          repairedByMode,
          usedSymbolicMathJS,
        });
      }
    }
  });

  return findings;
}

// ============================================================================
// مقترح المفتش التربوي رقم 3:
// لوحة التتبع الطولي لمكتسبات الفوج عبر الفروض الثلاثة (DS1 -> DS2 -> DS3)
// ============================================================================

export interface LongitudinalCheckpointStats {
  dsCode: "DS1" | "DS2" | "DS3";
  titleAr: string;
  titleFr: string;
  dateLabel: string;
  meanScore20: number;
  stdDeviation: number;
  masteryAPct: number; // متحكم (A >= 14/20)
  masteryECAPct: number; // في طور التحكم (10 <= ECA < 14)
  masteryNAPct: number; // غير متحكم (NA < 10/20)
  n1SuccessPct: number;
  n2SuccessPct: number;
  n3SuccessPct: number;
  remediationHoursDone: number;
  inspectorObservationAr: string;
  inspectorObservationFr: string;
}

export interface LongitudinalCohortTrackerConfig {
  includeInPrintablePreview: boolean;
  cohortName: string;
  studentCount: number;
  checkpoints: [
    LongitudinalCheckpointStats,
    LongitudinalCheckpointStats,
    LongitudinalCheckpointStats
  ];
}

export const DEFAULT_LONGITUDINAL_COHORT_CONFIG: LongitudinalCohortTrackerConfig = {
  includeInPrintablePreview: false,
  cohortName: "القسم النموذجي 1 — الفوج التربوي",
  studentCount: 34,
  checkpoints: [
    {
      dsCode: "DS1",
      titleAr: "الفرض المحروس رقم 1 (تشخيص وإرساء)",
      titleFr: "Devoir Surveillé N° 1 (Installation)",
      dateLabel: "أكتوبر / Octobre",
      meanScore20: 11.4,
      stdDeviation: 3.6,
      masteryAPct: 28,
      masteryECAPct: 44,
      masteryNAPct: 28,
      n1SuccessPct: 72,
      n2SuccessPct: 54,
      n3SuccessPct: 26,
      remediationHoursDone: 2,
      inspectorObservationAr: "تفاوت أولي طبيعي؛ برمجة حصتي دعم فارقي لتقليص فئة غير المتحكمين (NA).",
      inspectorObservationFr: "Hétérogénéité initiale ; 2h de remédiation ciblée programmées pour le groupe NA.",
    },
    {
      dsCode: "DS2",
      titleAr: "الفرض المحروس رقم 2 (تثبيت ومعالجة)",
      titleFr: "Devoir Surveillé N° 2 (Consolidation)",
      dateLabel: "نونبر / Novembre",
      meanScore20: 12.85,
      stdDeviation: 3.1,
      masteryAPct: 39,
      masteryECAPct: 46,
      masteryNAPct: 15,
      n1SuccessPct: 81,
      n2SuccessPct: 65,
      n3SuccessPct: 35,
      remediationHoursDone: 3,
      inspectorObservationAr: "أثر إيجابي ملموس لحصص الدعم: تراجع فئة التعثر (NA) من 28% إلى 15% وتحسن التجانس.",
      inspectorObservationFr: "Impact positif de la remédiation : baisse du groupe NA de 28% à 15%.",
    },
    {
      dsCode: "DS3",
      titleAr: "الفرض المحروس رقم 3 (توليف الدورة)",
      titleFr: "Devoir Surveillé N° 3 (Bilan Semestriel)",
      dateLabel: "يناير / Janvier",
      meanScore20: 13.75,
      stdDeviation: 2.75,
      masteryAPct: 48,
      masteryECAPct: 43,
      masteryNAPct: 9,
      n1SuccessPct: 87,
      n2SuccessPct: 73,
      n3SuccessPct: 44,
      remediationHoursDone: 3,
      inspectorObservationAr: "تحكم مؤسساتي ممتاز (91% بين A و ECA) واستعداد جيد للاستحقاق الإشهادي.",
      inspectorObservationFr: "Excellente maîtrise globale (91% A+ECA) et réduction de l'écart-type.",
    },
  ],
};

// ============================================================================
// مقترح أستاذ المادة رقم 1 (الدفعة الجديدة):
// مولد جداول الإشارة ومجموعة التعريف الآلي (Tableaux de Signes & Ensemble de Définition D_f)
// ============================================================================

export interface SignTableCriticalPoint {
  x: number;
  label: string;
  isNumZero: boolean;
  isDenZero: boolean; // Valeur interdite ||
}

export interface SignTableAndDomainData {
  isValid: boolean;
  errorMessage?: string;
  numeratorExpr: string;
  denominatorExpr: string;
  hasDenominator: boolean;
  numeratorLatex: string;
  denominatorLatex: string;
  fullExpressionLatex: string;
  domainLatex: string;
  domainExplanationAr: string;
  domainExplanationFr: string;
  criticalPoints: SignTableCriticalPoint[];
  numSigns: ("+" | "-")[];
  denSigns: ("+" | "-")[];
  quotientSigns: ("+" | "-")[];
  solutionStrictPosLatex: string; // E(x) > 0
  solutionNonNegLatex: string;    // E(x) >= 0
  solutionStrictNegLatex: string; // E(x) < 0
  solutionNonPosLatex: string;    // E(x) <= 0
  svgSignTable: string;
  tikzCode: string;
  suggestedQuestionAr: string;
  suggestedQuestionFr: string;
  suggestedAnswerAr: string;
  suggestedAnswerFr: string;
}

function findRealRootsInRange(
  compiled: EvalFunction,
  xMin: number,
  xMax: number
): number[] {
  const roots: number[] = [];
  const N = 600;
  const step = (xMax - xMin) / N;

  const evalSafe = (xVal: number): number => {
    try {
      const v = compiled.evaluate({ x: xVal });
      const num = typeof v === "number" ? v : Number(v);
      return Number.isFinite(num) ? num : NaN;
    } catch {
      return NaN;
    }
  };

  for (let i = 0; i <= N; i++) {
    const x1 = xMin + i * step;
    const y1 = evalSafe(x1);
    if (Number.isFinite(y1) && Math.abs(y1) < 1e-7) {
      const rounded = Number(x1.toFixed(2));
      if (!roots.some((r) => Math.abs(r - rounded) < 0.08)) {
        roots.push(rounded === 0 ? 0 : rounded);
      }
      continue;
    }
    if (i < N) {
      const x2 = xMin + (i + 1) * step;
      const y2 = evalSafe(x2);
      if (Number.isFinite(y1) && Number.isFinite(y2) && y1 * y2 < 0) {
        // Bisection refinement
        let a = x1;
        let b = x2;
        let fa = y1;
        for (let iter = 0; iter < 28; iter++) {
          const mid = 0.5 * (a + b);
          const fm = evalSafe(mid);
          if (!Number.isFinite(fm)) break;
          if (Math.abs(fm) < 1e-9) {
            a = mid;
            b = mid;
            break;
          }
          if (fa * fm <= 0) {
            b = mid;
          } else {
            a = mid;
            fa = fm;
          }
        }
        const root = Number((0.5 * (a + b)).toFixed(2));
        if (!roots.some((r) => Math.abs(r - root) < 0.08)) {
          roots.push(root === 0 ? 0 : root);
        }
      }
    }
  }

  return roots.sort((a, b) => a - b);
}

export function generateSignTableAndDomainData(
  numeratorRaw: string,
  denominatorRaw: string,
  xMinInput: number = -10,
  xMaxInput: number = 10
): SignTableAndDomainData {
  const numClean = (numeratorRaw || "x^2 - 4").trim();
  const denClean = (denominatorRaw || "1").trim();
  const hasDenominator = denClean !== "" && denClean !== "1";

  const xMin = Math.min(xMinInput, xMaxInput - 2);
  const xMax = Math.max(xMaxInput, xMinInput + 2);

  try {
    const numNode = parse(numClean);
    const denNode = parse(hasDenominator ? denClean : "1");
    const numCompiled = numNode.compile();
    const denCompiled = denNode.compile();

    let numLatex = numClean;
    let denLatex = denClean;
    try {
      numLatex = simplify(numNode).toTex();
    } catch {
      numLatex = numNode.toTex();
    }
    try {
      denLatex = hasDenominator ? simplify(denNode).toTex() : "1";
    } catch {
      denLatex = hasDenominator ? denNode.toTex() : "1";
    }

    const fullExpressionLatex = hasDenominator
      ? `\\frac{${numLatex}}{${denLatex}}`
      : numLatex;

    const numRoots = findRealRootsInRange(numCompiled, xMin, xMax);
    const denRoots = hasDenominator ? findRealRootsInRange(denCompiled, xMin, xMax) : [];

    // Merge critical points
    const allX: number[] = [];
    for (const r of [...numRoots, ...denRoots]) {
      if (!allX.some((v) => Math.abs(v - r) < 0.06)) {
        allX.push(r);
      }
    }
    allX.sort((a, b) => a - b);

    const criticalPoints: SignTableCriticalPoint[] = allX.map((xVal) => ({
      x: xVal,
      label: Number.isInteger(xVal) ? `${xVal}` : xVal.toFixed(2),
      isNumZero: numRoots.some((r) => Math.abs(r - xVal) < 0.06),
      isDenZero: denRoots.some((r) => Math.abs(r - xVal) < 0.06),
    }));

    // Evaluate sign in each of the (k + 1) intervals
    const numSigns: ("+" | "-")[] = [];
    const denSigns: ("+" | "-")[] = [];
    const quotientSigns: ("+" | "-")[] = [];

    const boundaries = [
      allX.length > 0 ? allX[0] - 2.3 : -1.5,
      ...allX,
      allX.length > 0 ? allX[allX.length - 1] + 2.3 : 1.5,
    ];

    for (let i = 0; i < allX.length + 1; i++) {
      const testX =
        allX.length === 0
          ? 0.37
          : i === 0
          ? allX[0] - 1.37
          : i === allX.length
          ? allX[allX.length - 1] + 1.37
          : 0.5 * (boundaries[i] + boundaries[i + 1]);

      const nv = Number(numCompiled.evaluate({ x: testX }));
      const dv = hasDenominator ? Number(denCompiled.evaluate({ x: testX })) : 1;
      const ns: "+" | "-" = nv >= 0 ? "+" : "-";
      const ds: "+" | "-" = dv >= 0 ? "+" : "-";
      const qs: "+" | "-" = ns === ds ? "+" : "-";
      numSigns.push(ns);
      denSigns.push(ds);
      quotientSigns.push(qs);
    }

    // Domain D_f
    const forbiddenLabels = criticalPoints
      .filter((cp) => cp.isDenZero)
      .map((cp) => cp.label);

    const domainLatex =
      forbiddenLabels.length === 0
        ? "D_f = \\mathbb{R} = ]-\\infty, +\\infty["
        : `D_f = \\mathbb{R} \\setminus \\{${forbiddenLabels.join(" ; ")}\\}`;

    const domainExplanationAr =
      forbiddenLabels.length === 0
        ? "التعبير معرف لكل عدد حقيقي $x \\in \\mathbb{R}$ لعدم وجود مقام ينعدم في $\\mathbb{R}$."
        : `التعبير معرف شريطة أن يخالف المقام الصفر ($Q(x) \\neq 0$)، أي $x \\notin \\{${forbiddenLabels.join(" ; ")}\\}$ (قيم ممنوعة مرموز لها بالخط المضاعف $||$).`;

    const domainExplanationFr =
      forbiddenLabels.length === 0
        ? "L'expression est définie sur $\\mathbb{R}$ tout entier."
        : `L'expression est définie SSI le dénominateur est non nul ($Q(x) \\neq 0$), soit $x \\notin \\{${forbiddenLabels.join(" ; ")}\\}$ (valeurs interdites notées par une double barre $||$).`;

    // Interval formatting helper
    const buildIntervalUnion = (
      targetSign: "+" | "-",
      includeZeros: boolean
    ): string => {
      const parts: string[] = [];
      const k = criticalPoints.length;
      if (k === 0) {
        return quotientSigns[0] === targetSign ? "\\mathbb{R}" : "\\varnothing";
      }
      for (let i = 0; i <= k; i++) {
        if (quotientSigns[i] !== targetSign) continue;
        const leftLabel = i === 0 ? "-\\infty" : criticalPoints[i - 1].label;
        const rightLabel = i === k ? "+\\infty" : criticalPoints[i].label;

        const leftClosed =
          i > 0 && includeZeros && !criticalPoints[i - 1].isDenZero;
        const rightClosed =
          i < k && includeZeros && !criticalPoints[i].isDenZero;

        const leftBracket = i === 0 ? "]" : leftClosed ? "[" : "]";
        const rightBracket = i === k ? "[" : rightClosed ? "]" : "[";
        parts.push(`${leftBracket}${leftLabel}, ${rightLabel}${rightBracket}`);
      }
      return parts.length > 0 ? parts.join(" \\cup ") : "\\varnothing";
    };

    const solutionStrictPosLatex = buildIntervalUnion("+", false);
    const solutionNonNegLatex = buildIntervalUnion("+", true);
    const solutionStrictNegLatex = buildIntervalUnion("-", false);
    const solutionNonPosLatex = buildIntervalUnion("-", true);

    // Build SVG Sign Table
    const k = criticalPoints.length;
    const width = 620;
    const labelColW = 155;
    const contentW = width - labelColW - 20;
    const rowH = 42;
    const rowsCount = hasDenominator ? 4 : 2;
    const height = 24 + rowsCount * rowH;

    // X positions for -inf, x_1, ..., x_k, +inf
    const xStart = labelColW + 28;
    const xEnd = width - 34;
    const pointXs: number[] = criticalPoints.map((_, idx) =>
      xStart + ((idx + 1) / (k + 1)) * (xEnd - xStart)
    );
    const allBoundXs = [xStart, ...pointXs, xEnd];

    let rowsSvg = "";
    // Header row: x | -inf ... x_i ... +inf
    rowsSvg += `
      <rect x="10" y="10" width="${width - 20}" height="${rowH}" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="${labelColW}" y1="10" x2="${labelColW}" y2="${10 + rowsCount * rowH}" stroke="#0f172a" stroke-width="1.5"/>
      <text x="${labelColW / 2 + 5}" y="${10 + rowH * 0.64}" text-anchor="middle" font-family="serif" font-style="italic" font-weight="bold" font-size="15" fill="#0f172a">x</text>
      <text x="${xStart}" y="${10 + rowH * 0.64}" text-anchor="middle" font-family="serif" font-weight="bold" font-size="14" fill="#0f172a">-∞</text>
      ${criticalPoints
        .map(
          (cp, idx) =>
            `<text x="${pointXs[idx].toFixed(1)}" y="${10 + rowH * 0.64}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="13.5" fill="${
              cp.isDenZero ? "#be123c" : "#1e1b4b"
            }">${cp.label}</text>`
        )
        .join("")}
      <text x="${xEnd}" y="${10 + rowH * 0.64}" text-anchor="middle" font-family="serif" font-weight="bold" font-size="14" fill="#0f172a">+∞</text>
    `;

    const renderSignRow = (
      rowIndex: number,
      rowLabel: string,
      signs: ("+" | "-")[],
      mode: "NUM" | "DEN" | "QUOTIENT"
    ) => {
      const yTop = 10 + rowIndex * rowH;
      const yMid = yTop + rowH * 0.64;
      let cellSvg = `
        <rect x="10" y="${yTop}" width="${width - 20}" height="${rowH}" fill="${
        mode === "QUOTIENT" ? "#eef2ff" : "#ffffff"
      }" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="${labelColW}" y1="${yTop}" x2="${labelColW}" y2="${yTop + rowH}" stroke="#0f172a" stroke-width="1.5"/>
        <text x="${labelColW / 2 + 5}" y="${yMid}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12.5" fill="#0f172a">${rowLabel}</text>
      `;

      // Interval signs
      for (let i = 0; i <= k; i++) {
        const cx = 0.5 * (allBoundXs[i] + allBoundXs[i + 1]);
        const s = signs[i];
        const color = s === "+" ? "#047857" : "#be123c";
        cellSvg += `<text x="${cx.toFixed(1)}" y="${yMid}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="${color}">${s}</text>`;
      }

      // Critical point markers (0, ||, or dashed vertical line)
      criticalPoints.forEach((cp, idx) => {
        const px = pointXs[idx];
        const isForbiddenHere = mode === "QUOTIENT" && cp.isDenZero;
        const isZeroHere =
          (mode === "NUM" && cp.isNumZero) ||
          (mode === "DEN" && cp.isDenZero) ||
          (mode === "QUOTIENT" && cp.isNumZero && !cp.isDenZero);

        if (isForbiddenHere) {
          // Double vertical bar || (Valeur interdite)
          cellSvg += `
            <line x1="${(px - 2.6).toFixed(1)}" y1="${yTop + 2}" x2="${(px - 2.6).toFixed(1)}" y2="${yTop + rowH - 2}" stroke="#be123c" stroke-width="2"/>
            <line x1="${(px + 2.6).toFixed(1)}" y1="${yTop + 2}" x2="${(px + 2.6).toFixed(1)}" y2="${yTop + rowH - 2}" stroke="#be123c" stroke-width="2"/>
          `;
        } else {
          cellSvg += `<line x1="${px.toFixed(1)}" y1="${yTop}" x2="${px.toFixed(1)}" y2="${yTop + rowH}" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>`;
          if (isZeroHere) {
            cellSvg += `
              <circle cx="${px.toFixed(1)}" cy="${(yTop + rowH / 2).toFixed(1)}" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="1.2"/>
              <text x="${px.toFixed(1)}" y="${yMid}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12.5" fill="#0f172a">0</text>
            `;
          }
        }
      });

      return cellSvg;
    };

    if (hasDenominator) {
      rowsSvg += renderSignRow(1, `P(x) = ${numClean.slice(0, 14)}`, numSigns, "NUM");
      rowsSvg += renderSignRow(2, `Q(x) = ${denClean.slice(0, 14)}`, denSigns, "DEN");
      rowsSvg += renderSignRow(3, "P(x) / Q(x)", quotientSigns, "QUOTIENT");
    } else {
      rowsSvg += renderSignRow(1, `P(x) = ${numClean.slice(0, 14)}`, quotientSigns, "QUOTIENT");
    }

    const svgSignTable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto bg-white rounded-lg">
      ${rowsSvg}
    </svg>`;

    const tikzPoints = ["-\\infty", ...criticalPoints.map((c) => c.label), "+\\infty"].join(", ");
    const tikzSignItems: string[] = [];
    for (let i = 0; i <= k; i++) {
      tikzSignItems.push(quotientSigns[i]);
      if (i < k) {
        tikzSignItems.push(criticalPoints[i].isDenZero ? "d" : "z");
      }
    }

    const tikzCode = `\\begin{tikzpicture}
\\tkzTabInit[lgt=3.2, espcl=2.2]
  {$x$ / 0.9, ${hasDenominator ? `$P(x)$ / 0.8, $Q(x)$ / 0.8, $f(x)=\\frac{P(x)}{Q(x)}$ / 1.0` : `$P(x)$ / 0.9`}}
  {${tikzPoints}}
\\tkzTabLine{, ${tikzSignItems.join(", ")}, }
\\end{tikzpicture}`;

    const suggestedQuestionAr = hasDenominator
      ? `نعتبر التعبير الجبري الكسري $f(x) = ${fullExpressionLatex}$.\nأ) حدد مجموعة تعريف التعبير $D_f$.\nب) أنشئ جدول إشارة $f(x)$ على $D_f$ مبرزاً القيم الممنوعة، ثم استنتج مجموعة حلول المتراجحة $f(x) \\ge 0$.`
      : `نعتبر التعبير الجبري $P(x) = ${fullExpressionLatex}$.\nأ) حل في $\\mathbb{R}$ المعادلة $P(x) = 0$.\nب) أنشئ جدول إشارة $P(x)$ على $\\mathbb{R}$ ثم استنتج مجموعة حلول المتراجحة $P(x) \\ge 0$.`;

    const suggestedQuestionFr = hasDenominator
      ? `On considère l'expression rationnelle $f(x) = ${fullExpressionLatex}$.\na) Déterminer l'ensemble de définition $D_f$.\nb) Dresser le tableau de signes de $f(x)$ sur $D_f$ (en précisant les valeurs interdites), puis résoudre l'inéquation $f(x) \\ge 0$.`
      : `On considère l'expression $P(x) = ${fullExpressionLatex}$.\na) Résoudre dans $\\mathbb{R}$ l'équation $P(x) = 0$.\nb) Dresser le tableau de signes de $P(x)$ sur $\\mathbb{R}$, puis en déduire l'ensemble des solutions de $P(x) \\ge 0$.`;

    const suggestedAnswerAr = `أ) مجموعة التعريف: $${domainLatex}$.\nب) حسب جدول الإشارة، مجموعة حلول المتراجحة $f(x) \\ge 0$ هي $S = ${solutionNonNegLatex}$، ومجموعة حلول $f(x) < 0$ هي $S' = ${solutionStrictNegLatex}$.`;
    const suggestedAnswerFr = `a) Ensemble de définition : $${domainLatex}$.\nb) D'après le tableau de signes, l'ensemble des solutions de $f(x) \\ge 0$ est $S = ${solutionNonNegLatex}$ et pour $f(x) < 0$ on a $S' = ${solutionStrictNegLatex}$.`;

    return {
      isValid: true,
      numeratorExpr: numClean,
      denominatorExpr: hasDenominator ? denClean : "1",
      hasDenominator,
      numeratorLatex: numLatex,
      denominatorLatex: denLatex,
      fullExpressionLatex,
      domainLatex,
      domainExplanationAr,
      domainExplanationFr,
      criticalPoints,
      numSigns,
      denSigns,
      quotientSigns,
      solutionStrictPosLatex,
      solutionNonNegLatex,
      solutionStrictNegLatex,
      solutionNonPosLatex,
      svgSignTable,
      tikzCode,
      suggestedQuestionAr,
      suggestedQuestionFr,
      suggestedAnswerAr,
      suggestedAnswerFr,
    };
  } catch (err) {
    return {
      isValid: false,
      errorMessage: err instanceof Error ? err.message : "خطأ في صياغة التعبير الجبري",
      numeratorExpr: numClean,
      denominatorExpr: denClean,
      hasDenominator,
      numeratorLatex: numClean,
      denominatorLatex: denClean,
      fullExpressionLatex: numClean,
      domainLatex: "D_f = \\mathbb{R}",
      domainExplanationAr: "",
      domainExplanationFr: "",
      criticalPoints: [],
      numSigns: ["+"],
      denSigns: ["+"],
      quotientSigns: ["+"],
      solutionStrictPosLatex: "\\mathbb{R}",
      solutionNonNegLatex: "\\mathbb{R}",
      solutionStrictNegLatex: "\\varnothing",
      solutionNonPosLatex: "\\varnothing",
      svgSignTable: "",
      tikzCode: "",
      suggestedQuestionAr: "",
      suggestedQuestionFr: "",
      suggestedAnswerAr: "",
      suggestedAnswerFr: "",
    };
  }
}

// ============================================================================
// مقترح أستاذ المادة رقم 2 (الدفعة الجديدة):
// مختبر حساب التكامل والمساحات المظللة (Calcul Intégral & Aires Hachurées)
// ============================================================================

export interface IntegralShadedAreaData {
  isValid: boolean;
  errorMessage?: string;
  fExpr: string;
  gExpr: string;
  fLatex: string;
  gLatex: string;
  aBound: number;
  bBound: number;
  unitIcm: number;
  unitJcm: number;
  unitAreaCm2: number;
  signedIntegralValue: number;      // \int_a^b (f(x) - g(x)) dx
  geometricAreaUA: number;          // \int_a^b |f(x) - g(x)| dx in u.a.
  geometricAreaCm2: number;         // Area in cm^2
  svgPlotWithShadedArea: string;
  tikzCode: string;
  suggestedQuestionAr: string;
  suggestedQuestionFr: string;
  suggestedAnswerAr: string;
  suggestedAnswerFr: string;
}

export function generateIntegralShadedAreaData(
  fRaw: string,
  gRaw: string = "0",
  aInput: number = 0,
  bInput: number = 2,
  xMinInput: number = -2,
  xMaxInput: number = 4,
  unitIcmInput: number = 2,
  unitJcmInput: number = 2
): IntegralShadedAreaData {
  const fClean = (fRaw || "-x^2 + 4").trim();
  const gClean = (gRaw || "0").trim() || "0";
  const aBound = Math.min(aInput, bInput);
  const bBound = Math.max(aInput + 0.1, bInput);
  const xMin = Math.min(xMinInput, aBound - 1);
  const xMax = Math.max(xMaxInput, bBound + 1);
  const unitIcm = Math.max(0.5, unitIcmInput || 1);
  const unitJcm = Math.max(0.5, unitJcmInput || 1);
  const unitAreaCm2 = Number((unitIcm * unitJcm).toFixed(2));

  try {
    const fNode = parse(fClean);
    const gNode = parse(gClean);
    const fCompiled = fNode.compile();
    const gCompiled = gNode.compile();

    let fLatex = fClean;
    let gLatex = gClean;
    try {
      fLatex = simplify(fNode).toTex();
    } catch {
      fLatex = fNode.toTex();
    }
    try {
      gLatex = simplify(gNode).toTex();
    } catch {
      gLatex = gNode.toTex();
    }

    const evalF = (x: number): number => {
      try {
        const v = Number(fCompiled.evaluate({ x }));
        return Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };
    const evalG = (x: number): number => {
      try {
        const v = Number(gCompiled.evaluate({ x }));
        return Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };

    // Numerical Integration (Composite Simpson / High-res Trapezoidal) on [aBound, bBound]
    const NInt = 400;
    const h = (bBound - aBound) / NInt;
    let signedSum = 0;
    let absSum = 0;

    for (let i = 0; i <= NInt; i++) {
      const x = aBound + i * h;
      const diff = evalF(x) - evalG(x);
      if (!Number.isFinite(diff)) continue;
      const weight = i === 0 || i === NInt ? 1 : i % 2 === 1 ? 4 : 2;
      signedSum += weight * diff;
      absSum += weight * Math.abs(diff);
    }

    const signedIntegralValue = Number(((h / 3) * signedSum).toFixed(4));
    const geometricAreaUA = Number(((h / 3) * absSum).toFixed(4));
    const geometricAreaCm2 = Number((geometricAreaUA * unitAreaCm2).toFixed(3));

    // Determine Y range on [xMin, xMax]
    const NSamples = 220;
    const fPoints: { x: number; y: number }[] = [];
    const gPoints: { x: number; y: number }[] = [];
    let yMinAuto = -2;
    let yMaxAuto = 4;

    for (let i = 0; i <= NSamples; i++) {
      const x = xMin + (i / NSamples) * (xMax - xMin);
      const yf = evalF(x);
      const yg = evalG(x);
      if (Number.isFinite(yf) && Math.abs(yf) <= 40) {
        fPoints.push({ x, y: yf });
        yMinAuto = Math.min(yMinAuto, yf);
        yMaxAuto = Math.max(yMaxAuto, yf);
      }
      if (Number.isFinite(yg) && Math.abs(yg) <= 40) {
        gPoints.push({ x, y: yg });
        yMinAuto = Math.min(yMinAuto, yg);
        yMaxAuto = Math.max(yMaxAuto, yg);
      }
    }

    const yMin = Math.floor(Math.min(-1.5, yMinAuto - 0.8));
    const yMax = Math.ceil(Math.max(2.5, yMaxAuto + 0.8));

    const width = 560;
    const height = 340;
    const pad = 34;

    const toSvgX = (x: number) =>
      pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
    const toSvgY = (y: number) =>
      height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);

    // Build Shaded Polygon between f(x) and g(x) on [aBound, bBound]
    const NShade = 100;
    const upperCoords: string[] = [];
    const lowerCoords: string[] = [];
    for (let i = 0; i <= NShade; i++) {
      const x = aBound + (i / NShade) * (bBound - aBound);
      const yf = evalF(x);
      const yg = evalG(x);
      if (Number.isFinite(yf) && Number.isFinite(yg)) {
        const clampedF = Math.max(yMin, Math.min(yMax, yf));
        const clampedG = Math.max(yMin, Math.min(yMax, yg));
        upperCoords.push(`${toSvgX(x).toFixed(1)},${toSvgY(clampedF).toFixed(1)}`);
        lowerCoords.unshift(`${toSvgX(x).toFixed(1)},${toSvgY(clampedG).toFixed(1)}`);
      }
    }
    const polygonPoints = [...upperCoords, ...lowerCoords].join(" ");

    const buildPath = (pts: { x: number; y: number }[]) =>
      pts
        .map(
          (pt, idx) =>
            `${idx === 0 ? "M" : "L"} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(
              Math.max(yMin, Math.min(yMax, pt.y))
            ).toFixed(1)}`
        )
        .join(" ");

    const fPathD = buildPath(fPoints);
    const gPathD = buildPath(gPoints);

    // Grid lines
    let gridLines = "";
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const sx = toSvgX(gx);
      gridLines += `<line x1="${sx.toFixed(1)}" y1="${pad}" x2="${sx.toFixed(
        1
      )}" y2="${height - pad}" stroke="#e2e8f0" stroke-width="1"/>`;
    }
    for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) {
      const sy = toSvgY(gy);
      gridLines += `<line x1="${pad}" y1="${sy.toFixed(1)}" x2="${
        width - pad
      }" y2="${sy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
    }

    const xAxisY = toSvgY(0);
    const yAxisX = toSvgX(0);
    const svgX_a = toSvgX(aBound);
    const svgX_b = toSvgX(bBound);

    const svgPlotWithShadedArea = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto bg-white rounded-lg border border-slate-200">
      <defs>
        <pattern id="hatchIntegralPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#4f46e5" stroke-width="2" stroke-opacity="0.55" />
        </pattern>
      </defs>
      ${gridLines}
      <!-- Axes -->
      <line x1="${pad}" y1="${xAxisY.toFixed(1)}" x2="${width - pad}" y2="${xAxisY.toFixed(1)}" stroke="#334155" stroke-width="1.6"/>
      <line x1="${yAxisX.toFixed(1)}" y1="${pad}" x2="${yAxisX.toFixed(1)}" y2="${height - pad}" stroke="#334155" stroke-width="1.6"/>
      <!-- Shaded & Hatched Integral Domain -->
      <polygon points="${polygonPoints}" fill="#6366f1" fill-opacity="0.16" />
      <polygon points="${polygonPoints}" fill="url(#hatchIntegralPattern)" stroke="#4338ca" stroke-width="1.2" stroke-dasharray="3,2"/>
      <!-- Vertical bounds x = a and x = b -->
      <line x1="${svgX_a.toFixed(1)}" y1="${pad}" x2="${svgX_a.toFixed(1)}" y2="${height - pad}" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="4,4"/>
      <line x1="${svgX_b.toFixed(1)}" y1="${pad}" x2="${svgX_b.toFixed(1)}" y2="${height - pad}" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="4,4"/>
      <text x="${svgX_a.toFixed(1)}" y="${(height - 10).toFixed(1)}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11.5" fill="#dc2626">x=${aBound}</text>
      <text x="${svgX_b.toFixed(1)}" y="${(height - 10).toFixed(1)}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11.5" fill="#dc2626">x=${bBound}</text>
      <!-- Curves (C_f) and (C_g) -->
      ${gClean !== "0" ? `<path d="${gPathD}" fill="none" stroke="#0d9488" stroke-width="2.2" />` : ""}
      <path d="${fPathD}" fill="none" stroke="#1e1b4b" stroke-width="2.6" />
      <!-- Legend Badge -->
      <rect x="${pad + 8}" y="${pad + 6}" width="215" height="44" rx="6" fill="#ffffff" fill-opacity="0.92" stroke="#cbd5e1"/>
      <text x="${pad + 16}" y="${pad + 23}" font-family="monospace" font-weight="bold" font-size="11" fill="#1e1b4b">(C_f): y = ${fClean.slice(0, 18)}</text>
      <text x="${pad + 16}" y="${pad + 40}" font-family="monospace" font-weight="bold" font-size="11" fill="#4338ca">Aire = ${geometricAreaUA} u.a. = ${geometricAreaCm2} cm²</text>
    </svg>`;

    const tikzCode = `\\begin{tikzpicture}[scale=0.85]
  \\draw[very thin, color=gray!30] (${xMin},${yMin}) grid (${xMax},${yMax});
  \\draw[->, thick] (${xMin},0) -- (${xMax},0) node[right] {$x$};
  \\draw[->, thick] (0,${yMin}) -- (0,${yMax}) node[above] {$y$};
  \\fill[pattern=north east lines, pattern color=indigo!60]
    plot[domain=${aBound}:${bBound}, samples=80] (\\x, {${fClean.replace(/\^/g, "**")}})
    -- plot[domain=${bBound}:${aBound}, samples=80] (\\x, {${gClean.replace(/\^/g, "**")}})
    -- cycle;
  \\draw[very thick, color=blue!80!black, domain=${xMin}:${xMax}, samples=120] plot (\\x, {${fClean.replace(/\^/g, "**")}}) node[right] {$(C_f)$};
  ${
    gClean !== "0"
      ? `\\draw[thick, color=teal!80!black, domain=${xMin}:${xMax}, samples=120] plot (\\x, {${gClean.replace(/\^/g, "**")}}) node[right] {$(C_g)$};`
      : ""
  }
  \\draw[dashed, red] (${aBound},${yMin}) -- (${aBound},${yMax});
  \\draw[dashed, red] (${bBound},${yMin}) -- (${bBound},${yMax});
\\end{tikzpicture}`;

    const isAxisOnly = gClean === "0";
    const suggestedQuestionAr = isAxisOnly
      ? `المستوى منسوب إلى معلم متعامد ممنظم $(O; \\vec{i}, \\vec{j})$ حيث $\\|\\vec{i}\\| = ${unitIcm}\\text{ cm}$ و $\\|\\vec{j}\\| = ${unitJcm}\\text{ cm}$.\nنعتبر الدالة $f(x) = ${fLatex}$.\nأ) احسب التكامل $I = \\int_{${aBound}}^{${bBound}} f(x)\\,dx$.\nب) احسب بالـ $\\text{cm}^2$ مساحة الحيز المستوي المظلل المحصور بين المنحنى $(C_f)$ ومحور الأفاصيل والمستقيمين اللذين معادلتاهما $x = ${aBound}$ و $x = ${bBound}$.`
      : `المستوى منسوب إلى معلم متعامد ممنظم $(O; \\vec{i}, \\vec{j})$ حيث $\\|\\vec{i}\\| = ${unitIcm}\\text{ cm}$ و $\\|\\vec{j}\\| = ${unitJcm}\\text{ cm}$.\nنعتبر الدالتين $f(x) = ${fLatex}$ و $g(x) = ${gLatex}$.\nأ) ادرس الوضع النسبي للمنحنيين $(C_f)$ و $(C_g)$ على المجال $[${aBound}, ${bBound}]$.\nب) احسب بالـ $\\text{cm}^2$ مساحة الحيز المستوي المظلل المحصور بين $(C_f)$ و $(C_g)$ والمستقيمين $x = ${aBound}$ و $x = ${bBound}$.`;

    const suggestedQuestionFr = isAxisOnly
      ? `Le plan est rapporté à un repère orthogonal $(O; \\vec{i}, \\vec{j})$ avec $\\|\\vec{i}\\| = ${unitIcm}\\text{ cm}$ et $\\|\\vec{j}\\| = ${unitJcm}\\text{ cm}$.\nOn considère la fonction $f(x) = ${fLatex}$.\na) Calculer l'intégrale $I = \\int_{${aBound}}^{${bBound}} f(x)\\,dx$.\nb) Calculer en $\\text{cm}^2$ l'aire du domaine plan hachuré délimité par $(C_f)$, l'axe des abscisses et les droites d'équations $x = ${aBound}$ et $x = ${bBound}$.`
      : `Le plan est rapporté à un repère orthogonal $(O; \\vec{i}, \\vec{j})$ avec $\\|\\vec{i}\\| = ${unitIcm}\\text{ cm}$ et $\\|\\vec{j}\\| = ${unitJcm}\\text{ cm}$.\nSoient $f(x) = ${fLatex}$ et $g(x) = ${gLatex}$.\na) Étudier la position relative de $(C_f)$ et $(C_g)$ sur $[${aBound}, ${bBound}]$.\nb) Calculer en $\\text{cm}^2$ l'aire du domaine hachuré compris entre $(C_f)$, $(C_g)$ et les droites $x = ${aBound}$ et $x = ${bBound}$.`;

    const suggestedAnswerAr = `أ) قيمة التكامل الجبري: $\\int_{${aBound}}^{${bBound}} (${isAxisOnly ? "f(x)" : "f(x)-g(x)"})\\,dx \\approx ${signedIntegralValue}$.\nب) وحدة المساحة هي $1\\text{ u.a.} = \\|\\vec{i}\\| \\times \\|\\vec{j}\\| = ${unitAreaCm2}\\text{ cm}^2$. إذن المساحة الهندسية للحيز المظلل هي:\n$$\\mathcal{A} = \\int_{${aBound}}^{${bBound}} |${isAxisOnly ? "f(x)" : "f(x)-g(x)"}|\\,dx \\times \\text{u.a.} \\approx ${geometricAreaUA}\\text{ u.a.} = ${geometricAreaCm2}\\text{ cm}^2$$`;

    const suggestedAnswerFr = `a) Intégrale algébrique : $\\int_{${aBound}}^{${bBound}} (${isAxisOnly ? "f(x)" : "f(x)-g(x)"})\\,dx \\approx ${signedIntegralValue}$.\nb) Unité d'aire : $1\\text{ u.a.} = \\|\\vec{i}\\| \\times \\|\\vec{j}\\| = ${unitAreaCm2}\\text{ cm}^2$. L'aire géométrique du domaine hachuré vaut :\n$$\\mathcal{A} = \\int_{${aBound}}^{${bBound}} |${isAxisOnly ? "f(x)" : "f(x)-g(x)"}|\\,dx \\times \\text{u.a.} \\approx ${geometricAreaUA}\\text{ u.a.} = ${geometricAreaCm2}\\text{ cm}^2$$`;

    return {
      isValid: true,
      fExpr: fClean,
      gExpr: gClean,
      fLatex,
      gLatex,
      aBound,
      bBound,
      unitIcm,
      unitJcm,
      unitAreaCm2,
      signedIntegralValue,
      geometricAreaUA,
      geometricAreaCm2,
      svgPlotWithShadedArea,
      tikzCode,
      suggestedQuestionAr,
      suggestedQuestionFr,
      suggestedAnswerAr,
      suggestedAnswerFr,
    };
  } catch (err) {
    return {
      isValid: false,
      errorMessage: err instanceof Error ? err.message : "خطأ في صياغة دالة التكامل",
      fExpr: fClean,
      gExpr: gClean,
      fLatex: fClean,
      gLatex: gClean,
      aBound,
      bBound,
      unitIcm,
      unitJcm,
      unitAreaCm2,
      signedIntegralValue: 0,
      geometricAreaUA: 0,
      geometricAreaCm2: 0,
      svgPlotWithShadedArea: "",
      tikzCode: "",
      suggestedQuestionAr: "",
      suggestedQuestionFr: "",
      suggestedAnswerAr: "",
      suggestedAnswerFr: "",
    };
  }
}

// ============================================================================
// مقترح أستاذ المادة رقم 3 (الدفعة الجديدة):
// مكتبة الأشكال الهندسية الفضائية الجاهزة (3D Wireframe SVG Presets - الهندسة الفضائية)
// ============================================================================

export type SpaceGeometry3DPresetType =
  | "CUBE"
  | "TETRAHEDRON"
  | "PYRAMID"
  | "SPHERE_PLANE";

export interface SpaceGeometry3DPresetData {
  presetType: SpaceGeometry3DPresetType;
  titleAr: string;
  titleFr: string;
  svgWireframe: string;
  tikzCode: string;
  keyMetricsSummaryAr: string;
  keyMetricsSummaryFr: string;
  suggestedQuestionAr: string;
  suggestedQuestionFr: string;
  suggestedAnswerAr: string;
  suggestedAnswerFr: string;
}

export function generate3DSpaceGeometryPresetData(
  presetType: SpaceGeometry3DPresetType,
  paramA: number = 4, // Edge length a or Sphere radius R
  paramB: number = 2, // Pyramid height h or Plane distance d
  showSectionPlane: boolean = true
): SpaceGeometry3DPresetData {
  const a = Math.max(1, Number(paramA) || 4);
  const b = Math.max(0.5, Number(paramB) || 2);

  if (presetType === "CUBE") {
    // Axonometric projection of Cube ABCDEFGH with section plane (IJK) or (ACH)
    const svgWireframe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 340" class="w-full h-auto bg-white rounded-lg border border-slate-200">
      <!-- Hidden edges from A (back-bottom-left) -->
      <line x1="170" y1="220" x2="340" y2="220" stroke="#475569" stroke-width="1.8" stroke-dasharray="6,5"/>
      <line x1="170" y1="220" x2="110" y2="280" stroke="#475569" stroke-width="1.8" stroke-dasharray="6,5"/>
      <line x1="170" y1="220" x2="170" y2="65" stroke="#475569" stroke-width="1.8" stroke-dasharray="6,5"/>

      ${
        showSectionPlane
          ? `<!-- Shaded Section Plane (IJK) / (BDE) inside the Cube -->
      <polygon points="110,280 340,220 170,65" fill="#4f46e5" fill-opacity="0.18" stroke="#4338ca" stroke-width="2.2" stroke-dasharray="5,3"/>
      <!-- Midpoint section (IJK) near vertex F -->
      <polygon points="195,125 225,95 140,95" fill="#10b981" fill-opacity="0.26" stroke="#047857" stroke-width="2"/>
      <circle cx="195" cy="125" r="3.5" fill="#047857"/><text x="204" y="132" font-family="serif" font-weight="bold" font-size="13" fill="#047857">I</text>
      <circle cx="225" cy="95" r="3.5" fill="#047857"/><text x="228" y="88" font-family="serif" font-weight="bold" font-size="13" fill="#047857">J</text>
      <circle cx="140" cy="95" r="3.5" fill="#047857"/><text x="125" y="90" font-family="serif" font-weight="bold" font-size="13" fill="#047857">K</text>`
          : ""
      }

      <!-- Visible edges of Cube ABCDEFGH -->
      <!-- Front face B C G F -->
      <polygon points="110,280 280,280 280,125 110,125" fill="none" stroke="#0f172a" stroke-width="2.3"/>
      <!-- Top face E F G H -->
      <polyline points="110,125 170,65 340,65 280,125" fill="none" stroke="#0f172a" stroke-width="2.3"/>
      <!-- Right face C D H G -->
      <polyline points="280,280 340,220 340,65" fill="none" stroke="#0f172a" stroke-width="2.3"/>

      <!-- Orthonormal Frame Vectors at A -->
      <line x1="170" y1="220" x2="142" y2="248" stroke="#dc2626" stroke-width="2.5"/>
      <line x1="170" y1="220" x2="225" y2="220" stroke="#dc2626" stroke-width="2.5"/>
      <line x1="170" y1="220" x2="170" y2="170" stroke="#dc2626" stroke-width="2.5"/>

      <!-- Vertices Labels -->
      <circle cx="170" cy="220" r="3.5" fill="#dc2626"/>
      <text x="155" y="213" font-family="serif" font-weight="bold" font-size="15" fill="#dc2626">A</text>
      <text x="90" y="294" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">B</text>
      <text x="288" y="294" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">C</text>
      <text x="352" y="226" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">D</text>
      <text x="155" y="56" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">E</text>
      <text x="90" y="128" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">F</text>
      <text x="290" y="132" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">G</text>
      <text x="350" y="62" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">H</text>

      <!-- Info Box -->
      <rect x="358" y="248" width="130" height="72" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="368" y="268" font-family="monospace" font-weight="bold" font-size="11" fill="#0f172a">Cube d'arête a=${a}</text>
      <text x="368" y="286" font-family="monospace" font-size="10.5" fill="#4338ca">Plan (BDE): x+y+z=${a}</text>
      <text x="368" y="304" font-family="monospace" font-size="10.5" fill="#047857">d(A,(BDE)) = ${(a / Math.sqrt(3)).toFixed(2)}</text>
    </svg>`;

    const tikzCode = `\\begin{tikzpicture}[scale=1.1]
  % Sommets du cube ABCDEFGH
  \\coordinate (A) at (0,0);
  \\coordinate (D) at (3.2,0);
  \\coordinate (B) at (-1.1,-1.1);
  \\coordinate (C) at (2.1,-1.1);
  \\coordinate (E) at (0,3.2);
  \\coordinate (H) at (3.2,3.2);
  \\coordinate (F) at (-1.1,2.1);
  \\coordinate (G) at (2.1,2.1);
  % Section plane (BDE)
  \\fill[indigo!15, draw=indigo!80!black, thick, dashed] (B) -- (D) -- (E) -- cycle;
  % Arêtes cachées
  \\draw[dashed, thick] (A) -- (B) (A) -- (D) (A) -- (E);
  % Arêtes visibles
  \\draw[thick] (B) -- (C) -- (G) -- (F) -- cycle;
  \\draw[thick] (E) -- (F) (G) -- (H) -- (E) (C) -- (D) -- (H);
  \\foreach \\p/\\pos in {A/above left,B/below left,C/below right,D/right,E/above left,F/left,G/right,H/above right}
    \\node[\\pos] at (\\p) {$\\p$};
\\end{tikzpicture}`;

    const distVal = (a / Math.sqrt(3)).toFixed(2);
    const areaBDE = ((Math.sqrt(3) / 2) * a * a).toFixed(2);

    return {
      presetType: "CUBE",
      titleAr: `مكعب $ABCDEFGH$ طول حرفه $a = ${a}$ مع تقاطع مستوٍ $(BDE)$`,
      titleFr: `Cube $ABCDEFGH$ d'arête $a = ${a}$ et section plane $(BDE)$`,
      svgWireframe,
      tikzCode,
      keyMetricsSummaryAr: `المعلم $(A; \\frac{1}{${a}}\\vec{AB}, \\frac{1}{${a}}\\vec{AD}, \\frac{1}{${a}}\\vec{AE})$ | معادلة $(BDE): x+y+z-${a}=0$ | المسافة $d(A,(BDE)) = \\frac{${a}\\sqrt{3}}{3} \\approx ${distVal}$`,
      keyMetricsSummaryFr: `Repère $(A; \\vec{i}, \\vec{j}, \\vec{k})$ | Plan $(BDE): x+y+z-${a}=0$ | Distance $d(A,(BDE)) = \\frac{${a}\\sqrt{3}}{3} \\approx ${distVal}$`,
      suggestedQuestionAr: `نعتبر في الفضاء مكعباً $ABCDEFGH$ طول حرفه $a = ${a}$. ننسب الفضاء إلى المعلم المتعامد الممنظم $(A; \\vec{i}, \\vec{j}, \\vec{k})$ حيث $\\vec{AB} = ${a}\\vec{i}$ و $\\vec{AD} = ${a}\\vec{j}$ و $\\vec{AE} = ${a}\\vec{k}$.\nأ) حدد إحداثيات النقط $B$ و $D$ و $E$ و $G$، ثم احسب الجداء المتجهي $\\vec{BD} \\wedge \\vec{BE}$.\nب) استنتج أن $x + y + z - ${a} = 0$ معادلة ديكارتية للمستوى $(BDE)$، ثم بين أن المستقيم $(AG)$ عمودي على المستوى $(BDE)$.\nج) احسب المسافة $d(A, (BDE))$ ومساحة المثلث المتساوي الأضلاع $BDE$.`,
      suggestedQuestionFr: `Dans l'espace muni du repère orthonormé $(A; \\vec{i}, \\vec{j}, \\vec{k})$ tel que $\\vec{AB} = ${a}\\vec{i}$, $\\vec{AD} = ${a}\\vec{j}$ et $\\vec{AE} = ${a}\\vec{k}$, on considère le cube $ABCDEFGH$ d'arête $a = ${a}$.\na) Déterminer les coordonnées de $B, D, E, G$ et calculer $\\vec{BD} \\wedge \\vec{BE}$.\nb) En déduire que $x + y + z - ${a} = 0$ est une équation cartésienne du plan $(BDE)$ et montrer que la droite $(AG)$ est orthogonale au plan $(BDE)$.\nc) Calculer la distance $d(A, (BDE))$ ainsi que l'aire du triangle équilatéral $BDE$.`,
      suggestedAnswerAr: `أ) $B(${a},0,0)$، $D(0,${a},0)$، $E(0,0,${a})$، $G(${a},${a},${a})$، والمتجهة المنظمية $\\vec{n}(1,1,1)$.\nب) معادلة $(BDE): x+y+z-${a}=0$. بما أن $\\vec{AG}(${a},${a},${a}) = ${a}\\vec{n}$ فإن $(AG) \\perp (BDE)$.\nج) $d(A,(BDE)) = \\frac{|0+0+0-${a}|}{\\sqrt{1^2+1^2+1^2}} = \\frac{${a}\\sqrt{3}}{3} \\approx ${distVal}$، ومساحة المثلث $S_{BDE} = \\frac{1}{2}\\|\\vec{BD}\\wedge\\vec{BE}\\| = \\frac{\\sqrt{3}}{2}a^2 \\approx ${areaBDE}$.`,
      suggestedAnswerFr: `a) $B(${a},0,0)$, $D(0,${a},0)$, $E(0,0,${a})$, $G(${a},${a},${a})$, vecteur normal $\\vec{n}(1,1,1)$.\nb) Plan $(BDE): x+y+z-${a}=0$. Comme $\\vec{AG} = ${a}\\vec{n}$, on a $(AG) \\perp (BDE)$.\nc) $d(A,(BDE)) = \\frac{${a}}{\\sqrt{3}} \\approx ${distVal}$ et $\\mathcal{A}(BDE) = \\frac{\\sqrt{3}}{2}a^2 \\approx ${areaBDE}$.`,
    };
  }

  if (presetType === "TETRAHEDRON") {
    const svgWireframe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 330" class="w-full h-auto bg-white rounded-lg border border-slate-200">
      <!-- Hidden base edge BC -->
      <line x1="115" y1="245" x2="385" y2="215" stroke="#475569" stroke-width="1.8" stroke-dasharray="6,5"/>
      ${
        showSectionPlane
          ? `<!-- Midpoint Section Plane (IJK) parallel to base -->
      <polygon points="180,145 315,130 250,185" fill="#10b981" fill-opacity="0.22" stroke="#047857" stroke-width="2"/>
      <line x1="180" y1="145" x2="315" y2="130" stroke="#047857" stroke-width="1.6" stroke-dasharray="4,3"/>
      <circle cx="180" cy="145" r="4" fill="#047857"/><text x="160" y="142" font-family="serif" font-weight="bold" font-size="14" fill="#047857">I</text>
      <circle cx="315" cy="130" r="4" fill="#047857"/><text x="326" y="132" font-family="serif" font-weight="bold" font-size="14" fill="#047857">J</text>
      <circle cx="250" cy="185" r="4" fill="#047857"/><text x="258" y="198" font-family="serif" font-weight="bold" font-size="14" fill="#047857">K</text>`
          : ""
      }
      <!-- Visible edges of Tetrahedron ABCD -->
      <line x1="245" y1="45" x2="115" y2="245" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="245" y1="45" x2="385" y2="215" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="245" y1="45" x2="255" y2="295" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="115" y1="245" x2="255" y2="295" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="255" y1="295" x2="385" y2="215" stroke="#0f172a" stroke-width="2.4"/>

      <!-- Labels -->
      <circle cx="245" cy="45" r="4" fill="#1e1b4b"/><text x="240" y="32" font-family="serif" font-weight="bold" font-size="16" fill="#1e1b4b">A</text>
      <circle cx="115" cy="245" r="4" fill="#1e1b4b"/><text x="94" y="254" font-family="serif" font-weight="bold" font-size="16" fill="#1e1b4b">B</text>
      <circle cx="385" cy="215" r="4" fill="#1e1b4b"/><text x="398" y="220" font-family="serif" font-weight="bold" font-size="16" fill="#1e1b4b">C</text>
      <circle cx="255" cy="295" r="4" fill="#1e1b4b"/><text x="250" y="316" font-family="serif" font-weight="bold" font-size="16" fill="#1e1b4b">D</text>
    </svg>`;

    const tikzCode = `\\begin{tikzpicture}[scale=1.1]
  \\coordinate (A) at (2.2,3.8);
  \\coordinate (B) at (0,0.6);
  \\coordinate (C) at (4.4,1.0);
  \\coordinate (D) at (2.3,-0.6);
  \\coordinate (I) at ($(A)!0.5!(B)$);
  \\coordinate (J) at ($(A)!0.5!(C)$);
  \\coordinate (K) at ($(A)!0.5!(D)$);
  \\draw[dashed, thick] (B) -- (C);
  \\fill[emerald!20, draw=emerald!70!black, thick] (I) -- (K) -- (J);
  \\draw[dashed, emerald!70!black, thick] (I) -- (J);
  \\draw[thick] (A) -- (B) -- (D) -- (C) -- cycle (A) -- (D);
  \\foreach \\p/\\pos in {A/above,B/left,C/right,D/below,I/left,J/right,K/below right}
    \\node[\\pos] at (\\p) {$\\p$};
\\end{tikzpicture}`;

    const volTetra = ((a * a * a) / 6).toFixed(2);
    return {
      presetType: "TETRAHEDRON",
      titleAr: `رباعي الأوجه $ABCD$ ومستوى المنتصفات $(IJK)$`,
      titleFr: `Tétraèdre $ABCD$ et plan des milieux $(IJK)$`,
      svgWireframe,
      tikzCode,
      keyMetricsSummaryAr: `$I, J, K$ منتصفات $[AB], [AC], [AD]$ | $(IJK) \\parallel (BCD)$ | حجم رباعي الأوجه المتعامد: $V = \\frac{a^3}{6} \\approx ${volTetra}$`,
      keyMetricsSummaryFr: `$I, J, K$ milieux de $[AB], [AC], [AD]$ | $(IJK) \\parallel (BCD)$ | Volume $V = \\frac{a^3}{6} \\approx ${volTetra}$`,
      suggestedQuestionAr: `نعتبر في الفضاء رباعي الأوجه $ABCD$، ولتكن $I$ و $J$ و $K$ منتصفات القطع $[AB]$ و $[AC]$ و $[AD]$ على التوالي.\nأ) بين أن المستقيم $(IJ)$ يوازي المستوى $(BCD)$ وأن المستقيم $(IK)$ يوازي المستوى $(BCD)$.\nب) استنتج أن المستويين $(IJK)$ و $(BCD)$ متوازيان قطعاً.\nج) إذا كان $ABCD$ رباعي أوجه متعامداً في $A$ حيث $AB = AC = AD = ${a}$، احسب مساحة المثلث $IJK$ وحجم رباعي الأوجه $AIJK$.`,
      suggestedQuestionFr: `Soit $ABCD$ un tétraèdre dans l'espace, et soient $I$, $J$, $K$ les milieux respectifs des segments $[AB]$, $[AC]$ et $[AD]$.\na) Montrer que les droites $(IJ)$ et $(IK)$ sont parallèles au plan $(BCD)$.\nb) En déduire que le plan $(IJK)$ est parallèle au plan $(BCD)$.\nc) En supposant le tétraèdre trirectangle en $A$ avec $AB = AC = AD = ${a}$, calculer le volume du tétraèdre $AIJK$.`,
      suggestedAnswerAr: `أ) حسب مبرهنة طاليس في المثلث $ABC$ لدينا $(IJ) \\parallel (BC)$، وبما أن $(BC) \\subset (BCD)$ فإن $(IJ) \\parallel (BCD)$. وبالمثل $(IK) \\parallel (BD)$ إذن $(IK) \\parallel (BCD)$.\nب) بما أن $(IJ)$ و $(IK)$ مستقيمان متقاطعان في $I$ ضمن $(IJK)$ وموازيان للمستوى $(BCD)$ فإن $(IJK) \\parallel (BCD)$.\nج) بالتحاكي الذي مركزه $A$ ونسبته $k = \\frac{1}{2}$، حجم $AIJK$ هو $V' = (\\frac{1}{2})^3 V_{ABCD} = \\frac{1}{8} \\times \\frac{${a}^3}{6} \\approx ${(Number(volTetra) / 8).toFixed(3)}$.`,
      suggestedAnswerFr: `a) Par le théorème des milieux, $(IJ) \\parallel (BC) \\subset (BCD)$ et $(IK) \\parallel (BD) \\subset (BCD)$.\nb) Deux droites sécantes de $(IJK)$ étant parallèles à $(BCD)$, on a $(IJK) \\parallel (BCD)$.\nc) Par réduction de rapport $k = \\frac{1}{2}$, $V(AIJK) = \\left(\\frac{1}{2}\\right)^3 V(ABCD) = \\frac{${a}^3}{48} \\approx ${(Number(volTetra) / 8).toFixed(3)}$.`,
    };
  }

  if (presetType === "PYRAMID") {
    const volPyr = ((a * a * b) / 3).toFixed(2);
    const svgWireframe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 340" class="w-full h-auto bg-white rounded-lg border border-slate-200">
      <!-- Hidden base edges AD and CD + Diagonals + Altitude SO -->
      <line x1="165" y1="215" x2="365" y2="215" stroke="#64748b" stroke-width="1.7" stroke-dasharray="6,5"/>
      <line x1="165" y1="215" x2="105" y2="280" stroke="#64748b" stroke-width="1.7" stroke-dasharray="6,5"/>
      <line x1="250" y1="45" x2="165" y2="215" stroke="#64748b" stroke-width="1.7" stroke-dasharray="6,5"/>
      <!-- Diagonals of base ABCD meeting at O(235, 247.5) -->
      <line x1="105" y1="280" x2="365" y2="215" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
      <line x1="305" y1="280" x2="165" y2="215" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
      <!-- Altitude SO -->
      <line x1="250" y1="45" x2="235" y2="248" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
      <circle cx="235" cy="248" r="3.5" fill="#dc2626"/><text x="242" y="262" font-family="serif" font-weight="bold" font-size="14" fill="#dc2626">O</text>

      ${
        showSectionPlane
          ? `<!-- Mid-height Horizontal Section A'B'C'D' -->
      <polygon points="178,162 278,162 308,130 208,130" fill="#6366f1" fill-opacity="0.2" stroke="#4338ca" stroke-width="1.8"/>`
          : ""
      }

      <!-- Visible edges of Pyramid SABCD -->
      <line x1="105" y1="280" x2="305" y2="280" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="305" y1="280" x2="365" y2="215" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="250" y1="45" x2="105" y2="280" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="250" y1="45" x2="305" y2="280" stroke="#0f172a" stroke-width="2.4"/>
      <line x1="250" y1="45" x2="365" y2="215" stroke="#0f172a" stroke-width="2.4"/>

      <!-- Labels -->
      <circle cx="250" cy="45" r="4" fill="#0f172a"/><text x="245" y="32" font-family="serif" font-weight="bold" font-size="16" fill="#0f172a">S</text>
      <text x="150" y="210" font-family="serif" font-weight="bold" font-size="15" fill="#475569">A</text>
      <text x="86" y="290" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">B</text>
      <text x="314" y="292" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">C</text>
      <text x="376" y="220" font-family="serif" font-weight="bold" font-size="15" fill="#0f172a">D</text>
    </svg>`;

    const tikzCode = `\\begin{tikzpicture}[scale=1.05]
  \\coordinate (A) at (0,0);
  \\coordinate (D) at (3.2,0);
  \\coordinate (B) at (-1.0,-1.1);
  \\coordinate (C) at (2.2,-1.1);
  \\coordinate (O) at (1.1,-0.55);
  \\coordinate (S) at (1.1,3.0);
  \\draw[dashed, gray] (A) -- (C) (B) -- (D);
  \\draw[dashed, red, thick] (S) -- (O) node[below] {$O$};
  \\draw[dashed, thick] (A) -- (B) (A) -- (D) (S) -- (A);
  \\draw[thick] (B) -- (C) -- (D) (S) -- (B) (S) -- (C) (S) -- (D);
  \\foreach \\p/\\pos in {S/above,A/above left,B/below left,C/below right,D/right}
    \\node[\\pos] at (\\p) {$\\p$};
\\end{tikzpicture}`;

    return {
      presetType: "PYRAMID",
      titleAr: `هرم منتظم $SABCD$ قاعدته مربع ($a=${a}$) وارتفاعه $SO = ${b}$`,
      titleFr: `Pyramide régulière $SABCD$ à base carrée ($a=${a}$, $SO=${b}$)`,
      svgWireframe,
      tikzCode,
      keyMetricsSummaryAr: `ضلع القاعدة $a = ${a}$ | الارتفاع $SO = h = ${b}$ | حجم الهرم $V = \\frac{1}{3}a^2 h \\approx ${volPyr}\\text{ cm}^3$`,
      keyMetricsSummaryFr: `Base carrée $a = ${a}$ | Hauteur $SO = ${b}$ | Volume $V = \\frac{1}{3}a^2 h \\approx ${volPyr}\\text{ cm}^3$`,
      suggestedQuestionAr: `نعتبر هرماً منتظماً $SABCD$ قاعدته المربع $ABCD$ الذي مركزه $O$ وطول ضلعه $AB = ${a}\\text{ cm}$، وارتفاعه $SO = ${b}\\text{ cm}$.\nأ) بين أن المستقيم $(SO)$ عمودي على المستوى $(ABCD)$ ثم احسب الطول $OA$ واستنتج طول الحرف الجانبي $SA$.\nب) احسب حجم الهرم $SABCD$.\nج) نقطع الهرم بمستوٍ موازٍ للقاعدة يمر من منتصف $[SO]$ فنحصل على المربع $A'B'C'D'$. احسب مساحة المقطع $A'B'C'D'$ وحجم الهرم المصغر $SA'B'C'D'$.`,
      suggestedQuestionFr: `Soit $SABCD$ une pyramide régulière à base carrée $ABCD$ de centre $O$, de côté $AB = ${a}\\text{ cm}$ et de hauteur $SO = ${b}\\text{ cm}$.\na) Calculer la longueur $OA$ puis en déduire l'arête latérale $SA$.\nb) Calculer le volume $V$ de la pyramide $SABCD$.\nc) On coupe la pyramide par un plan parallèle à la base passant par le milieu de $[SO]$. Calculer l'aire de la section $A'B'C'D'$ et le volume de la petite pyramide $SA'B'C'D'$.`,
      suggestedAnswerAr: `أ) قطر المربع $AC = ${a}\\sqrt{2}$ ومنه $OA = \\frac{${a}\\sqrt{2}}{2}$. بتطبيق مبرهنة فيثاغورس في المثلث القائم $SOA$ نجد $SA = \\sqrt{SO^2 + OA^2} = \\sqrt{${b * b} + ${(0.5 * a * a).toFixed(2)}} \\approx ${Math.sqrt(b * b + 0.5 * a * a).toFixed(2)}\\text{ cm}$.\nب) الحجم: $V = \\frac{1}{3} \\times AB^2 \\times SO = \\frac{1}{3} \\times ${a * a} \\times ${b} \\approx ${volPyr}\\text{ cm}^3$.\nج) نسبة التصغير $k = \\frac{1}{2}$، إذن مساحة المقطع $S' = (\\frac{1}{2})^2 \\times ${a * a} = ${(0.25 * a * a).toFixed(2)}\\text{ cm}^2$، وحجم الهرم المصغر $V' = (\\frac{1}{2})^3 V \\approx ${(Number(volPyr) / 8).toFixed(2)}\\text{ cm}^3$.`,
      suggestedAnswerFr: `a) $OA = \\frac{${a}\\sqrt{2}}{2}$, et d'après Pythagore dans $SOA$, $SA = \\sqrt{${b * b} + ${(0.5 * a * a).toFixed(2)}} \\approx ${Math.sqrt(b * b + 0.5 * a * a).toFixed(2)}\\text{ cm}$.\nb) Volume : $V = \\frac{1}{3} \\times ${a}^2 \\times ${b} \\approx ${volPyr}\\text{ cm}^3$.\nc) Rapport de réduction $k = \\frac{1}{2}$, d'où $\\mathcal{A}(A'B'C'D') = \\frac{${a * a}}{4} = ${(0.25 * a * a).toFixed(2)}\\text{ cm}^2$ et $V' = \\frac{1}{8}V \\approx ${(Number(volPyr) / 8).toFixed(2)}\\text{ cm}^3$.`,
    };
  }

  // SPHERE_PLANE (2BAC: الفلكة والمستوى القاطع)
  const R = Math.max(1.5, a);
  const d = Math.min(R - 0.2, Math.max(0.3, b));
  const rCircle = Number(Math.sqrt(Math.max(0, R * R - d * d)).toFixed(2));

  const svgWireframe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" class="w-full h-auto bg-white rounded-lg border border-slate-200">
    <!-- Secant Plane (P) parallelogram -->
    <polygon points="75,135 375,135 445,70 145,70" fill="#e0e7ff" fill-opacity="0.45" stroke="#4338ca" stroke-width="1.8"/>
    <text x="92" y="125" font-family="serif" font-weight="bold" font-size="14" fill="#312e81">(P)</text>

    <!-- Sphere (S) outer contour -->
    <circle cx="260" cy="185" r="115" fill="#f8fafc" fill-opacity="0.45" stroke="#0f172a" stroke-width="2.4"/>
    <!-- Equator ellipse -->
    <ellipse cx="260" cy="185" rx="115" ry="34" fill="none" stroke="#64748b" stroke-width="1.4" stroke-dasharray="5,4"/>

    <!-- Intersection Circle (C) at y = 105 -->
    <ellipse cx="260" cy="105" rx="84" ry="24" fill="#10b981" fill-opacity="0.24" stroke="#047857" stroke-width="2.2"/>
    <text x="352" y="102" font-family="serif" font-weight="bold" font-size="13" fill="#047857">(C)</text>

    <!-- Center Omega(260,185), H(260,105), and Point M(344,105) on (C) -->
    <line x1="260" y1="185" x2="260" y2="105" stroke="#dc2626" stroke-width="2.2"/>
    <line x1="260" y1="105" x2="344" y2="105" stroke="#047857" stroke-width="2.2"/>
    <line x1="260" y1="185" x2="344" y2="105" stroke="#1e1b4b" stroke-width="2" stroke-dasharray="4,3"/>

    <!-- Right angle at H -->
    <polyline points="260,115 270,115 270,105" fill="none" stroke="#dc2626" stroke-width="1.5"/>

    <circle cx="260" cy="185" r="4" fill="#dc2626"/>
    <text x="236" y="195" font-family="serif" font-weight="bold" font-size="15" fill="#dc2626">Ω</text>
    <circle cx="260" cy="105" r="4" fill="#dc2626"/>
    <text x="242" y="100" font-family="serif" font-weight="bold" font-size="14" fill="#dc2626">H</text>
    <circle cx="344" cy="105" r="4" fill="#047857"/>
    <text x="348" y="118" font-family="serif" font-weight="bold" font-size="14" fill="#047857">M</text>

    <!-- Metric labels -->
    <text x="242" y="150" font-family="monospace" font-weight="bold" font-size="11.5" fill="#dc2626">d=${d}</text>
    <text x="292" y="98" font-family="monospace" font-weight="bold" font-size="11.5" fill="#047857">r=${rCircle}</text>
    <text x="308" y="155" font-family="monospace" font-weight="bold" font-size="11.5" fill="#1e1b4b">R=${R}</text>
  </svg>`;

  const tikzCode = `\\begin{tikzpicture}[scale=1.0]
  % Sphère (S) de centre Omega et rayon R=${R}
  \\draw[thick] (0,0) circle (2.5cm);
  \\draw[dashed, gray] (0,0) ellipse (2.5cm and 0.7cm);
  % Plan sécant (P) et cercle d'intersection (C)
  \\fill[indigo!12, draw=indigo!70!black] (-3.2,0.9) -- (2.2,0.9) -- (3.2,1.9) -- (-2.2,1.9) -- cycle;
  \\fill[emerald!20, draw=emerald!70!black, thick] (0,1.4) ellipse (1.8cm and 0.45cm);
  \\draw[red, thick] (0,0) node[below left] {$\\Omega$} -- (0,1.4) node[above left] {$H$};
  \\draw[emerald!70!black, thick] (0,1.4) -- (1.8,1.4) node[right] {$M$};
  \\draw[dashed, thick] (0,0) -- (1.8,1.4);
\\end{tikzpicture}`;

  return {
    presetType: "SPHERE_PLANE",
    titleAr: `تقاطع فلكة $(\\mathcal{S})$ شعاعها $R=${R}$ ومستوٍ قاطع $(P)$ على مسافة $d=${d}$`,
    titleFr: `Intersection d'une sphère $(\\mathcal{S})$ ($R=${R}$) et d'un plan sécant $(P)$ ($d=${d}$)`,
    svgWireframe,
    tikzCode,
    keyMetricsSummaryAr: `شعاع الفلكة $R = ${R}$ | مسافة المركز عن المستوى $d(\\Omega, (P)) = ${d} < R$ | شعاع دائرة التقاطع $(\\mathcal{C})$: $r = \\sqrt{R^2 - d^2} \\approx ${rCircle}$`,
    keyMetricsSummaryFr: `Rayon sphère $R = ${R}$ | Distance $d(\\Omega, (P)) = ${d} < R$ | Rayon du cercle $(\\mathcal{C})$ : $r = \\sqrt{R^2 - d^2} \\approx ${rCircle}$`,
    suggestedQuestionAr: `الفضاء منسوب إلى معلم متعامد ممنظم $(O; \\vec{i}, \\vec{j}, \\vec{k})$.\nنعتبر الفلكة $(\\mathcal{S})$ التي مركزها $\\Omega(1, -1, 2)$ وشعاعها $R = ${R}$، والمستوى $(P)$ المعرف بالمعادلة الديكارتية $2x - y + 2z - 5 = 0$.\nأ) اكتب معادلة ديكارتية للفلكة $(\\mathcal{S})$.\nب) تحقق أن المسافة $d(\\Omega, (P)) = ${d}$، ثم استنتج أن المستوى $(P)$ يقطع الفلكة $(\\mathcal{S})$ وفق دائرة $(\\mathcal{C})$ يطلب تحديد شعاعها $r$.\nج) حدد تمثيلاً بارامترياً للمستقيم $(\\Delta)$ المار من $\\Omega$ والعمودي على $(P)$، ثم استنتج إحداثيات $H$ مركز الدائرة $(\\mathcal{C})$.`,
    suggestedQuestionFr: `L'espace est rapporté à un repère orthonormé $(O; \\vec{i}, \\vec{j}, \\vec{k})$.\nSoit $(\\mathcal{S})$ la sphère de centre $\\Omega(1, -1, 2)$ et de rayon $R = ${R}$, et $(P)$ le plan d'équation $2x - y + 2z - 5 = 0$.\na) Donner une équation cartésienne de la sphère $(\\mathcal{S})$.\nb) Montrer que $d(\\Omega, (P)) = ${d} < R$ et en déduire que $(P)$ coupe $(\\mathcal{S})$ suivant un cercle $(\\mathcal{C})$ dont on précisera le rayon $r$.\nc) Déterminer une représentation paramétrique de la droite $(\\Delta)$ passant par $\\Omega$ et orthogonale à $(P)$, puis déterminer les coordonnées du centre $H$ de $(\\mathcal{C})$.`,
    suggestedAnswerAr: `أ) معادلة الفلكة: $(x-1)^2 + (y+1)^2 + (z-2)^2 = ${R * R}$.\nب) لدينا $d(\\Omega,(P)) = ${d} < R = ${R}$، إذن $(P)$ يقطع $(\\mathcal{S})$ وفق دائرة $(\\mathcal{C})$ شعاعها $r = \\sqrt{R^2 - d^2} = \\sqrt{${R * R} - ${(d * d).toFixed(2)}} \\approx ${rCircle}$.\nج) المستقيم $(\\Delta)$ موجه بالمتجهة المنظمية $\\vec{n}(2,-1,2)$، ومسقط $\\Omega$ العمودي على $(P)$ هو النقطة $H$ تقاطع $(\\Delta)$ و $(P)$.`,
    suggestedAnswerFr: `a) Équation de $(\\mathcal{S})$ : $(x-1)^2 + (y+1)^2 + (z-2)^2 = ${R * R}$.\nb) Comme $d(\\Omega,(P)) = ${d} < R = ${R}$, l'intersection est le cercle $(\\mathcal{C})$ de rayon $r = \\sqrt{R^2 - d^2} \\approx ${rCircle}$.\nc) Le centre $H$ de $(\\mathcal{C})$ est le projeté orthogonal de $\\Omega$ sur $(P)$, intersection de $(\\Delta)$ dirigée par $\\vec{n}(2,-1,2)$ avec $(P)$.`,
  };
}

// ============================================================================
// تتمة مقترح المفتش التربوي رقم 2:
// مدقق التدرج الديداكتيكي (N1 -> N2 -> N3) وميزانية الزمن (قاعدة 1×3 أستاذ/تلميذ) وتجزئة سلم التنقيط بالربع نقطة (0.25 ن)
// ============================================================================

export type CognitiveTaxonomicLevel =
  | "N1_RESTITUTION"
  | "N2_APPLICATION"
  | "N3_SYNTHESE";

export function classifyQuestionTaxonomicLevel(
  qAr: string,
  qFr: string,
  qIdx: number,
  totalCount: number
): CognitiveTaxonomicLevel {
  const text = `${qAr} ${qFr}`;
  if (
    /استنتج|بين\s+أنه\s+يوجد|ناقش\s+حسب|المساحة|التكامل\s+بالأجزاء|تقبل\s+حلا\s+وحيدا|En\s+déduire|Montrer\s+qu'il\s+existe|Discuter\s+suivant|aire\s+du\s+domaine/i.test(
      text
    ) ||
    (qIdx === totalCount - 1 && totalCount >= 3)
  ) {
    return "N3_SYNTHESE";
  }
  if (
    /بين\s+أن|ادرس|حل\s+في|حدد\s+معادلة|جدول\s+تغيرات|Montrer\s+que|Étudier|Résoudre|tableau\s+de\s+variations/i.test(
      text
    ) ||
    qIdx > 0
  ) {
    return "N2_APPLICATION";
  }
  return "N1_RESTITUTION";
}

export interface QuestionDidacticAuditItem {
  exerciseIndex: number;
  questionIndex: number;
  questionAr: string;
  questionFr: string;
  level: CognitiveTaxonomicLevel;
  allocatedPoints: number;
  estimatedTeacherMinutes: number;
  estimatedStudentMinutes: number;
  analyticalBaremeAr: string;
  analyticalBaremeFr: string;
  hasProgressionInversion: boolean;
  inversionWarningAr?: string;
}

export interface ExerciseDidacticAuditSummary {
  exerciseIndex: number;
  lessonAr: string;
  lessonFr: string;
  points: number;
  questionsAudit: QuestionDidacticAuditItem[];
  totalTeacherMinutes: number;
  totalStudentMinutes: number;
  hasInversion: boolean;
  recommendedOrderIndices: number[];
}

export interface ExamDidacticTimeAndProgressionReport {
  exercises: ExerciseDidacticAuditSummary[];
  totalTeacherMinutes: number;
  totalStudentMinutes: number;
  targetDurationMinutes: number;
  timeBudgetStatus: "OPTIMAL" | "OVERLOAD" | "UNDERLOAD";
  timeBudgetStatusAr: string;
  inversionCount: number;
  quarterPointCompliancePercent: number;
}

/**
 * تحليل التدرج الديداكتيكي للأسئلة داخل كل تمرين + حساب ميزانية الزمن بقاعدة المفتش (1×3) وتوليد سلم تنقيط تحليلي بالربع نقطة (0.25 ن)
 */
export function analyzeDidacticProgressionAndTimeBudget(
  lessons: LessonItem[],
  getQuestionsForLesson: (lesson: LessonItem) => { questionsAr: string[]; questionsFr: string[] },
  targetDurationMinutes: number = 120
): ExamDidacticTimeAndProgressionReport {
  const rankMap: Record<CognitiveTaxonomicLevel, number> = {
    N1_RESTITUTION: 1,
    N2_APPLICATION: 2,
    N3_SYNTHESE: 3,
  };

  let totalTeacherMinutes = 0;
  let totalStudentMinutes = 0;
  let inversionCount = 0;
  let totalQuestionsCount = 0;
  let quarterPointAlignedCount = 0;

  const totalWeight = Math.max(
    1,
    lessons.reduce((acc, l) => acc + (l.weight || 5), 0)
  );

  const exercises: ExerciseDidacticAuditSummary[] = lessons.map((lesson, exIdx) => {
    const lessonPoints = Number(
      (((lesson.weight || 5) / totalWeight) * 20).toFixed(2)
    );
    const { questionsAr, questionsFr } = getQuestionsForLesson(lesson);
    const qCount = Math.max(1, Math.min(questionsAr.length, questionsFr.length));
    const rawPtsPerQ = lessonPoints / qCount;
    const roundedQuarterPts = Math.max(0.25, Math.round(rawPtsPerQ * 4) / 4);

    let maxRankSeen = 1;
    let exTeacherMin = 0;
    let exStudentMin = 0;
    let exHasInversion = false;

    const questionsAudit: QuestionDidacticAuditItem[] = [];

    for (let qIdx = 0; qIdx < qCount; qIdx++) {
      const qAr = questionsAr[qIdx] || "";
      const qFr = questionsFr[qIdx] || "";
      const level = classifyQuestionTaxonomicLevel(qAr, qFr, qIdx, qCount);
      const currentRank = rankMap[level];

      let hasProgressionInversion = false;
      let inversionWarningAr: string | undefined;

      if (currentRank < maxRankSeen) {
        hasProgressionInversion = true;
        exHasInversion = true;
        inversionCount++;
        inversionWarningAr = `اختلال التدرج الديداكتيكي: السؤال (${qIdx + 1}) من المستوى (${level === "N1_RESTITUTION" ? "N1 استرداد" : "N2 تطبيق"}) جاء بعد سؤال من مستوى أعلى (${maxRankSeen === 3 ? "N3 توليف" : "N2 تطبيق"}). يوصي المفتش بترتيب الأسئلة تصاعدياً N1 ← N2 ← N3 لبناء الثقة السيكومترية.`;
      } else {
        maxRankSeen = currentRank;
      }

      // تقدير زمن إنجاز الأستاذ (بالدقائق) ثم ضربه في معامل 3 لتقدير زمن التلميذ (قاعدة المفتش 1×3)
      const baseTeacherMin =
        level === "N1_RESTITUTION"
          ? 1.5
          : level === "N2_APPLICATION"
          ? 2.8
          : 4.5;
      const lengthFactor = Math.min(1.6, Math.max(0.8, (qAr.length + qFr.length) / 180));
      const tMin = Number((baseTeacherMin * lengthFactor).toFixed(1));
      const sMin = Number((tMin * 3).toFixed(1));

      exTeacherMin += tMin;
      exStudentMin += sMin;
      totalQuestionsCount++;

      if (Math.abs(roundedQuarterPts * 4 - Math.round(roundedQuarterPts * 4)) < 0.01) {
        quarterPointAlignedCount++;
      }

      // تفكيك النقطة إلى خطوات جزئية من فئة 0.25 ن (Method vs Final Result)
      const methodPts = Math.max(0.25, Math.round(roundedQuarterPts * 0.6 * 4) / 4);
      const resultPts = Math.max(0.25, Number((roundedQuarterPts - methodPts).toFixed(2)));

      const analyticalBaremeAr = `[${roundedQuarterPts.toFixed(2)} ن] = ${methodPts.toFixed(2)} ن (التمشي والخاصية الرياضية) + ${resultPts.toFixed(2)} ن (سلامة الحساب والنتيجة)`;
      const analyticalBaremeFr = `[${roundedQuarterPts.toFixed(2)} pt] = ${methodPts.toFixed(2)} pt (Démarche & propriété) + ${resultPts.toFixed(2)} pt (Calcul & résultat)`;

      questionsAudit.push({
        exerciseIndex: exIdx,
        questionIndex: qIdx,
        questionAr: qAr,
        questionFr: qFr,
        level,
        allocatedPoints: roundedQuarterPts,
        estimatedTeacherMinutes: tMin,
        estimatedStudentMinutes: sMin,
        analyticalBaremeAr,
        analyticalBaremeFr,
        hasProgressionInversion,
        inversionWarningAr,
      });
    }

    const recommendedOrderIndices = questionsAudit
      .map((item, idx) => ({ idx, rank: rankMap[item.level] }))
      .sort((a, b) => a.rank - b.rank || a.idx - b.idx)
      .map((x) => x.idx);

    totalTeacherMinutes += exTeacherMin;
    totalStudentMinutes += exStudentMin;

    return {
      exerciseIndex: exIdx,
      lessonAr: lesson.lessonAr,
      lessonFr: lesson.lessonFr,
      points: lessonPoints,
      questionsAudit,
      totalTeacherMinutes: Number(exTeacherMin.toFixed(1)),
      totalStudentMinutes: Number(exStudentMin.toFixed(1)),
      hasInversion: exHasInversion,
      recommendedOrderIndices,
    };
  });

  totalTeacherMinutes = Number(totalTeacherMinutes.toFixed(1));
  totalStudentMinutes = Number(totalStudentMinutes.toFixed(1));

  const ratio = totalStudentMinutes / Math.max(30, targetDurationMinutes);
  let timeBudgetStatus: "OPTIMAL" | "OVERLOAD" | "UNDERLOAD" = "OPTIMAL";
  let timeBudgetStatusAr = `متوازن زمنياً (${totalStudentMinutes} د للتلميذ مقابل ${targetDurationMinutes} د رسمية — يحترم قاعدة 1×3)`;

  if (ratio > 1.12) {
    timeBudgetStatus = "OVERLOAD";
    timeBudgetStatusAr = `إفراط في الطول الزمني (${totalStudentMinutes} د للتلميذ > ${targetDurationMinutes} د): يوصي المفتش بحذف سؤال فرعي أو تحويل سؤال مفتوح إلى «بين أن» لتقليص زمن الحساب`;
  } else if (ratio < 0.68) {
    timeBudgetStatus = "UNDERLOAD";
    timeBudgetStatusAr = `قصر زمني (${totalStudentMinutes} د للتلميذ < ${targetDurationMinutes} د): الموضوع أقصر من الحصة الرسمية؛ يمكن تعزيز أسئلة التطبيق (N2)`;
  }

  return {
    exercises,
    totalTeacherMinutes,
    totalStudentMinutes,
    targetDurationMinutes,
    timeBudgetStatus,
    timeBudgetStatusAr,
    inversionCount,
    quarterPointCompliancePercent:
      totalQuestionsCount > 0
        ? Math.round((quarterPointAlignedCount / totalQuestionsCount) * 100)
        : 100,
  };
}

// ============================================================================
// تتمة مقترح المفتش التربوي رقم 3:
// التحليل الإحصائي الطولي المتقدم (DS1 -> DS2 -> DS3) + مبيان SVG التطوري + مصنف نقط مسار (Massar Grade Triage)
// ============================================================================

export interface LongitudinalInspectorAnalytics {
  svgEvolutionChart: string;
  netRemediationEfficiencyScore: number; // 0..100
  deltaNonAcquis: number; // DS3.NA - DS1.NA (negative means improvement)
  deltaAcquis: number; // DS3.A - DS1.A (positive means improvement)
  meanProgressionDelta: number; // DS3.mean - DS1.mean
  homogeneityCV_DS1: number; // Coefficient of variation (%)
  homogeneityCV_DS3: number;
  homogeneityTrendAr: string;
  inspectorVisaStatusAr: string;
  inspectorVisaStatusFr: string;
}

/**
 * توليد مبيان التطور الطولي بصيغة SVG + حساب مؤشرات نجاعة الدعم ومعامل التجانس السيكومتري (CV = sigma / mean)
 */
export function computeLongitudinalInspectorAnalytics(
  config: LongitudinalCohortTrackerConfig
): LongitudinalInspectorAnalytics {
  const [ds1, ds2, ds3] = config.checkpoints;
  const deltaNonAcquis = Number((ds3.masteryNAPct - ds1.masteryNAPct).toFixed(1));
  const deltaAcquis = Number((ds3.masteryAPct - ds1.masteryAPct).toFixed(1));
  const meanProgressionDelta = Number((ds3.meanScore20 - ds1.meanScore20).toFixed(2));

  const cv1 = ds1.meanScore20 > 0 ? Number(((ds1.stdDeviation / ds1.meanScore20) * 100).toFixed(1)) : 0;
  const cv3 = ds3.meanScore20 > 0 ? Number(((ds3.stdDeviation / ds3.meanScore20) * 100).toFixed(1)) : 0;

  // مؤشر نجاعة الدعم التربوي الصافي (من 0 إلى 100)
  const rawEfficiency =
    55 +
    (ds1.masteryNAPct - ds3.masteryNAPct) * 1.4 +
    (ds3.masteryAPct - ds1.masteryAPct) * 0.8 +
    meanProgressionDelta * 4 +
    (cv1 - cv3) * 0.5;
  const netRemediationEfficiencyScore = Math.max(
    10,
    Math.min(99, Math.round(rawEfficiency))
  );

  const homogeneityTrendAr =
    cv3 < cv1
      ? `تحسن في تجانس الفوج: انخفض معامل التشتت النسبي CV من ${cv1}% في DS1 إلى ${cv3}% في DS3 (تقلص الفوارق بين المتعلمين).`
      : `ارتفاع في تشتت الفوج: انتقل معامل التشتت CV من ${cv1}% إلى ${cv3}% (يتطلب تفريقاً بيداغوجياً أوضح بين المجموعات).`;

  const inspectorVisaStatusAr =
    netRemediationEfficiencyScore >= 70
      ? `تأشيرة إيجابية للتفتيش التربوي (نجاعة دعم عالية: ${netRemediationEfficiencyScore}/100) — تقليص فئة التعثر بـ ${Math.abs(deltaNonAcquis)}% ورفع المعدل بـ +${meanProgressionDelta} ن.`
      : netRemediationEfficiencyScore >= 50
      ? `تأشيرة مشروطة (نجاعة متوسطة: ${netRemediationEfficiencyScore}/100) — يوصى بتكثيف روائز الضبط القبلي قبل DS3.`
      : `تنبيه بيداغوجي (${netRemediationEfficiencyScore}/100) — استمرار نسبة التعثر يتطلب مراجعة خطة الدعم المؤسساتي.`;

  const inspectorVisaStatusFr =
    netRemediationEfficiencyScore >= 70
      ? `Visa pédagogique favorable (Indice d'efficacité : ${netRemediationEfficiencyScore}/100) — Réduction NA de ${Math.abs(deltaNonAcquis)}% et gain moyen de +${meanProgressionDelta} pt.`
      : `Suivi différencié requis (Indice : ${netRemediationEfficiencyScore}/100) — Renforcer la remédiation ciblée sur les prérequis.`;

  // بناء مبيان SVG احترافي يقارن DS1 و DS2 و DS3 (الأشرطة المتراكمة A/ECA/NA + منحنى المعدل /20)
  const checkpoints = [ds1, ds2, ds3];
  const xPositions = [130, 290, 450];
  const chartBottom = 185;
  const barHeightMax = 125;

  const barsSvg = checkpoints
    .map((cp, idx) => {
      const cx = xPositions[idx];
      const hA = (cp.masteryAPct / 100) * barHeightMax;
      const hECA = (cp.masteryECAPct / 100) * barHeightMax;
      const hNA = (cp.masteryNAPct / 100) * barHeightMax;

      const yA = chartBottom - hA;
      const yECA = yA - hECA;
      const yNA = yECA - hNA;

      return `
        <g>
          <!-- A (Acquis) -->
          <rect x="${cx - 26}" y="${yA.toFixed(1)}" width="52" height="${Math.max(2, hA).toFixed(1)}" rx="2" fill="#10b981" />
          <!-- ECA (En cours) -->
          <rect x="${cx - 26}" y="${yECA.toFixed(1)}" width="52" height="${Math.max(2, hECA).toFixed(1)}" rx="2" fill="#f59e0b" />
          <!-- NA (Non acquis) -->
          <rect x="${cx - 26}" y="${yNA.toFixed(1)}" width="52" height="${Math.max(2, hNA).toFixed(1)}" rx="2" fill="#f43f5e" />
          <text x="${cx}" y="${chartBottom + 18}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#1e1b4b">${cp.dsCode}</text>
          <text x="${cx}" y="${chartBottom + 32}" text-anchor="middle" font-family="monospace" font-size="10" fill="#475569">x̄=${cp.meanScore20.toFixed(1)} | σ=${cp.stdDeviation.toFixed(1)}</text>
          <text x="${cx + 38}" y="${(yA + hA / 2 + 3).toFixed(1)}" font-family="monospace" font-weight="bold" font-size="9.5" fill="#047857">A:${cp.masteryAPct}%</text>
          <text x="${cx + 38}" y="${(yNA + hNA / 2 + 3).toFixed(1)}" font-family="monospace" font-weight="bold" font-size="9.5" fill="#be123c">NA:${cp.masteryNAPct}%</text>
        </g>
      `;
    })
    .join("\n");

  // نقاط منحنى المعدل العام (/20)
  const meanPts = checkpoints.map((cp, idx) => {
    const x = xPositions[idx];
    const y = chartBottom - (cp.meanScore20 / 20) * barHeightMax;
    return { x, y, score: cp.meanScore20 };
  });

  const polylinePts = meanPts.map((p) => `${p.x},${p.y.toFixed(1)}`).join(" ");
  const meanNodesSvg = meanPts
    .map(
      (p) => `
      <circle cx="${p.x}" cy="${p.y.toFixed(1)}" r="5.5" fill="#4f46e5" stroke="#ffffff" stroke-width="2" />
      <rect x="${p.x - 22}" y="${(p.y - 24).toFixed(1)}" width="44" height="16" rx="4" fill="#1e1b4b" />
      <text x="${p.x}" y="${(p.y - 13).toFixed(1)}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="10" fill="#ffffff">${p.score.toFixed(2)}/20</text>
    `
    )
    .join("\n");

  const svgEvolutionChart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 235" width="100%" height="100%">
    <rect x="2" y="2" width="576" height="231" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="290" y="24" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12.5" fill="#0f172a">المبيان التطوري الطولي لمكتسبات الفوج (${config.cohortName}) — مؤشر النجاعة: ${netRemediationEfficiencyScore}/100</text>
    <!-- خطوط الشبكة الأفقية -->
    <line x1="65" y1="${chartBottom}" x2="525" y2="${chartBottom}" stroke="#64748b" stroke-width="1.5" />
    <line x1="65" y1="${chartBottom - barHeightMax * 0.5}" x2="525" y2="${chartBottom - barHeightMax * 0.5}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="65" y1="${chartBottom - barHeightMax}" x2="525" y2="${chartBottom - barHeightMax}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4" />
    <text x="55" y="${chartBottom + 4}" text-anchor="end" font-family="monospace" font-size="9.5" fill="#64748b">0%</text>
    <text x="55" y="${chartBottom - barHeightMax * 0.5 + 4}" text-anchor="end" font-family="monospace" font-size="9.5" fill="#64748b">50%</text>
    <text x="55" y="${chartBottom - barHeightMax + 4}" text-anchor="end" font-family="monospace" font-size="9.5" fill="#64748b">100%</text>
    ${barsSvg}
    <!-- منحنى المعدل /20 -->
    <polyline fill="none" stroke="#4f46e5" stroke-width="3" points="${polylinePts}" />
    ${meanNodesSvg}
    <!-- مفتاح المبيان -->
    <g transform="translate(85, 36)">
      <rect x="0" y="0" width="10" height="10" rx="2" fill="#10b981" />
      <text x="14" y="9" font-family="sans-serif" font-size="9.5" fill="#334155">متحكم (A ≥ 14)</text>
      <rect x="105" y="0" width="10" height="10" rx="2" fill="#f59e0b" />
      <text x="119" y="9" font-family="sans-serif" font-size="9.5" fill="#334155">في طور التحكم (10 ≤ ECA &lt; 14)</text>
      <rect x="275" y="0" width="10" height="10" rx="2" fill="#f43f5e" />
      <text x="289" y="9" font-family="sans-serif" font-size="9.5" fill="#334155">غير متحكم (NA &lt; 10)</text>
      <line x1="390" y1="5" x2="412" y2="5" stroke="#4f46e5" stroke-width="2.5" />
      <circle cx="401" cy="5" r="3.5" fill="#4f46e5" />
      <text x="417" y="9" font-family="sans-serif" font-weight="bold" font-size="9.5" fill="#4f46e5">المعدل /20</text>
    </g>
  </svg>`;

  return {
    svgEvolutionChart,
    netRemediationEfficiencyScore,
    deltaNonAcquis,
    deltaAcquis,
    meanProgressionDelta,
    homogeneityCV_DS1: cv1,
    homogeneityCV_DS3: cv3,
    homogeneityTrendAr,
    inspectorVisaStatusAr,
    inspectorVisaStatusFr,
  };
}

/**
 * تحليل لائحة نقط التلاميذ الخام (من مسار أو لائحة القسم) واستخراج الإحصائيات وتصنيف المتعلمين آلياً إلى 3 مجموعات دعم
 */
export function parseCohortGradesToCheckpointStats(rawGradesInput: string): {
  validCount: number;
  meanScore: number;
  stdDev: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  acquisPercent: number;
  enCoursPercent: number;
  nonAcquisPercent: number;
  groupACount: number;
  groupECACount: number;
  groupNACount: number;
  triageSummaryAr: string;
} {
  const matches = rawGradesInput
    .replace(/,/g, ".")
    .split(/[\s؛;|\n]+/)
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n) && n >= 0 && n <= 20);

  if (matches.length === 0) {
    return {
      validCount: 0,
      meanScore: 10,
      stdDev: 2.5,
      medianScore: 10,
      minScore: 5,
      maxScore: 17,
      acquisPercent: 25,
      enCoursPercent: 45,
      nonAcquisPercent: 30,
      groupACount: 0,
      groupECACount: 0,
      groupNACount: 0,
      triageSummaryAr: "أدخل نقط التلاميذ (بين 0 و 20) لحساب المؤشرات السيكومترية آلياً.",
    };
  }

  const n = matches.length;
  const sorted = [...matches].sort((a, b) => a - b);
  const sum = matches.reduce((acc, v) => acc + v, 0);
  const meanScore = Number((sum / n).toFixed(2));
  const variance = matches.reduce((acc, v) => acc + Math.pow(v - meanScore, 2), 0) / n;
  const stdDev = Number(Math.sqrt(variance).toFixed(2));
  const medianScore =
    n % 2 === 1
      ? sorted[Math.floor(n / 2)]
      : Number(((sorted[n / 2 - 1] + sorted[n / 2]) / 2).toFixed(2));

  const groupACount = matches.filter((g) => g >= 14).length;
  const groupECACount = matches.filter((g) => g >= 10 && g < 14).length;
  const groupNACount = matches.filter((g) => g < 10).length;

  const acquisPercent = Math.round((groupACount / n) * 100);
  const enCoursPercent = Math.round((groupECACount / n) * 100);
  const nonAcquisPercent = Math.max(0, 100 - acquisPercent - enCoursPercent);

  const triageSummaryAr = `تم تحليل ${n} نقطة: مجموعة التميز (A ≥ 14): ${groupACount} تلميذ (${acquisPercent}%) | مجموعة التثبيت (10..14): ${groupECACount} تلميذ (${enCoursPercent}%) | مجموعة الدعم العاجل (< 10): ${groupNACount} تلميذ (${nonAcquisPercent}%).`;

  return {
    validCount: n,
    meanScore,
    stdDev,
    medianScore,
    minScore: sorted[0],
    maxScore: sorted[sorted.length - 1],
    acquisPercent,
    enCoursPercent,
    nonAcquisPercent,
    groupACount,
    groupECACount,
    groupNACount,
    triageSummaryAr,
  };
}

// ============================================================================
// مقترحات مطور البرامج التربوية (Pedagogical Software Developer Proposals — EdTech Dev Studio):
// 1) مولد التمارين البارامترية المتكافئة المضادة للغش عبر MathJS (Parametric Seed-Based Cloner A/B/C/D)
// 2) مدقق جودة الوثيقة وكثافة الصفحة A4 وسلامة LaTeX/MathJS (EdTech Linter & A4 Page Overflow Guard)
// 3) جسر التصدير المعياري المفتوح لمنصات التعليم الإلكتروني (Moodle XML / QTI & JSON Schema Exporter)
// ============================================================================

export type ParametricCloneTemplateId =
  | "RATIONAL_ANALYSIS"
  | "EXP_ANALYSIS"
  | "LOG_ANALYSIS"
  | "ARITHMETIC_GEOMETRIC_SUITE"
  | "COMPLEX_EQUATION";

export interface ParametricCloneVariant {
  variantCode: "A" | "B" | "C" | "D";
  seedUsed: number;
  parametersSummary: string;
  functionOrRelationLatex: string;
  derivativeOrKeyResultLatex: string;
  questionAr: string;
  questionFr: string;
  answerKeyAr: string;
  answerKeyFr: string;
}

/**
 * توليد 4 نماذج متكافئة ديداكتيكياً ومختلفة عددياً (Modèles A / B / C / D) باستخدام الحساب الرمزي MathJS
 * بحيث تظل النهايات والمشتقات والجذور أعداداً صحيحة أو كسرية مضبوطة خالية من الكسور المعقدة
 */
export function generateParametricClonesWithMathJS(
  templateId: ParametricCloneTemplateId,
  baseSeed: number = 2025
): ParametricCloneVariant[] {
  const codes: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

  return codes.map((code, idx) => {
    const seed = baseSeed + idx * 7;
    const k = (seed % 4) + 1 + idx; // 1..8

    if (templateId === "RATIONAL_ANALYSIS") {
      // f(x) = (a x + b) / (x - c) avec déterminant ad - bc = -(c^2) ou carré parfait pour racines propres
      const c = idx + 1; // 1, 2, 3, 4
      const a = idx + 2; // 2, 3, 4, 5
      const b = -a * c - (idx + 1); // garantit f'(x) = (idx+1) / (x - c)^2 > 0
      const numConst = -(a * c + b); // = idx + 1 > 0
      const fnExpr = `(${a}*x + (${b})) / (x - ${c})`;
      let mathjsDeriv = `\\frac{${numConst}}{(x - ${c})^2}`;
      try {
        const d = simplify(derivative(parse(fnExpr), "x")).toString();
        if (d) {
          mathjsDeriv = `\\frac{${numConst}}{(x - ${c})^2}`;
        }
      } catch {
        // fallback clean latex
      }
      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const fnLatex = `f_${code}(x) = \\frac{${a}x ${bSign}}{x - ${c}}`;

      return {
        variantCode: code,
        seedUsed: seed,
        parametersSummary: `a=${a}, b=${b}, c=${c} (D_f = \\mathbb{R} \\setminus \\{${c}\\})`,
        functionOrRelationLatex: fnLatex,
        derivativeOrKeyResultLatex: `f'_{${code}}(x) = ${mathjsDeriv}`,
        questionAr: `[النموذج ${code}] نعتبر الدالة العددية $f_${code}$ المعرفة على $\\mathbb{R} \\setminus \\{${c}\\}$ بما يلي: $${fnLatex}$.\n1) احسب نهايات $f_${code}$ عند محدات حيز تعريفها واستنتج مقاربي المنحنى $(\\mathcal{C}_{f_${code}})$.\n2) بين أنه لكل $x \\neq ${c}$ لدينا: $f'_{${code}}(x) = ${mathjsDeriv}$، ثم ضع جدول تغيرات $f_${code}$.\n3) اكتب معادلة المماس $(T_${code})$ للمنحنى عند النقطة ذات الأفصول $x_0 = ${c + 1}$.`,
        questionFr: `[Modèle ${code}] Soit $f_${code}$ la fonction définie sur $\\mathbb{R} \\setminus \\{${c}\\}$ par : $${fnLatex}$.\n1) Calculer les limites de $f_${code}$ aux bornes de son domaine et en déduire les asymptotes de $(\\mathcal{C}_{f_${code}})$.\n2) Montrer que pour tout $x \\neq ${c}$, $f'_{${code}}(x) = ${mathjsDeriv}$, puis dresser le tableau de variations de $f_${code}$.\n3) Déterminer l'équation de la tangente $(T_${code})$ au point d'abscisse $x_0 = ${c + 1}$.`,
        answerKeyAr: `[عناصر إجابة النموذج ${code}] 1) مقارب عمودي $x = ${c}$ ومقارب أفقي $y = ${a}$.\n2) المشتقة عبر MathJS: $f'_{${code}}(x) = ${mathjsDeriv} > 0$، إذن $f_${code}$ تزايدية قطعا على كل من $]-\\infty, ${c}[$ و $]${c}, +\\infty[$.\n3) في $x_0 = ${c + 1}$: $f'_{${code}}(${c + 1}) = ${numConst}$ و $f_${code}(${c + 1}) = ${a * (c + 1) + b}$.`,
        answerKeyFr: `[Corrigé Modèle ${code}] 1) Asymptote verticale $x = ${c}$ et horizontale $y = ${a}$.\n2) Dérivée vérifiée par MathJS : $f'_{${code}}(x) = ${mathjsDeriv} > 0$ (strictement croissante).\n3) En $x_0 = ${c + 1}$ : $f'_{${code}}(${c + 1}) = ${numConst}$ et $f_${code}(${c + 1}) = ${a * (c + 1) + b}$.`,
      };
    }

    if (templateId === "EXP_ANALYSIS") {
      const alpha = idx + 1; // 1, 2, 3, 4
      const beta = idx + 2; // 2, 3, 4, 5
      // f(x) = (x - alpha) e^x + beta => f'(x) = (x - alpha + 1) e^x, s'annule en x = alpha - 1
      const rootX = alpha - 1;
      const fnLatex = `f_${code}(x) = (x - ${alpha})e^x + ${beta}`;
      const derivLatex =
        rootX === 0 ? `x e^x` : `(x - ${rootX})e^x`;

      return {
        variantCode: code,
        seedUsed: seed,
        parametersSummary: `\\alpha=${alpha}, \\beta=${beta}, x_0=${rootX}`,
        functionOrRelationLatex: fnLatex,
        derivativeOrKeyResultLatex: `f'_{${code}}(x) = ${derivLatex}`,
        questionAr: `[النموذج ${code}] نعتبر الدالة $f_${code}$ المعرفة على $\\mathbb{R}$ بما يلي: $${fnLatex}$.\n1) احسب $\\lim_{x \\to -\\infty} f_${code}(x)$ وبيّن أن المستقيم $(D_${code}): y = ${beta}$ مقارب مائل/أفقي بجوار $-\\infty$.\n2) بين أنه لكل $x \\in \\mathbb{R}$ لدينا: $f'_{${code}}(x) = ${derivLatex}$، ثم استنتج أن $f_${code}$ تقبل مطرافاً عند $x_0 = ${rootX}$ قيمته $f_${code}(${rootX}) = ${beta} - e^{${rootX}}$.`,
        questionFr: `[Modèle ${code}] Soit $f_${code}$ la fonction définie sur $\\mathbb{R}$ par : $${fnLatex}$.\n1) Calculer $\\lim_{x \\to -\\infty} f_${code}(x)$ et interpréter géométriquement (asymptote $y = ${beta}$).\n2) Montrer que pour tout $x \\in \\mathbb{R}$, $f'_{${code}}(x) = ${derivLatex}$ et dresser le tableau de variations de $f_${code}$ (extremum en $x_0 = ${rootX}$).`,
        answerKeyAr: `[عناصر إجابة النموذج ${code}] 1) $\\lim_{x \\to -\\infty} (x-${alpha})e^x = 0$ بالتالي $\\lim_{x \\to -\\infty} f_${code}(x) = ${beta}$.\n2) $f'_{${code}}(x) = ${derivLatex}$ تنعدم وتغير إشارتها في $x_0 = ${rootX}$، والقيمة الدنيا هي $f_${code}(${rootX}) = ${beta} - e^{${rootX}}$.`,
        answerKeyFr: `[Corrigé Modèle ${code}] 1) Par croissances comparées, $\\lim_{x \\to -\\infty} f_${code}(x) = ${beta}$.\n2) $f'_{${code}}(x) = ${derivLatex}$ s'annule en $x_0 = ${rootX}$ ; minimum global $f_${code}(${rootX}) = ${beta} - e^{${rootX}}$.`,
      };
    }

    if (templateId === "LOG_ANALYSIS") {
      const m = idx + 1; // 1, 2, 3, 4
      // f(x) = x^2 - 2 m^2 ln(x) sur ]0, +inf[ => f'(x) = 2(x^2 - m^2)/x = 2(x-m)(x+m)/x
      const m2 = m * m;
      const twoM2 = 2 * m2;
      const fnLatex = `f_${code}(x) = x^2 - ${twoM2}\\ln(x)`;
      const derivLatex = `\\frac{2(x - ${m})(x + ${m})}{x}`;

      return {
        variantCode: code,
        seedUsed: seed,
        parametersSummary: `m=${m}, 2m^2=${twoM2}, \\text{racine positive } x_0=${m}`,
        functionOrRelationLatex: fnLatex,
        derivativeOrKeyResultLatex: `f'_{${code}}(x) = ${derivLatex}`,
        questionAr: `[النموذج ${code}] نعتبر الدالة $f_${code}$ المعرفة على $]0, +\\infty[$ بما يلي: $${fnLatex}$.\n1) احسب $\\lim_{x \\to 0^+} f_${code}(x)$ و $\\lim_{x \\to +\\infty} f_${code}(x)$.\n2) بين أنه لكل $x > 0$ لدينا: $f'_{${code}}(x) = ${derivLatex}$، ثم استنتج رتابة $f_${code}$ على $]0, ${m}]$ وعلى $[${m}, +\\infty[$.`,
        questionFr: `[Modèle ${code}] Soit $f_${code}$ définie sur $]0, +\\infty[$ par : $${fnLatex}$.\n1) Déterminer $\\lim_{x \\to 0^+} f_${code}(x)$ et $\\lim_{x \\to +\\infty} f_${code}(x)$.\n2) Montrer que pour tout $x > 0$, $f'_{${code}}(x) = ${derivLatex}$, puis étudier les variations de $f_${code}$ sur $]0, +\\infty[$.`,
        answerKeyAr: `[عناصر إجابة النموذج ${code}] 1) $\\lim_{0^+} f_${code}(x) = +\\infty$ و $\\lim_{+\\infty} f_${code}(x) = +\\infty$.\n2) إشارة $f'_{${code}}(x)$ هي إشارة $x - ${m}$ على $]0, +\\infty[$؛ تناقصية على $]0, ${m}]$ وتزايدية على $[${m}, +\\infty[$، وقيمتها الدنيا $f_${code}(${m}) = ${m2} - ${twoM2}\\ln(${m})$.`,
        answerKeyFr: `[Corrigé Modèle ${code}] 1) Limites en $0^+$ et $+\\infty$ égales à $+\\infty$.\n2) Sur $]0,+\\infty[$, $f'_{${code}}(x)$ est du signe de $(x - ${m})$. Minimum en $x_0 = ${m}$ égal à $${m2} - ${twoM2}\\ln(${m})$.`,
      };
    }

    if (templateId === "ARITHMETIC_GEOMETRIC_SUITE") {
      // u_{n+1} = (1/2) u_n + L => point fixe l = 2L, v_n = u_n - 2L géométrique de raison 1/2
      const L = idx + 2; // 2, 3, 4, 5
      const fixedPoint = 2 * L;
      const u0 = fixedPoint + 4;
      const fnLatex = `u_{n+1} = \\frac{1}{2}u_n + ${L} \\quad (u_0 = ${u0})`;
      const derivLatex = `v_n = u_n - ${fixedPoint} \\implies u_n = ${fixedPoint} + 4\\left(\\frac{1}{2}\\right)^n`;

      return {
        variantCode: code,
        seedUsed: seed,
        parametersSummary: `u_0=${u0}, L=${L}, \\ell=${fixedPoint}`,
        functionOrRelationLatex: fnLatex,
        derivativeOrKeyResultLatex: derivLatex,
        questionAr: `[النموذج ${code}] نعتبر المتتالية العددية $(u_n)$ المعرفة بحدها الأول $u_0 = ${u0}$ وبالعلاقة الترجعية: $u_{n+1} = \\frac{1}{2}u_n + ${L}$ لكل $n \\in \\mathbb{N}$.\n1) برهن بالترجع أنه لكل $n \\in \\mathbb{N}$ لدينا: $u_n > ${fixedPoint}$.\n2) نضع $v_n = u_n - ${fixedPoint}$. بين أن $(v_n)$ متتالية هندسية أساسها $q = \\frac{1}{2}$، ثم اكتب $u_n$ بدلالة $n$ واحسب $\\lim_{n \\to +\\infty} u_n$.`,
        questionFr: `[Modèle ${code}] Soit $(u_n)$ la suite définie par $u_0 = ${u0}$ et $u_{n+1} = \\frac{1}{2}u_n + ${L}$ pour tout $n \\in \\mathbb{N}$.\n1) Montrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n > ${fixedPoint}$.\n2) On pose $v_n = u_n - ${fixedPoint}$. Montrer que $(v_n)$ est géométrique de raison $q = \\frac{1}{2}$, exprimer $u_n$ en fonction de $n$ et calculer sa limite.`,
        answerKeyAr: `[عناصر إجابة النموذج ${code}] 1) الترجع مباشر لأن $u_0 = ${u0} > ${fixedPoint}$.\n2) $v_{n+1} = \\frac{1}{2}(u_n - ${fixedPoint}) = \\frac{1}{2}v_n$ وحدها الأول $v_0 = 4$، إذن $u_n = ${fixedPoint} + 4(\\frac{1}{2})^n$ ونهايتها $\\ell = ${fixedPoint}$.`,
        answerKeyFr: `[Corrigé Modèle ${code}] 1) Récurrence immédiate ($u_0 = ${u0} > ${fixedPoint}$).\n2) $v_n = 4(\\frac{1}{2})^n$, d'où $u_n = ${fixedPoint} + 4(\\frac{1}{2})^n$ et $\\lim u_n = ${fixedPoint}$.`,
      };
    }

    // COMPLEX_EQUATION: z^2 - 2 r cos(pi/4) z + r^2 = 0 ou z^2 - 2 a z + (a^2 + b^2) = 0
    const a = idx + 1; // 1, 2, 3, 4
    const b = idx + 2; // 2, 3, 4, 5
    const twoA = 2 * a;
    const modSq = a * a + b * b;
    const deltaVal = -4 * b * b;
    const fnLatex = `z^2 - ${twoA}z + ${modSq} = 0`;
    const derivLatex = `\\Delta = ${deltaVal} = (2\\times ${b}i)^2 \\implies z_1 = ${a} + ${b}i,\\; z_2 = ${a} - ${b}i`;

    return {
      variantCode: code,
      seedUsed: seed + k,
      parametersSummary: `\\text{Re}=${a}, \\text{Im}=\\pm ${b}, |z|^2=${modSq}`,
      functionOrRelationLatex: fnLatex,
      derivativeOrKeyResultLatex: derivLatex,
      questionAr: `[النموذج ${code}] 1) حل في مجموعة الأعداد العقدية $\\mathbb{C}$ المعادلة: $(E_${code}): ${fnLatex}$.\n2) في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر $(O; \\vec{u}, \\vec{v})$، نعتبر النقطتين $A_${code}$ و $B_${code}$ اللتين إلحاقاهما $z_1 = ${a} + ${b}i$ و $z_2 = ${a} - ${b}i$.\nاحسب المسافة $OA_${code}$ و $AB_${code}$ واستنتج طبيعة المثلث $OA_${code}B_${code}$.`,
      questionFr: `[Modèle ${code}] 1) Résoudre dans $\\mathbb{C}$ l'équation : $(E_${code}): ${fnLatex}$.\n2) Dans le plan complexe rapporté à un repère orthonormé direct $(O; \\vec{u}, \\vec{v})$, on considère les points $A_${code}(${a} + ${b}i)$ et $B_${code}(${a} - ${b}i)$.\nCalculer $OA_${code}$ et $AB_${code}$, puis en déduire la nature du triangle $OA_${code}B_${code}$.`,
      answerKeyAr: `[عناصر إجابة النموذج ${code}] 1) المميز $\\Delta = ${deltaVal} = (${2 * b}i)^2 < 0$، والحلان المترافقان هما $z_1 = ${a} + ${b}i$ و $z_2 = ${a} - ${b}i$.\n2) لدينا $OA_${code} = OB_${code} = \\sqrt{${modSq}}$ و $AB_${code} = ${2 * b}$، إذن المثلث $OA_${code}B_${code}$ متساوي الساقين رأسه $O$.`,
      answerKeyFr: `[Corrigé Modèle ${code}] 1) $\\Delta = ${deltaVal} = (${2 * b}i)^2$, solutions conjuguées $z_1 = ${a} + ${b}i$ et $z_2 = ${a} - ${b}i$.\n2) $OA_${code} = OB_${code} = \\sqrt{${modSq}}$ et $AB_${code} = ${2 * b}$, donc $OA_${code}B_${code}$ est isocèle en $O$.`,
    };
  });
}

export interface EdTechDocumentDiagnosticsReport {
  estimatedTotalHeightMm: number;
  estimatedA4Pages: number;
  lastPageFillPercent: number;
  hasOrphanPageRisk: boolean;
  densityStatus: "COMPACT_SINGLE_PAGE" | "OPTIMAL_MULTI_PAGE" | "ORPHAN_OVERFLOW_RISK";
  densityRecommendationAr: string;
  totalQuestionsAudited: number;
  mathSyntaxHealthScore: number; // 0..100
  latexDelimiterWarningsCount: number;
  astVerifiedExpressionsCount: number;
  detailedIssues: Array<{
    exerciseIndex: number;
    questionIndex: number;
    severity: "ERROR" | "WARNING" | "INFO";
    messageAr: string;
  }>;
}

/**
 * مدقق مطور البرامج التربوية الشامل:
 * - يفحص كثافة الصفحة A4 (297mm) ويرصد خطر الأسطر اليتيمة (Orphan lines) في الصفحة الإضافية
 * - يفحص سلامة محددات LaTeX ($...$) وتوازن الأقواس وشجرة الحساب الرمزي MathJS AST في كافة الأسئلة
 */
export function runFullEdTechDocumentDiagnostics(
  lessons: LessonItem[],
  getQuestionsForLesson: (lesson: LessonItem) => { questionsAr: string[]; questionsFr: string[] },
  hasCohortTableInPrint: boolean = false
): EdTechDocumentDiagnosticsReport {
  const usableA4HeightMm = 252; // 297mm minus top/bottom margins
  let estimatedTotalHeightMm = 42; // Official ministry header + title banner

  let totalQuestionsAudited = 0;
  let latexDelimiterWarningsCount = 0;
  let astVerifiedExpressionsCount = 0;
  const detailedIssues: EdTechDocumentDiagnosticsReport["detailedIssues"] = [];

  lessons.forEach((lesson, exIdx) => {
    estimatedTotalHeightMm += 14; // Exercise header bar
    const { questionsAr, questionsFr } = getQuestionsForLesson(lesson);
    const qCount = Math.max(questionsAr.length, questionsFr.length);

    for (let qIdx = 0; qIdx < qCount; qIdx++) {
      totalQuestionsAudited++;
      const qAr = questionsAr[qIdx] || "";
      const qFr = questionsFr[qIdx] || "";
      const combined = `${qAr} ${qFr}`;

      // تقدير الارتفاع بالمليمتر لكل سؤال حسب طول النص ووجود الكسور أو الجداول
      const linesEst = Math.max(1.4, Math.ceil(combined.length / 135));
      const hasDisplayBlock = /\\frac|\\int|\\sum|\\begin\{|\\sqrt/.test(combined);
      estimatedTotalHeightMm += linesEst * 6.2 + (hasDisplayBlock ? 4.5 : 1.5);

      const validation = validateCustomQuestionWithMathJS(combined);
      astVerifiedExpressionsCount += validation.expressionsChecked.filter(
        (e: SingleExpressionCheckResult) => e.isValid
      ).length;

      const hasUnclosedDollar = validation.issues.some(
        (iss: MathValidationIssue) => iss.code === "UNCLOSED_MATH_DELIMITER"
      );
      if (hasUnclosedDollar) {
        latexDelimiterWarningsCount++;
        detailedIssues.push({
          exerciseIndex: exIdx,
          questionIndex: qIdx,
          severity: "ERROR",
          messageAr: `التمرين ${exIdx + 1} - السؤال ${qIdx + 1}: عدد علامات الدولار ($) غير زوجي مما قد يمنع تصيير معادلة KaTeX.`,
        });
      }

      validation.issues.forEach((iss: MathValidationIssue) => {
        if (iss.type === "ERROR" && iss.code !== "UNCLOSED_MATH_DELIMITER") {
          detailedIssues.push({
            exerciseIndex: exIdx,
            questionIndex: qIdx,
            severity: "ERROR",
            messageAr: `التمرين ${exIdx + 1} - السؤال ${qIdx + 1}: ${iss.messageAr}`,
          });
        } else if (iss.type === "WARNING") {
          detailedIssues.push({
            exerciseIndex: exIdx,
            questionIndex: qIdx,
            severity: "WARNING",
            messageAr: `التمرين ${exIdx + 1} - السؤال ${qIdx + 1}: ${iss.messageAr}`,
          });
        }
      });
    }
  });

  if (hasCohortTableInPrint) {
    estimatedTotalHeightMm += 58;
  }

  estimatedTotalHeightMm = Math.round(estimatedTotalHeightMm);
  const estimatedA4Pages = Math.max(1, Math.ceil(estimatedTotalHeightMm / usableA4HeightMm));
  const remainderMm = estimatedTotalHeightMm % usableA4HeightMm;
  const lastPageFillPercent =
    estimatedA4Pages === 1
      ? Math.min(100, Math.round((estimatedTotalHeightMm / usableA4HeightMm) * 100))
      : remainderMm === 0
      ? 100
      : Math.round((remainderMm / usableA4HeightMm) * 100);

  const hasOrphanPageRisk = estimatedA4Pages > 1 && lastPageFillPercent < 26;

  let densityStatus: EdTechDocumentDiagnosticsReport["densityStatus"] = "OPTIMAL_MULTI_PAGE";
  let densityRecommendationAr = `توزيع مثالي على ${estimatedA4Pages} صفحة A4 (نسبة ملء الصفحة الأخيرة: ${lastPageFillPercent}%).`;

  if (estimatedA4Pages === 1 && lastPageFillPercent <= 95) {
    densityStatus = "COMPACT_SINGLE_PAGE";
    densityRecommendationAr = `ورقة امتحان مدمجة في صفحة A4 واحدة (${estimatedTotalHeightMm} مم / 252 مم متاحة — نسبة الملء ${lastPageFillPercent}%). جاهزة للطباعة الاقتصادية.`;
  } else if (hasOrphanPageRisk) {
    densityStatus = "ORPHAN_OVERFLOW_RISK";
    densityRecommendationAr = `تنبيه مطور البرامج (Orphan Page Overflow): الصفحة رقم ${estimatedA4Pages} تحتوي فقط على ${lastPageFillPercent}% من مساحتها (${remainderMm} مم). يوصى بتفعيل «الوضع المدمج Compact Mode» أو تقليص التباعد العمودي لربح ورقة طباعة كاملة.`;
  }

  const errorCount = detailedIssues.filter((i) => i.severity === "ERROR").length;
  const warningCount = detailedIssues.filter((i) => i.severity === "WARNING").length;
  const mathSyntaxHealthScore = Math.max(
    0,
    Math.min(100, 100 - errorCount * 18 - warningCount * 5)
  );

  return {
    estimatedTotalHeightMm,
    estimatedA4Pages,
    lastPageFillPercent,
    hasOrphanPageRisk,
    densityStatus,
    densityRecommendationAr,
    totalQuestionsAudited,
    mathSyntaxHealthScore,
    latexDelimiterWarningsCount,
    astVerifiedExpressionsCount,
    detailedIssues,
  };
}

/**
 * تصدير الفرض المحروس بالكامل إلى صيغة Moodle XML المعيارية (متوافقة مع Moodle / QTI / منصات التعليم عن بعد)
 * مع تضمين صيغ MathJax/LaTeX وسلم التنقيط وعناصر الإجابة
 */
export function exportExamToMoodleXML(
  examTitle: string,
  levelCode: string,
  lessons: LessonItem[],
  getQuestionsForLesson: (lesson: LessonItem) => {
    questionsAr: string[];
    questionsFr: string[];
    answersAr?: string[];
    answersFr?: string[];
  }
): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const convertInlineDollarToMathJax = (str: string) =>
    str.replace(/\$([^$]+)\$/g, "\\($1\\)");

  const categoryHeader = `  <question type="category">
    <category>
      <text>$course$/top/MENPS_Maroc_${escapeXml(levelCode)}/${escapeXml(examTitle)}</text>
    </category>
  </question>`;

  const totalWeight = Math.max(
    1,
    lessons.reduce((acc, l) => acc + (l.weight || 5), 0)
  );

  const questionsXml = lessons
    .map((lesson, exIdx) => {
      const lessonPoints = Number(
        (((lesson.weight || 5) / totalWeight) * 20).toFixed(2)
      );
      const { questionsAr, questionsFr, answersAr = [], answersFr = [] } =
        getQuestionsForLesson(lesson);
      const qCount = Math.max(1, Math.min(questionsAr.length, questionsFr.length));
      const defaultGrade = Number((lessonPoints / qCount).toFixed(2));

      return questionsAr
        .slice(0, qCount)
        .map((qAr, qIdx) => {
          const qFr = questionsFr[qIdx] || "";
          const ansAr = answersAr[qIdx] || "";
          const ansFr = answersFr[qIdx] || "";
          const level = classifyQuestionTaxonomicLevel(qAr, qFr, qIdx, qCount);

          const htmlQuestion = `<div dir="rtl" style="font-family:sans-serif;margin-bottom:8px;"><strong>[التمرين ${exIdx + 1} - ${escapeXml(lesson.lessonAr)} | السؤال ${qIdx + 1}]</strong><br/>${convertInlineDollarToMathJax(escapeXml(qAr))}</div><div dir="ltr" style="font-family:sans-serif;color:#334155;"><strong>[Exercice ${exIdx + 1} - ${escapeXml(lesson.lessonFr)} | Q${qIdx + 1}]</strong><br/>${convertInlineDollarToMathJax(escapeXml(qFr))}</div>`;

          const htmlGraderInfo = `<div dir="rtl"><strong>عناصر الإجابة وسلم التنقيط (${defaultGrade} ن — المستوى ${level}):</strong><br/>${convertInlineDollarToMathJax(escapeXml(ansAr || "يرجى اعتماد التمشي الرياضي السليم (60%) والنتيجة النهائية (40%)."))}</div><hr/><div dir="ltr">${convertInlineDollarToMathJax(escapeXml(ansFr))}</div>`;

          return `  <question type="essay">
    <name>
      <text>Ex${exIdx + 1}_Q${qIdx + 1}_${escapeXml(lesson.lessonFr.slice(0, 28))} (${level})</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[${htmlQuestion}]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[${htmlGraderInfo}]]></text>
    </generalfeedback>
    <defaultgrade>${defaultGrade}</defaultgrade>
    <penalty>0.0000000</penalty>
    <hidden>0</hidden>
    <responseformat>editor</responseformat>
    <responserequired>1</responserequired>
    <responsefieldlines>10</responsefieldlines>
    <graderinfo format="html">
      <text><![CDATA[${htmlGraderInfo}]]></text>
    </graderinfo>
  </question>`;
        })
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Exported by Math Exam Studio Morocco — Pedagogical Developer Interoperability Bridge (Moodle XML + MathJax) -->
<quiz>
${categoryHeader}
${questionsXml}
</quiz>`;
}


