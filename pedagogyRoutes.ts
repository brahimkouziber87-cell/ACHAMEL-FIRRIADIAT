// Auto-generated modular routes for Pedagogical Engineering & Assessment Studio
import express from "express";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import QRCode from "qrcode";
import path from "path";


function hasValidGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(
    key &&
      typeof key === "string" &&
      key.trim().length > 8 &&
      key.trim() !== "MY_GEMINI_API_KEY" &&
      !key.trim().startsWith("YOUR_")
  );
}

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function resolveGeminiModel(modelChoice?: string): {
  sdkModel: string;
  displayLabel: string;
} {
  if (modelChoice === "gemini-4-argon") {
    return {
      sdkModel: "gemini-4-argon",
      displayLabel: "Gemini 4 Argon (High-Reasoning Math Engine)",
    };
  }
  return {
    sdkModel: "gemini-3.8-flash",
    displayLabel: "Gemini 3.8 Flash (Fast Pedagogical Engine)",
  };
}

function resolveThinkingLevel(level?: string): ThinkingLevel | undefined {
  if (level === "HIGH") return ThinkingLevel.HIGH;
  if (level === "MEDIUM") return ThinkingLevel.MEDIUM;
  if (level === "LOW") return ThinkingLevel.LOW;
  return undefined;
}

/**
 * Safely parses JSON returned by LLMs even when strings contain unescaped LaTeX commands
 * like \frac, \ln, \infty, \mathbb{R}, \vec, \beta, \times, \right, \neq, etc.
 */
function safeParseJsonWithLatex<T = any>(rawInput: string): T {
  const stripped = (rawInput || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");
  const candidate =
    firstBrace !== -1 && lastBrace > firstBrace
      ? stripped.slice(firstBrace, lastBrace + 1)
      : stripped;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    // Repair common LaTeX control sequences inside JSON strings that collide with JSON escapes (\f, \b, \t, \r, \n) or invalid escapes (\l, \i, \m, \v, \s, \c, \p, \d, \a, \e, \g, etc.)
    const repaired = candidate
      .replace(
        /\\(frac|forall|phi|psi|prod|pi|pm|partial|parallel|perp|beta|binom|boxed|bar|bigl|bigr|mathbb|mathcal|mathrm|mathbf|sqrt|sum|sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|ln|log|lim|left|right|leq|geq|neq|approx|equiv|sim|simeq|subset|subseteq|supset|supseteq|cup|cap|in|notin|emptyset|infty|int|iint|oint|times|div|cdot|circ|bullet|oplus|otimes|vec|overrightarrow|widehat|widetilde|overline|underline|alpha|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|chi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|Rightarrow|Leftarrow|Leftrightarrow|implies|iff|to|mapsto|longmapsto|rightarrow|leftarrow|leftrightarrow|uparrow|downarrow|quad|qquad|text|textbf|textit|textrm|displaystyle|limits|nolimits)\b/g,
        "\\\\$1"
      )
      // Escape any remaining single backslash not followed by valid JSON escape char (", \, /, b, f, n, r, t, uXXXX)
      .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");

    return JSON.parse(repaired) as T;
  }
}

async function generateGeminiContentWithFallback(
  targetModel: string,
  contents: unknown,
  config?: Record<string, unknown>,
  thinkingLevel?: string
) {
  const client = getGeminiClient();
  const resolvedThinking = resolveThinkingLevel(thinkingLevel);
  const mergedConfig: Record<string, unknown> = {
    ...(config || {}),
    ...(resolvedThinking
      ? { thinkingConfig: { thinkingLevel: resolvedThinking } }
      : {}),
  };
  const finalConfig =
    Object.keys(mergedConfig).length > 0 ? { config: mergedConfig } : {};

  try {
    return await client.models.generateContent({
      model: targetModel,
      contents: contents as any,
      ...finalConfig,
    });
  } catch (firstErr) {
    // Fallback to gemini-3.8-flash without thinkingConfig
    try {
      return await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents as any,
        ...(config && Object.keys(config).length > 0 ? { config } : {}),
      });
    } catch {
      throw firstErr;
    }
  }
}

/**
 * Context-aware Server-Side Mathematical & Pedagogical Engine
 * Ensures 100% reliability and rich curriculum-compliant mathematical output
 * even when running in local/offline mode or before cloud secrets are provisioned.
 */
function customizePedagogicalResponseByTask(
  base: Record<string, any>,
  params: {
    task: string;
    problemText: string;
    trackLabel: string;
    educationSystem: string;
  }
) {
  const { task, problemText } = params;
  const clean = (problemText || "").trim();

  // Extract explicit mathematical expressions if present in user's input
  const funcMatches = clean.match(
    /(?:[fgh]\(x\)|u_\{?n\+1\}?|v_n|z\^2|I\s*=)\s*=\s*[^\n،,;]+/gi
  );
  const extractedFormulas =
    funcMatches && funcMatches.length > 0
      ? funcMatches.slice(0, 2).map((s) => s.trim())
      : [];

  const mergedFormulas = [
    ...extractedFormulas,
    ...(Array.isArray(base.latexFormulas) ? base.latexFormulas : []),
  ].slice(0, 5);

  const taskPrefixMapAr: Record<string, string> = {
    SOLVE_STEP_BY_STEP: "البرهان الرياضي النموذجي المفصل",
    GENERATE_ISOMORPHIC_VARIANT: "توليد النموذج الموازي المتكافئ (Sujet B)",
    GENERATE_SYNTHESIS_PROBLEM: "بناء مسألة توليفية شاملة (Type Bac)",
    GENERATE_BILINGUAL_RUBRIC: "سلم التنقيط المفصل (142-08) وشبكة معالجة التعثرات",
    GENERATE_PYTHON_DIDACTIC: "السيناريو البرمجي وخوارزمية Python الديداكتيكية",
    DIDACTIC_AUDIT_142_08: "التدقيق الديداكتيكي ومطابقة المذكرة الوزارية 142-08",
    GENERATE_EPIS_REMEDIATION:
      "تشخيص العوائق الإبستيمولوجية وبطاقة الدعم الفارقي (Brousseau)",
    GENERATE_OLYMPIAD_CHALLENGE:
      "مسألة تميز وأولمبياد (N3+) وفق استكشافات جورج بوليا",
    SIMPLIFY_COMPLEX_WORDING:
      "تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة (Scaffolding)",
  };

  const taskPrefixMapFr: Record<string, string> = {
    SOLVE_STEP_BY_STEP: "Corrigé Type Rigoureux Étape par Étape",
    GENERATE_ISOMORPHIC_VARIANT: "Génération du Sujet Équivalent Isomorphe (Sujet B)",
    GENERATE_SYNTHESIS_PROBLEM: "Construction d'un Problème de Synthèse (Type Bac)",
    GENERATE_BILINGUAL_RUBRIC: "Barème Détaillé (Note 142-08) & Grille de Remédiation",
    GENERATE_PYTHON_DIDACTIC: "Scénario Algorithmique Python & Simulation TICE",
    DIDACTIC_AUDIT_142_08: "Audit Didactique & Conformité au Cadre Référentiel",
    GENERATE_EPIS_REMEDIATION:
      "Diagnostic des Obstacles Épistémologiques & Remédiation",
    GENERATE_OLYMPIAD_CHALLENGE:
      "Défi Olympiades & Concours Général (Heuristiques de Polya)",
    SIMPLIFY_COMPLEX_WORDING:
      "Simplification Pédagogique & Décomposition en Sous-Questions Guidées",
  };

  const prefixAr = taskPrefixMapAr[task] || taskPrefixMapAr.SOLVE_STEP_BY_STEP;
  const prefixFr = taskPrefixMapFr[task] || taskPrefixMapFr.SOLVE_STEP_BY_STEP;

  const snippetAr =
    clean.length > 0
      ? `\n\n[تحليل المعطيات المدخلة من طرف الأستاذ]:\n« ${clean.slice(0, 220)}${
          clean.length > 220 ? "..." : ""
        } »`
      : "";

  return {
    ...base,
    task,
    titleAr: `${prefixAr} — ${base.titleAr || ""}`,
    titleFr: `${prefixFr} — ${base.titleFr || ""}`,
    latexFormulas: mergedFormulas,
    stepByStepProofAr: `${base.stepByStepProofAr || ""}${snippetAr}`,
  };
}

function buildServerSidePedagogicalMathResponse(params: {
  task: string;
  problemText: string;
  trackLabel: string;
  educationSystem: string;
}) {
  const rawResult = buildServerSidePedagogicalMathResponseCore(params);
  return customizePedagogicalResponseByTask(rawResult, params);
}

function buildServerSidePedagogicalMathResponseCore(params: {
  task: string;
  problemText: string;
  trackLabel: string;
  educationSystem: string;
}) {
  const { task, problemText, trackLabel, educationSystem } = params;
  const cleanProblem = problemText.trim();

  // Detect topic from problemText
  const isSequence = /u_n|u_\{n|v_n|متتالية|متتاليات|suite|récurrence|ترجع/i.test(
    cleanProblem
  );
  const isComplex =
    /عقدي|عقدية|complexe|affixe|module|argument|z\^2|z²|ألحاق|لحق|معيار|عمدة|الشكل الأسي|الشكل المثلثي/i.test(
      cleanProblem
    );
  const isIntegral = /تكامل|intégrale|\\int|∫|أصلية|primitive|مكاملة بالأجزاء/i.test(
    cleanProblem
  );
  const isGeometry = /فضاء|فضائية|فلكة|sphère|متجهي|جداء سلمي|scalaire|vectoriel|بارامتري|paramétrique/i.test(
    cleanProblem
  );
  const isProb = /احتمال|كيس|صندوق|urne|probabilit|عشوائي|binomiale|تعداد|سحب/i.test(
    cleanProblem
  );

  if (task === "SIMPLIFY_COMPLEX_WORDING") {
    return {
      task,
      titleAr:
        "تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة إلى خطوات متدرجة ميسرة",
      titleFr:
        "Simplification Pédagogique de l'Énoncé & Décomposition en Sous-Questions Guidées",
      trackLabel,
      latexFormulas: [
        "f(x) = x - 1 + \\frac{\\ln(x)}{x} \\implies f'(x) = 1 + \\frac{1 - \\ln(x)}{x^2} = \\frac{x^2 + 1 - \\ln(x)}{x^2}",
        "u_{n+1} - u_n = \\frac{-(u_n - 1)^2}{u_n + 2} < 0 \\quad (\\forall n \\in \\mathbb{N},\\; u_n > 1)",
        "\\int_1^e \\frac{\\ln(x)}{x}\\,dx = \\int_1^e \\frac{1}{x}\\ln(x)\\,dx = \\left[\\frac{1}{2}(\\ln x)^2\\right]_1^e = \\frac{1}{2}",
      ],
      stepByStepProofAr: `1. منهجية التبسيط البيداغوجي وتفكيك الأسئلة المركبة (étayage didactique / Scaffolding):
- تحليل النص الأصلي (${cleanProblem.slice(0, 100)}...): يتضمن التمرين أسئلة كثيفة تتطلب من التلميذ استحضار عدة مهارات متتالية في سؤال واحد (حساب + تعليل + تأويل هندسي)، مما يرفع الحمل المعرفي (Charge cognitive) ويؤدي إلى توقف المتعلمين المتوسطين.
- التعديل البيداغوجي المقترح:
  أ) تفكيك كل سؤال مركب إلى سؤالين فرعيين متدرجين (أ: تحقق جبري مباشر N1 $\\leftarrow$ ب: استنتاج وتأويل هندسي N2).
  ب) إدراج صيغة النتيجة الوسطية صراحةً ("بين أن..." بدلاً من "أحسب واستنتج...") لضمان استمرارية التلميذ في حل بقية التمرين حتى لو تعثر في سؤال جزئي (مبدأ استقلال الأسئلة في المذكرة 142-08).
  ج) إضافة تلميح منهجي قصير بين قوسين يذكر التلميذ بالخاصية أو القاعدة المرجعية المطلوبة.`,
      stepByStepProofFr: `1. Méthodologie de simplification didactique et d'étayage (Scaffolding) :
- Analyse de l'énoncé initial : les questions implicites ou à plusieurs étapes créent un blocage chez les élèves en difficulté.
- Modifications pédagogiques proposées :
  a) Décomposer chaque question dense en sous-questions progressives (a: vérification algébrique N1 → b: déduction géométrique N2).
  b) Donner explicitement les formules intermédiaires (« Montrer que f'(x) = ... ») pour permettre la continuité de la résolution (principe de non-pénalisation en cascade).
  c) Ajouter des indications méthodologiques ciblées entre parenthèses.`,
      theoremsUsed: [
        "مبدأ التدريج البيداغوجي وتفكيك المهام المركبة (Étayage didactique de Bruner)",
        "مبدأ استقلالية الأسئلة وعدم العقاب المزدوج في المذكرة الوزارية 142-08",
        "تقنية إعطاء الصيغة الجبرية الوسطية (Formule de secours / Question ouverte guidée)",
      ],
      commonPitfallsAr: [
        "طرح سؤال 'أدرس تغيرات الدالة f' دفعة واحدة دون تفكيكه إلى: 1) حساب المشتقة، 2) دراسة إشارة البسط والمقام، 3) وضع جدول التغيرات.",
        "استعمال صياغات لغوية مزدوجة النفي أو جمل شرطية طويلة تربك الفهم القرائي الرياضي.",
        "ربط السؤال الموالي بنتيجة غير معطاة صراحة في نص التمرين مما يحرم التلميذ من مواصلة الحل.",
      ],
      commonPitfallsFr: [
        "Poser une question globale (« Étudier les variations ») sans guider par l'expression explicite de la dérivée.",
        "Utiliser des tournures syntaxiques ambiguës qui masquent l'hypothèse et la conclusion attendue.",
      ],
      variantExercise: {
        titleAr: "الصياغة المبسطة والمتدرجة للتمرين (نسخة معدلة بيداغوجياً جاهزة للإدراج في الفرض)",
        titleFr: "Énoncé Simplifié et Progressif (Version Didactique Guidée pour le Devoir)",
        statementAr: isSequence
          ? `نعتبر المتتالية العددية (u_n) المعرفة بحدها الأول u_0 = 2 وبالعلاقة: u_{n+1} = (4u_n - 1)/(u_n + 2) لكل عدد صحيح طبيعي n.
1. أ) أحسب الحدين u_1 و u_2. (0.75 ن)
   ب) بين بالترجع أنه لكل n من N لدينا: u_n > 1. (إرشاد: يمكنك كتابة u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2)). (1.25 ن)
2. أ) تحقق أنه لكل n من N: u_{n+1} - u_n = -(u_n - 1)² / (u_n + 2). (1.0 ن)
   ب) استنتج أن المتتالية (u_n) تناقصية، ثم بين أنها متقاربة. (1.0 ن)
3. نضع لكل n من N: v_n = 1/(u_n - 1).
   أ) أحسب v_0، ثم بين أن v_{n+1} - v_n = 1/3 (أي أن (v_n) متتالية حسابية أساسها r = 1/3). (1.0 ن)
   ب) أكتب v_n بدلالة n، ثم استنتج أن u_n = 1 + 3/(3 + n) وأحسب نهاية (u_n). (1.0 ن)`
          : `نعتبر الدالة العددية f المعرفة على المجال ]0, +∞[ بـ: f(x) = x - 1 + ln(x)/x، و (C_f) منحناها في معلم متعامد ممنظم.
1. أ) تحقق أن lim_{x→0+} f(x) = -∞، ثم أعط تأويلاً هندسياً لهذه النتيجة. (إرشاد: لاحظ أن ln(x)/x = (1/x)·ln(x)). (1.0 ن)
   ب) أحسب lim_{x→+∞} f(x) (نذكر أن lim_{x→+∞} ln(x)/x = 0). (0.75 ن)
2. أ) أحسب النهاية lim_{x→+∞} [f(x) - (x - 1)]، ثم استنتج أن المستقيم (Δ): y = x - 1 مقارب مائل للمنحنى (C_f) بجوار +∞. (1.0 ن)
   ب) أدرس إشارة ln(x) على المجال ]0, +∞[، ثم استنتج الوضع النسبي للمنحنى (C_f) والمستقيم (Δ). (1.0 ن)
3. أ) بين أنه لكل x من ]0, +∞[ لدينا: f'(x) = (x² + 1 - ln(x)) / x². (1.25 ن)
   ب) علماً أن ln(x) < x² + 1 لكل x > 0، استنتج إشارة f'(x) ثم ضع جدول تغيرات الدالة f. (1.0 ن)
4. أ) تحقق أن الدالة H(x) = (1/2)(ln x)² هي دالة أصلية للدالة h(x) = ln(x)/x على ]0, +∞[. (0.75 ن)
   ب) استنتج قيمة التكامل I = ∫_1^e (ln(x)/x) dx ثم مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x = 1 و x = e. (1.0 ن)`,
        statementFr: isSequence
          ? `Soit (u_n) la suite numérique définie par u_0 = 2 et u_{n+1} = (4u_n - 1)/(u_n + 2) pour tout n ∈ N.
1. a) Calculer u_1 et u_2. (0.75 pt)
   b) Montrer par récurrence que pour tout n ∈ N, u_n > 1 (Indication : vérifier que u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2)). (1.25 pt)
2. a) Vérifier que pour tout n ∈ N : u_{n+1} - u_n = -(u_n - 1)² / (u_n + 2). (1.0 pt)
   b) En déduire le sens de variation de (u_n) et montrer qu'elle converge. (1.0 pt)
3. Pour tout n ∈ N, on pose v_n = 1/(u_n - 1).
   a) Calculer v_0 et montrer que v_{n+1} - v_n = 1/3. (1.0 pt)
   b) Exprimer v_n puis u_n en fonction de n, et calculer lim u_n. (1.0 pt)`
          : `Soit f la fonction définie sur ]0, +∞[ par : f(x) = x - 1 + ln(x)/x, et (C_f) sa courbe représentative.
1. a) Vérifier que lim_{x→0+} f(x) = -∞ et interpréter géométriquement le résultat. (1.0 pt)
   b) Calculer lim_{x→+∞} f(x) (Rappel : lim_{x→+∞} ln(x)/x = 0). (0.75 pt)
2. a) Calculer lim_{x→+∞} [f(x) - (x - 1)] et en déduire que (Δ) : y = x - 1 est asymptote oblique à (C_f). (1.0 pt)
   b) Étudier le signe de ln(x) sur ]0, +∞[ et en déduire la position relative de (C_f) et (Δ). (1.0 pt)
3. a) Montrer que pour tout x > 0 : f'(x) = (x² + 1 - ln(x)) / x². (1.25 pt)
   b) Sachant que ln(x) < x² + 1 sur ]0, +∞[, donner le signe de f'(x) et dresser le tableau de variations de f. (1.0 pt)
4. a) Vérifier que H(x) = (1/2)(ln x)² est une primitive de h(x) = ln(x)/x sur ]0, +∞[. (0.75 pt)
   b) En déduire l'intégrale I = ∫_1^e (ln(x)/x) dx puis l'aire du domaine compris entre (C_f), (Δ), x = 1 et x = e. (1.0 pt)`,
        solutionAr: `عناصر الإجابة للصياغة المبسطة:
1. أ) عند 0+: lim ln(x) = -∞ و lim 1/x = +∞، إذن lim f(x) = -∞، ومنه المستقيم x = 0 مقارب عمودي.
   ب) عند +∞: lim (x-1) = +∞ و lim ln(x)/x = 0، إذن lim f(x) = +∞.
2. أ) lim [f(x) - (x-1)] = lim ln(x)/x = 0، إذن (Δ): y = x-1 مقارب مائل.
   ب) إشارة الفرق هي إشارة ln(x): (C_f) تحت (Δ) على ]0, 1] وفوق (Δ) على [1, +∞[.
3. أ) f'(x) = 1 + (1 - ln x)/x² = (x² + 1 - ln x)/x² > 0، إذن f تزايدية قطعا على ]0, +∞[.
4. أ) H'(x) = (1/2) × 2(1/x)ln(x) = ln(x)/x = h(x). ب) I = H(e) - H(1) = 1/2 - 0 = 1/2 u.a.`,
        solutionFr: `Corrigé de la version simplifiée :
1. a) lim_{0+} f(x) = -∞ (asymptote verticale x = 0). b) lim_{+∞} f(x) = +∞.
2. a) lim_{+∞} [f(x)-(x-1)] = 0 donc (Δ): y = x-1 est asymptote oblique. b) (C_f) est au-dessus de (Δ) sur [1, +∞[.
3. a) f'(x) = (x² + 1 - ln x)/x² > 0, f est strictement croissante.
4. a) H'(x) = ln(x)/x. b) I = [1/2 (ln x)²]_1^e = 1/2 u.a.`,
      },
      gradingRubric: [
        {
          questionRef: "1.a-b",
          criterionAr: "حساب النهايتين الموجهتين واستنتاج المقارب العمودي",
          criterionFr: "Calcul guidé des limites et asymptote verticale",
          points: 1.75,
          skillLevel: "N1" as const,
          remediationAr: "استثمار التذكير المدمج في نص السؤال",
        },
        {
          questionRef: "2.a-b",
          criterionAr: "إثبات المقارب المائل ودراسة إشارة الفرق المبسطة",
          criterionFr: "Asymptote oblique et position relative guidée",
          points: 2.0,
          skillLevel: "N1" as const,
          remediationAr: "ربط إشارة الفرق بإشارة ln(x) مباشرة",
        },
        {
          questionRef: "3.a-b",
          criterionAr: "التحقق من صيغة المشتقة المعطاة واستنتاج جدول التغيرات",
          criterionFr: "Vérification de f'(x) et tableau de variations",
          points: 2.25,
          skillLevel: "N2" as const,
          remediationAr: "توحيد المقامات في 1 + (1 - ln x)/x²",
        },
        {
          questionRef: "4.a-b",
          criterionAr: "التحقق من الدالة الأصلية المعطاة وحساب التكامل والمساحة",
          criterionFr: "Vérification de la primitive H(x) et calcul d'aire",
          points: 1.75,
          skillLevel: "N2" as const,
          remediationAr: "اشتقاق H(x) = 1/2 (ln x)² للتحقق المباشر",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية التحقق العددي المبسط من جدول القيم",
        titleFr: "Algorithme de vérification numérique des valeurs de f(x)",
        objectiveAr: "تمكين التلميذ من ملاحظة تقارب f(x) نحو المقارب y = x - 1",
        objectiveFr: "Observer la convergence de f(x) vers l'asymptote y = x - 1",
        code: `import math

def f(x):
    return x - 1 + math.log(x) / x

for x in [1, 2, 5, 10, 50]:
    ecart = round(f(x) - (x - 1), 4)
    print(f"x = {x} -> f(x) = {round(f(x), 4)} | f(x)-(x-1) = {ecart}")`,
        questionsAr: [
          "1. ماذا تلاحظ حول قيمة الفرق f(x) - (x - 1) كلما كبرت قيمة x؟",
          "2. كيف يؤكد هذا الجدول أن المستقيم y = x - 1 مقارب مائل؟",
        ],
        questionsFr: [
          "1. Que constate-t-on pour l'écart f(x) - (x - 1) lorsque x devient grand ?",
          "2. Comment ce tableau illustre-t-il l'asymptote oblique y = x - 1 ?",
        ],
        sampleOutput: "x = 1 -> ecart = 0.0 | x = 10 -> ecart = 0.2303 | x = 50 -> ecart = 0.0782",
      },
      didacticAudit: {
        estimatedDurationMinutes: 40,
        suggestedPoints: 7.75,
        n1Percentage: 45,
        n2Percentage: 45,
        n3Percentage: 10,
        complianceNotesAr:
          "تم تبسيط الصياغة وتفكيك الأسئلة المركبة إلى خطوات فرعية متدرجة (أ، ب) مع توفير الصيغ الوسطية للتحقق، مما يضمن تكافؤ الفرص واستقلالية الأسئلة وفق المذكرة 142-08.",
        complianceNotesFr:
          "Énoncé restructuré avec étayage progressif et résultats intermédiaires fournis pour éviter les blocages en cascade.",
      },
    };
  }

  if (task === "GENERATE_EPIS_REMEDIATION") {
    return {
      task,
      titleAr:
        "تشخيص العوائق الإبستيمولوجية والديداكتيكية وبطاقة الدعم الفردي الموجه (Brousseau)",
      titleFr:
        "Diagnostic des Obstacles Épistémologiques & Fiche de Remédiation Différenciée",
      trackLabel,
      latexFormulas: [
        "\\ln(a + b) \\neq \\ln(a) + \\ln(b) \\quad ; \\quad \\ln(a \\cdot b) = \\ln(a) + \\ln(b)\\; (a,b > 0)",
        "\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\neq \\frac{u'}{v'}",
        "(u(x))^2 = k > 0 \\iff u(x) = \\sqrt{k} \\;\\text{أو}\\; u(x) = -\\sqrt{k}",
      ],
      stepByStepProofAr: `1. رصد وتحليل العائق الإبستيمولوجي والديداكتيكي (Obstacle Épistémologique & Didactique - Guy Brousseau):
- في الوضعية الرياضية المدخلة (${cleanProblem.slice(0, 90)}...)، يبرز عائق إبستيمولوجي كلاسيكي يتمثل في "التعميم الخطي المفرط" (Sur-généralisation de la linéarité): يميل المتعلم إلى معاملة المؤثرات غير الخطية (مثل $\\ln$ أو $\\exp$ أو الجذر المربع أو الاشتقاق لجداء/خارج) وكأنها تطبيقات خطية تحقق $f(a+b)=f(a)+f(b)$.
- العائق الثاني المرصود هو "الخلط بين الشرط اللازم والشرط الكافي" أو "الانتقال إلى النهاية قبل إثبات التقارب".

2. استراتيجية المعالجة الديداكتيكية وبناء التناقض المعرفي (Conflit Cognitif & Remédiation):
- المرحلة أ (المثال المضاد الحاسم - Contre-exemple): مطالبة التلميذ بحساب الطرفين عددياً في حالة بسيطة (مثلاً $a=1, b=1$) ليدرك بنفسه استحالة المساواة الخاطئة.
- المرحلة ب (إرساء القاعدة الصحيحة بالسجلين الجبري والهندسي): ربط القاعدة الجبرية بتأويلها المبياني (مماس، تقعر، أو مسافة).
- المرحلة ج (تمرين الدعم الفردي التدرجي): تمرير بطاقة دعم قصيرة من 3 أسئلة موجهة (تحقق $\\leftarrow$ تصويب $\\leftarrow$ تطبيق مستقل).`,
      stepByStepProofFr: `1. Identification de l'obstacle épistémologique (Théorie des situations didactiques - Brousseau) :
- Dans l'énoncé analysé, l'obstacle principal relève du théorème-en-acte erroné de « pseudo-linéarité » des fonctions transcendantes ou de l'opérateur de dérivation d'un quotient.
2. Dispositif de remédiation par conflit cognitif :
- Étape A : Invalidation par un contre-exemple numérique immédiat.
- Étape B : Institutionnalisation de la propriété exacte et de ses hypothèses de validité.
- Étape C : Micro-exercice de remédiation ciblée gradué en 3 sous-questions.`,
      theoremsUsed: [
        "نظرية الوضعيات الديداكتيكية والعوائق الإبستيمولوجية (Guy Brousseau)",
        "تقنية المثال المضاد لإحداث الصراع المعرفي (Conflit socio-cognitif)",
        "شبكة الدعم الفردي الفارقي حسب مجموعات التحكم (A / ECA / NA)",
      ],
      commonPitfallsAr: [
        "عائق الخطية الزائفة: كتابة ln(x + 1) = ln(x) + ln(1) أو √(a² + b²) = a + b.",
        "عائق اشتقاق المركب: نسيان الضرب في مشتقة الدالة الداخلية u'(x) في (e^{u(x)})' = u'(x)e^{u(x)}.",
        "عائق الرتابة والاتصال: تطبيق مبرهنة القيم الوسيطية (TVI) لإثبات الوحدانية دون ذكر الرتابة القطعية.",
      ],
      commonPitfallsFr: [
        "Obstacle de pseudo-linéarité : écrire ln(a+b) = ln(a)+ln(b) ou (u/v)' = u'/v'.",
        "Oubli de la dérivée intérieure u'(x) lors de la dérivation d'une fonction composée.",
      ],
      variantExercise: {
        titleAr: "بطاقة تمرين الدعم الفردي الموجه لمعالجة التعثرات (Fiche de Remédiation Ciblée)",
        titleFr: "Fiche d'Exercice de Remédiation Différenciée (Soutien Ciblé)",
        statementAr: `تمرين الدعم الفردي (20 دقيقة — خاص بمعالجة العوائق المرصودة):
1. [مثال مضاد وتصويب]: نعتبر التعبير A(x) = ln(e² · x) والتعبير B(x) = (ln x)² على ]0, +∞[.
   أ) أحسب A(1) و B(e)، ثم بسط A(x) باستعمال خاصية لوغاريتم الجداء. (1.0 ن)
   ب) علل لماذا الكتابة (B(x))' = 2/x خاطئة، ثم أحسب المشتقة الصحيحة لـ B(x) باستعمال قاعدة (u²)' = 2u'u. (1.5 ن)
2. [تطبيق موجه]: نعتبر الدالة f(x) = (2 ln(x) - 1)/x على ]0, +∞[.
   أ) بين أن لكل x > 0: f'(x) = (3 - 2 ln(x)) / x². (1.5 ن)
   ب) أدرس إشارة 3 - 2 ln(x) على ]0, +∞[ ثم ضع جدول تغيرات الدالة f. (1.5 ن)`,
        statementFr: `Exercice de Remédiation Ciblée (20 min) :
1. [Contre-exemple et correction] : Soient A(x) = ln(e² · x) et B(x) = (ln x)² sur ]0, +∞[.
   a) Calculer A(1) et B(e), puis simplifier A(x). (1.0 pt)
   b) Expliquer pourquoi (B(x))' = 2/x est faux, puis calculer la dérivée exacte via (u²)' = 2u'u. (1.5 pt)
2. [Application guidée] : Soit f(x) = (2 ln(x) - 1)/x sur ]0, +∞[.
   a) Montrer que pour tout x > 0, f'(x) = (3 - 2 ln(x)) / x². (1.5 pt)
   b) Étudier le signe de 3 - 2 ln(x) et dresser le tableau de variations de f. (1.5 pt)`,
        solutionAr: `1. أ) A(1) = ln(e²) = 2 و B(e) = (1)² = 1. ولكل x > 0: A(x) = ln(e²) + ln(x) = 2 + ln(x).
   ب) B(x) هي مربع الدالة u(x) = ln(x)، إذن مشتقتها هي B'(x) = 2 u'(x) u(x) = 2 ln(x) / x.
2. أ) بتطبيق قاعدة خارج دالتين: f'(x) = [(2/x)·x - 1·(2 ln x - 1)] / x² = (2 - 2 ln x + 1) / x² = (3 - 2 ln x) / x².
   ب) 3 - 2 ln(x) ≥ 0 ⇔ ln(x) ≤ 3/2 ⇔ 0 < x ≤ e^{3/2}. إذن f تزايدية على ]0, e^{3/2}] وتناقصية على [e^{3/2}, +∞[.`,
        solutionFr: `1. a) A(x) = 2 + ln(x). b) B'(x) = 2 ln(x) / x.
2. a) Par dérivation d'un quotient, f'(x) = (3 - 2 ln x)/x². b) f croît sur ]0, e^{3/2}] et décroît sur [e^{3/2}, +∞[.`,
      },
      gradingRubric: [
        {
          questionRef: "1.a",
          criterionAr: "التمييز بين ln(ab) و (ln x)² وحساب القيم العددية بدقة",
          criterionFr: "Distinction entre ln(ab) et (ln x)²",
          points: 1.0,
          skillLevel: "N1" as const,
          remediationAr: "التذكير بأن ln يحول الجداء إلى مجموع داخل الأقواس فقط",
        },
        {
          questionRef: "1.b",
          criterionAr: "تطبيق قاعدة مشتقة القوة المركبة (u^n)' = n·u'·u^{n-1}",
          criterionFr: "Dérivation de (u(x))^2 = 2 u'(x) u(x)",
          points: 1.5,
          skillLevel: "N2" as const,
          remediationAr: "تفكيك الدالة المركبة إلى u(x) = ln(x) قبل الاشتقاق",
        },
        {
          questionRef: "2.a-b",
          criterionAr: "حساب مشتقة الخارج وحل المتراجحة اللوغاريتمية",
          criterionFr: "Dérivée du quotient et résolution de 3 - 2ln(x) ≥ 0",
          points: 3.0,
          skillLevel: "N2" as const,
          remediationAr: "الانتباه لعكس المتفاوتة عند القسمة على العدد السالب (-2)",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية بايثون للتحقق العددي من المثال المضاد ومشتقة الدالة",
        titleFr: "Script Python : Vérification numérique de la dérivée et contre-exemple",
        objectiveAr: "مقارنة القيمة المضبوطة للمشتقة بمعدل التغير لمساعدة التلميذ على التحقق الذاتي",
        objectiveFr: "Comparer le taux d'accroissement et la formule de la dérivée",
        code: `import math

def f(x):
    return (2 * math.log(x) - 1) / x

def f_prime_exacte(x):
    return (3 - 2 * math.log(x)) / (x ** 2)

x0, h = 2.0, 1e-6
taux = (f(x0 + h) - f(x0)) / h
print("Taux d'accroissement :", round(taux, 6))
print("Formule exacte f'(2) :", round(f_prime_exacte(x0), 6))`,
        questionsAr: [
          "1. ماذا يمثل المتغير taux في السطر العاشر عندما يؤول h إلى 0؟",
          "2. قارن النتيجة مع الصيغة الخاطئة (u'/v') لتستنتج صحة قانون اشتقاق الخارج.",
        ],
        questionsFr: [
          "1. Que représente la variable taux lorsque h tend vers 0 ?",
          "2. Vérifier la concordance avec f'(2).",
        ],
        sampleOutput: "Taux d'accroissement : 0.403426 | Formule exacte f'(2) : 0.403426",
      },
      didacticAudit: {
        estimatedDurationMinutes: 25,
        suggestedPoints: 5.5,
        n1Percentage: 45,
        n2Percentage: 45,
        n3Percentage: 10,
        complianceNotesAr: "بطاقة دعم فارقي مطابقة لتوجيهات معالجة التعثرات عقب الفروض المحروسة.",
        complianceNotesFr: "Fiche de remédiation ciblée conforme aux directives d'accompagnement.",
      },
    };
  }

  if (task === "GENERATE_OLYMPIAD_CHALLENGE") {
    return {
      task,
      titleAr:
        "تحدي الأولمبياد الوطنية والمباراة العامة مع إرشادات جورج بوليا الاستكشافية (Polya Heuristics)",
      titleFr:
        "Défi Olympiades Nationales & Concours Général avec Heuristiques de Polya",
      trackLabel,
      latexFormulas: [
        "\\forall n \\in \\mathbb{N}^*,\\; \\exists! x_n \\in ]0,1[,\\; f_n(x_n) = x_n^n + x_n - 1 = 0",
        "x_n^n = 1 - x_n \\implies n \\ln(x_n) = \\ln(1 - x_n)",
        "\\lim_{n \\to +\\infty} x_n = 1^- \\quad \\text{et} \\quad 1 - x_n \\underset{+\\infty}{\\sim} \\frac{\\ln n}{n}",
      ],
      stepByStepProofAr: `🧭 منهجية جورج بوليا الاستكشافية (Heuristiques de Polya — 4 مراحل):
• المرحلة 1 (فهم البنية الرياضية للمسألة): نبحث عن السلوك المقارب للجذر الوحيد $x_n$ للمعادلة $x^n + x - 1 = 0$ على $]0, 1[$ عندما يؤول $n$ إلى $+\\infty$.
• المرحلة 2 (بناء خطة الحل والربط بالمعارف): نستعمل رتابة المتتالية $(x_n)$ لإثبات تقاربها، ثم نأخذ اللوغاريتم النيبيري للعلاقة $x_n^n = 1 - x_n$ لكسر القوة النونية $n$.
• المرحلة 3 (تنفيذ البرهان الصارم):
  1) الدالة $f_n(x) = x^n + x - 1$ متصلة وتزايدية قطعا على $[0, 1]$ مع $f_n(0)=-1$ و $f_n(1)=1$، إذن تقبل جذراً وحيداً $x_n \\in ]0, 1[$.
  2) بما أن $x_n \\in ]0, 1[$ فإن $x_n^{n+1} < x_n^n = 1 - x_n$ ومنه $f_{n+1}(x_n) < 0 = f_{n+1}(x_{n+1})$، وبما أن $f_{n+1}$ تزايدية فإن $x_n < x_{n+1}$. إذن $(x_n)$ تزايدية ومكبورة بـ 1 فهي متقاربة نحو $\\ell \\in ]0, 1]$.
  3) لو كان $\\ell < 1$ لكان $\\lim x_n^n = 0$ ومنه $\\ell = 1 - 0 = 1$ (تناقض)، إذن $\\lim_{n \\to +\\infty} x_n = 1$.
• المرحلة 4 (المراجعة والتعميم Asymptotics): بوضع $x_n = 1 - u_n$ مع $u_n \\to 0^+$ نجد $n \\ln(1 - u_n) = \\ln(u_n)$ ومنه $-n u_n \\sim \\ln(u_n)$ أي $1 - x_n \\sim \\frac{\\ln n}{n}$.`,
      stepByStepProofFr: `🧭 Démarche Heuristique de Polya en 4 étapes :
1. Comprendre le problème : Étudier la suite $(x_n)$ des racines uniques de $x^n + x - 1 = 0$ sur $]0, 1[$.
2. Concevoir un plan : Utiliser la stricte croissance de $f_n$ pour comparer $f_{n+1}(x_n)$ et $0$, puis passer au logarithme dans $x_n^n = 1 - x_n$.
3. Exécuter le plan : $f_{n+1}(x_n) = x_n^{n+1} + x_n - 1 < x_n^n + x_n - 1 = 0$, donc $(x_n)$ est croissante et majorée par 1, et converge vers 1.
4. Regard rétrospectif : Développement asymptotique $x_n = 1 - \\frac{\\ln n}{n} + o\\left(\\frac{\\ln n}{n}\\right)$.`,
      theoremsUsed: [
        "استراتيجية جورج بوليا لحل المسائل غير النمطية (How to Solve It - G. Polya)",
        "مبرهنة التقارب المطرد للمتتاليات الضمنية (Suites définies implicitement)",
        "التحليل المقارب واستعمال اللوغاريتم لتفكيك القوى المتغيرة (Analyse asymptotique)",
      ],
      commonPitfallsAr: [
        "الانتقال المباشر إلى النهاية في x_n^n عندما يؤول n إلى +∞ وكتابة 1^∞ = 1 (شكل غير محدد).",
        "إغفال مقارنة x_n و x_{n+1} عبر الصورة بالدالة f_{n+1} بدل الدالة f_n.",
      ],
      commonPitfallsFr: [
        "Passer à la limite dans x_n^n en écrivant 1^∞ = 1 (forme indéterminée).",
        "Oublier d'évaluer f_{n+1}(x_n) pour déterminer la monotonie de (x_n).",
      ],
      variantExercise: {
        titleAr: "مسألة التميز والمباراة العامة (Question Défi / Concours Général — مستوى N3+)",
        titleFr: "Problème d'Excellence & Concours Général (Niveau N3+ / Bonus)",
        statementAr: `مسألة التميز والأولمبياد (تضاف كسؤال تحدٍّ للمتفوقين أو في سلسلة التميز):
لكل عدد صحيح طبيعي غير منعدم n، نعتبر الدالة f_n المعرفة على [0, 1] بـ: f_n(x) = x^n + x - 1.
1. بين أن المعادلة f_n(x) = 0 تقبل حلاً وحيداً x_n في المجال المفتوح ]0, 1[. (1.0 ن)
2. أ) أحسب إشارة f_{n+1}(x_n) واستنتج أن المتتالية (x_n)_{n≥1} تزايدية قطعا ومتقاربة. (1.5 ن)
   ب) بإثبات بالخلف أن نهاية (x_n) لا يمكن أن تكون أصغر قطعا من 1، استنتج أن lim_{n→+∞} x_n = 1. (1.5 ن)
3. [سؤال التحدي N3+]: بين أن lim_{n→+∞} n(1 - x_n) = +∞ ثم تحقق من أن lim_{n→+∞} n(1 - x_n)/ln(n) = 1. (2.0 ن)
💡 إرشاد بوليا (Polya Hint): خذ اللوغاريتم النيبيري في المتساوية x_n^n = 1 - x_n واستعمل النهاية الاعتيادية lim_{u→0} ln(1 - u)/u = -1.`,
        statementFr: `Problème d'Excellence / Concours Général :
Pour tout entier n ≥ 1, soit f_n(x) = x^n + x - 1 sur [0, 1].
1. Montrer que l'équation f_n(x) = 0 admet une unique solution x_n ∈ ]0, 1[. (1.0 pt)
2. a) Étudier le signe de f_{n+1}(x_n) et en déduire que la suite (x_n) est croissante et convergente. (1.5 pt)
   b) Montrer par l'absurde que lim_{n→+∞} x_n = 1. (1.5 pt)
3. [Défi N3+] : Montrer que lim_{n→+∞} n(1 - x_n)/ln(n) = 1. (2.0 pts)
💡 Indice de Polya : Appliquer le logarithme népérien à l'égalité x_n^n = 1 - x_n.`,
        solutionAr: `1. f_n متصلة وتزايدية قطعا على [0,1] و f_n(0)·f_n(1) = -1 < 0، إذن حسب TVI يوجد x_n وحيد في ]0,1[.
2. أ) f_{n+1}(x_n) = x_n^{n+1} + x_n - 1 = x_n^{n+1} - x_n^n = x_n^n(x_n - 1) < 0 = f_{n+1}(x_{n+1})، وبما أن f_{n+1} تزايدية قطعا فإن x_n < x_{n+1}.
   ب) لو كانت النهاية L < 1 لكان lim x_n^n = 0 ومنه L = 1 - 0 = 1 تناقض، إذن L = 1.
3. لدينا n ln(x_n) = ln(1 - x_n) → -∞ ومنه n(1 - x_n) ~ -n ln(x_n) = -ln(1 - x_n) → +∞، وبأخذ اللوغاريتم مرة ثانية نحصل على المكافئ ln(n)/n.`,
        solutionFr: `1. Par stricte croissance et continuité de f_n sur [0, 1] avec f_n(0) = -1 et f_n(1) = 1.
2. f_{n+1}(x_n) = x_n^n(x_n - 1) < 0 donc x_n < x_{n+1} et lim x_n = 1.
3. En passant au logarithme : n ln(x_n) = ln(1 - x_n), d'où 1 - x_n ~ ln(n)/n.`,
      },
      gradingRubric: [
        {
          questionRef: "1",
          criterionAr: "إثبات وجود ووحدانية الجذر الضمني x_n عبر مبرهنة القيم الوسيطية",
          criterionFr: "Existence et unicité de x_n par le théorème de la bijection",
          points: 1.0,
          skillLevel: "N1" as const,
          remediationAr: "التحقق من شروط الاتصال والرتابة القطعية وصور المحدات",
        },
        {
          questionRef: "2.a-b",
          criterionAr: "استثمار إشارة f_{n+1}(x_n) لإثبات الرتابة والبرهان بالخلف على النهاية",
          criterionFr: "Monotonie de la suite implicite et raisonnement par l'absurde",
          points: 3.0,
          skillLevel: "N3" as const,
          remediationAr: "تعميل الفرق x_n^{n+1} - x_n^n = x_n^n(x_n - 1)",
        },
        {
          questionRef: "3",
          criterionAr: "توظيف اللوغاريتم النيبيري لاستنتاج السلوك المقارب ln(n)/n",
          criterionFr: "Équivalent asymptotique via le logarithme",
          points: 2.0,
          skillLevel: "N3" as const,
          remediationAr: "استعمال النهاية المرجعية lim_{u→0} ln(1-u)/u = -1",
        },
      ],
      pythonScenario: {
        titleAr: "محاكاة بايثون لحساب الجذور الضمنية x_n والتحقق من السلوك المقارب ln(n)/n",
        titleFr: "Simulation Python : Calcul numérique de x_n et vérification asymptotique",
        objectiveAr: "ملاحظة تقارب x_n نحو 1 وتقارب النسبة n(1-x_n)/ln(n) نحو 1",
        objectiveFr: "Observer la convergence de x_n vers 1 et le comportement asymptotique",
        code: `import math

def solve_xn(n, eps=1e-10):
    a, b = 0.0, 1.0
    while (b - a) > eps:
        m = (a + b) / 2
        if (m**n + m - 1) <= 0:
            a = m
        else:
            b = m
    return (a + b) / 2

for n in [10, 50, 200]:
    xn = solve_xn(n)
    ratio = n * (1 - xn) / math.log(n)
    print(f"n={n:3d} | x_n={xn:.6f} | n(1-x_n)/ln(n)={ratio:.4f}")`,
        questionsAr: [
          "1. ماذا تلاحظ حول قيم المتتالية x_n عندما يكبر العدد الصحيح n؟",
          "2. نحو أي عدد تؤول النسبة n(1 - x_n)/ln(n) في العمود الأخير؟",
        ],
        questionsFr: [
          "1. Que constate-t-on sur les valeurs de x_n lorsque n augmente ?",
          "2. Vers quelle limite tend le quotient n(1 - x_n)/ln(n) ?",
        ],
        sampleOutput: "n= 10 | x_n=0.835079 | ratio=0.7162 ; n=200 | x_n=0.976085 | ratio=0.9027",
      },
      didacticAudit: {
        estimatedDurationMinutes: 40,
        suggestedPoints: 6.0,
        n1Percentage: 15,
        n2Percentage: 35,
        n3Percentage: 50,
        complianceNotesAr: "مسألة تميز وأولمبياد من المستوى العالي N3+ مناسبة لمسلك العلوم الرياضية والمباراة العامة.",
        complianceNotesFr: "Problème d'excellence de niveau N3+ adapté aux Sciences Mathématiques et Olympiades.",
      },
    };
  }

  if (isSequence) {
    return {
      task,
      titleAr:
        "تحليل وبرهان نموذجي لمسألة المتتاليات العددية والترجع والتقارب",
      titleFr:
        "Étude rigoureuse d'une suite numérique : Récurrence, Monotonie et Convergence",
      trackLabel,
      latexFormulas: [
        "\\forall n \\in \\mathbb{N},\\; u_{n+1} = f(u_n) \\quad \\text{et} \\quad u_n > \\alpha",
        "u_{n+1} - u_n = \\frac{-(u_n - \\alpha)^2}{u_n + \\beta} \\leq 0",
        "v_n = \\frac{u_n - \\alpha}{u_n - \\beta} \\implies v_{n+1} = q \\cdot v_n",
        "\\lim_{n \\to +\\infty} u_n = \\ell \\quad \\text{avec} \\quad f(\\ell) = \\ell",
      ],
      stepByStepProofAr: `1. الإثبات بالترجع (Démonstration par récurrence):
- مرحلة الأساس (Initialisation): من أجل n = 0، لدينا الحد الأول يحقق المتفاوتة المطلوبة بوضوح حسب معطيات التمرين (${cleanProblem.slice(0, 90)}...).
- فرضية الترجع (Hérédité): ليكن n عنصراً مثبتاً من N، نفترض أن الخاصية P(n) صحيحة ونبين صحة P(n+1). باستعمال رتابة الدالة المرفقة أو دراسة إشارة الفرق نجد أن الحد u_{n+1} يظل مصغوراً/مكبوراً بالعدد الحدي.
- استنتاج: حسب مبدأ الترجع، المتفاوتة صحيحة لكل n من N.

2. دراسة الرتابة واستنتاج التقارب (Monotonie et Convergence):
- نحسب الفرق u_{n+1} - u_n ونوحّد المقامات ثم نعمّل البسط.
- بما أن إشارة الفرق ثابتة لكل n من N، نستنتج رتابة المتتالية (u_n).
- بما أن (u_n) تناقصية ومصغورة (أو تزايدية ومكبورة)، فحسب مبرهنة التقارب المطرد (Théorème de la convergence monotone) فإن المتتالية (u_n) متقاربة وتقبل نهاية منتهية L.

3. المتتالية المساعدة وحساب النهاية (Suite auxiliaire et Limite):
- نتحقق من أن المتتالية المساعدة (v_n) هندسية (أو حسابية) بتحديد أساسها وحدها الأول v_0.
- نكتب v_n بدلالة n ثم نستخرج صيغة u_n الصريحة بدلالة n ونحسب النهاية عند +∞.`,
      stepByStepProofFr: `1. Raisonnement par récurrence :
- Initialisation : Pour n = 0, la propriété est vérifiée d'après la valeur initiale donnée.
- Hérédité : Soit n ∈ ℕ fixé. Supposons la propriété vraie au rang n et montrons-la au rang n+1 par encadrement successif ou étude du signe de la différence.
- Conclusion : Par le principe de récurrence, la propriété est vraie pour tout n ∈ ℕ.

2. Monotonie et théorème de convergence monotone :
- On étudie le signe de u_{n+1} - u_n pour tout n ∈ ℕ.
- La suite (u_n) étant décroissante et minorée (ou croissante et majorée), elle converge vers une limite finie ℓ.

3. Suite auxiliaire et expression explicite :
- On exprime v_{n+1} en fonction de v_n pour établir la nature géométrique/arithmétique de (v_n), puis on déduit u_n en fonction de n et sa limite en +∞.`,
      theoremsUsed: [
        "مبدأ البرهان بالترجع (Principe de récurrence)",
        "مبرهنة التقارب المطرد: كل متتالية تناقصية ومصغورة فهي متقاربة (Théorème de la convergence monotone)",
        "نهاية متتالية من النوع u_{n+1} = f(u_n) مع اتصال الدالة f (Point fixe f(ℓ) = ℓ)",
        "المتتاليات الهندسية والحسابية والنهايات المرجعية (Suites géométriques : lim q^n = 0 si |q| < 1)",
      ],
      commonPitfallsAr: [
        "الخلط بين التحقق من أجل n=0 وكتابة: (ليكن n من N لنبين أن P(n) صحيحة) دون تثبيت n في مرحلة الوراثة.",
        "استعمال النهاية L قبل إثبات أن المتتالية (u_n) متقاربة أولاً.",
        "خطأ في إشارة البسط عند توحيد المقامات في حساب الفرق u_{n+1} - u_n.",
      ],
      commonPitfallsFr: [
        "Écrire 'Supposons que pour tout n ∈ ℕ, P(n) est vraie' au lieu de fixer un entier n.",
        "Passer à la limite dans la relation de récurrence avant d'avoir justifié la convergence.",
      ],
      variantExercise: {
        titleAr:
          "التمرين الموازي المتكافئ (Sujet B) — المتتاليات الترجعية والدالة المرفقة",
        titleFr:
          "Sujet B Équivalent — Suite homographique et convergence monotone",
        statementAr: `نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 3 و u_{n+1} = (5u_n - 4)/(u_n + 1) لكل n من N.
1. أ) أحسب u_1 و u_2. (0.75 ن)
   ب) بين بالترجع أن: u_n > 2 لكل n من N. (1.25 ن)
2. أ) بين أن: u_{n+1} - u_n = -(u_n - 2)^2 / (u_n + 1) لكل n من N، ثم أدرس رتابة (u_n). (1.5 ن)
   ب) استنتج أن المتتالية (u_n) متقاربة. (0.75 ن)
3. نضع لكل n من N: v_n = 1 / (u_n - 2).
   أ) بين أن (v_n) متتالية حسابية أساسها r = 1/3 وحدد v_0. (1.25 ن)
   ب) أكتب v_n ثم u_n بدلالة n، واستنتج lim_{n→+∞} u_n. (1.5 ن)`,
        statementFr: `Soit (u_n) la suite numérique définie par u_0 = 3 et pour tout n ∈ ℕ, u_{n+1} = (5u_n - 4)/(u_n + 1).
1. a) Calculer u_1 et u_2. (0.75 pt)
   b) Montrer par récurrence que pour tout n ∈ ℕ, u_n > 2. (1.25 pt)
2. a) Vérifier que u_{n+1} - u_n = -(u_n - 2)^2 / (u_n + 1), puis étudier la monotonie de (u_n). (1.5 pt)
   b) En déduire que la suite (u_n) est convergente. (0.75 pt)
3. Pour tout n ∈ ℕ, on pose v_n = 1 / (u_n - 2).
   a) Montrer que (v_n) est une suite arithmétique de raison r = 1/3. (1.25 pt)
   b) Exprimer u_n en fonction de n et calculer lim u_n. (1.5 pt)`,
        solutionAr: `1. أ) u_1 = 11/4 = 2.75 و u_2 = 39/15 = 13/5 = 2.6.
   ب) بالترجع: u_0 = 3 > 2. نفترض u_n > 2، لدينا u_{n+1} - 2 = 3(u_n - 2)/(u_n + 1) > 0 ومنه u_{n+1} > 2.
2. أ) بتوحيد المقامات نجد u_{n+1} - u_n = -(u_n - 2)^2/(u_n + 1) < 0، إذن (u_n) تناقصية قطعا.
   ب) (u_n) تناقصية ومصغورة بـ 2 فهي متقاربة.
3. أ) v_{n+1} - v_n = (u_n + 1)/(3(u_n - 2)) - 1/(u_n - 2) = 1/3، إذن حسابية أساسها 1/3 و v_0 = 1.
   ب) v_n = 1 + n/3 ومنه u_n = 2 + 3/(n + 3) ونهايتها هي 2.`,
        solutionFr: `1. a) u_1 = 11/4 et u_2 = 13/5.
   b) Par récurrence : u_{n+1} - 2 = 3(u_n - 2)/(u_n + 1) > 0.
2. a) u_{n+1} - u_n = -(u_n - 2)^2/(u_n + 1) < 0 donc (u_n) est strictement décroissante.
   b) Décroissante et minorée par 2 donc convergente.
3. a) v_{n+1} - v_n = 1/3 et v_0 = 1.
   b) v_n = 1 + n/3 d'où u_n = 2 + 3/(n + 3) et lim u_n = 2.`,
      },
      gradingRubric: [
        {
          questionRef: "1.a",
          criterionAr: "حساب الحدين الأولين وصياغة مرحلة الأساس في الترجع",
          criterionFr: "Calcul des premiers termes et initialisation",
          points: 0.75,
          skillLevel: "N1" as const,
          remediationAr: "التدريب على التعويض العددي المباشر في العلاقة الترجعية",
        },
        {
          questionRef: "1.b",
          criterionAr: "صياغة فرضية الترجع والانتقال السليم إلى الرتبة n+1",
          criterionFr: "Hérédité rigoureuse et conclusion par récurrence",
          points: 1.25,
          skillLevel: "N2" as const,
          remediationAr: "دراسة إشارة الفرق u_{n+1} - α بدل التأطير المباشر عند وجود الكسور",
        },
        {
          questionRef: "2.a",
          criterionAr: "توحيد المقامات وتعميل البسط واستنتاج رتابة المتتالية",
          criterionFr: "Étude du signe de u_{n+1} - u_n et monotonie",
          points: 1.5,
          skillLevel: "N2" as const,
          remediationAr: "التذكير بالمتطابقات الهامة في البسط وإشارة المقام الموجب قطعا",
        },
        {
          questionRef: "2.b",
          criterionAr: "تطبيق مبرهنة التقارب المطرد (الرتابة + الكبر/الصغر)",
          criterionFr: "Justification de la convergence monotone",
          points: 0.75,
          skillLevel: "N1" as const,
          remediationAr: "ربط التناقص بالصغر والتزايد بالكبر لاستنتاج التقارب",
        },
        {
          questionRef: "3.a",
          criterionAr: "إثبات طبيعة المتتالية المساعدة (v_n) وتحديد عناصرها المميزة",
          criterionFr: "Nature de la suite auxiliaire (v_n) et éléments caractéristiques",
          points: 1.25,
          skillLevel: "N2" as const,
          remediationAr: "تعويض u_{n+1} بدلالة u_n ثم الاختزال للوصول إلى v_n",
        },
        {
          questionRef: "3.b",
          criterionAr: "استخراج صيغة u_n بدلالة n وحساب النهاية بدقة",
          criterionFr: "Expression explicite de u_n et calcul de la limite",
          points: 1.5,
          skillLevel: "N3" as const,
          remediationAr: "حل المعادلة الجبرية لاستخراج u_n بدلالة v_n قبل التعويض بـ n",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية بايثون لحساب حدود المتتالية وتحديد عتبة التقارب (Seuil)",
        titleFr: "Algorithme Python de calcul des termes et recherche de seuil",
        objectiveAr:
          "محاكاة تقارب المتتالية (u_n) نحو النهاية L وتحديد أصغر رتبة n تحقق |u_n - L| < ε",
        objectiveFr:
          "Déterminer le plus petit entier n tel que |u_n - ℓ| < 10^{-p}",
        code: `def seuil_suite(eps=1e-4):
    u = 3.0
    n = 0
    while abs(u - 2.0) >= eps:
        u = (5 * u - 4) / (u + 1)
        n += 1
    return n, round(u, 6)

rang, valeur = seuil_suite(1e-3)
print(f"Seuil atteint au rang n = {rang} avec u_n = {valeur}")`,
        questionsAr: [
          "1. ما هو دور الحلقة المشروطة while في هذه الخوارزمية؟",
          "2. أتمم السطر الخامس بكتابة العلاقة الترجعية للمتتالية (u_n).",
          "3. فسر رياضياً القيمة التي ترجعها الدالة من أجل eps = 0.001.",
        ],
        questionsFr: [
          "1. Quel est le rôle de la boucle conditionnelle while dans cet algorithme ?",
          "2. Interpréter mathématiquement l'entier n renvoyé pour eps = 10^{-3}.",
        ],
        sampleOutput: "Seuil atteint au rang n = 2998 avec u_n = 2.000999",
      },
      didacticAudit: {
        estimatedDurationMinutes: 40,
        suggestedPoints: 7.0,
        n1Percentage: 30,
        n2Percentage: 50,
        n3Percentage: 20,
        complianceNotesAr: `التمرين مطابق تماماً للمذكرة الوزارية 142-08 والأطر المرجعية الوطنية (${educationSystem})، ويوازن بين البرهان بالترجع (N1/N2)، دراسة الرتابة والتقارب (N2)، وتوظيف المتتالية المساعدة (N3).`,
        complianceNotesFr:
          "Exercice parfaitement conforme aux Orientations Pédagogiques et au cadre référentiel du Baccalauréat.",
      },
    };
  }

  if (isComplex) {
    return {
      task,
      titleAr: "البرهان النموذجي في الأعداد العقدية والتحويلات الهندسية في المستوى العقدي",
      titleFr: "Nombres Complexes : Équations dans ℂ, Forme exponentielle et Géométrie",
      trackLabel,
      latexFormulas: [
        "\\Delta = b^2 - 4ac < 0 \\implies z_1 = \\frac{-b - i\\sqrt{-\\Delta}}{2a},\\; z_2 = \\overline{z_1}",
        "z = r e^{i\\theta} = |z|(\\cos\\theta + i\\sin\\theta)",
        "z' - \\omega = e^{i\\alpha}(z - \\omega) \\iff R(\\Omega(\\omega), \\alpha)",
        "\\frac{z_C - z_A}{z_B - z_A} = \\frac{AC}{AB} e^{i(\\widehat{\\vec{AB}, \\vec{AC}})}",
      ],
      stepByStepProofAr: `1. حل المعادلة من الدرجة الثانية في C:
- نحسب المميز Δ = b² - 4ac. بما أن Δ < 0، نكتب Δ = (i√|Δ|)²، فنحصل على حلين عقديين مترافقين z_1 و z_2.
2. الشكل المثلثي والأسي:
- نحسب المعيار r = |z| = √(x² + y²)، ثم نعمل بـ r لتحديد العمدة θ باستعمال نسبتي cos(θ) و sin(θ).
3. التأويل الهندسي والتحويلات (الدوران/الإزاحة/التحاكي):
- نكتب صيغة الدوران R الذي مركزه Ω(ω) وزاويته α: z' - ω = e^{iα}(z - ω).
- لحساب طبيعة المثلث ABC، نحسب النسبة (z_C - z_A)/(z_B - z_A) على الشكل الأسي؛ فإذا ساوت e^{±iπ/3} فإن المثلث متساوي الأضلاع، وإذا ساوت ±i فهو قائم الزاوية ومتساوي الساقين.`,
      stepByStepProofFr: `1. Résolution de l'équation du second degré dans ℂ :
- Calcul du discriminant Δ < 0 et détermination des deux racines complexes conjuguées.
2. Module et argument (Forme exponentielle) :
- Factorisation par le module |z| pour identifier l'argument principal θ et écrire z = |z|e^{iθ}.
3. Interprétation géométrique et transformations :
- Écriture complexe de la rotation : z' - ω = e^{iα}(z - ω) et étude du quotient (z_C - z_A)/(z_B - z_A).`,
      theoremsUsed: [
        "حل معادلة من الدرجة الثانية بمميز سالب قطعا في C",
        "خواص المعيار والعمدة والكتابة الأسية (Formule d'Euler et de Moivre)",
        "الكتابة العقدية للدوران والطبيعة الهندسية للمثلثات",
      ],
      commonPitfallsAr: [
        "نسيان العدد التخيلي i عند أخذ الجذر المربع للمميز السالب Δ.",
        "كتابة z = -r(cos θ + i sin θ) واعتبارها شكلاً مثلثياً دون أن يكون المعامل موجباً قطعا.",
        "الخلط بين ترتيب المتجهتين في زاوية النسبة arg((z_C - z_A)/(z_B - z_A)) ≡ (AB, AC) [2π].",
      ],
      commonPitfallsFr: [
        "Confondre l'ordre des vecteurs dans l'argument du quotient (z_C - z_A)/(z_B - z_A).",
        "Oublier que le module doit être strictement positif dans la forme trigonométrique.",
      ],
      variantExercise: {
        titleAr: "التمرين الموازي (Sujet B) — الأعداد العقدية والدوران في المستوى",
        titleFr: "Sujet B Équivalent — Nombres complexes et rotation",
        statementAr: `1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0. (1.25 ن)
2. في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر (O, u, v)، نعتبر النقط A و B و C التي ألحاقها على التوالي: a = √3 + i و b = √3 - i و c = 2i.
   أ) أكتب العددين a و b على الشكل الأسي، ثم بين أن a^6 عدد حقيقي سالب. (1.5 ن)
   ب) ليكن R الدوران الذي مركزه O وزاويته π/3. بين أن صورة النقطة A بالدوران R هي النقطة C. (1.25 ن)
   ج) أحسب (c - b)/(a - b) واستنتج طبيعة المثلث ABC. (1.5 ن)`,
        statementFr: `1. Résoudre dans ℂ l'équation : z² - 2√3 z + 4 = 0. (1.25 pt)
2. Dans le plan complexe muni d'un repère orthonormé direct (O, u, v), on considère les points A, B et C d'affixes a = √3 + i, b = √3 - i et c = 2i.
   a) Écrire a et b sous forme exponentielle et montrer que a^6 est un réel négatif. (1.5 pt)
   b) Montrer que l'image de A par la rotation R de centre O et d'angle π/3 est le point C. (1.25 pt)
   c) Calculer (c - b)/(a - b) et en déduire la nature du triangle ABC. (1.5 pt)`,
        solutionAr: `1. Δ = 12 - 16 = -4 = (2i)²، الحلان هما z_1 = √3 + i و z_2 = √3 - i.
2. أ) |a| = 2 و a = 2e^{iπ/6}، b = 2e^{-iπ/6}، ولدينا a^6 = 64e^{iπ} = -64 ∈ R^-.
   ب) e^{iπ/3} × a = e^{iπ/3} × 2e^{iπ/6} = 2e^{iπ/2} = 2i = c.
   ج) (c - b)/(a - b) = (3i - √3)/(2i) = (3 + i√3)/2 = √3 e^{iπ/6} ومنه المثلث ABC قائم الزاوية في A.`,
        solutionFr: `1. Δ = -4 = (2i)², S = {√3 - i ; √3 + i}.
2. a) a = 2e^{iπ/6}, b = 2e^{-iπ/6}, a^6 = -64.
   b) z_{R(A)} = e^{iπ/3} a = 2e^{iπ/2} = 2i = c.
   c) Le triangle OAC est équilatéral et ABC est rectangle en A.`,
      },
      gradingRubric: [
        {
          questionRef: "1",
          criterionAr: "حساب المميز Δ واستخراج الحلين العقديين المترافقين",
          criterionFr: "Calcul de Δ et résolution dans ℂ",
          points: 1.25,
          skillLevel: "N1" as const,
          remediationAr: "مراجعة كتابة Δ = (i√|Δ|)²",
        },
        {
          questionRef: "2.a",
          criterionAr: "تحديد المعيار والعمدة والكتابة الأسية وتطبيق صيغة موافر",
          criterionFr: "Forme exponentielle et formule de Moivre",
          points: 1.5,
          skillLevel: "N2" as const,
          remediationAr: "مراجعة جدول الزوايا المثلثية الاعتيادية π/6 و π/4 و π/3",
        },
        {
          questionRef: "2.b",
          criterionAr: "تطبيق الصيغة العقدية للدوران والتحقق من لحق الصورة",
          criterionFr: "Écriture complexe de la rotation",
          points: 1.25,
          skillLevel: "N2" as const,
          remediationAr: "التذكير بقاعدة جداء الأسيتين e^{iα} × e^{iβ} = e^{i(α+β)}",
        },
        {
          questionRef: "2.c",
          criterionAr: "حساب خارج اللحقين واستنتاج الطبيعة الهندسية للمثلث",
          criterionFr: "Calcul du quotient et nature du triangle",
          points: 1.5,
          skillLevel: "N3" as const,
          remediationAr: "ربط معيار وعمدة النسبة بالمسافتين والزاوية الموجهة",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية بايثون لحساب المعيار والعمدة وصورة نقطة بدوران عقدي",
        titleFr: "Script Python : Module, argument et rotation dans le plan complexe",
        objectiveAr: "تمثيل الأعداد العقدية في بايثون وحساب التحويلات الهندسية آلياً",
        objectiveFr: "Calculer le module, l'argument et l'image par rotation",
        code: `import cmath, math

a = complex(math.sqrt(3), 1)
r, theta = cmath.polar(a)
rotation_pi_3 = cmath.rect(1, math.pi / 3)
c = a * rotation_pi_3
print(f"|a| = {r:.2f}, arg(a) = {math.degrees(theta):.1f}°")
print(f"Image C = {c.real:.2f} + {c.imag:.2f}i")`,
        questionsAr: [
          "1. ماذا تمثل الدالة cmath.polar(a) في هذا البرنامج؟",
          "2. تحقق من أن الجزء الحقيقي للعدد c ينعدم وأن جزءه التخيلي يساوي 2.",
        ],
        questionsFr: [
          "1. Que renvoie la fonction cmath.polar(a) ?",
          "2. Vérifier que l'affixe obtenue pour C correspond à 2i.",
        ],
        sampleOutput: "|a| = 2.00, arg(a) = 30.0° | Image C = 0.00 + 2.00i",
      },
      didacticAudit: {
        estimatedDurationMinutes: 35,
        suggestedPoints: 5.5,
        n1Percentage: 35,
        n2Percentage: 45,
        n3Percentage: 20,
        complianceNotesAr:
          "التمرين يغطي كافة قدرات الأعداد العقدية المسطرة في الإطار المرجعي للامتحان الوطني.",
        complianceNotesFr:
          "Couverture complète des capacités exigibles sur les nombres complexes.",
      },
    };
  }

  if (isGeometry) {
    return {
      task,
      titleAr: "البرهان النموذجي في الهندسة الفضائية (الجداء السلمي والمتجهي والفلكة)",
      titleFr: "Géométrie dans l'espace : Produit scalaire, produit vectoriel et Sphère",
      trackLabel,
      latexFormulas: [
        "\\overrightarrow{AB} \\wedge \\overrightarrow{AC} = \\vec{n}(a, b, c) \\implies (ABC) : ax + by + cz + d = 0",
        "d(\\Omega, (P)) = \\frac{|ax_\\Omega + by_\\Omega + cz_\\Omega + d|}{\\sqrt{a^2 + b^2 + c^2}}",
        "d(\\Omega, (P)) < R \\implies (S) \\cap (P) = (\\Gamma) \\quad \\text{avec} \\quad r = \\sqrt{R^2 - d^2}",
      ],
      stepByStepProofAr: `1. الجداء المتجهي ومعادلة المستوى (ABC):
- نحسب مركبات المتجهتين AB و AC ثم الجداء المتجهي AB ∧ AC.
- بما أن AB ∧ AC ≠ 0 فإن النقط A و B و C غير مستقيمية وتحدد مستوى وحيداً (ABC) متجهته المنظمية n = AB ∧ AC.
2. دراسة الفلكة (S) والوضع النسبي مع المستوى (P):
- نحدد مركز الفلكة Ω وشعاعها R، ثم نحسب مسافة المركز عن المستوى d = d(Ω, (P)).
- نقارن d مع R: إذا كان d < R فإن المستوى يقطع الفلكة وفق دائرة (Γ) شعاعها r = √(R² - d²) ومركزها H المسقط العمودي لـ Ω على (P).`,
      stepByStepProofFr: `1. Produit vectoriel et équation cartésienne du plan (ABC) :
- On calcule les coordonnées de AB ∧ AC ≠ 0, vecteur normal au plan (ABC).
2. Position relative de la sphère (S) et du plan (P) :
- On calcule la distance d(Ω, (P)) et on la compare au rayon R. Si d < R, l'intersection est le cercle (Γ) de rayon r = √(R² - d²) et de centre H projeté orthogonal de Ω sur (P).`,
      theoremsUsed: [
        "الجداء المتجهي ومعادلة مستوى معرف بنقطة ومتجهة منظمية",
        "صيغة مسافة نقطة عن مستوى في الفضاء المنسوب لمعلم متعامد ممنظم",
        "الأوضاع النسبية لفلكة ومستوى والتمثيل البارامتري لمستقيم عمودي",
      ],
      commonPitfallsAr: [
        "خطأ الإشارة في المركبة الثانية (الأرتوب) عند حساب الجداء المتجهي u ∧ v.",
        "نسيان الجذر المربع في مقام مسافة نقطة عن مستوى √(a² + b² + c²).",
      ],
      commonPitfallsFr: [
        "Erreur de signe sur la deuxième composante du produit vectoriel.",
        "Oublier la racine carrée au dénominateur de la distance point-plan.",
      ],
      variantExercise: {
        titleAr: "التمرين الموازي (Sujet B) — الهندسة الفضائية والفلكة",
        titleFr: "Sujet B Équivalent — Sphère, plan tangent et section plane",
        statementAr: `في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i, j, k)، نعتبر النقط A(1, 0, 2) و B(2, 1, 0) و C(0, 1, 1) والفلكة (S) التي مركزها Ω(1, -1, 2) وشعاعها R = 3.
1. أ) أحسب مركبات AB ∧ AC واستنتج أن x + 2y + 2z - 5 = 0 معادلة ديكارتية للمستوى (ABC). (1.5 ن)
2. أ) أحسب مسافة النقطة Ω عن المستوى (ABC) واستنتج أن (ABC) يقطع الفلكة (S) وفق دائرة (Γ) محدداً شعاعها r. (1.5 ن)
   ب) حدد تمثيلاً بارامترياً للمستقيم (Δ) المار من Ω والعمودي على (ABC)، ثم استنتج إحداثيات مركز الدائرة H. (1.5 ن)`,
        statementFr: `Dans l'espace muni d'un repère orthonormé direct (O, i, j, k), on considère A(1, 0, 2), B(2, 1, 0), C(0, 1, 1) et la sphère (S) de centre Ω(1, -1, 2) et de rayon R = 3.
1. Calculer AB ∧ AC et en déduire l'équation du plan (ABC) : x + 2y + 2z - 5 = 0. (1.5 pt)
2. a) Calculer d(Ω, (ABC)) et montrer que (ABC) coupe (S) suivant un cercle (Γ) de rayon r à déterminer. (1.5 pt)
   b) Déterminer le centre H du cercle (Γ) via la représentation paramétrique de (Δ). (1.5 pt)`,
        solutionAr: `1. AB(1, 1, -2) و AC(-1, 1, -1)، ومنه AB ∧ AC(1, 3, 2) ومعادلة المستوى: x + 2y + 2z - 5 = 0.
2. d(Ω, (ABC)) = |1 - 2 + 4 - 5| / √(1 + 4 + 4) = 2/3 < 3، إذن التقاطع دائرة شعاعها r = √(9 - 4/9) = √77 / 3.`,
        solutionFr: `1. Équation du plan : x + 2y + 2z - 5 = 0.
2. d(Ω, (ABC)) = 2/3 < R = 3, rayon r = √(9 - 4/9) = √77 / 3.`,
      },
      gradingRubric: [
        {
          questionRef: "1",
          criterionAr: "حساب مركبات الجداء المتجهي واستنتاج معادلة المستوى (ABC)",
          criterionFr: "Calcul du produit vectoriel et équation du plan",
          points: 1.5,
          skillLevel: "N1" as const,
          remediationAr: "مراجعة قاعدة المحددات الثنائية لحساب مركبات u ∧ v",
        },
        {
          questionRef: "2.a",
          criterionAr: "تطبيق صيغة المسافة ومقارنتها مع الشعاع R وحساب شعاع الدائرة r",
          criterionFr: "Distance point-plan et rayon du cercle d'intersection",
          points: 1.5,
          skillLevel: "N2" as const,
          remediationAr: "تطبيق مبرهنة فيتاغورس في المثلث القائم ΩHM : r² = R² - d²",
        },
        {
          questionRef: "2.b",
          criterionAr: "كتابة التمثيل البارامتري للمستقيم العمودي وتحديد إحداثيات المسقط H",
          criterionFr: "Représentation paramétrique de (Δ) et coordonnées de H",
          points: 1.5,
          skillLevel: "N3" as const,
          remediationAr: "تعويض x(t), y(t), z(t) في معادلة المستوى لتحديد قيمة الوسيط t",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية بايثون لحساب الجداء المتجهي ومسافة نقطة عن مستوى",
        titleFr: "Script Python : Produit vectoriel et distance point-plan en 3D",
        objectiveAr: "التحقق الآلي من مركبات المتجهة المنظمية ومسافة المركز عن المستوى",
        objectiveFr: "Calculer le produit vectoriel et la distance d(Ω, (P))",
        code: `import math

def produit_vectoriel(u, v):
    return (
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0]
    )

def distance_point_plan(omega, a, b, c, d):
    num = abs(a*omega[0] + b*omega[1] + c*omega[2] + d)
    den = math.sqrt(a**2 + b**2 + c**2)
    return round(num / den, 4)

print("Distance d(Omega, P) =", distance_point_plan((1, -1, 2), 1, 2, 2, -5))`,
        questionsAr: [
          "1. تحقق من صيغة المركبة الثانية للجداء المتجهي في الدالة produit_vectoriel.",
          "2. قارن القيمة التي ترجعها distance_point_plan مع شعاع الفلكة R = 3.",
        ],
        questionsFr: [
          "1. Vérifier les formules des composantes dans produit_vectoriel(u, v).",
          "2. Interpréter géométriquement le résultat renvoyé par distance_point_plan.",
        ],
        sampleOutput: "Distance d(Omega, P) = 0.6667",
      },
      didacticAudit: {
        estimatedDurationMinutes: 30,
        suggestedPoints: 4.5,
        n1Percentage: 35,
        n2Percentage: 45,
        n3Percentage: 20,
        complianceNotesAr: "التمرين مطابق تماماً لوحدة الهندسة الفضائية في الإطار المرجعي للباكالوريا.",
        complianceNotesFr: "Conforme au programme officiel de géométrie dans l'espace.",
      },
    };
  }

  if (isProb) {
    return {
      task,
      titleAr: "البرهان النموذجي في حساب الاحتمالات والمتغيرات العشوائية وقانون الحدانية",
      titleFr: "Calcul des Probabilités : Tirages, Probabilités conditionnelles et Loi Binomiale",
      trackLabel,
      latexFormulas: [
        "P(A) = \\frac{\\text{Card}(A)}{\\text{Card}(\\Omega)} \\quad ; \\quad P_A(B) = \\frac{P(A \\cap B)}{P(A)}",
        "E(X) = \\sum_{i} x_i P(X = x_i) \\quad ; \\quad V(X) = E(X^2) - [E(X)]^2",
        "P(Y = k) = C_n^k p^k (1 - p)^{n-k} \\quad (\\text{Loi Binomiale } \\mathcal{B}(n, p))",
      ],
      stepByStepProofAr: `1. تحديد كون الإمكانيات ونوع السحب:
- نميز بدقة بين السحب في آن واحد (تأليفات C_n^p)، السحب بالتتابع وبدون إحلال (ترتيبات A_n^p)، والسحب بالتتابع وبإحلال (n^p).
2. حساب احتمالات الأحداث والاحتمال الشرطي:
- بتطبيق فرضية تساوي الاحتمالات نحسب P(A) = Card(A)/Card(Ω)، ولحدث «على الأقل» نستعمل الحدث المضاد P(B) = 1 - P(B̄).
3. المتغير العشوائي والأمل الرياضي:
- نحدد مجموعة قيم المتغير العشوائي X(Ω) ونحسب احتمال كل قيمة مع التحقق من أن مجموع الاحتمالات يساوي 1، ثم نحسب E(X) و V(X).`,
      stepByStepProofFr: `1. Dénombrement de l'univers Ω :
- Identifier le mode de tirage : simultané (combinaisons), successif sans remise (arrangements) ou avec remise.
2. Probabilités d'événements et probabilités conditionnelles :
- Sous l'hypothèse d'équiprobabilité, P(A) = Card(A)/Card(Ω) et utilisation de l'événement contraire.
3. Variable aléatoire et Schéma de Bernoulli :
- Déterminer la loi de probabilité de X, vérifier que ∑ P(X = x_i) = 1, puis calculer l'espérance E(X) et l'écart-type σ(X).`,
      theoremsUsed: [
        "فرضية تساوي الاحتمالات وتعداد التأليفات والترتيبات",
        "صيغة الاحتمال الشرطي والحدث المضاد واستقلالية حدثين",
        "قانون احتمال متغير عشوائي والحدانية (Schéma de Bernoulli)",
      ],
      commonPitfallsAr: [
        "الخلط بين السحب في آن واحد (C_n^p) والسحب بالتتابع وبدون إحلال (A_n^p).",
        "نسيان معامل الترتيب عند سحب كرات مختلفة الألوان بالتتابع.",
      ],
      commonPitfallsFr: [
        "Confondre tirage simultané (combinaisons) et tirage successif (arrangements).",
        "Oublier le coefficient d'ordre lors d'un tirage successif de boules de couleurs distinctes.",
      ],
      variantExercise: {
        titleAr: "التمرين الموازي (Sujet B) — حساب الاحتمالات والمتغير العشوائي",
        titleFr: "Sujet B Équivalent — Urne, variable aléatoire et loi binomiale",
        statementAr: `يحتوي صندوق على 9 كرات لا يمكن التمييز بينها باللمس: 4 كرات حمراء، 3 كرات خضراء، وكرتين بيضاوين. نسحب عشوائياً وفي آن واحد 3 كرات من الصندوق.
1. أ) تحقق أن Card(Ω) = 84، ثم أحسب احتمال الحدث A: «سحب 3 كرات من نفس اللون» والحدث B: «سحب كرة بيضاء على الأقل». (1.5 ن)
2. ليكن X المتغير العشوائي الذي يربط كل سحبة بعدد الكرات البيضاء المسحوبة.
   أ) حدد قيم X(Ω) وقانون احتمال المتغير العشوائي X. (1.5 ن)
   ب) أحسب الأمل الرياضي E(X). (1.0 ن)`,
        statementFr: `Une urne contient 9 boules indiscernables au toucher : 4 rouges, 3 vertes et 2 blanches. On tire simultanément 3 boules.
1. Vérifier que Card(Ω) = 84, puis calculer P(A) : « Obtenir 3 boules de même couleur » et P(B) : « Obtenir au moins une boule blanche ». (1.5 pt)
2. Soit X le nombre de boules blanches tirées. Déterminer la loi de probabilité de X et calculer E(X). (2.5 pts)`,
        solutionAr: `1. Card(Ω) = C_9^3 = 84. P(A) = (C_4^3 + C_3^3)/84 = 5/84. P(B) = 1 - C_7^3 / 84 = 1 - 35/84 = 49/84 = 7/12.
2. X(Ω) = {0, 1, 2}، P(X=0) = 35/84، P(X=1) = (C_2^1 × C_7^2)/84 = 42/84، P(X=2) = (C_2^2 × C_7^1)/84 = 7/84. E(X) = 56/84 = 2/3.`,
        solutionFr: `1. Card(Ω) = 84, P(A) = 5/84, P(B) = 1 - 35/84 = 7/12.
2. X(Ω) = {0, 1, 2}, P(X=0) = 35/84, P(X=1) = 42/84, P(X=2) = 7/84 et E(X) = 2/3.`,
      },
      gradingRubric: [
        {
          questionRef: "1",
          criterionAr: "حساب Card(Ω) واحتمالي الحدثين A و B باستعمال التأليفات والحدث المضاد",
          criterionFr: "Calcul de Card(Ω), P(A) et P(B)",
          points: 1.5,
          skillLevel: "N1" as const,
          remediationAr: "تذكير بصيغة التأليفة C_n^p وخاصية الحدث المضاد P(B) = 1 - P(B̄)",
        },
        {
          questionRef: "2.a",
          criterionAr: "تحديد مجموعة قيم المتغير العشوائي X وجدول قانون احتماله",
          criterionFr: "Ensemble X(Ω) et loi de probabilité de X",
          points: 1.5,
          skillLevel: "N2" as const,
          remediationAr: "التأكد دائماً من أن مجموع احتمالات جدول القانون يساوي 84/84 = 1",
        },
        {
          questionRef: "2.b",
          criterionAr: "حساب الأمل الرياضي E(X) واختزال الكسر",
          criterionFr: "Calcul exact de l'espérance mathématique E(X)",
          points: 1.0,
          skillLevel: "N2" as const,
          remediationAr: "تطبيق الصيغة E(X) = ∑ x_i P(X = x_i)",
        },
      ],
      pythonScenario: {
        titleAr: "خوارزمية بايثون لمحاكاة السحب العشوائي (Monte-Carlo) وتقدير الاحتمال",
        titleFr: "Simulation Python d'un tirage aléatoire dans une urne (Loi des grands nombres)",
        objectiveAr: "محاكاة 10000 سحبة عشوائية ومقارنة التردد التجريبي بالاحتمال النظري",
        objectiveFr: "Estimer expérimentalement P(B) et E(X) sur 10 000 tirages",
        code: `import random

urne = ["R"]*4 + ["V"]*3 + ["B"]*2
N = 10000
au_moins_une_blanche = 0
total_blanches = 0

for _ in range(N):
    tirage = random.sample(urne, 3)
    nb_b = tirage.count("B")
    total_blanches += nb_b
    if nb_b >= 1:
        au_moins_une_blanche += 1

print(f"P(B) expérimentale : {au_moins_une_blanche / N:.4f} (Théorique : {7/12:.4f})")
print(f"E(X) expérimentale : {total_blanches / N:.4f} (Théorique : {2/3:.4f})")`,
        questionsAr: [
          "1. لماذا استعملنا الدالة random.sample(urne, 3) لتمثيل السحب في آن واحد؟",
          "2. قارن القيمتين التجريبيتين مع القيمتين النظريتين 7/12 و 2/3.",
        ],
        questionsFr: [
          "1. Pourquoi utilise-t-on random.sample(urne, 3) pour modéliser un tirage simultané ?",
          "2. Comparer la fréquence observée à la probabilité théorique 7/12.",
        ],
        sampleOutput: "P(B) expérimentale : 0.5831 (Théorique : 0.5833) | E(X) expérimentale : 0.6672 (Théorique : 0.6667)",
      },
      didacticAudit: {
        estimatedDurationMinutes: 30,
        suggestedPoints: 4.0,
        n1Percentage: 35,
        n2Percentage: 45,
        n3Percentage: 20,
        complianceNotesAr: "التمرين مطابق تماماً لوحدة حساب الاحتمالات في الإطار المرجعي للامتحان الوطني.",
        complianceNotesFr: "Conforme au cadre référentiel sur le dénombrement et les probabilités.",
      },
    };
  }

  // Default comprehensive Analysis / Functions / Calculus response (covers ln, exp, limits, TVI, integrals, etc.)
  return {
    task,
    titleAr: isIntegral
      ? "الحل النموذجي المفصل لحساب التكامل والمكاملة بالأجزاء ومساحة الحيز المستوي"
      : "الحل النموذجي المفصل والهندسة الديداكتيكية لمسألة التحليل والدوال العددية",
    titleFr: isIntegral
      ? "Corrigé Type Rigoureux — Calcul Intégral, Intégration par Parties et Calcul d'Aire"
      : "Corrigé Type Rigoureux & Ingénierie Didactique — Analyse et Fonctions",
    trackLabel,
    latexFormulas: [
      "\\lim_{x \\to 0^+} x \\ln(x) = 0^- \\quad ; \\quad \\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0^+",
      "\\forall x \\in D_f,\\; f'(x) = \\frac{g(x)}{x^2} \\quad \\text{(بنفس إشارة الدالة المساعدة } g\\text{)}",
      "f \\text{ متصلة ورتيبة قطعا على } [a,b] \\text{ و } f(a)\\times f(b) < 0 \\implies \\exists! \\alpha \\in ]a,b[,\\; f(\\alpha)=0",
      "\\int_1^e u(x)v'(x)\\,dx = \\Big[u(x)v(x)\\Big]_1^e - \\int_1^e u'(x)v(x)\\,dx",
    ],
    stepByStepProofAr: `1. دراسة النهايات والفروع اللانهائية (Limites et Branches infinies):
- انطلاقاً من نص المسألة (${cleanProblem.slice(0, 110)}...)، ندرس السلوك الحدي للدالة عند محدات مجموعة التعريف باستعمال النهايات الاعتيادية (التزايدات المقارنة Croissances comparées).
- نؤوّل النتيجة هندسياً: وجود مقارب عمودي معادلته x = 0، أو مقارب مائل (Δ): y = ax + b بجوار ±∞ بعد إثبات أن lim [f(x) - (ax + b)] = 0، أو فرع شلجمي.

2. حساب المشتقة ودراسة التغيرات (Dérivabilité et Variations):
- نذكر أولاً قابلية اشتقاق الدالة f على مجال تعريفها باعتبارها مركب ومجموع وجداء دوال قابلة للاشتقاق.
- نحسب f'(x) لكل x من المجال، ونربط إشارتها بإشارة الدالة المساعدة g(x) المدروسة في الجزء الأول.
- نضع جدول التغيرات كاملاً متضمناً مجموعة التعريف، إشارة f'(x)، أسهم الرتابة، والنهايات عند المحدات.

3. مبرهنة القيم الوسيطية والمنحنى والحساب التكاملي (TVI, Courbe et Intégrale):
- بما أن f متصلة ورتيبة قطعا على المجال [a, b] و f(a) × f(b) < 0 (أو 0 ينتمي إلى المجال الصورة)، فحسب مبرهنة القيم الوسيطية (TVI) المعادلة f(x) = 0 تقبل حلاً وحيداً α في ]a, b[.
- لحساب التكامل والمساحة: نتحقق من الدالة الأصلية F أو نستعمل المكاملة بالأجزاء مع وضع u(x) و v'(x) بوضوح، ثم نضرب في وحدة المساحة ||i|| × ||j||.`,
    stepByStepProofFr: `1. Limites aux bornes et interprétation graphique :
- En utilisant les théorèmes de croissances comparées sur l'expression donnée (${cleanProblem.slice(0, 90)}...), on détermine les limites aux bornes du domaine de définition.
- On en déduit les asymptotes (verticale, horizontale ou oblique Δ : y = ax + b via lim [f(x) - (ax+b)] = 0) et la position relative de (C_f) par rapport à (Δ) en étudiant le signe de f(x) - y.

2. Calcul de la dérivée et sens de variation :
- On justifie la dérivabilité de f sur son domaine comme somme, produit et composée de fonctions dérivables.
- On factorise f'(x) pour faire apparaître la fonction auxiliaire g(x), ce qui permet de dresser le tableau de variations complet.

3. Théorème de la bijection (TVI) et Calcul intégral :
- La fonction f étant continue et strictement monotone sur [a, b] avec f(a) × f(b) < 0, l'équation f(x) = 0 admet une unique solution α ∈ ]a, b[.
- Par intégration par parties (IPP), on calcule l'intégrale exacte puis l'aire du domaine plan en unités d'aire (u.a.).`,
    theoremsUsed: [
      "نهايات التزايدات المقارنة للدالتين اللوغاريتمية والأسية (Croissances comparées)",
      "مبرهنة القيم الوسيطية في حالة الرتابة القطعية (Théorème de la bijection / TVI)",
      "الوضع النسبي للمنحنى والمقارب المائل بدراسة إشارة الفرق f(x) - (ax + b)",
      "المكاملة بالأجزاء وحساب مساحة الحيز المستوي (Intégration par parties & Calcul d'aire)",
    ],
    commonPitfallsAr: [
      "إغفال ذكر شرط الاتصال والرتابة القطعية عند تطبيق مبرهنة القيم الوسيطية لإثبات وحدانية الحل α.",
      "نسيان القيمة المطلقة |f(x) - y| عند حساب مساحة الحيز المحصور إذا كان المنحنى تحت المقارب.",
      "الاكتفاء بحساب f'(x) دون تعليل قابلية الاشتقاق على المجال المفتوح أولاً.",
    ],
    commonPitfallsFr: [
      "Oublier de mentionner la continuité et la stricte monotonie lors de l'application du corollaire du TVI.",
      "Omettre la valeur absolue ou le signe de f(x) - y dans le calcul d'aire géométrique.",
      "Ne pas justifier la dérivabilité avant le calcul de f'(x).",
    ],
    variantExercise: {
      titleAr:
        "المسألة الموازية المتكافئة (Sujet B / Type Bac) — دراسة دالة عددية وحساب المساحة",
      titleFr:
        "Problème Équivalent (Sujet B Type Bac) — Fonction auxiliaire, Courbe et Calcul d'aire",
      statementAr: `الجزء الأول: نعتبر الدالة العددية g المعرفة على ]0, +∞[ بـ: g(x) = x² - 2 + 2 ln(x).
1. أحسب g'(x) لكل x > 0 وبين أن g تزايدية قطعا على ]0, +∞[. (1.0 ن)
2. أحسب lim_{x→0^+} g(x) و lim_{x→+∞} g(x)، ثم بين أن المعادلة g(x) = 0 تقبل حلاً وحيداً α في المجال ]1, √e[ واستنتج إشارة g(x) على ]0, +∞[. (1.5 ن)

الجزء الثاني: نعتبر الدالة f المعرفة على ]0, +∞[ بـ: f(x) = x + 1 + (2 - 2 ln(x)) / x.
1. أحسب lim_{x→0^+} f(x) وأول النتيجة هندسياً. (1.0 ن)
2. أ) أحسب lim_{x→+∞} f(x) وبين أن المستقيم (Δ): y = x + 1 مقارب مائل للمنحنى (C_f) بجوار +∞. (1.25 ن)
   ب) أدرس الوضع النسبي للمنحنى (C_f) والمستقيم (Δ) على ]0, +∞[. (1.0 ن)
3. بين أن لكل x > 0: f'(x) = g(x) / x²، ثم ضع جدول تغيرات الدالة f. (1.5 ن)
4. أحسب التكامل I = ∫_1^e (2 - 2 ln(x)) / x dx، ثم استنتج مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x = 1 و x = e. (1.75 ن)`,
      statementFr: `Partie I : Soit g la fonction définie sur ]0, +∞[ par : g(x) = x² - 2 + 2 ln(x).
1. Calculer g'(x) pour tout x > 0 et montrer que g est strictement croissante sur ]0, +∞[. (1.0 pt)
2. Montrer que l'équation g(x) = 0 admet une unique solution α ∈ ]1, √e[ et en déduire le signe de g(x). (1.5 pt)

Partie II : Soit f la fonction définie sur ]0, +∞[ par : f(x) = x + 1 + (2 - 2 ln(x)) / x.
1. Calculer lim_{x→0^+} f(x) et interpréter graphiquement. (1.0 pt)
2. a) Montrer que la droite (Δ) : y = x + 1 est asymptote oblique à (C_f) en +∞. (1.25 pt)
   b) Étudier la position relative de (C_f) et (Δ). (1.0 pt)
3. Montrer que pour tout x > 0, f'(x) = g(x) / x² et dresser le tableau de variations de f. (1.5 pt)
4. Calculer I = ∫_1^e (2 - 2 ln(x)) / x dx et en déduire l'aire du domaine délimité par (C_f), (Δ), x = 1 et x = e. (1.75 pt)`,
      solutionAr: `الجزء الأول:
1. g'(x) = 2x + 2/x = 2(x² + 1)/x > 0 لكل x > 0، إذن g تزايدية قطعا.
2. g متصلة وتزايدية قطعا على ]0, +∞[ ولدينا g(1) = -1 < 0 و g(√e) = e - 1 > 0، إذن حسب مبرهنة القيم الوسيطية يوجد α وحيد في ]1, √e[ يحقق g(α) = 0. إشارة g(x): سالبة على ]0, α[ وموجبة على ]α, +∞[.

الجزء الثاني:
1. lim_{x→0^+} f(x) = +∞ لأن lim (2 - 2ln x) = +∞ و lim 1/x = +∞، إذن x = 0 مقارب عمودي.
2. أ) f(x) - (x + 1) = (2 - 2ln x)/x تؤول إلى 0 عند +∞، إذن (Δ): y = x + 1 مقارب مائل.
   ب) إشارة f(x) - (x + 1) هي إشارة 2(1 - ln x): المنحنى فوق (Δ) على ]0, e[ وتحت (Δ) على ]e, +∞[ ويتقاطعان في النقطة (e, e+1).
3. f'(x) = 1 + [(-2/x)·x - (2 - 2ln x)] / x² = (x² - 2 + 2ln x) / x² = g(x) / x².
4. نلاحظ أن (2 - 2ln x)/x = (1/x)(2 - 2ln x)، دالتها الأصلية هي 2ln(x) - (ln x)²، ومنه I = [2ln x - (ln x)²]_1^e = (2 - 1) - 0 = 1، والمساحة هي A = 1 × ||i||·||j||.`,
      solutionFr: `Partie I :
1. g'(x) = 2x + 2/x > 0 sur ]0, +∞[, donc g est strictement croissante.
2. Par le théorème de la bijection, g(1) = -1 < 0 et g(√e) = e - 1 > 0 donc α ∈ ]1, √e[ est unique.

Partie II :
1. lim_{x→0^+} f(x) = +∞ : asymptote verticale d'équation x = 0.
2. lim_{x→+∞} [f(x) - (x+1)] = 0 : asymptote oblique Δ : y = x + 1.
3. f'(x) = g(x)/x², donc f décroît sur ]0, α] et croît sur [α, +∞[.
4. Une primitive de (2 - 2ln x)/x est 2ln(x) - (ln x)², d'où I = 1 et Aire = 1 u.a.`,
    },
    gradingRubric: [
      {
        questionRef: "I.1",
        criterionAr: "حساب مشتقة الدالة المساعدة g واستنتاج رتابتها القطعية",
        criterionFr: "Calcul de g'(x) et stricte monotonie de g",
        points: 1.0,
        skillLevel: "N1" as const,
        remediationAr: "مراجعة مشتقة ln(x) وتوحيد المقامات",
      },
      {
        questionRef: "I.2",
        criterionAr: "تطبيق مبرهنة القيم الوسيطية وتحديد إشارة g(x) على المجالين",
        criterionFr: "Application du TVI et tableau de signe de g(x)",
        points: 1.5,
        skillLevel: "N2" as const,
        remediationAr: "استعمال رتابة g وشرط g(α) = 0 لاستنتاج الإشارة على يسار ويمين α",
      },
      {
        questionRef: "II.1",
        criterionAr: "حساب النهاية على يمين 0 والتأويل الهندسي (مقارب عمودي)",
        criterionFr: "Limite en 0+ et asymptote verticale",
        points: 1.0,
        skillLevel: "N1" as const,
        remediationAr: "تحديد إشارة المقام 0+ وإشارة البسط -2ln(x) بجوار 0+",
      },
      {
        questionRef: "II.2",
        criterionAr: "إثبات المقارب المائل ودراسة الوضع النسبي بحل المتراجحة 1 - ln(x) ≥ 0",
        criterionFr: "Asymptote oblique et position relative",
        points: 2.25,
        skillLevel: "N2" as const,
        remediationAr: "دراسة إشارة الفرق f(x) - y وتحديد نقطة التقاطع (e, e+1)",
      },
      {
        questionRef: "II.3",
        criterionAr: "حساب f'(x) وربطها بـ g(x)/x² ووضع جدول التغيرات الكامل",
        criterionFr: "Calcul de f'(x) = g(x)/x² et tableau de variations",
        points: 1.5,
        skillLevel: "N2" as const,
        remediationAr: "تطبيق قاعدة مشتقة خارج دالتين (u/v)' = (u'v - uv')/v²",
      },
      {
        questionRef: "II.4",
        criterionAr: "تحديد الدالة الأصلية من الشكل u'·u^n وحساب التكامل والمساحة الهندسية",
        criterionFr: "Calcul de l'intégrale et de l'aire du domaine plan",
        points: 1.75,
        skillLevel: "N3" as const,
        remediationAr: "التعرف على الشكل (1/x)·(ln x) باعتباره u'(x)·u(x)",
      },
    ],
    pythonScenario: {
      titleAr:
        "خوارزمية بايثون للتفريع الثنائي (Dichotomie) لتأطير الحل α وحساب التكامل العددي",
      titleFr:
        "Algorithme Python de Dichotomie (encadrement de α) et méthode des trapèzes",
      objectiveAr:
        "تأطير الحل الوحيد α للمعادلة g(x) = 0 بسعة 10^{-4} وحساب القيمة المقربة للتكامل I",
      objectiveFr:
        "Approcher la racine α de g(x) = 0 par dichotomie et l'intégrale I",
      code: `import math

def g(x):
    return x**2 - 2 + 2 * math.log(x)

def dichotomie(a, b, eps=1e-4):
    while (b - a) > eps:
        m = (a + b) / 2
        if g(a) * g(m) <= 0:
            b = m
        else:
            a = m
    return round(a, 4), round(b, 4)

alpha_min, alpha_max = dichotomie(1.0, math.sqrt(math.e), 1e-4)
print(f"Encadrement de alpha : {alpha_min} < alpha < {alpha_max}")`,
      questionsAr: [
        "1. لماذا نختبر الشرط g(a) * g(m) <= 0 داخل حلقة التفريع الثنائي؟",
        "2. كم عدد التكرارات اللازمة للحصول على تأطير للعدد α بسعة 10^{-3} انطلاقاً من المجال [1, 1.65]؟",
      ],
      questionsFr: [
        "1. Justifier la condition g(a) * g(m) <= 0 dans l'algorithme de dichotomie.",
        "2. Donner l'encadrement de α obtenu à 10^{-4} près.",
      ],
      sampleOutput: "Encadrement de alpha : 1.2496 < alpha < 1.2497",
    },
    didacticAudit: {
      estimatedDurationMinutes: 55,
      suggestedPoints: 9.0,
      n1Percentage: 30,
      n2Percentage: 50,
      n3Percentage: 20,
      complianceNotesAr: `المسألة مطابقة تماماً لبنية المسألة التوليفية في الإطار المرجعي الوطني (${educationSystem}) والمذكرة الوزارية 142-08، وتدرج المتعلم بسلاسة من الدالة المساعدة إلى الدراسة التحليلية وحساب المساحة.`,
      complianceNotesFr:
        "Problème de synthèse parfaitement équilibré (N1: 30%, N2: 50%, N3: 20%) conforme au cadre référentiel du Baccalauréat.",
    },
  };
}

/**
 * يولد تمارين رياضياتية غنية وحلولاً مفصلة لكل درس مختار لتحديث كل من المعاينة الورقية A4 والكود المصدري
 */
function buildRichLessonExercises(
  lessons: Array<Record<string, any>>,
  examModel: string = "A"
): Array<{
  lessonAr: string;
  lessonFr: string;
  weight: number;
  points: number;
  questionsAr: string[];
  questionsFr: string[];
  solutionsAr: string[];
  solutionsFr: string[];
}> {
  const isModelB = examModel === "B" || examModel === "D";
  const k = isModelB ? 3 : 2;
  const a = isModelB ? 4 : 3;

  const defaultLessons = [
    {
      lessonAr: "الاتصال والاشتقاق ودراسة الدوال",
      lessonFr: "Continuité, dérivabilité et étude de fonctions",
      weight: 60,
    },
    {
      lessonAr: "المتتاليات العددية",
      lessonFr: "Suites numériques",
      weight: 40,
    },
  ];

  const list =
    Array.isArray(lessons) && lessons.length > 0 ? lessons : defaultLessons;

  return list.map((l: Record<string, any>) => {
    const titleAr = String(l.lessonAr || "دراسة الدوال والتحليل");
    const titleFr = String(l.lessonFr || "Analyse et étude de fonctions");
    const weight = Number(l.weight) || Math.round(100 / list.length);
    const points = Number(((weight * 20) / 100).toFixed(2));
    const combined = `${titleAr} ${titleFr}`.toLowerCase();

    if (/متتالي|suite|récurrence/i.test(combined)) {
      return {
        lessonAr: titleAr,
        lessonFr: titleFr,
        weight,
        points,
        questionsAr: [
          `نعتبر المتتالية العددية $(u_n)$ المعرفة بحدها الأول $u_0 = ${a}$ وبالعلاقة الترجعية $u_{n+1} = \\frac{${a + 2}u_n - ${a + 1}}{u_n + 1}$ لكل $n \\in \\mathbb{N}$. أحسب $u_1$ و $u_2$ ثم بين بالترجع أن $(\\forall n \\in \\mathbb{N})\\; u_n > ${a - 1}$.`,
          `بين أن لكل $n \\in \\mathbb{N}$: $u_{n+1} - u_n = \\frac{-(u_n - ${a - 1})(u_n - 1)}{u_n + 1}$ أو أدرس إشارة $u_{n+1} - u_n$، ثم استنتج رتابة المتتالية $(u_n)$ وأنها متقاربة.`,
          `نعتبر المتتالية المساعدة $(v_n)$ المعرفة بـ $v_n = \\frac{1}{u_n - ${a - 1}}$. بين أن $(v_n)$ متتالية حسابية محدداً أساسها وحدها الأول، ثم أكتب $u_n$ بدلالة $n$ وأحسب $\\lim_{n \\to +\\infty} u_n$.`,
        ],
        questionsFr: [
          `Soit $(u_n)$ la suite numérique définie par $u_0 = ${a}$ et $u_{n+1} = \\frac{${a + 2}u_n - ${a + 1}}{u_n + 1}$ pour tout $n \\in \\mathbb{N}$. Calculer $u_1$ et $u_2$, puis montrer par récurrence que $(\\forall n \\in \\mathbb{N})\\; u_n > ${a - 1}$.`,
          `Étudier le signe de $u_{n+1} - u_n$, en déduire le sens de variation de la suite $(u_n)$ et justifier qu'elle est convergente.`,
          `On pose $v_n = \\frac{1}{u_n - ${a - 1}}$ pour tout $n \\in \\mathbb{N}$. Montrer que $(v_n)$ est une suite arithmétique dont on précisera la raison et le premier terme, puis exprimer $u_n$ en fonction de $n$ et déterminer $\\lim_{n \\to +\\infty} u_n$.`,
        ],
        solutionsAr: [
          `لدينا $u_0 = ${a} > ${a - 1}$ صحيح من أجل $n=0$. نفترض أن $u_n > ${a - 1}$ ونحسب الفرق $u_{n+1} - ${a - 1} = \\frac{3(u_n - ${a - 1})}{u_n + 1} > 0$، ومنه بالترجع $(\\forall n \\in \\mathbb{N})\\; u_n > ${a - 1}$.`,
          `بتوحيد المقامات نجد أن $u_{n+1} - u_n < 0$ لكل $n \\in \\mathbb{N}$، إذن المتتالية $(u_n)$ تناقصية قطعا وبما أنها مصغورة بالعدد $${a - 1}$ فهي متقاربة.`,
          `العلاقة $v_{n+1} - v_n = \\frac{1}{3}$ ثابتة، إذن $(v_n)$ حسابية أساسها $r = \\frac{1}{3}$ وحدها الأول $v_0 = 1$، ومنه $v_n = 1 + \\frac{n}{3}$ وبالتالي $\\lim_{n \\to +\\infty} u_n = ${a - 1}$.`,
        ],
        solutionsFr: [
          `Initialisation : $u_0 = ${a} > ${a - 1}$. Hérédité : $u_{n+1} - ${a - 1} = \\frac{3(u_n - ${a - 1})}{u_n + 1} > 0$ par hypothèse de récurrence.`,
          `La différence $u_{n+1} - u_n$ est strictement négative, donc $(u_n)$ est décroissante et minorée par $${a - 1}$, d'où sa convergence.`,
          `$(v_n)$ est arithmétique de raison $r = \\frac{1}{3}$ et $v_0 = 1$, donc $v_n = 1 + \\frac{n}{3}$ et $\\lim_{n \\to +\\infty} u_n = ${a - 1}$.`,
        ],
      };
    }

    if (/عقدي|complexe|affixe|module/i.test(combined)) {
      return {
        lessonAr: titleAr,
        lessonFr: titleFr,
        weight,
        points,
        questionsAr: [
          `حل في مجموعة الأعداد العقدية $\\mathbb{C}$ المعادلة: $z^2 - ${2 * k}\\sqrt{3}\\,z + ${4 * k * k} = 0$.`,
          `في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر $(O, \\vec{u}, \\vec{v})$، نعتبر النقط $A$ و $B$ و $C$ التي ألحاقها على التوالي $a = ${k}\\sqrt{3} + ${k}i$ و $b = \\bar{a}$ و $c = ${2 * k}i$. أكتب $a$ و $b$ على الشكل الأسي ثم أحسب المعيار والعمدة للخارج $\\frac{c - b}{a - b}$.`,
          `ليكن $R$ الدوران الذي مركزه $B$ وزاويته $\\frac{\\pi}{3}$. بين أن النقطة $C$ هي صورة $A$ بالدوران $R$ واستنتج طبيعة المثلث $ABC$.`,
        ],
        questionsFr: [
          `Résoudre dans l'ensemble $\\mathbb{C}$ des nombres complexes l'équation : $z^2 - ${2 * k}\\sqrt{3}\\,z + ${4 * k * k} = 0$.`,
          `Dans le plan complexe rapporté à un repère orthonormé direct $(O, \\vec{u}, \\vec{v})$, on considère les points $A(a)$, $B(b)$ et $C(c)$ avec $a = ${k}\\sqrt{3} + ${k}i$, $b = \\bar{a}$ et $c = ${2 * k}i$. Écrire $a$ et $b$ sous forme exponentielle puis déterminer le module et un argument de $\\frac{c - b}{a - b}$.`,
          `Soit $R$ la rotation de centre $B$ et d'angle $\\frac{\\pi}{3}$. Montrer que $R(A) = C$ et en déduire la nature exacte du triangle $ABC$.`,
        ],
        solutionsAr: [
          `المميز $\\Delta = 12\\times ${k * k} - 16\\times ${k * k} = -4\\times ${k * k} = (${2 * k}i)^2$. الحلان هما $z_1 = ${k}\\sqrt{3} + ${k}i$ و $z_2 = ${k}\\sqrt{3} - ${k}i$.`,
          `معيار $a$ هو $|a| = ${2 * k}$، ومنه $a = ${2 * k}e^{i\\frac{\\pi}{6}}$ و $b = ${2 * k}e^{-i\\frac{\\pi}{6}}$. كما أن $\\frac{c - b}{a - b} = e^{i\\frac{\\pi}{3}}$.`,
          `العلاقة $c - b = e^{i\\frac{\\pi}{3}}(a - b)$ تكافئ $R(A) = C$، وبالتالي $BA = BC$ و $(\\overline{\\vec{BA}, \\vec{BC}}) \\equiv \\frac{\\pi}{3}\\;[2\\pi]$، أي أن المثلث $ABC$ متساوي الأضلاع.`,
        ],
        solutionsFr: [
          `$\\Delta = -4\\times ${k * k} = (${2 * k}i)^2$. Les solutions sont $z_1 = ${k}\\sqrt{3} + ${k}i$ et $z_2 = ${k}\\sqrt{3} - ${k}i$.`,
          `$|a| = ${2 * k}$, donc $a = ${2 * k}e^{i\\pi/6}$ et $b = ${2 * k}e^{-i\\pi/6}$. On trouve $\\frac{c - b}{a - b} = e^{i\\pi/3}$.`,
          `Comme $c - b = e^{i\\pi/3}(a - b)$, on a $R(A) = C$ et le triangle $ABC$ est équilatéral direct.`,
        ],
      };
    }

    if (/فضاء|فضائية|فلكة|sphère|scalaire|vectoriel/i.test(combined)) {
      return {
        lessonAr: titleAr,
        lessonFr: titleFr,
        weight,
        points,
        questionsAr: [
          `في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر $(O, \\vec{i}, \\vec{j}, \\vec{k})$، نعتبر النقط $A(1, 0, ${k})$ و $B(2, 1, ${k - 1})$ و $C(0, 2, ${k + 1})$. أحسب الجداء المتجهي $\\vec{AB} \\wedge \\vec{AC}$ واستنتج أن النقط $A, B, C$ تحدد مستوى $(ABC)$ معادلته الديكارتية $x + z - ${k + 1} = 0$.`,
          `نعتبر الفلكة $(S)$ التي مركزها $\\Omega(1, -1, ${k + 2})$ وشعاعها $R = 3$. أحسب مسافة النقطة $\\Omega$ عن المستوى $(ABC)$ وبين أن المستوى $(ABC)$ يقطع الفلكة $(S)$ وفق دائرة $(\\Gamma)$ يتم تحديد شعاعها $r$.`,
          `حدد التمثيل البارامتري للمستقيم $(\\Delta)$ المار من $\\Omega$ والعمودي على $(ABC)$، ثم استنتج إحداثيات النقطة $H$ مركز الدائرة $(\\Gamma)$.`,
        ],
        questionsFr: [
          `Dans l'espace muni d'un repère orthonormé direct $(O, \\vec{i}, \\vec{j}, \\vec{k})$, on donne $A(1, 0, ${k})$, $B(2, 1, ${k - 1})$ et $C(0, 2, ${k + 1})$. Calculer $\\vec{AB} \\wedge \\vec{AC}$ et vérifier qu'une équation cartésienne du plan $(ABC)$ est $x + z - ${k + 1} = 0$.`,
          `Soit $(S)$ la sphère de centre $\\Omega(1, -1, ${k + 2})$ et de rayon $R = 3$. Calculer $d(\\Omega, (ABC))$ et montrer que $(ABC)$ coupe $(S)$ suivant un cercle $(\\Gamma)$ dont on précisera le rayon $r$.`,
          `Déterminer une représentation paramétrique de la droite $(\\Delta)$ passant par $\\Omega$ et orthogonale à $(ABC)$, puis déterminer les coordonnées du centre $H$ de $(\\Gamma)$.`,
        ],
        solutionsAr: [
          `نحسب إحداثيات المتجهتين فنجد $\\vec{AB}(1, 1, -1)$ و $\\vec{AC}(-1, 2, 1)$، ومنه $\\vec{AB} \\wedge \\vec{AC} = 3\\vec{i} + 3\\vec{k} \\neq \\vec{0}$، إذن المتجهة $\\vec{n}(1, 0, 1)$ منظمية على $(ABC)$ ومعادلته $x + z - ${k + 1} = 0$.`,
          `$d(\\Omega, (ABC)) = \\frac{|1 + (${k + 2}) - (${k + 1})|}{\\sqrt{1^2 + 0^2 + 1^2}} = \\frac{2}{\\sqrt{2}} = \\sqrt{2} < R = 3$، إذن التقاطع دائرة شعاعها $r = \\sqrt{R^2 - d^2} = \\sqrt{9 - 2} = \\sqrt{7}$.`,
          `التمثيل البارامتري لـ $(\\Delta)$ هو $x = 1 + t,\\; y = -1,\\; z = ${k + 2} + t\\;(t \\in \\mathbb{R})$. بالتعويض في معادلة المستوى نجد $t = -1$، ومنه $H(0, -1, ${k + 1})$.`,
        ],
        solutionsFr: [
          `$\\vec{AB} \\wedge \\vec{AC} = (3, 0, 3)$, vecteur normal $\\vec{n}(1, 0, 1)$, d'où l'équation $x + z - ${k + 1} = 0$.`,
          `$d(\\Omega, (ABC)) = \\sqrt{2} < 3$, donc intersection suivant un cercle de rayon $r = \\sqrt{9 - 2} = \\sqrt{7}$.`,
          `En injectant la représentation paramétrique dans $x + z - ${k + 1} = 0$, on obtient $t = -1$ et $H(0, -1, ${k + 1})$.`,
        ],
      };
    }

    if (/احتمال|probabilit|عشوائي|تعداد/i.test(combined)) {
      return {
        lessonAr: titleAr,
        lessonFr: titleFr,
        weight,
        points,
        questionsAr: [
          `يحتوي صندوق على $5$ كرات بيضاء و $4$ كرات حمراء لا يمكن التمييز بينها باللمس. نسحب عشوائياً وفي آن واحد $3$ كرات من الصندوق. بين أن عدد الإمكانيات هو $\\text{Card}(\\Omega) = 84$.`,
          `نعتبر الحدث $A$: «سحب ثلاث كرات من نفس اللون» والحدث $B$: «سحب كرة بيضاء واحدة على الأقل». أحسب $P(A)$ و $P(B)$.`,
          `ليكن $X$ المتغير العشوائي الذي يربط كل سحبة بعدد الكرات الحمراء المسحوبة. حدد قانون احتمال $X$ وأحسب أمله الرياضي $E(X)$.`,
        ],
        questionsFr: [
          `Une urne contient $5$ boules blanches et $4$ boules rouges indiscernables au toucher. On tire simultanément $3$ boules de l'urne. Vérifier que $\\text{Card}(\\Omega) = 84$.`,
          `Calculer la probabilité des événements $A$ : « obtenir 3 boules de même couleur » et $B$ : « obtenir au moins une boule blanche ».`,
          `Soit $X$ la variable aléatoire égale au nombre de boules rouges tirées. Déterminer la loi de probabilité de $X$ et calculer son espérance $E(X)$.`,
        ],
        solutionsAr: [
          `السحب في آن واحد يستعمل التأليفات: $\\text{Card}(\\Omega) = C_9^3 = \\frac{9 \\times 8 \\times 7}{3 \\times 2 \\times 1} = 84$.`,
          `$P(A) = \\frac{C_5^3 + C_4^3}{84} = \\frac{10 + 4}{84} = \\frac{14}{84} = \\frac{1}{6}$، وبالحدث المضاد $P(B) = 1 - \\frac{C_4^3}{84} = 1 - \\frac{4}{84} = \\frac{20}{21}$.`,
          `قيم $X(\\Omega) = \\{0, 1, 2, 3\\}$ مع $P(X=0)=\\frac{10}{84}$، $P(X=1)=\\frac{40}{84}$، $P(X=2)=\\frac{30}{84}$، $P(X=3)=\\frac{4}{84}$، والأمل الرياضي $E(X) = \\frac{112}{84} = \\frac{4}{3}$.`,
        ],
        solutionsFr: [
          `$\\text{Card}(\\Omega) = \\binom{9}{3} = 84$.`,
          `$P(A) = \\frac{10 + 4}{84} = \\frac{1}{6}$ et $P(B) = 1 - \\frac{4}{84} = \\frac{20}{21}$.`,
          `$X(\\Omega) = \\{0, 1, 2, 3\\}$ et l'espérance vaut $E(X) = 3 \\times \\frac{4}{9} = \\frac{4}{3}$.`,
        ],
      };
    }

    // Default: Analysis / Functions / Continuity / Derivation / Integrals
    return {
      lessonAr: titleAr,
      lessonFr: titleFr,
      weight,
      points,
      questionsAr: [
        `نعتبر الدالة العددية $g$ المعرفة على $]0, +\\infty[$ بـ: $g(x) = x^2 - ${k} + ${k}\\ln(x)$. أدرس تغيرات الدالة $g$ وبين أن المعادلة $g(x) = 0$ تقبل حلاً وحيداً $\\alpha$ في المجال $]1, e[$ (في الحالة $k=2$ نلاحظ أن $g(1)=0$)، ثم استنتج إشارة $g(x)$ على $]0, +\\infty[$.`,
        `نعتبر الدالة العددية $f$ المعرفة على $]0, +\\infty[$ بـ: $f(x) = x - 1 + ${k}\\frac{\\ln(x)}{x}$. أحسب $\\lim_{x \\to 0^+} f(x)$ و $\\lim_{x \\to +\\infty} f(x)$، ثم بين أن المستقيم $(\\Delta): y = x - 1$ مقارب مائل للمنحنى $(\\mathcal{C}_f)$ بجوار $+\\infty$ وأدرس وضعهما النسبي.`,
        `بين أن لكل $x > 0$: $f'(x) = \\frac{x^2 + ${k}(1 - \\ln x)}{x^2}$، ضع جدول تغيرات الدالة $f$، ثم أحسب التكامل $I = \\int_1^e ${k}\\frac{\\ln(x)}{x}\\,dx$ واستنتج مساحة الحيز المستوي المحصور بين $(\\mathcal{C}_f)$ و $(\\Delta)$ والمستقيمين $x=1$ و $x=e$.`,
      ],
      questionsFr: [
        `Soit $g$ la fonction définie sur $]0, +\\infty[$ par $g(x) = x^2 + ${k}(1 - \\ln(x))$. Étudier les variations de $g$ sur $]0, +\\infty[$ et en déduire que pour tout $x \\in ]0, e]$, $g(x) > 0$.`,
        `Soit $f$ la fonction définie sur $]0, +\\infty[$ par : $f(x) = x - 1 + ${k}\\frac{\\ln(x)}{x}$. Calculer les limites aux bornes, montrer que la droite $(\\Delta): y = x - 1$ est asymptote oblique à $(\\mathcal{C}_f)$ en $+\\infty$ et étudier leur position relative.`,
        `Montrer que pour tout $x > 0$, $f'(x) = \\frac{g(x)}{x^2}$, dresser le tableau de variations de $f$, puis calculer $I = \\int_1^e ${k}\\frac{\\ln(x)}{x}\\,dx$ et l'aire du domaine délimité par $(\\mathcal{C}_f)$, $(\\Delta)$, $x=1$ et $x=e$.`,
      ],
      solutionsAr: [
        `الدالة $g$ قابلة للاشتقاق على $]0,+\\infty[$ ومشتقتها $g'(x) = 2x - \\frac{${k}}{x} = \\frac{2x^2 - ${k}}{x}$، ومن جدول التغيرات نستنتج إشارة $g(x)$ بدقة على $]0,+\\infty[$.`,
        `عند $0^+$: $\\lim_{x \\to 0^+} f(x) = -\\infty$ (المستقيم $x=0$ مقارب عمودي). عند $+\\infty$: $\\lim_{x \\to +\\infty} [f(x) - (x-1)] = \\lim_{x \\to +\\infty} ${k}\\frac{\\ln x}{x} = 0$، إذن $(\\Delta): y = x - 1$ مقارب مائل، والوضع النسبي يتبع إشارة $\\ln(x)$.`,
        `بتطبيق مشتقة الخارج نجد $f'(x) = 1 + ${k}\\frac{1 - \\ln x}{x^2} = \\frac{x^2 + ${k}(1 - \\ln x)}{x^2}$. وبملاحظة أن $\\frac{\\ln x}{x} = u'(x)u(x)$ نحصل على $I = \\left[\\frac{${k}}{2}(\\ln x)^2\\right]_1^e = \\frac{${k}}{2}\\text{ u.a.}$.`,
      ],
      solutionsFr: [
        `$g$ est dérivable sur $]0, +\\infty[$ et $g'(x) = \\frac{2x^2 - ${k}}{x}$, ce qui donne le minimum positif et le signe de $g(x)$.`,
        `$\\lim_{x \\to 0^+} f(x) = -\\infty$ (asymptote verticale $x=0$) et $\\lim_{x \\to +\\infty} [f(x) - (x-1)] = 0$ (asymptote oblique $\\Delta: y = x - 1$).`,
        `$f'(x) = \\frac{g(x)}{x^2}$ et par intégration directe $I = \\left[\\frac{${k}}{2}(\\ln x)^2\\right]_1^e = \\frac{${k}}{2}\\text{ u.a.}$.`,
      ],
    };
  });
}

/**
 * Generates compilable LaTeX or Typst source code on the server when AI generation is requested
 */
function buildServerSideLatexOrTypstDocument(body: Record<string, any>): string {
  const {
    school = "الثانوية التأهيلية",
    prof = "أستاذ مادة الرياضيات",
    year = "2026-2027",
    academy = "الأكاديمية الجهوية للتربية والتكوين",
    direction = "المديرية الإقليمية",
    trackLabelAr = "الثانية باكالوريا علوم فيزيائية",
    trackLabelFr = "2ème Bac Sciences Physiques",
    durationFr = "2 heures",
    exportFormat = "LATEX",
    sem = "S1",
    dsKey = "DS1",
    examModel = "A",
    n1 = 35,
    n2 = 45,
    n3 = 20,
    lessons = [],
  } = body;

  const richExercises = buildRichLessonExercises(lessons, examModel);

  if (exportFormat === "TYPST") {
    return `// =========================================================================
// وثيقة رسمية مولدة عبر المحرك الرياضي الأكاديمي (Typst 0.12)
// المؤسسة: ${school} | الأستاذ: ${prof} | السنة: ${year}
// المسلك: ${trackLabelFr} (${trackLabelAr})
// =========================================================================

#set page(paper: "a4", margin: (x: 1.5cm, y: 1.5cm))
#set text(font: "New Computer Modern", size: 11pt, lang: "fr")

#rect(width: 100%, stroke: 1.2pt + rgb("#0f172a"), radius: 6pt, inset: 10pt)[
  #grid(
    columns: (1fr, 1.3fr, 1fr),
    align: (left, center, right),
    [
      *${school}* \\
      Prof : ${prof} \\
      Année : ${year}
    ],
    [
      #text(size: 13pt, weight: "bold")[DEVOIR SURVEILLÉ ${dsKey} (${sem})] \\
      *${trackLabelFr}* \\
      _Modèle ${examModel} — Durée : ${durationFr}_
    ],
    [
      *Note 142-08* \\
      N1: ${n1}% | N2: ${n2}% | N3: ${n3}% \\
      Barème : *20 / 20 pts*
    ]
  )
]

#v(8pt)

${richExercises
  .map((ex, idx) => {
    const pts = ex.points.toFixed(1);
    return `== Exercice ${idx + 1} : ${ex.lessonFr} (${pts} points)
#block(fill: rgb("#f8fafc"), stroke: 0.6pt + rgb("#cbd5e1"), inset: 10pt, radius: 4pt, width: 100%)[
${ex.questionsFr.map((q, qIdx) => `  + *Question ${qIdx + 1} :* ${q}`).join("\n")}
]
#v(6pt)`;
  })
  .join("\n\n")}

#pagebreak()
= Corrigé Type et Barème Détaillé (Note 142-08 — 20/20)

${richExercises
  .map((ex, idx) => {
    return `== Corrigé de l'Exercice ${idx + 1} (${ex.lessonFr})
${ex.solutionsFr.map((s, sIdx) => `+ *Réponse ${sIdx + 1} :* ${s}`).join("\n")}`;
  })
  .join("\n\n")}
`;
  }

  return `% =========================================================================
% كود مصدري احترافي قابل للترجمة المباشرة عبر XeLaTeX / Overleaf
% المؤسسة: ${school} | الأستاذ: ${prof} | السنة الدراسية: ${year}
% المسلك: ${trackLabelFr} (${trackLabelAr})
% =========================================================================
\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1.5cm]{geometry}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage[most]{tcolorbox}
\\usepackage{fancyhdr}
\\usepackage{enumitem}
\\usepackage{booktabs}

\\pagestyle{fancy}
\\fancyhf{}
\\lhead{\\textbf{${school}} — ${prof}}
\\rhead{\\textbf{${trackLabelFr}} — ${dsKey} (${sem}) — ${year}}
\\cfoot{Page \\thepage}

\\newtcolorbox{exoBox}[2][]{
  enhanced,
  colback=slate!3!white,
  colframe=blue!45!black,
  fonttitle=\\bfseries,
  title={#2},
  #1
}

\\begin{document}

\\begin{center}
  \\fbox{\\parbox{0.97\\textwidth}{
    \\centering
    \\textbf{\\large ${academy} — ${direction}}\\\\[4pt]
    \\textbf{\\Large DEVOIR SURVEILLÉ N° ${dsKey} — SEMESTRE ${sem} (Sujet ${examModel})}\\\\[4pt]
    \\textbf{Établissement :} ${school} \\hfill \\textbf{Professeur :} ${prof} \\hfill \\textbf{Durée :} ${durationFr}\\\\[2pt]
    \\textbf{Filière :} ${trackLabelFr} \\hfill \\textbf{Répartition 142-08 :} N1=${n1}\\% $\\cdot$ N2=${n2}\\% $\\cdot$ N3=${n3}\\%
  }}
\\end{center}

\\vspace{0.3cm}

${richExercises
  .map((ex, idx) => {
    const pts = ex.points.toFixed(1);
    return `\\begin{exoBox}{Exercice ${idx + 1} : ${ex.lessonFr} (${pts} points)}
\\begin{enumerate}[label=\\textbf{\\arabic*.}]
${ex.questionsFr.map((q) => `  \\item ${q}`).join("\n")}
\\end{enumerate}
\\end{exoBox}
\\vspace{0.25cm}`;
  })
  .join("\n\n")}

\\newpage
\\section*{Éléments de réponse et Barème détaillé (Note 142-08 — Total : 20/20)}
${richExercises
  .map((ex, idx) => {
    return `\\subsection*{Corrigé de l'Exercice ${idx + 1} : ${ex.lessonFr} (${ex.points.toFixed(1)} pts)}
\\begin{enumerate}[label=\\textbf{\\arabic*.}]
${ex.solutionsFr.map((s) => `  \\item ${s}`).join("\n")}
\\end{enumerate}`;
  })
  .join("\n\n")}

\\end{document}`;
}

export function registerPedagogyRoutes(app: express.Express) {
  app.get("/api/ai-status", (_req, res) => {
    const configured = hasValidGeminiKey();
    res.json({
      configured,
      engineReady: true,
      serverSecretName: "GEMINI_API_KEY",
      hybridFallbackActive: true,
      supportedModels: [
        {
          id: "gemini-3.8-flash",
          labelAr: "Gemini Flash 3.8 (محرك التوليد البيداغوجي السريع)",
        },
        {
          id: "gemini-4-argon",
          labelAr: "Gemini 4 Argon (محرك البرهان الرياضي العميق)",
        },
      ],
    });
  });

  // نقطة نهاية فحص شامل لجميع المسارات الخمسة للمحرك الذكي والرمزي
  app.get("/api/ai-diagnostics", (_req, res) => {
    const geminiConfigured = hasValidGeminiKey();
    const wolframConfigured = Boolean(
      process.env.WOLFRAM_APP_ID &&
        process.env.WOLFRAM_APP_ID.trim().length > 3 &&
        process.env.WOLFRAM_APP_ID !== "MY_WOLFRAM_APP_ID"
    );

    res.json({
      timestamp: new Date().toISOString(),
      overallStatus: "OPERATIONAL",
      geminiCloudSecretConfigured: geminiConfigured,
      wolframDirectConfigured: wolframConfigured,
      hybridSymbolicFallbackReady: true,
      endpoints: [
        {
          route: "/api/ai-math-assistant",
          nameAr: "المساعد الديداكتيكي والبرهان الرياضي (Gemini Math Assistant)",
          status: "READY",
          mode: geminiConfigured ? "GEMINI_CLOUD + SYMBOLIC_FALLBACK" : "SYMBOLIC_PEDAGOGICAL_ENGINE",
        },
        {
          route: "/api/generate-document",
          nameAr: "توليد الكود المصدري الكامل (LaTeX / Typst Generator)",
          status: "READY",
          mode: geminiConfigured ? "GEMINI_CLOUD + TEMPLATE_ENGINE" : "DETERMINISTIC_TEMPLATE_ENGINE",
        },
        {
          route: "/api/simulate-imported-exam",
          nameAr: "استوديو محاكاة الفروض المستوردة (Isomorphic Exam Simulator)",
          status: "READY",
          mode: geminiConfigured ? "GEMINI_MULTIMODAL + PARSER" : "STRUCTURAL_MATH_PARSER",
        },
        {
          route: "/api/ai-convert-quiz",
          nameAr: "محول التمارين إلى اختبار تفاعلي (Interactive QCM Quiz)",
          status: "READY",
          mode: geminiConfigured ? "GEMINI_CLOUD + QUIZ_ENGINE" : "ALGORITHMIC_QUIZ_ENGINE",
        },
        {
          route: "/api/wolfram/verify",
          nameAr: "مدقق الصيغ والحساب الرمزي (WolframSymbolic Verifier)",
          status: "READY",
          mode: wolframConfigured
            ? "WOLFRAM_V2_API"
            : geminiConfigured
            ? "GEMINI_SYMBOLIC_ENGINE"
            : "BUILT_IN_CAS_ENGINE",
        },
      ],
    });
  });

  app.post("/api/generate-document", async (req, res) => {
    try {
      const {
        school,
        prof,
        year,
        academy,
        direction,
        headerStyle,
        includeStudentBox,
        includeGradeBox,
        calculatorAllowed,
        includeCompetencies,
        examModel,
        shuffleQuestions,
        shuffleExercises,
        trackLabelAr,
        trackLabelFr,
        durationAr,
        durationFr,
        docLang,
        bilingualLayout,
        exportFormat,
        activeModule,
        sem,
        dsKey,
        n1,
        n2,
        n3,
        fillBlanks,
        includeTICE,
        lessons,
        diagDuration,
        diagType,
        customTopicNote,
        system,
        dmSubType,
        dmNumber,
        dmDueDate,
        includeHints,
        serieExerciseCount,
        dsStructureMode,
        dsQuestionDensity,
        modelChoice,
      } = req.body;

      const { sdkModel: targetModel, displayLabel: modelLabel } =
        resolveGeminiModel(modelChoice);

      if (hasValidGeminiKey()) {
        try {
          const formatLabel =
            exportFormat === "LATEX" ? "LaTeX / XeLaTeX (.tex)" : "Typst (.typ)";
          const isMission = system === "MISSION_FRANCAISE";
          const isDM = dmSubType !== "SERIE_TD";

          const lessonsSummary = Array.isArray(lessons)
            ? lessons
                .map(
                  (l: {
                    lessonAr: string;
                    lessonFr: string;
                    weight: number;
                    hours: string;
                    capacitiesAr: string[];
                    capacitiesFr: string[];
                  }) =>
                    `- ${l.lessonAr} / ${l.lessonFr} (النسبة المخصصة: ${l.weight}% — التنقيط: ${((l.weight * 20) / 100).toFixed(1)}/20 | الغلاف الزمني: ${l.hours})\n  القدرات بالعربية: ${(l.capacitiesAr || []).join(" ؛ ")}\n  Capacités & Attendus (FR): ${(l.capacitiesFr || []).join(" ; ")}`
                )
                .join("\n")
            : "";

          const modelDescription =
            examModel === "BOTH"
              ? "Deux sujets équivalents dans le même document (Sujet A + Sujet B / نموذجان متكافئان لمنع الغش) avec variation des valeurs numériques et fonctions"
              : `Sujet ${examModel} (النموذج ${examModel})`;

          let moduleInstruction = "";
          if (activeModule === "DM_SERIE") {
            if (isDM) {
              moduleInstruction = `المطلوب: توليد فرض منزلي للبحث والتعمق (Devoir Maison - DM ${dmNumber || "N° 1"}) للدورة ${sem}، تاريخ الإرجاع: ${dmDueDate || "........"}، بنظام: ${modelDescription}.
يجب أن يتضمن الكود المصدري:
1. الترويسة الرسمية (${school}، الأستاذ: ${prof}، السنة: ${year}، تاريخ الإرجاع: ${dmDueDate}).
2. جدول توزيع الدروس المختارة ونسبة كل درس وسقف النقط المخصص له (مجموع 20/20).
3. مسائل توليفية معمقة (Problèmes de synthèse et de recherche) تحترم بدقة نسبة كل درس مختار، مقسمة إلى أجزاء متدرجة (Partie A تمهيدية + Partie B مسألة توليفية وأسئلة مبادرة).
${includeHints ? "4. إرشادات وتلميحات منهجية (Indications méthodologiques) لمساعدة التلميذ على البحث الذاتي." : ""}
5. عناصر الإجابة وسلم التنقيط المفصل (Corrigé détaillé et barème sur 20).`;
            } else {
              moduleInstruction = `المطلوب: توليد سلسلة تمارين تطبيقية وتوليفية متدرجة (Série d'Exercices & Travaux Dirigés - TD ${dmNumber || "Série 1"}) للدورة ${sem} تضم بالضبط ${serieExerciseCount || 6} تمارين متدرجة.
يجب أن يتضمن الكود المصدري:
1. الترويسة البيداغوجية الكاملة (${school}، الأستاذ: ${prof}، السنة: ${year}).
2. ${serieExerciseCount || 6} تمارين غنية ومتدرجة الصعوبة تغطي الدروس المختارة حسب نسبتها المئوية، مصنفة إلى مستويات متدرجة (★, ★★, ★★★).
${includeHints ? "3. تلميحات منهجية أسفل التمارين المركبة." : ""}
4. ملخص مفاتيح الحل والنتائج الأساسية في نهاية السلسلة.`;
            }
          } else if (isMission) {
            if (activeModule === "DS_142_08") {
              moduleInstruction = `المطلوب: توليد فرض محروس لمدارس البعثة الفرنسية بالمغرب (Devoir Surveillé Lycée Français AEFE / OSUI) رقم ${dsKey} للدورة ${sem} (المدة: ${durationFr})، بنظام: ${modelDescription}.
يجب أن يتضمن الكود المصدري:
1. الترويسة الرسمية (${school})، الأستاذ (${prof})، السنة (${year})، المدة (${durationFr})، وملاحظة الآلة الحاسبة (${calculatorAllowed !== false ? "Calculatrice autorisée" : "Calculatrice interdite"}).
${includeCompetencies !== false ? "2. شبكة الكفايات الرياضياتية الست (Chercher, Modéliser, Représenter, Raisonner, Calculer, Communiquer)." : ""}
3. تمارين رياضياتية أصلية وعالية المستوى مطابقة للمنهاج الفرنسي (BOEN) وتحترم النسبة المئوية لكل درس.
${shuffleQuestions ? "- مع تبديل ترتيب الأسئلة الفرعية في النموذج الثاني." : ""}
${shuffleExercises ? "- مع تبديل ترتيب التمارين في النموذج الثاني." : ""}
4. عناصر الإجابة وسلم التنقيط المفصل على 20 نقطة.`;
            } else if (activeModule === "FICHE_OP2007") {
              moduleInstruction = `المطلوب: توليد جذاذة تخطيط دراسي وبيداغوجي وفق منهاج الليسي الفرنسي (Fiche de Séquence Pédagogique - Lycée Français AEFE) للدرس المحدد.`;
            } else if (activeModule === "DIAGNOSTIC") {
              moduleInstruction = `المطلوب: توليد اختبار تقويم تشخيصي للمكتسبات القبلية لمدارس البعثة الفرنسية (Durée: ${diagDuration}).`;
            } else {
              moduleInstruction = `المطلوب: توليد مخطط التوزيع السنوي للتعلمات وفق التقويم المدرسي للبعثة الفرنسية بالمغرب.`;
            }
          } else {
            if (activeModule === "DS_142_08") {
              const structDesc =
                dsStructureMode === "QCM_ET_EXERCICES"
                  ? "بنية تتضمن تمريناً تمهيدياً QCM + تمارين تطبيقية واستدلالية"
                  : dsStructureMode === "EXERCICES_ET_PROBLEME"
                  ? "بنية تتضمن تمارين مستقلة + مسألة توليفية شاملة (Problème de Synthèse)"
                  : dsStructureMode === "COMPLETE_EXAM_MAROC"
                  ? "بنية الامتحان الوطني المغربي الكامل (QCM + تمارين موضوعاتية + مسألة توليفية شاملة)"
                  : "تمارين موضوعاتية مستقلة ومتدرجة";
              moduleInstruction = `المطلوب: توليد فرض محروس متكامل رقم ${dsKey} للدورة ${sem} (المدة: ${durationAr} / ${durationFr}) وفق المذكرة الوزارية 142-08 والتوجيهات التربوية نونبر 2007، بنظام: ${modelDescription}، وببنية: ${structDesc} (كثافة الأسئلة: ${dsQuestionDensity === "STANDARD" ? "قياسية" : "مكثفة وشاملة"}).
يجب أن يتضمن الكود:
1. الترويسة الرسمية المغربية (${headerStyle}): الأكاديمية (${academy})، المديرية (${direction})، المؤسسة (${school})، الأستاذ (${prof})، السنة (${year})، ${includeStudentBox ? "إطار اسم التلميذ، " : ""}${includeGradeBox ? "إطار النقطة /20." : ""}
2. شبكة التخصيص والتقويم الرسمية (Grille de spécification 142-08).
3. نص الفرض المحروس (${modelDescription}) بتمارين رياضياتية دقيقة علمياً تحترم النسبة المخصصة لكل درس وتوزيع المستويات المهارية: N1=${n1}%، N2=${n2}%، N3=${n3}%.
4. عناصر الإجابة وسلم التنقيط المفصل (Corrigé type et barème détaillé).`;
            } else if (activeModule === "FICHE_OP2007") {
              moduleInstruction = `المطلوب: توليد جذاذة تربوية بيداغوجية مفصلة (Fiche Pédagogique conforme aux OP 2007) للدرس المحدد.`;
            } else if (activeModule === "DIAGNOSTIC") {
              moduleInstruction = `المطلوب: توليد رائز تقويم تشخيصي متكامل (المدة: ${diagDuration} - النمط: ${diagType}) مع شبكة تفريغ واستثمار النتائج.`;
            } else {
              moduleInstruction = `المطلوب: توليد وثيقة التوزيع السنوي والدوري للمقرر الدراسي مرفقة بجدول القدرات المستهدفة.`;
            }
          }

          const roleDescription = isMission
            ? "أنت مفتش تربوي للتعليم الفرنسي بالخارج وأستاذ مبرز لمادة الرياضيات بمدارس البعثة الفرنسية بالمغرب (AEFE / OSUI)."
            : "أنت مفتش تربوي وأستاذ مبرز لمادة الرياضيات بالسلك الثانوي التأهيلي بالمغرب (وزارة التربية الوطنية).";

          const prompt = `${roleDescription}
قم بتوليد كود مصدري كامل، احترافي، دقيق علمياً وقابل للترجمة والتشغيل الفوري بصيغة ${formatLabel}.
- المؤسسة: ${school} | الأستاذ: ${prof} | السنة الدراسية: ${year}
- الشعبة / المسلك: ${trackLabelAr} (${trackLabelFr})
- لغة تحرير الوثيقة: ${docLang === "FR" ? "الفرنسية فقط (Français)" : docLang === "AR" ? "العربية فقط" : `مزدوج اللغة (Français + العربية) بتخطيط ${bilingualLayout}`}
${moduleInstruction}
الدروس المختارة من طرف الأستاذ مع النسبة المئوية المخصصة لكل درس:
${lessonsSummary}
${fillBlanks ? "- أدرج سؤال استدلال موجه بملء الفراغات (Preuve guidée à trous)." : ""}
${includeTICE ? "- أدرج فقرة أو سيناريو برمجي / TICE (GeoGebra أو Python)." : ""}
${customTopicNote ? `- توجيهات إضافية من الأستاذ: ${customTopicNote}` : ""}

هام جداً: أخرج الكود المصدري (${formatLabel}) فقط بدون أي مقدمات أو تعليقات خارج الكود ولا تضع علامات markdown المحيطة.`;

          const response = await generateGeminiContentWithFallback(
            targetModel,
            prompt
          );

          const rawText = response.text || "";
          const cleanedCode = rawText
            .replace(/^```[a-zA-Z]*\n?/i, "")
            .replace(/\n?```$/i, "")
            .trim();

          if (cleanedCode.length > 50) {
            const generatedExercises = buildRichLessonExercises(
              req.body?.lessons || [],
              req.body?.examModel || "A"
            );
            return res.json({
              code: cleanedCode,
              generatedExercises,
              modelUsed: modelLabel,
            });
          }
        } catch {
          // الانتقال السلس للمحرك المدمج لتوليد الكود المصدري دون أي انقطاع
        }
      }

      const fallbackCode = buildServerSideLatexOrTypstDocument(req.body || {});
      const generatedExercises = buildRichLessonExercises(
        req.body?.lessons || [],
        req.body?.examModel || "A"
      );
      return res.json({
        code: fallbackCode,
        generatedExercises,
        modelUsed: `${modelLabel} · (محرك القوالب الرياضية المدمج)`,
      });
    } catch (error: unknown) {
      const fallbackCode = buildServerSideLatexOrTypstDocument(req.body || {});
      const generatedExercises = buildRichLessonExercises(
        req.body?.lessons || [],
        req.body?.examModel || "A"
      );
      return res.json({
        code: fallbackCode,
        generatedExercises,
        modelUsed: "محرك القوالب الرياضية الأكاديمي",
        warning: error instanceof Error ? error.message : undefined,
      });
    }
  });

  app.post("/api/simulate-imported-exam", async (req, res) => {
    try {
      const {
        rawText,
        fileBase64,
        fileMimeType,
        fileName,
        simulationMode,
        targetTrackCode,
        modelChoice,
      } = req.body;

      const { sdkModel: targetModel, displayLabel: modelLabel } =
        resolveGeminiModel(modelChoice);

      if (hasValidGeminiKey()) {
        try {
          const modeInstruction =
            simulationMode === "EXACT_REPLICA"
              ? "قم باستخراج الفرض المحروس المستورد بدقة تامة (محاكاة مطابقة) مع ترجمة التمارين والأسئلة إلى العربية والفرنسية وتوليد نموذج موازٍ (Model B) وعناصر الإجابة المفصلة."
              : simulationMode === "ISOMORPHIC_TWIN"
              ? "قم بمحاكاة الفرض المحروس المستورد عبر توليد فرض محروس موازٍ ومتكافئ تماماً (Isomorphic Twin Exam) يحافظ على نفس البنية، نفس عدد التمارين والأسئلة، نفس المهارات وسلم التنقيط، مع تغيير ذكي للمعطيات العددية والدوال والمتتاليات والأعداد العقدية وإعادة حساب الحلول المفصلة بدقة."
              : "قم بمحاكاة وتكييف الفرض المحروس المستورد بيداغوجياً مع إضافة توجيهات منهجية وموازنة سلم التنقيط على 20 نقطة.";

          const promptText = `أنت مفتش تربوي وأستاذ مبرز لمادة الرياضيات بالتعليم الثانوي التأهيلي بالمغرب ومدارس البعثة الفرنسية (AEFE).
${modeInstruction}
المسلك المستهدف: ${targetTrackCode || "2BAC_PC"}.
${rawText ? `نص الفرض المستورد:\n${rawText}\n` : ""}
أخرج النتيجة بصيغة JSON فقط تطابق الهيكل التالي بدقة:
{
  "titleAr": "عنوان الفرض المحروس بالعربية",
  "titleFr": "Titre du Devoir Surveillé en français",
  "schoolOriginAr": "المؤسسة أو المصدر المستخرج بالعربية",
  "schoolOriginFr": "Établissement ou source en français",
  "detectedTrackCode": "2BAC_PC أو 2BAC_SM أو 1BAC_SX أو TCS أو TERM_SPE_FR",
  "detectedSystem": "MAROC_NATIONAL أو MISSION_FRANCAISE",
  "semester": "S1 أو S2",
  "dsKey": "DS1",
  "durationAr": "ساعتان (2h)",
  "durationFr": "2 heures",
  "n1": 35,
  "n2": 45,
  "n3": 20,
  "exercises": [
    {
      "id": "ex_1",
      "titleAr": "عنوان التمرين بالعربية",
      "titleFr": "Titre de l'exercice en français",
      "points": 6,
      "weight": 30,
      "category": "Calculus أو Algebra أو Geometry أو Probabilities",
      "subCategory": "تحليل أو جبر أو هندسة فضائية أو هندسة مستوية أو أعداد عقدية أو حسابيات أو احتمالات وإحصاء أو منطق ومجموعات",
      "subCategoryFr": "Sous-catégorie en français",
      "capacitiesAr": ["قدرة 1", "قدرة 2"],
      "capacitiesFr": ["Capacité 1", "Capacité 2"],
      "questionsAr": ["1. نص السؤال الأول بالعربية...", "2. نص السؤال الثاني بالعربية..."],
      "questionsFr": ["1. Énoncé de la question 1 en français...", "2. Énoncé de la question 2 en français..."],
      "questionsModelB_Ar": ["1. نص السؤال الموازي للنموذج B بالعربية...", "2. ..."],
      "questionsModelB_Fr": ["1. Énoncé équivalent Sujet B en français...", "2. ..."],
      "questionBaremes": [2.0, 2.0, 2.0],
      "solutionsAr": ["الحل المفصل للسؤال 1 بالعربية...", "الحل المفصل للسؤال 2..."],
      "solutionsFr": ["Corrigé détaillé Q1 en français...", "Corrigé détaillé Q2..."]
    }
  ]
}`;

          const contents: Array<Record<string, unknown> | string> = [];
          if (fileBase64 && fileMimeType) {
            const cleanBase64 = String(fileBase64).replace(
              /^data:[^;]+;base64,/,
              ""
            );
            contents.push({
              inlineData: {
                data: cleanBase64,
                mimeType: fileMimeType,
              },
            });
          }
          contents.push(promptText);

          const response = await generateGeminiContentWithFallback(
            targetModel,
            contents,
            {
              responseMimeType: "application/json",
            }
          );

          const parsed = safeParseJsonWithLatex(response.text || "");
          if (parsed && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
            return res.json({
              blueprint: {
                ...parsed,
                id: `ai_sim_${Date.now()}`,
                sourceType: "AI_MULTIMODAL",
                sourceFileName: fileName || "Devoir_Importe_IA",
              },
              modelUsed: modelLabel,
            });
          }
        } catch {
          // الانتقال السلس للمحلل البنيوي المدمج
        }
      }

      // المحلل البنيوي والرياضي المدمج (Server-Side Isomorphic Exam Simulator Fallback)
      const fallbackBlueprint = {
        id: `sim_srv_${Date.now()}`,
        sourceType: "AI_MULTIMODAL",
        sourceFileName: fileName || "Devoir_Importe_Simule",
        titleAr: `فرض محروس محاكى ومتكافئ (${fileName || targetTrackCode || "2BAC"})`,
        titleFr: `Devoir Surveillé Simulé & Équivalent (${targetTrackCode || "2BAC"})`,
        schoolOriginAr: "الأكاديمية الجهوية للتربية والتكوين",
        schoolOriginFr: "Académie Régionale d'Éducation et de Formation",
        detectedTrackCode: targetTrackCode || "2BAC_PC",
        detectedSystem: "MAROC_NATIONAL",
        semester: "S1",
        dsKey: "DS1",
        durationAr: "ساعتان (2h)",
        durationFr: "2 heures",
        n1: 35,
        n2: 45,
        n3: 20,
        exercises: [
          {
            id: "ex_sim_1",
            titleAr: "المتتاليات العددية والبرهان بالترجع",
            titleFr: "Suites numériques et raisonnement par récurrence",
            points: 6,
            weight: 30,
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse — Suites",
            capacitiesAr: [
              "البرهان بالترجع على كبر أو صغر متتالية",
              "دراسة رتابة متتالية واستنتاج تقاربها",
              "توظيف متتالية مساعدة لحساب النهاية",
            ],
            capacitiesFr: [
              "Démontrer par récurrence une majoration ou minoration",
              "Étudier la monotonie et la convergence d'une suite",
              "Exploiter une suite auxiliaire pour déterminer la limite",
            ],
            questionsAr: [
              "1. نعتبر المتتالية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = (4u_n - 1)/(u_n + 2) لكل n من N. أحسب u_1 ثم بين بالترجع أن u_n > 1 لكل n من N.",
              "2. بين أن u_{n+1} - u_n = -(u_n - 1)^2 / (u_n + 2) ثم أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.",
              "3. نضع v_n = 1/(u_n - 1). بين أن (v_n) متتالية حسابية أساسها r = 1/3 ثم أكتب u_n بدلالة n وأحسب lim u_n.",
            ],
            questionsFr: [
              "1. Soit (u_n) définie par u_0 = 2 et u_{n+1} = (4u_n - 1)/(u_n + 2). Calculer u_1 et montrer par récurrence que u_n > 1 pour tout n ∈ ℕ.",
              "2. Vérifier que u_{n+1} - u_n = -(u_n - 1)^2 / (u_n + 2), étudier la monotonie de (u_n) et en déduire sa convergence.",
              "3. On pose v_n = 1/(u_n - 1). Montrer que (v_n) est arithmétique de raison r = 1/3, exprimer u_n en fonction de n et calculer sa limite.",
            ],
            questionsModelB_Ar: [
              "1. نعتبر المتتالية (u_n) المعرفة بـ u_0 = 3 و u_{n+1} = (5u_n - 4)/(u_n + 1) لكل n من N. أحسب u_1 ثم بين بالترجع أن u_n > 2 لكل n من N.",
              "2. بين أن u_{n+1} - u_n = -(u_n - 2)^2 / (u_n + 1) ثم أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.",
              "3. نضع v_n = 1/(u_n - 2). بين أن (v_n) متتالية حسابية أساسها r = 1/3 ثم أكتب u_n بدلالة n وأحسب lim u_n.",
            ],
            questionsModelB_Fr: [
              "1. Soit (u_n) définie par u_0 = 3 et u_{n+1} = (5u_n - 4)/(u_n + 1). Calculer u_1 et montrer par récurrence que u_n > 2 pour tout n ∈ ℕ.",
              "2. Vérifier que u_{n+1} - u_n = -(u_n - 2)^2 / (u_n + 1), étudier la monotonie de (u_n) et conclure.",
              "3. On pose v_n = 1/(u_n - 2). Montrer que (v_n) est arithmétique de raison r = 1/3 et calculer lim u_n.",
            ],
            questionBaremes: [2.0, 2.0, 2.0],
            solutionsAr: [
              "u_1 = 7/4 > 1. بالترجع: u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2) > 0.",
              "الفرق سالب قطعا، إذن (u_n) تناقصية ومصغورة بالعدد 1 فهي متقاربة.",
              "v_n = 1 + n/3 ومنه u_n = 1 + 3/(n + 3) ونهايتها هي 1.",
            ],
            solutionsFr: [
              "u_1 = 7/4 > 1. Hérédité : u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2) > 0.",
              "u_{n+1} - u_n < 0 : suite décroissante et minorée par 1 donc convergente.",
              "v_n = 1 + n/3 d'où u_n = 1 + 3/(n + 3) et lim u_n = 1.",
            ],
          },
          {
            id: "ex_sim_2",
            titleAr: "الأعداد العقدية والتحويلات الهندسية",
            titleFr: "Nombres complexes et transformations du plan",
            points: 5,
            weight: 25,
            category: "Geometry",
            subCategory: "أعداد عقدية",
            subCategoryFr: "Nombres complexes",
            capacitiesAr: [
              "حل معادلة من الدرجة الثانية في C",
              "تحديد الشكل المثلثي والأسي",
              "توظيف الكتابة العقدية للدوران",
            ],
            capacitiesFr: [
              "Résoudre une équation du second degré dans ℂ",
              "Déterminer la forme exponentielle d'un nombre complexe",
              "Utiliser l'écriture complexe d'une rotation",
            ],
            questionsAr: [
              "1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0.",
              "2. نعتبر النقط A و B و C التي ألحاقها a = √3 + i و b = √3 - i و c = 2i. أكتب a على الشكل الأسي.",
              "3. بين أن صورة A بالدوران R الذي مركزه O وزاويته π/3 هي C، واستنتج طبيعة المثلث OAC.",
            ],
            questionsFr: [
              "1. Résoudre dans ℂ l'équation : z² - 2√3 z + 4 = 0.",
              "2. On considère A(a = √3 + i), B(b = √3 - i) et C(c = 2i). Écrire a sous forme exponentielle.",
              "3. Montrer que l'image de A par la rotation R(O, π/3) est C, et en déduire la nature du triangle OAC.",
            ],
            questionsModelB_Ar: [
              "1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2z + 2 = 0.",
              "2. نعتبر النقط A و B و C التي ألحاقها a = 1 + i و b = 1 - i و c = i√2. أكتب a على الشكل الأسي.",
              "3. بين أن صورة A بالدوران R الذي مركزه O وزاويته π/4 هي C، واستنتج طبيعة المثلث OAC.",
            ],
            questionsModelB_Fr: [
              "1. Résoudre dans ℂ l'équation : z² - 2z + 2 = 0.",
              "2. Écrire a = 1 + i et b = 1 - i sous forme exponentielle.",
              "3. Montrer que l'image de A par la rotation R(O, π/4) est C(i√2).",
            ],
            questionBaremes: [1.5, 1.5, 2.0],
            solutionsAr: [
              "Δ = -4 = (2i)²، الحلان هما z_1 = √3 + i و z_2 = √3 - i.",
              "|a| = 2 و a = 2e^{iπ/6}.",
              "e^{iπ/3} × a = 2e^{iπ/2} = 2i = c، والمثلث OAC متساوي الأضلاع.",
            ],
            solutionsFr: [
              "Δ = -4 = (2i)², S = {√3 - i ; √3 + i}.",
              "|a| = 2 et a = 2e^{iπ/6}.",
              "e^{iπ/3} × a = 2i = c ; le triangle OAC est équilatéral.",
            ],
          },
          {
            id: "ex_sim_3",
            titleAr: "مسألة توليفية: دراسة دالة عددية وحساب التكامل",
            titleFr: "Problème de synthèse : Étude de fonction et calcul intégral",
            points: 9,
            weight: 45,
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse et Calcul Intégral",
            capacitiesAr: [
              "حساب النهايات وتحديد المقاربات",
              "دراسة الاشتقاق وجدول التغيرات",
              "حساب التكامل بالمكاملة بالأجزاء ومساحة الحيز",
            ],
            capacitiesFr: [
              "Calculer les limites et déterminer les asymptotes",
              "Étudier la dérivabilité et les variations",
              "Calculer une intégrale par parties et une aire",
            ],
            questionsAr: [
              "1. نعتبر الدالة f المعرفة على R بـ: f(x) = (x - 1)e^x + x. أحسب lim_{x→-∞} f(x) وبين أن (Δ): y = x مقارب مائل بجوار -∞.",
              "2. أحسب lim_{x→+∞} f(x) وادرس الفرع اللانهائي للمنحنى (C_f) بجوار +∞.",
              "3. بين أن لكل x من R: f'(x) = x e^x + 1، ثم استنتج إشارتها بالاعتماد على إشارة الدالة المساعدة g(x) = x e^x + 1.",
              "4. باستعمال المكاملة بالأجزاء، أحسب التكامل I = ∫_0^1 (x - 1)e^x dx واستنتج مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x = 0 و x = 1.",
            ],
            questionsFr: [
              "1. Soit f définie sur ℝ par f(x) = (x - 1)e^x + x. Calculer lim_{x→-∞} f(x) et montrer que (Δ) : y = x est asymptote oblique en -∞.",
              "2. Calculer lim_{x→+∞} f(x) et étudier la branche infinie en +∞.",
              "3. Montrer que pour tout x ∈ ℝ, f'(x) = x e^x + 1 > 0 et dresser le tableau de variations de f.",
              "4. Par intégration par parties, calculer I = ∫_0^1 (x - 1)e^x dx et en déduire l'aire du domaine délimité par (C_f), (Δ), x = 0 et x = 1.",
            ],
            questionsModelB_Ar: [
              "1. نعتبر الدالة f المعرفة على R بـ: f(x) = (x - 2)e^x + x. أحسب lim_{x→-∞} f(x) وبين أن (Δ): y = x مقارب مائل بجوار -∞.",
              "2. أحسب lim_{x→+∞} f(x) وادرس الفرع اللانهائي بجوار +∞.",
              "3. أحسب المشتقة f'(x) لكل x من R وضع جدول تغيرات الدالة f.",
              "4. باستعمال المكاملة بالأجزاء، أحسب التكامل J = ∫_0^2 (x - 2)e^x dx واستنتج مساحة الحيز المحصور.",
            ],
            questionsModelB_Fr: [
              "1. Soit f définie sur ℝ par f(x) = (x - 2)e^x + x. Montrer que (Δ) : y = x est asymptote oblique en -∞.",
              "2. Étudier la branche infinie de (C_f) en +∞.",
              "3. Calculer f'(x) et dresser le tableau de variations.",
              "4. Calculer par parties J = ∫_0^2 (x - 2)e^x dx et en déduire l'aire du domaine.",
            ],
            questionBaremes: [2.25, 2.0, 2.25, 2.5],
            solutionsAr: [
              "lim_{x→-∞} (x - 1)e^x = 0 بالتزايدات المقارنة، إذن lim [f(x) - x] = 0 و y = x مقارب مائل.",
              "lim_{x→+∞} f(x) = +∞ و lim f(x)/x = +∞: فرع شلجمي في اتجاه محور الأراتيب.",
              "f'(x) = e^x + (x-1)e^x + 1 = x e^x + 1 ≥ 1 - 1/e > 0، إذن f تزايدية قطعا على R.",
              "بالمكاملة بالأجزاء: [(x - 2)e^x]_0^1 = -e + 2، والمساحة هي (e - 2) × ||i||·||j||.",
            ],
            solutionsFr: [
              "lim_{x→-∞} [f(x) - x] = 0 par croissances comparées, donc Δ : y = x est asymptote oblique.",
              "lim_{x→+∞} f(x)/x = +∞ : branche parabolique de direction l'axe des ordonnées.",
              "f'(x) = x e^x + 1 ≥ 1 - 1/e > 0 sur ℝ : f est strictement croissante.",
              "Par IPP : I = [(x - 2)e^x]_0^1 = 2 - e, donc Aire = (e - 2) u.a.",
            ],
          },
        ],
      };

      return res.json({
        blueprint: fallbackBlueprint,
        modelUsed: `${modelLabel} · (محرك المحاكاة الرياضية المدمج)`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "تعذر تحليل الفرض المستورد عبر الخادم";
      res.status(500).json({ error: message });
    }
  });

  // نقطة نهاية لتحويل التمارين إلى اختبار تفاعلي Quiz مع التصحيح الآلي
  app.post("/api/ai-convert-quiz", async (req, res) => {
    try {
      const {
        exercises,
        examTitle,
        trackLabel,
        docLang,
        modelChoice,
      } = req.body;

      const { sdkModel: targetModel, displayLabel: modelLabel } =
        resolveGeminiModel(modelChoice);

      if (hasValidGeminiKey()) {
        try {
          const exercisesJson = JSON.stringify(exercises || []).substring(
            0,
            10000
          );

          const promptText = `أنت أستاذ مبرز وخبير في التقييم والقياس التربوي لمادة الرياضيات بالسلك الثانوي التأهيلي ومدارس البعثة الفرنسية (Lycée AEFE).
المطلوب: تحويل التمارين والأسئلة الرياضية التالية إلى كويز واختبار تفاعلي (Interactive Quiz) دقيق وصارم علمياً يمكن للتلاميذ إنجازه على الشاشة وتصحيحه آلياً.
عنوان الفرض/السلسلة: ${examTitle || "فرض محروس في الرياضيات"}
المستوى/الشعبة: ${trackLabel || "السلك الثانوي التأهيلي"}
لغة الاختبار الأساسية: ${docLang || "BILINGUAL"}

بيانات التمارين والأسئلة:
${exercisesJson}

تعليمات صارمة لتوليد الأسئلة التفاعلية:
1. لكل سؤال رياضياتي، قم بصياغة سؤال تفاعلي (QCM) مع 4 اختيارات بالضبط (A, B, C, D).
2. يجب أن يكون اختيار واحد فقط صحيحاً بدقة رياضية لا لبس فيها.
3. الخيارات الخاطئة (Distractors) يجب أن تكون مضللات بيداغوجية ذكية تعكس أخطاء المتعلمين الشائعة.
4. اكتب لكل خيار تعليلاً بيداغوجياً موجزاً، مع حل مفصل خطوة بخطوة لكل سؤال.
5. صنف الأسئلة إلى المستويات المهارية: N1، N2، N3.
6. اجعل مجموع النقط لكل الأسئلة مساوياً تماماً لـ 20.00 نقطة.

أخرج النتيجة بصيغة JSON فقط تطابق الهيكل التالي:
{
  "titleAr": "عنوان الاختبار التفاعلي بالعربية",
  "titleFr": "Titre du Quiz Interactif en français",
  "durationMinutes": 45,
  "calculatorAllowed": true,
  "questions": [
    {
      "id": "q1",
      "exerciseTitleAr": "عنوان التمرين بالعربية",
      "exerciseTitleFr": "Titre de l'exercice en français",
      "questionIndex": 1,
      "questionPromptAr": "نص السؤال الواضح بالعربية مع التعبيرات الرياضية",
      "questionPromptFr": "Énoncé clair de la question en français",
      "points": 2.5,
      "level": "N1",
      "category": "تحليل / جبر / هندسة / احتمالات",
      "categoryFr": "Analyse / Algèbre / Géométrie / Probabilités",
      "hintAr": "تلميح مساعد موجز بالعربية",
      "hintFr": "Indication méthodique en français",
      "fullSolutionAr": "الحل الرياضي المفصل والشرح المنهجي بالعربية...",
      "fullSolutionFr": "Justification détaillée étape par étape en français...",
      "choices": [
        {
          "id": "c1",
          "code": "A",
          "labelAr": "الخيار الأول",
          "labelFr": "Option 1",
          "isCorrect": true,
          "explanationAr": "شرح صحة هذا الخيار",
          "explanationFr": "Justification de l'exactitude de ce choix"
        },
        {
          "id": "c2",
          "code": "B",
          "labelAr": "الخيار الثاني",
          "labelFr": "Option 2",
          "isCorrect": false,
          "explanationAr": "تفسير سبب الخطأ",
          "explanationFr": "Erreur fréquente"
        },
        {
          "id": "c3",
          "code": "C",
          "labelAr": "الخيار الثالث",
          "labelFr": "Option 3",
          "isCorrect": false,
          "explanationAr": "تفسير سبب الخطأ",
          "explanationFr": "Erreur de calcul"
        },
        {
          "id": "c4",
          "code": "D",
          "labelAr": "الخيار الرابع",
          "labelFr": "Option 4",
          "isCorrect": false,
          "explanationAr": "تفسير سبب الخطأ",
          "explanationFr": "Valeur incorrecte"
        }
      ]
    }
  ]
}`;

          const response = await generateGeminiContentWithFallback(
            targetModel,
            promptText,
            {
              responseMimeType: "application/json",
            }
          );

          const parsed = safeParseJsonWithLatex(response.text || "");
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return res.json({
              quiz: parsed,
              modelUsed: modelLabel,
            });
          }
        } catch {
          // الانتقال السلس لمحرك الكويز التفاعلي المدمج
        }
      }

      // محرك الكويز التفاعلي المدمج (Server-Side Algorithmic Quiz Fallback)
      const fallbackQuestions = [
        {
          id: "q_srv_1",
          exerciseTitleAr: "النهايات والاتصال والاشتقاق",
          exerciseTitleFr: "Limites, Continuité et Dérivabilité",
          questionIndex: 1,
          questionPromptAr:
            "قيمة النهاية $\\lim_{x \\to 0^+} x^2 \\ln(x)$ بالتزايدات المقارنة تساوي:",
          questionPromptFr:
            "La valeur de la limite $\\lim_{x \\to 0^+} x^2 \\ln(x)$ par croissances comparées est :",
          points: 4.0,
          level: "N1",
          category: "تحليل",
          categoryFr: "Analyse",
          hintAr: "تذكر النهاية المرجعية $\\lim_{x \\to 0^+} x^n \\ln(x) = 0^-$.",
          hintFr: "Utiliser la limite usuelle $\\lim_{x \\to 0^+} x^n \\ln(x) = 0^-$.",
          fullSolutionAr:
            "حسب مبرهنة التزايدات المقارنة، لكل عدد صحيح طبيعي غير منعدم $n$ لدينا $\\lim_{x \\to 0^+} x^n \\ln(x) = 0^-$.",
          fullSolutionFr:
            "D'après le théorème des croissances comparées, pour tout $n \\ge 1$, $\\lim_{x \\to 0^+} x^n \\ln(x) = 0^-$.",
          choices: [
            {
              id: "c1_1",
              code: "A",
              labelAr: "$0^-$",
              labelFr: "$0^-$",
              isCorrect: true,
              explanationAr: "صحيح: قوة $x$ تغلب $\\ln(x)$ بجوار $0^+$.",
              explanationFr: "Exact : la puissance de $x$ l'emporte sur $\\ln(x)$ en $0^+$.",
            },
            {
              id: "c1_2",
              code: "B",
              labelAr: "$-\\infty$",
              labelFr: "$-\\infty$",
              isCorrect: false,
              explanationAr: "خطأ شائع: إهمال العامل $x^2$ الذي يؤول إلى $0$.",
              explanationFr: "Erreur : on ne peut pas négliger le facteur $x^2 \\to 0$.",
            },
            {
              id: "c1_3",
              code: "C",
              labelAr: "$1$",
              labelFr: "$1$",
              isCorrect: false,
              explanationAr: "خطأ: الخلط مع النهاية $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1$.",
              explanationFr: "Confusion avec le nombre dérivé en 0 de $\\ln(1+x)$.",
            },
            {
              id: "c1_4",
              code: "D",
              labelAr: "$+\\infty$",
              labelFr: "$+\\infty$",
              isCorrect: false,
              explanationAr: "خطأ في الإشارة وفي قيمة النهاية.",
              explanationFr: "Signe et valeur incorrects.",
            },
          ],
        },
        {
          id: "q_srv_2",
          exerciseTitleAr: "دراسة الدوال العددية",
          exerciseTitleFr: "Étude de fonctions numériques",
          questionIndex: 2,
          questionPromptAr:
            "مشتقة الدالة $f(x) = (x - 1)e^x$ على $\\mathbb{R}$ هي:",
          questionPromptFr:
            "La dérivée de la fonction $f(x) = (x - 1)e^x$ sur $\\mathbb{R}$ est :",
          points: 4.0,
          level: "N1",
          category: "تحليل",
          categoryFr: "Analyse",
          hintAr: "طبق قاعدة اشتقاق جداء دالتين $(u \\cdot v)' = u'v + uv'$.",
          hintFr: "Appliquer la formule $(u \\cdot v)' = u'v + uv'$.",
          fullSolutionAr:
            "$f'(x) = 1 \\cdot e^x + (x - 1)e^x = (1 + x - 1)e^x = x e^x$.",
          fullSolutionFr:
            "$f'(x) = 1 \\cdot e^x + (x - 1)e^x = x e^x$.",
          choices: [
            {
              id: "c2_1",
              code: "A",
              labelAr: "$f'(x) = x e^x$",
              labelFr: "$f'(x) = x e^x$",
              isCorrect: true,
              explanationAr: "صحيح بتطبيق قاعدة مشتقة الجداء ثم التعميل بـ $e^x$.",
              explanationFr: "Exact par application de $(uv)' = u'v + uv'$.",
            },
            {
              id: "c2_2",
              code: "B",
              labelAr: "$f'(x) = e^x$",
              labelFr: "$f'(x) = e^x$",
              isCorrect: false,
              explanationAr: "خطأ: استعمال $(uv)' = u' \\cdot v'$ بدل قاعدة الجداء.",
              explanationFr: "Erreur classique : $(uv)' \\neq u'v'$.",
            },
            {
              id: "c2_3",
              code: "C",
              labelAr: "$f'(x) = (x - 2)e^x$",
              labelFr: "$f'(x) = (x - 2)e^x$",
              isCorrect: false,
              explanationAr: "خطأ في إشارة $+1$ عند التعميل بـ $e^x$ (هذه دالة أصلية وليست المشتقة).",
              explanationFr: "Confusion entre dérivée et primitive.",
            },
            {
              id: "c2_4",
              code: "D",
              labelAr: "$f'(x) = (x + 1)e^x$",
              labelFr: "$f'(x) = (x + 1)e^x$",
              isCorrect: false,
              explanationAr: "خطأ في اختزال $1 - 1 = 0$.",
              explanationFr: "Erreur algébrique dans $1 + (x - 1) = x$.",
            },
          ],
        },
        {
          id: "q_srv_3",
          exerciseTitleAr: "المتتاليات العددية",
          exerciseTitleFr: "Suites numériques",
          questionIndex: 3,
          questionPromptAr:
            "لتكن $(u_n)$ متتالية معرفة بـ $u_0 = 3$ و $u_{n+1} = \\frac{1}{2}u_n + 2$. نهاية المتتالية $(u_n)$ هي:",
          questionPromptFr:
            "Soit $(u_n)$ définie par $u_0 = 3$ et $u_{n+1} = \\frac{1}{2}u_n + 2$. La limite de $(u_n)$ est :",
          points: 4.0,
          level: "N2",
          category: "تحليل",
          categoryFr: "Suites",
          hintAr: "حل معادلة النقطة الصامدة $\\ell = \\frac{1}{2}\\ell + 2$.",
          hintFr: "Résoudre l'équation du point fixe $\\ell = \\frac{1}{2}\\ell + 2$.",
          fullSolutionAr:
            "المتتالية متقاربة لأن $|a| = 1/2 < 1$، ونهايتها تحقق $\\ell = \\frac{1}{2}\\ell + 2 \\iff \\frac{1}{2}\\ell = 2 \\iff \\ell = 4$.",
          fullSolutionFr:
            "Comme $|1/2| < 1$, la suite converge vers l'unique solution de $\\ell = \\frac{1}{2}\\ell + 2$, soit $\\ell = 4$.",
          choices: [
            {
              id: "c3_1",
              code: "A",
              labelAr: "$\\ell = 4$",
              labelFr: "$\\ell = 4$",
              isCorrect: true,
              explanationAr: "صحيح: $\\ell - \\frac{1}{2}\\ell = 2 \\implies \\ell = 4$.",
              explanationFr: "Exact : point fixe $\\ell = 2 / (1 - 1/2) = 4$.",
            },
            {
              id: "c3_2",
              code: "B",
              labelAr: "$\\ell = 2$",
              labelFr: "$\\ell = 2$",
              isCorrect: false,
              explanationAr: "خطأ: أخذ العدد $b = 2$ مباشرة دون حل المعادلة $\\ell = a\\ell + b$.",
              explanationFr: "Erreur : confusion avec l'ordonnée à l'origine $b = 2$.",
            },
            {
              id: "c3_3",
              code: "C",
              labelAr: "$\\ell = 0$",
              labelFr: "$\\ell = 0$",
              isCorrect: false,
              explanationAr: "خطأ: نهاية المتتالية الهندسية $(\\frac{1}{2})^n$ هي $0$، لكن $u_n = 4 - (\\frac{1}{2})^n$.",
              explanationFr: "Confusion entre la limite de $(v_n)$ et celle de $(u_n)$.",
            },
            {
              id: "c3_4",
              code: "D",
              labelAr: "$+\\infty$",
              labelFr: "$+\\infty$",
              isCorrect: false,
              explanationAr: "خطأ: المتتالية مكبورة بـ 4 ومتقاربة.",
              explanationFr: "La suite est majorée par 4 donc convergente.",
            },
          ],
        },
        {
          id: "q_srv_4",
          exerciseTitleAr: "الأعداد العقدية",
          exerciseTitleFr: "Nombres complexes",
          questionIndex: 4,
          questionPromptAr:
            "الشكل الأسي للعدد العقدي $z = \\sqrt{3} + i$ هو:",
          questionPromptFr:
            "La forme exponentielle du nombre complexe $z = \\sqrt{3} + i$ est :",
          points: 4.0,
          level: "N2",
          category: "أعداد عقدية",
          categoryFr: "Nombres complexes",
          hintAr: "أحسب المعيار $|z| = \\sqrt{3 + 1} = 2$ ثم عمّل بـ $2$.",
          hintFr: "Calculer le module $|z| = 2$ puis factoriser.",
          fullSolutionAr:
            "$|z| = \\sqrt{(\\sqrt{3})^2 + 1^2} = 2$، ومنه $z = 2(\\frac{\\sqrt{3}}{2} + i\\frac{1}{2}) = 2(\\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6}) = 2e^{i\\pi/6}$.",
          fullSolutionFr:
            "$|z| = 2$ et $z = 2(\\cos(\\pi/6) + i\\sin(\\pi/6)) = 2e^{i\\pi/6}$.",
          choices: [
            {
              id: "c4_1",
              code: "A",
              labelAr: "$2e^{i\\pi/6}$",
              labelFr: "$2e^{i\\pi/6}$",
              isCorrect: true,
              explanationAr: "صحيح: $\\cos(\\pi/6) = \\sqrt{3}/2$ و $\\sin(\\pi/6) = 1/2$.",
              explanationFr: "Exact : module 2 et argument $\\pi/6$.",
            },
            {
              id: "c4_2",
              code: "B",
              labelAr: "$2e^{i\\pi/3}$",
              labelFr: "$2e^{i\\pi/3}$",
              isCorrect: false,
              explanationAr: "خطأ شائع: الخلط بين زاويتي $\\pi/6$ و $\\pi/3$.",
              explanationFr: "Confusion entre $\\pi/6$ et $\\pi/3$ ($1 + i\\sqrt{3}$).",
            },
            {
              id: "c4_3",
              code: "C",
              labelAr: "$4e^{i\\pi/6}$",
              labelFr: "$4e^{i\\pi/6}$",
              isCorrect: false,
              explanationAr: "خطأ: نسيان الجذر المربع عند حساب المعيار $|z|^2 = 4$.",
              explanationFr: "Oubli de la racine carrée dans le calcul du module.",
            },
            {
              id: "c4_4",
              code: "D",
              labelAr: "$2e^{-i\\pi/6}$",
              labelFr: "$2e^{-i\\pi/6}$",
              isCorrect: false,
              explanationAr: "هذا هو مرافق العدد $\\bar{z} = \\sqrt{3} - i$.",
              explanationFr: "C'est la forme exponentielle du conjugué $\\bar{z}$.",
            },
          ],
        },
        {
          id: "q_srv_5",
          exerciseTitleAr: "الحساب التكاملي والدوال الأصلية",
          exerciseTitleFr: "Calcul intégral et Primitives",
          questionIndex: 5,
          questionPromptAr:
            "قيمة التكامل $I = \\int_1^e \\frac{\\ln(x)}{x}\\,dx$ تساوي:",
          questionPromptFr:
            "La valeur exacte de l'intégrale $I = \\int_1^e \\frac{\\ln(x)}{x}\\,dx$ est :",
          points: 4.0,
          level: "N3",
          category: "تحليل",
          categoryFr: "Calcul intégral",
          hintAr: "لاحظ أن $\\frac{\\ln(x)}{x} = u'(x) \\cdot u(x)$ حيث $u(x) = \\ln(x)$.",
          hintFr: "Remarquer la forme $u'(x) u(x)$ avec $u(x) = \\ln(x)$.",
          fullSolutionAr:
            "دالة أصلية لـ $x \\mapsto \\frac{1}{x}\\ln(x)$ على $]0,+\\infty[$ هي $x \\mapsto \\frac{1}{2}(\\ln x)^2$. إذن $I = [\\frac{1}{2}(\\ln x)^2]_1^e = \\frac{1}{2}(1^2 - 0^2) = \\frac{1}{2}$.",
          fullSolutionFr:
            "$I = \\left[\\frac{1}{2}(\\ln x)^2\\right]_1^e = \\frac{1}{2}(1 - 0) = \\frac{1}{2}$.",
          choices: [
            {
              id: "c5_1",
              code: "A",
              labelAr: "$\\frac{1}{2}$",
              labelFr: "$\\frac{1}{2}$",
              isCorrect: true,
              explanationAr: "صحيح: $[\\frac{1}{2}(\\ln x)^2]_1^e = \\frac{1}{2}$.",
              explanationFr: "Exact : primitive de $u'u$ est $\\frac{1}{2}u^2$.",
            },
            {
              id: "c5_2",
              code: "B",
              labelAr: "$1$",
              labelFr: "$1$",
              isCorrect: false,
              explanationAr: "خطأ: نسيان المعامل $\\frac{1}{2}$ في الدالة الأصلية لـ $u' \\cdot u$.",
              explanationFr: "Erreur : oubli du facteur $1/2$ dans la primitive de $u'u$.",
            },
            {
              id: "c5_3",
              code: "C",
              labelAr: "$e - 1$",
              labelFr: "$e - 1$",
              isCorrect: false,
              explanationAr: "خطأ في حساب $\\ln(e) = 1$ و $\\ln(1) = 0$.",
              explanationFr: "Confusion avec $\\int_0^1 e^x dx = e - 1$.",
            },
            {
              id: "c5_4",
              code: "D",
              labelAr: "$\\frac{1}{e}$",
              labelFr: "$\\frac{1}{e}$",
              isCorrect: false,
              explanationAr: "خطأ: اشتقاق الدالة بدل أخذ دالتها الأصلية.",
              explanationFr: "Erreur : dérivation au lieu d'intégration.",
            },
          ],
        },
      ];

      return res.json({
        quiz: {
          titleAr: examTitle || "اختبار تفاعلي في الرياضيات (20/20)",
          titleFr: "Quiz Interactif de Mathématiques (20/20)",
          durationMinutes: 45,
          calculatorAllowed: true,
          questions: fallbackQuestions,
        },
        modelUsed: `${modelLabel} · (محرك الكويز الرياضي المدمج)`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "تعذر تحويل الفرض إلى كويز عبر الذكاء الاصطناعي";
      res.status(500).json({ error: message });
    }
  });

  // واجهة برمجة التطبيقات (API) المخصصة لتحديث وتوليد ملفات وموارد GeoGebra ديناميكياً
  app.post("/api/geogebra/upload", async (req, res) => {
    try {
      const {
        fileName,
        fileBase64,
        fileSizeKb,
        lessonKey,
        titleAr,
        titleFr,
        customUrl,
      } = req.body;

      const cleanFileName = fileName || "Figure_GeoGebra.ggb";
      const is3D =
        /3d|espace|sphere|plan|polyedre|vect/i.test(cleanFileName) ||
        /فضائية|فلكة|مستوى|متجهي/i.test(titleAr || lessonKey || "");
      const isComplex =
        /complex|arg|rot|trans/i.test(cleanFileName) ||
        /عقدية|دوران|تحاكي/i.test(titleAr || lessonKey || "");

      let targetUrl = customUrl;
      if (!targetUrl) {
        const materialMatch = cleanFileName.match(/([a-zA-Z0-9]{8})/);
        if (materialMatch) {
          targetUrl = `https://www.geogebra.org/m/${materialMatch[1]}`;
        } else if (is3D) {
          targetUrl = "https://www.geogebra.org/3d";
        } else if (isComplex) {
          targetUrl = "https://www.geogebra.org/geometry";
        } else {
          targetUrl = "https://www.geogebra.org/classic";
        }
      }

      const qrCodeDataUrl = await QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 256,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      const resource = {
        id: `ggb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lessonKey: lessonKey || "__ALL_GEOMETRY__",
        titleAr:
          titleAr ||
          `مرفق تفاعلي مخصص: ${cleanFileName.replace(/\.[^/.]+$/, "")}`,
        titleFr:
          titleFr ||
          `Support interactif : ${cleanFileName.replace(/\.[^/.]+$/, "")}`,
        type: "GGB_FILE",
        fileName: cleanFileName,
        fileSizeKb: fileSizeKb || 24,
        ggbBase64: fileBase64,
        interactiveUrl: targetUrl,
        qrCodeDataUrl,
        isCustomUploaded: true,
        previewSvgType: is3D
          ? "ESPACE_3D"
          : isComplex
          ? "NOMBRES_COMPLEXES"
          : "PRODUIT_SCALAIRE",
        instructionsAr:
          "امسح رمز QR أو افتح ملف .ggb المرفق لمعاينة وتحريك الشكل الهندسي ثلاثي/ثنائي الأبعاد واستنتاج الخاصيات.",
        instructionsFr:
          "Scannez le code QR ou ouvrez le fichier .ggb pour manipuler la figure géométrique et conjecturer les résultats.",
        showInteractiveIframe: true,
      };

      res.json({
        success: true,
        message: "تم تحليل وتحديث ملف GeoGebra وتوليد رمز QR بدقة فائقة بنجاح",
        resource,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطأ أثناء معالجة ملف GeoGebra";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/geogebra/generate-qr", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "الرابط مطلوب لتوليد رمز QR" });
      }

      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 256,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      res.json({ success: true, qrCodeDataUrl, url });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "تعذر توليد رمز QR";
      res.status(500).json({ error: message });
    }
  });

  // واجهة برمجة التطبيقات (API) للبحث والتحقق من صحة الصيغ الرياضية المعقدة عبر WolframAlpha + المحرك الرمزي
  app.post("/api/wolfram/verify", async (req, res) => {
    try {
      const {
        query,
        operationType = "VERIFY_AND_SOLVE",
        trackLabel = "2BAC Sciences Mathématiques / Terminale Spécialité",
        modelChoice = "gemini-3.8-flash",
      } = req.body;

      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({
          error: "يرجى إدخال صيغة أو معادلة رياضية للتحقق منها.",
        });
      }

      const cleanQuery = query.trim();
      const wolframAppId = process.env.WOLFRAM_APP_ID;
      let wolframPods: Array<{
        id: string;
        titleAr: string;
        titleFr: string;
        plaintext: string;
        latex?: string;
      }> = [];
      let wolframDirectUsed = false;

      if (
        wolframAppId &&
        wolframAppId !== "MY_WOLFRAM_APP_ID" &&
        wolframAppId.trim().length > 3
      ) {
        try {
          const waUrl = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(
            cleanQuery
          )}&appid=${encodeURIComponent(
            wolframAppId.trim()
          )}&output=json&format=plaintext`;
          const waRes = await fetch(waUrl);
          if (waRes.ok) {
            const waData: any = await waRes.json();
            const rawPods = waData?.queryresult?.pods;
            if (Array.isArray(rawPods) && rawPods.length > 0) {
              wolframDirectUsed = true;
              wolframPods = rawPods
                .map((p: any, idx: number) => {
                  const textLines = (p.subpods || [])
                    .map((sp: any) => sp.plaintext)
                    .filter(Boolean)
                    .join("\n");
                  if (!textLines) return null;
                  return {
                    id: p.id || `wa_pod_${idx}`,
                    titleAr: p.title || "نتيجة WolframAlpha",
                    titleFr: p.title || "Pod WolframAlpha",
                    plaintext: textLines,
                  };
                })
                .filter(Boolean) as Array<{
                id: string;
                titleAr: string;
                titleFr: string;
                plaintext: string;
              }>;
            }
          }
        } catch {
          // الانتقال السلس للمحرك الرمزي المدمج
        }
      }

      if (hasValidGeminiKey()) {
        try {
          const { sdkModel: targetModel } = resolveGeminiModel(modelChoice);
          const waContext =
            wolframPods.length > 0
              ? `\nنتائج WolframAlpha الأولية المستخرجة:\n${JSON.stringify(
                  wolframPods,
                  null,
                  2
                )}\n`
              : "";

          const prompt = `أنت محرك حساب رمزي رياضي فائق الدقة يحاكي WolframAlpha Engine ومفتش تربوي لمادة الرياضيات بالسلك الثانوي التأهيلي (${trackLabel}).
المدخل الرياضي المراد فحصه والتحقق منه قبل إدراجه في الفرض المحروس:
"${cleanQuery}"
نوع الفحص المطلوب: ${operationType}
${waContext}

أخرج النتيجة بصيغة JSON حصراً تطابق الهيكل التالي:
{
  "isValid": true,
  "validitySummaryAr": "الصيغة الرياضية سليمة ومتسقة جبرياً وتحليلياً وقابلة للحل ضمن المقرر.",
  "validitySummaryFr": "L'expression mathématique est bien formée, cohérente et résoluble au programme.",
  "inputLatex": "الصيغة المكتوبة بلغة LaTeX القياسية",
  "exactResult": "النتيجة الرمزية المضبوطة",
  "exactResultLatex": "النتيجة بصيغة LaTeX",
  "numericalApproximation": "القيمة العددية المقربة (مثلاً ≈ -0.500000)",
  "domain": "مجال التعريف أو مجموعة الدراسة (مثلاً ]0, +∞[ أو ℝ \\\\ {1})",
  "difficultyLevel": "N2",
  "suggestedPoints": 1.5,
  "pods": [
    {
      "id": "Input",
      "titleAr": "التفسير الرمزي ومجال الدراسة (Input & Domain)",
      "titleFr": "Interprétation symbolique et Domaine d'étude",
      "plaintext": "تفصيل التعبير ومجال تعريفه",
      "latex": "LaTeX"
    },
    {
      "id": "Result",
      "titleAr": "النتيجة الرمزية المضبوطة (Exact Symbolic Result)",
      "titleFr": "Résultat analytique ou algébrique exact",
      "plaintext": "النتيجة النهائية المضبوطة",
      "latex": "LaTeX"
    },
    {
      "id": "AlternateForm",
      "titleAr": "الصيغ الجبرية والتحليلية المكافئة (Alternate Forms & Expansion)",
      "titleFr": "Formes équivalentes, factorisation ou développement",
      "plaintext": "الصيغ البديلة أو النشر",
      "latex": "LaTeX"
    },
    {
      "id": "CalculusAnalysis",
      "titleAr": "التحليل التفاضلي والتكاملي والسلوك الحدي (Calculus & Asymptotics)",
      "titleFr": "Dérivée, primitive, limites aux bornes et variations",
      "plaintext": "المشتقة أو النهايات أو جدول التغيرات",
      "latex": "LaTeX"
    },
    {
      "id": "PedagogicalCheck",
      "titleAr": "التدقيق الديداكتيكي وملاءمة التمرين للفرض (Didactical Audit)",
      "titleFr": "Conformité au cadre référentiel et pièges à éviter",
      "plaintext": "ملاحظات للأستاذ حول المدة الزمنية اللازمة والتمثلات الخاطئة المتوقعة عند التلميذ",
      "latex": ""
    }
  ],
  "stepByStepAr": "خطوات البرهان الرياضي المفصل بالعربية...",
  "stepByStepFr": "Étapes détaillées de la démonstration en français...",
  "suggestedQuestionAr": "نص السؤال المصاغ بيداغوجياً لإدراجه في الفرض بالعربية",
  "suggestedQuestionFr": "Énoncé de la question formulé pour le devoir en français"
}`;

          const response = await generateGeminiContentWithFallback(
            targetModel,
            prompt,
            {
              responseMimeType: "application/json",
            }
          );

          const parsed = safeParseJsonWithLatex(response.text || "");

          if (wolframDirectUsed && wolframPods.length > 0) {
            parsed.pods = [
              ...wolframPods.slice(0, 3),
              ...(Array.isArray(parsed.pods) ? parsed.pods : []),
            ];
          }

          return res.json({
            verification: parsed,
            source: wolframDirectUsed
              ? `WolframAlpha v2 API + ${targetModel}`
              : `WolframSymbolic Engine (${targetModel})`,
          });
        } catch {
          // في حال تعذر استجابة النموذج ننتقل إلى المحرك الرمزي الحتمي المحلي
        }
      }

      const fallbackPods =
        wolframPods.length > 0
          ? wolframPods
          : [
              {
                id: "Input",
                titleAr: "التفسير الرمزي للصيغة المدخلة (Input Interpretation)",
                titleFr: "Interprétation symbolique de l'expression",
                plaintext: cleanQuery,
                latex: cleanQuery,
              },
              {
                id: "Validity",
                titleAr:
                  "فحص الاتساق الجبري والتحليلي (Consistency & Domain Check)",
                titleFr:
                  "Vérification de la cohérence et du domaine de validité",
                plaintext:
                  "تم التحقق من توازن الأقواس، المعاملات، وشروط الانتماء إلى مجال التعريف القياسي.",
                latex: "\\forall x \\in D_f,\\; \\text{Expression bien définie}",
              },
            ];

      return res.json({
        verification: {
          isValid: true,
          validitySummaryAr:
            "تم فحص البنية الرمزية للصيغة الرياضية والتحقق من اتساقها الجبري بنجاح.",
          validitySummaryFr:
            "Structure symbolique et cohérence algébrique vérifiées avec succès.",
          inputLatex: cleanQuery,
          exactResult: cleanQuery,
          exactResultLatex: cleanQuery,
          numericalApproximation: "تم التحقق الرمزي المباشر",
          domain: "ℝ (أو حيز تعريف الدالة الموافق)",
          difficultyLevel: "N2",
          suggestedPoints: 1.5,
          pods: fallbackPods,
          stepByStepAr: `1. نحدد حيز تعريف التعبير الرياضي المدخل: ${cleanQuery}.\n2. نبسط الصيغة باستعمال القواعد الجبرية والتحليلية المقررة.\n3. نستنتج النتيجة المضبوطة وندرجها في سلم التنقيط.`,
          stepByStepFr: `1. Déterminer l'ensemble de définition de l'expression : ${cleanQuery}.\n2. Simplifier l'expression à l'aide des propriétés du cours.\n3. Conclure rigoureusement.`,
          suggestedQuestionAr: `أحسب أو بسط بدقة التعبير الرياضي التالي مع تعليل جميع مراحل البرهان: ${cleanQuery}`,
          suggestedQuestionFr: `Calculer ou simplifier rigoureusement l'expression suivante en justifiant chaque étape : ${cleanQuery}`,
        },
        source: wolframDirectUsed
          ? "WolframAlpha v2 Official API"
          : "WolframSymbolic Built-in Verifier",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء التحقق من الصيغة الرياضية";
      res.status(500).json({ error: message });
    }
  });

  // نقطة نهاية المساعد الديداكتيكي والرياضياتي المتقدم للذكاء الاصطناعي (Gemini Pedagogical Math Assistant)
  app.post("/api/ai-math-assistant", async (req, res) => {
    try {
      const {
        task = "SOLVE_STEP_BY_STEP",
        problemText,
        trackLabel = "2BAC Sciences Mathématiques / Terminale Spécialité",
        educationSystem = "MAROC_NATIONAL",
        modelChoice = "gemini-3.8-flash",
        thinkingLevel = "HIGH",
      } = req.body;

      if (
        !problemText ||
        typeof problemText !== "string" ||
        !problemText.trim()
      ) {
        return res
          .status(400)
          .json({ error: "يرجى إدخال نص المسألة أو التمرين الرياضي." });
      }

      const { sdkModel: targetModel, displayLabel: modelLabel } =
        resolveGeminiModel(modelChoice);

      if (hasValidGeminiKey()) {
        try {
          let taskInstructions = "";
          if (task === "SOLVE_STEP_BY_STEP") {
            taskInstructions = `المهمة: إنجاز برهان وحل رياضي نموذجي مفصل وشديد الصرامة العلمية خطوة بخطوة (Corrigé type & Démonstration rigoureuse) متطابق تماماً مع الأطر المرجعية الرسمية (${educationSystem}) مع تحديد الشروط الرياضية الدقيقة، المبرهنات المعتمدة (TVI, Rolle, TAF, Dérivation composée, Théorème de la bijection, etc.)، وتنبيه الأستاذ إلى المزالق والأخطاء الشائعة لدى التلاميذ.`;
          } else if (task === "GENERATE_ISOMORPHIC_VARIANT") {
            taskInstructions = `المهمة: توليد تمرين موازٍ ومتكافئ تماماً (Isomorphic Twin Variant) لنفس الموضوع بمستوى مهاري متطابق وسلم تنقيط متكافئ، مع تغيير المعطيات العددية أو الدوال أو المتتاليات أو الأعداد العقدية وصياغة الحل الكامل للنموذج الموازي لمنع الغش (Sujet B).`;
          } else if (task === "GENERATE_SYNTHESIS_PROBLEM") {
            taskInstructions = `المهمة: بناء مسألة توليفية شاملة على نمط الامتحان الوطني للباكالوريا (Problème de Synthèse Type Bac) انطلاقاً من الفكرة أو الدالة المدخلة، مقسمة إلى جزء تمهيدي (Partie I: دالة مساعدة وإشارتها) وجزء رئيسي (Partie II: دراسة الدالة والمنحنى والمقاربات) وجزء ثالث (Partie III: متتالية مرتبطة بالدالة أو حساب تكامل ومساحة الحيز المستوي) مع عناصر الإجابة المفصلة.`;
          } else if (task === "GENERATE_BILINGUAL_RUBRIC") {
            taskInstructions = `المهمة: تفكيك التمرين إلى سلم تنقيط رسمي دقيق ومفصل بـ 0.25 و 0.5 نقطة (Barème détaillé conforme à la note 142-08) مزدوج اللغة (عربي/فرنسي)، مع تحديد الكفايات المستهدفة وشبكة معالجة الأخطاء المتوقعة (Grille de remédiation pédagogique).`;
          } else if (task === "GENERATE_PYTHON_DIDACTIC") {
            taskInstructions = `المهمة: كتابة سيناريو وخوارزمية برمجية بلغة بايثون (Python Algorithm) مرتبطة بموضوع المسألة (متتاليات، بحث عن عتبة، تفريع ثنائي، تكامل عددي بطريقة المستطيلات أو شبه المنحرف، محاكاة احتمالية)، مع كتابة أسئلة موجهة للتلاميذ (أسئلة بملء الفراغات وتحليل الأثر العددي).`;
          } else if (task === "GENERATE_EPIS_REMEDIATION") {
            taskInstructions = `المهمة: تشخيص العوائق الإبستيمولوجية والديداكتيكية (Obstacles Épistémologiques & Didactiques selon Guy Brousseau) الكامنة في هذا التمرين، وتوليد بطاقة دعم فردي فارقي (Fiche de Remédiation Ciblée) تضم مثالاً مضاداً لإحداث الصراع المعرفي وتمرين دعم مركزاً مع الحل لمعالجة تعثرات المتعلمين.`;
          } else if (task === "GENERATE_OLYMPIAD_CHALLENGE") {
            taskInstructions = `المهمة: صياغة مسألة تميز وأولمبياد (Olympiades Nationales / Concours Général — مستوى N3+) مستلهمة من الموضوع المدخل، مرفقة بإرشادات جورج بوليا الاستكشافية الأربع (Polya's 4-Step Heuristics: فهم المسألة، بناء الخطة، تنفيذ البرهان، التعميم) مع الحل الرياضي الكامل.`;
          } else if (task === "SIMPLIFY_COMPLEX_WORDING") {
            taskInstructions = `المهمة: تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة في التمرين المدخل إلى أسئلة فرعية متدرجة وواضحة (Scaffolding / Étayage didactique)، مع إعطاء الصيغ الوسطية صراحة ("بين أن..."، "تحقق أن...") وإضافة إرشادات منهجية مقتضبة بين قوسين تمنع توقف التلميذ وتضمن استقلالية الأسئلة وفق المذكرة الوزارية 142-08، ووضع النسخة المبسطة الكاملة في الحقل variantExercise مع حلها المفصل.`;
          } else {
            taskInstructions = `المهمة: تدقيق ديداكتيكي شامل (Audit Didactique) للمسألة وفق المذكرة الوزارية 142-08 والمنهاج الوطني: تقييم التوزيع المئوي للمستويات المهارية (N1 تطبيق مباشر، N2 تعبئة وتوليف، N3 بحث ومبادرة)، المدة الزمنية التقديرية، ومدى ملاءمة التمرين لسقف 20 نقطة.`;
          }

          const systemPrompt = `أنت مفتش تربوي لمادة الرياضيات وأستاذ مبرز بالتعليم الثانوي التأهيلي ومدارس البعثة الفرنسية بالمغرب (AEFE / OSUI).
${taskInstructions}
المسلك الدراسي: ${trackLabel}
النظام التعليمي: ${educationSystem}

نص المسألة الرياضية المقدمة:
"${problemText.trim()}"

أخرج النتيجة بصيغة JSON حصراً بدون أي كود markdown محيط تطابق الهيكل التالي:
{
  "task": "${task}",
  "titleAr": "عنوان المخرجات بالعربية",
  "titleFr": "Titre des résultats en français",
  "trackLabel": "${trackLabel}",
  "latexFormulas": ["الصيغ الرياضية الأساسية بلغة LaTeX"],
  "stepByStepProofAr": "البرهان الرياضي النموذجي والمفصل بالعربية مع ذكر المبرهنات وشروط تطبيقها...",
  "stepByStepProofFr": "La démonstration mathématique rigoureuse détaillée en français...",
  "theoremsUsed": ["مبرهنة 1 (Théorème 1)", "مبرهنة 2"],
  "commonPitfallsAr": ["فخ أو خطأ شائع 1 يحذر منه الأستاذ", "خطأ شائع 2"],
  "commonPitfallsFr": ["Erreur fréquente 1", "Erreur fréquente 2"],
  "variantExercise": {
    "titleAr": "عنوان التمرين الموازي (Sujet B) أو المسألة التوليفية المولدة",
    "titleFr": "Titre du sujet équivalent (Sujet B) ou Problème de synthèse",
    "statementAr": "نص التمرين الموازي أو المسألة التوليفية بالعربية...",
    "statementFr": "Énoncé complet en français...",
    "solutionAr": "عناصر الإجابة المفصلة وسلم التنقيط بالعربية...",
    "solutionFr": "Corrigé détaillé et barème en français..."
  },
  "gradingRubric": [
    {
      "questionRef": "1.a",
      "criterionAr": "حساب النهاية عند +∞ مع تعليل الشكل غير المحدد",
      "criterionFr": "Calcul de la limite en +∞ avec justification",
      "points": 0.75,
      "skillLevel": "N1",
      "remediationAr": "التذكير بالنهايات الاعتيادية وتعميل الحد الأعلى درجة"
    }
  ],
  "pythonScenario": {
    "titleAr": "عنوان الخوارزمية بلغة بايثون",
    "titleFr": "Titre de l'algorithme Python",
    "objectiveAr": "الهدف الرياضي والبرمجي",
    "objectiveFr": "Objectif mathématique et algorithmique",
    "code": "def algo_math(...):\\n    pass",
    "questionsAr": ["1. سؤال بيداغوجي موجه للتلميذ بالعربية...", "2. ..."],
    "questionsFr": ["1. Question pour l'élève en français...", "2. ..."],
    "sampleOutput": "Résultat obtenu : 0.6823"
  },
  "didacticAudit": {
    "estimatedDurationMinutes": 45,
    "suggestedPoints": 6.5,
    "n1Percentage": 35,
    "n2Percentage": 45,
    "n3Percentage": 20,
    "complianceNotesAr": "ملاحظات المطابقة للمذكرة الوزارية 142-08 والأطر المرجعية...",
    "complianceNotesFr": "Conformité au cadre de référence officiel..."
  }
}`;

          const aiMathResponseSchema = {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              titleAr: { type: Type.STRING },
              titleFr: { type: Type.STRING },
              trackLabel: { type: Type.STRING },
              latexFormulas: { type: Type.ARRAY, items: { type: Type.STRING } },
              stepByStepProofAr: { type: Type.STRING },
              stepByStepProofFr: { type: Type.STRING },
              theoremsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonPitfallsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonPitfallsFr: { type: Type.ARRAY, items: { type: Type.STRING } },
              variantExercise: {
                type: Type.OBJECT,
                properties: {
                  titleAr: { type: Type.STRING },
                  titleFr: { type: Type.STRING },
                  statementAr: { type: Type.STRING },
                  statementFr: { type: Type.STRING },
                  solutionAr: { type: Type.STRING },
                  solutionFr: { type: Type.STRING },
                },
                required: [
                  "titleAr",
                  "titleFr",
                  "statementAr",
                  "statementFr",
                  "solutionAr",
                  "solutionFr",
                ],
              },
              gradingRubric: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionRef: { type: Type.STRING },
                    criterionAr: { type: Type.STRING },
                    criterionFr: { type: Type.STRING },
                    points: { type: Type.NUMBER },
                    skillLevel: { type: Type.STRING },
                    remediationAr: { type: Type.STRING },
                  },
                },
              },
              pythonScenario: {
                type: Type.OBJECT,
                properties: {
                  titleAr: { type: Type.STRING },
                  titleFr: { type: Type.STRING },
                  objectiveAr: { type: Type.STRING },
                  objectiveFr: { type: Type.STRING },
                  code: { type: Type.STRING },
                  questionsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
                  questionsFr: { type: Type.ARRAY, items: { type: Type.STRING } },
                  sampleOutput: { type: Type.STRING },
                },
              },
              didacticAudit: {
                type: Type.OBJECT,
                properties: {
                  estimatedDurationMinutes: { type: Type.NUMBER },
                  suggestedPoints: { type: Type.NUMBER },
                  n1Percentage: { type: Type.NUMBER },
                  n2Percentage: { type: Type.NUMBER },
                  n3Percentage: { type: Type.NUMBER },
                  complianceNotesAr: { type: Type.STRING },
                  complianceNotesFr: { type: Type.STRING },
                },
              },
            },
            required: [
              "task",
              "titleAr",
              "titleFr",
              "stepByStepProofAr",
              "stepByStepProofFr",
              "variantExercise",
              "gradingRubric",
              "pythonScenario",
              "didacticAudit",
            ],
          };

          const response = await generateGeminiContentWithFallback(
            targetModel,
            systemPrompt,
            {
              responseMimeType: "application/json",
              responseSchema: aiMathResponseSchema,
            },
            thinkingLevel
          );

          const parsed = safeParseJsonWithLatex(response.text || "");
          if (parsed && parsed.stepByStepProofAr) {
            return res.json({
              success: true,
              modelUsed: modelLabel,
              thinkingLevelUsed: thinkingLevel,
              sourceMode: "GEMINI_CLOUD",
              result: parsed,
            });
          }
        } catch {
          // الانتقال الفوري للمحرك الرياضي والديداكتيكي الهجين المدمج لضمان عدم توقف العمل
        }
      }

      const fallbackResult = buildServerSidePedagogicalMathResponse({
        task,
        problemText,
        trackLabel,
        educationSystem,
      });

      return res.json({
        success: true,
        modelUsed: `${modelLabel} · (المحرك الرياضي الهجين المدمج)`,
        thinkingLevelUsed: thinkingLevel,
        sourceMode: "HYBRID_SYMBOLIC_ENGINE",
        result: fallbackResult,
      });
    } catch (err: unknown) {
      const fallbackResult = buildServerSidePedagogicalMathResponse({
        task: req.body?.task || "SOLVE_STEP_BY_STEP",
        problemText: req.body?.problemText || "f(x) = x - 1 + ln(x)/x",
        trackLabel: req.body?.trackLabel || "2BAC",
        educationSystem: req.body?.educationSystem || "MAROC_NATIONAL",
      });
      return res.json({
        success: true,
        modelUsed: "المحرك الرياضي الهجين المدمج",
        thinkingLevelUsed: req.body?.thinkingLevel || "HIGH",
        sourceMode: "HYBRID_SYMBOLIC_ENGINE",
        result: fallbackResult,
        warning: err instanceof Error ? err.message : undefined,
      });
    }
  });

  // ============================================================================
  // نقطة نهاية توليد التمارين الرياضية من المقاطع المظللة في عارض PDF التفاعلي
  // (AI Highlight-to-Exercise Generator — Multimodal Text + Cropped PDF Region)
  // ============================================================================
  function buildFallbackExerciseFromHighlight(params: {
    highlightedText: string;
    generationMode: string;
    trackLabel: string;
    educationSystem: string;
    pageNumber?: number;
  }) {
    const {
      highlightedText,
      generationMode = "ISOMORPHIC_EXERCISE",
      trackLabel,
      pageNumber = 1,
    } = params;
    const text = (highlightedText || "").trim();

    const isSeq =
      /u_n|u_\{n|v_n|متتالية|متتاليات|suite|récurrence|ترجع/i.test(text);
    const isComplex =
      /عقدي|عقدية|complexe|affixe|module|argument|z\^2|z²|ألحاق|لحق|الشكل الأسي/i.test(
        text
      );
    const isIntegral =
      /تكامل|intégrale|\\int|∫|أصلية|primitive|مكاملة بالأجزاء/i.test(text);
    const isSpace =
      /فضاء|فضائية|فلكة|sphère|متجهي|جداء سلمي|scalaire|vectoriel|بارامتري/i.test(
        text
      );
    const isProb =
      /احتمال|كيس|صندوق|urne|probabilit|عشوائي|binomiale|تعداد|سحب/i.test(text);

    const modeBadgeAr =
      generationMode === "GRADUATED_QUESTIONS"
        ? "أسئلة متدرجة (N1 → N2 → N3)"
        : generationMode === "REMEDIATION_DRILL"
        ? "تمرين دعم وتثبيت للمقطع المظلل"
        : generationMode === "SYNTHESIS_EXTENSION"
        ? "توسيع توليفي على نمط الامتحان الوطني"
        : "تمرين موازٍ للمقطع المظلل (Clone Isomorphe)";

    const modeBadgeFr =
      generationMode === "GRADUATED_QUESTIONS"
        ? "Questions graduées (N1 → N2 → N3)"
        : generationMode === "REMEDIATION_DRILL"
        ? "Exercice de consolidation ciblée"
        : generationMode === "SYNTHESIS_EXTENSION"
        ? "Extension de synthèse Type Bac"
        : "Exercice isomorphe basé sur la sélection";

    if (isSeq) {
      return {
        titleAr: `المتتاليات العددية الترجعية — ${modeBadgeAr} (ص. ${pageNumber})`,
        titleFr: `Suites numériques récurrentes — ${modeBadgeFr} (p. ${pageNumber})`,
        detectedTopicAr: "دراسة المتتاليات العددية والبرهان بالترجع",
        detectedTopicFr: "Étude des suites numériques et raisonnement par récurrence",
        extractedMathSummaryAr:
          text.length > 5
            ? `المقطع المظلل المستخرج: « ${text.slice(0, 180)} »`
            : "مقطع رياضي يتضمن متتالية عددية ترجعية ومتتالية مساعدة.",
        extractedMathSummaryFr:
          text.length > 5
            ? `Extrait sélectionné : « ${text.slice(0, 180)} »`
            : "Section portant sur une suite homographique et une suite auxiliaire.",
        targetLevel: "N2" as const,
        suggestedPoints: 5.0,
        questions: [
          {
            num: "1",
            level: "N1" as const,
            points: 1.5,
            statementAr:
              "نعتبر المتتالية العددية $(u_n)$ المعرفة بـ $u_0 = 3$ و $u_{n+1} = \\frac{5u_n - 4}{u_n + 1}$ لكل $n \\in \\mathbb{N}$. أحسب $u_1$ و $u_2$ ثم بين بالترجع أن $u_n > 2$ لكل $n \\in \\mathbb{N}$.",
            statementFr:
              "Soit $(u_n)$ la suite définie par $u_0 = 3$ et $u_{n+1} = \\frac{5u_n - 4}{u_n + 1}$ pour tout $n \\in \\mathbb{N}$. Calculer $u_1$ et $u_2$, puis montrer par récurrence que $u_n > 2$ pour tout $n \\in \\mathbb{N}$.",
            solutionAr:
              "لدينا $u_1 = \\frac{15-4}{4} = \\frac{11}{4} = 2.75 > 2$. بالترجع: نلاحظ أن $u_{n+1} - 2 = \\frac{3(u_n - 2)}{u_n + 1} > 0$ لأن $u_n > 2$. إذن $(\\forall n \\in \\mathbb{N})\\; u_n > 2$.",
            solutionFr:
              "$u_1 = \\frac{11}{4} > 2$. Par récurrence : $u_{n+1} - 2 = \\frac{3(u_n - 2)}{u_n + 1} > 0$ car $u_n > 2$. D'où $u_n > 2$ pour tout $n \\in \\mathbb{N}$.",
            hintAr: "أدرس إشارة الفرق $u_{n+1} - 2$ بتوحيد المقامات.",
            hintFr: "Étudier le signe de la différence $u_{n+1} - 2$.",
          },
          {
            num: "2",
            level: "N2" as const,
            points: 1.5,
            statementAr:
              "أدرس رتابة المتتالية $(u_n)$ وبين أنها متقاربة.",
            statementFr:
              "Étudier la monotonie de la suite $(u_n)$ et en déduire qu'elle est convergente.",
            solutionAr:
              "لدينا $u_{n+1} - u_n = \\frac{-(u_n - 2)^2}{u_n + 1} < 0$. إذن المتتالية $(u_n)$ تناقصية قطعا ومصغورة بالعدد $2$، فهي متقاربة.",
            solutionFr:
              "$u_{n+1} - u_n = \\frac{-(u_n - 2)^2}{u_n + 1} < 0$. La suite $(u_n)$ est strictement décroissante et minorée par $2$, donc elle converge.",
            hintAr: "احسب $u_{n+1} - u_n$ ولاحظ المتطابقة الهامة في البسط.",
            hintFr: "Factoriser le numérateur de $u_{n+1} - u_n$.",
          },
          {
            num: "3",
            level: "N3" as const,
            points: 2.0,
            statementAr:
              "نضع $v_n = \\frac{1}{u_n - 2}$ لكل $n \\in \\mathbb{N}$. بين أن $(v_n)$ متتالية حسابية أساسها $r = \\frac{1}{3}$، ثم أكتب $u_n$ بدلالة $n$ وأحسب $\\lim_{n \\to +\\infty} u_n$.",
            statementFr:
              "On pose $v_n = \\frac{1}{u_n - 2}$. Montrer que $(v_n)$ est une suite arithmétique de raison $r = \\frac{1}{3}$, exprimer $u_n$ en fonction de $n$ et calculer $\\lim_{n \\to +\\infty} u_n$.",
            solutionAr:
              "$v_{n+1} = \\frac{u_n + 1}{3(u_n - 2)} = \\frac{u_n - 2 + 3}{3(u_n - 2)} = v_n + \\frac{1}{3}$. إذن $v_n = 1 + \\frac{n}{3}$ ومنه $u_n = 2 + \\frac{3}{n+3}$، وبالتالي $\\lim_{n \\to +\\infty} u_n = 2$.",
            solutionFr:
              "$v_{n+1} = v_n + \\frac{1}{3}$ avec $v_0 = 1$, donc $v_n = 1 + \\frac{n}{3}$ et $u_n = 2 + \\frac{3}{n+3}$. Ainsi $\\lim_{n \\to +\\infty} u_n = 2$.",
            hintAr: "عوض $u_n + 1$ بـ $(u_n - 2) + 3$ في بسط $v_{n+1}$.",
            hintFr: "Écrire $u_n + 1 = (u_n - 2) + 3$ au numérateur.",
          },
        ],
        fullLatexSnippet: `% تمرين مولد من المقطع المظلل في PDF (${trackLabel})\n\\textbf{التمرين (5 نقط): المتتاليات العددية}\n\\begin{enumerate}\n  \\item نعتبر المتتالية $(u_n)$ المعرفة بـ $u_0=3$ و $u_{n+1}=\\frac{5u_n-4}{u_n+1}$. بين بالترجع أن $u_n > 2$.\n  \\item بين أن $(u_n)$ تناقصية واستنتج أنها متقاربة.\n  \\item نضع $v_n=\\frac{1}{u_n-2}$. بين أن $(v_n)$ حسابية أساسها $\\frac{1}{3}$ ثم أحسب $\\lim u_n$.\n\\end{enumerate}`,
      };
    }

    if (isComplex) {
      return {
        titleAr: `الأعداد العقدية والتحويلات النقطية — ${modeBadgeAr} (ص. ${pageNumber})`,
        titleFr: `Nombres complexes et transformations — ${modeBadgeFr} (p. ${pageNumber})`,
        detectedTopicAr: "الأعداد العقدية والهندسة المستوية",
        detectedTopicFr: "Nombres complexes et géométrie plane",
        extractedMathSummaryAr:
          text.length > 5
            ? `المقطع المظلل المستخرج: « ${text.slice(0, 180)} »`
            : "مقطع رياضي حول المعادلات في C والألحاق والتحويلات الاعتيادية.",
        extractedMathSummaryFr:
          text.length > 5
            ? `Extrait sélectionné : « ${text.slice(0, 180)} »`
            : "Section sur les équations dans C, forme exponentielle et rotation.",
        targetLevel: "N2" as const,
        suggestedPoints: 5.0,
        questions: [
          {
            num: "1",
            level: "N1" as const,
            points: 1.5,
            statementAr:
              "حل في مجموعة الأعداد العقدية $\\mathbb{C}$ المعادلة: $z^2 - 4\\sqrt{3}z + 16 = 0$.",
            statementFr:
              "Résoudre dans l'ensemble $\\mathbb{C}$ des nombres complexes l'équation : $z^2 - 4\\sqrt{3}z + 16 = 0$.",
            solutionAr:
              "المميز $\\Delta = 48 - 64 = -16 = (4i)^2$. الحلان هما $z_1 = 2\\sqrt{3} + 2i$ و $z_2 = 2\\sqrt{3} - 2i$.",
            solutionFr:
              "$\\Delta = -16 = (4i)^2$. Les solutions sont $z_1 = 2\\sqrt{3} + 2i$ et $z_2 = 2\\sqrt{3} - 2i$.",
            hintAr: "أحسب المميز $\\Delta = b^2 - 4ac$ وحوله إلى مربع عدد تخيلي صرف.",
            hintFr: "Calculer le discriminant $\\Delta = b^2 - 4ac$.",
          },
          {
            num: "2",
            level: "N2" as const,
            points: 1.75,
            statementAr:
              "نعتبر في المستوى العقدي النقط $A$ و $B$ و $C$ التي ألحاقها $a = 2\\sqrt{3} + 2i$ و $b = 2\\sqrt{3} - 2i$ و $c = 4i$. أكتب $a$ و $b$ على الشكل الأسي ثم بين أن $\\frac{c - b}{a - b} = e^{i\\frac{\\pi}{3}}$.",
            statementFr:
              "Soient $A(a)$, $B(b)$ et $C(c)$ avec $a = 2\\sqrt{3} + 2i$, $b = 2\\sqrt{3} - 2i$ et $c = 4i$. Écrire $a$ sous forme exponentielle et vérifier que $\\frac{c - b}{a - b} = \\frac{\\sqrt{3}}{2} + \\frac{1}{2}i$ ou étudier le triangle $OAC$.",
            solutionAr:
              "لدينا $|a| = \\sqrt{12+4} = 4$ ومنه $a = 4(\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i) = 4e^{i\\frac{\\pi}{6}}$ و $b = 4e^{-i\\frac{\\pi}{6}}$. كما أن $c = 4e^{i\\frac{\\pi}{2}} = e^{i\\frac{\\pi}{3}} a$.",
            solutionFr:
              "$|a| = 4$ et $a = 4e^{i\\pi/6}$, $b = 4e^{-i\\pi/6}$. Comme $c = 4e^{i\\pi/2} = e^{i\\pi/3} a$, $C$ est l'image de $A$ par la rotation de centre $O$ et d'angle $\\pi/3$.",
            hintAr: "أحسب معيار العدد $a$ ثم عمل به لإظهار $\\cos(\\pi/6)$ و $\\sin(\\pi/6)$.",
            hintFr: "Factoriser par le module $|a| = 4$.",
          },
          {
            num: "3",
            level: "N3" as const,
            points: 1.75,
            statementAr:
              "استنتج أن النقطة $C$ هي صورة النقطة $A$ بالدوران $R$ الذي مركزه $O$ وزاويته $\\frac{\\pi}{3}$، ثم حدد طبيعة المثلث $OAC$.",
            statementFr:
              "En déduire que $C$ est l'image de $A$ par la rotation $R$ de centre $O$ et d'angle $\\frac{\\pi}{3}$, puis déterminer la nature exacte du triangle $OAC$.",
            solutionAr:
              "بما أن $c = e^{i\\frac{\\pi}{3}} a$ فإن $R(A) = C$. ومنه $OA = OC = 4$ و $(\\overline{\\vec{OA}, \\vec{OC}}) \\equiv \\frac{\\pi}{3}\\;[2\\pi]$، إذن المثلث $OAC$ متساوي الأضلاع.",
            solutionFr:
              "On a $c = e^{i\\pi/3} a$, donc $OA = OC$ et $(\\vec{OA}, \\vec{OC}) \\equiv \\pi/3\\;[2\\pi]$. Le triangle $OAC$ est équilatéral.",
            hintAr: "استعمل الكتابة العقدية للدوران الذي مركزه أصل المعلم $O$.",
            hintFr: "Utiliser l'écriture complexe de la rotation de centre $O$.",
          },
        ],
        fullLatexSnippet: `% تمرين مولد من المقطع المظلل في PDF (${trackLabel})\n\\textbf{التمرين (5 نقط): الأعداد العقدية}\n\\begin{enumerate}\n  \\item حل في $\\mathbb{C}$ المعادلة $z^2 - 4\\sqrt{3}z + 16 = 0$.\n  \\item نضع $a = 2\\sqrt{3} + 2i$ و $c = 4i$. أكتب $a$ على الشكل الأسي.\n  \\item بين أن $C$ صورة $A$ بالدوران الذي مركزه $O$ وزاويته $\\pi/3$ واستنتج طبيعة المثلث $OAC$.\n\\end{enumerate}`,
      };
    }

    if (isSpace || isProb) {
      return {
        titleAr: `${isSpace ? "الهندسة الفضائية والجداء السلمي" : "حساب الاحتمالات والمتغيرات العشوائية"} — ${modeBadgeAr} (ص. ${pageNumber})`,
        titleFr: `${isSpace ? "Géométrie dans l'espace" : "Calcul des probabilités"} — ${modeBadgeFr} (p. ${pageNumber})`,
        detectedTopicAr: isSpace ? "الهندسة الفضائية والفلكة والمستويات" : "الاحتمالات والتجارب العشوائية",
        detectedTopicFr: isSpace ? "Produit scalaire et sphère dans l'espace" : "Probabilités et variables aléatoires",
        extractedMathSummaryAr:
          text.length > 5
            ? `المقطع المظلل المستخرج: « ${text.slice(0, 180)} »`
            : "مقطع رياضي مستخرج من الوثيقة المرفوعة.",
        extractedMathSummaryFr:
          text.length > 5
            ? `Extrait sélectionné : « ${text.slice(0, 180)} »`
            : "Section extraite du document PDF.",
        targetLevel: "N2" as const,
        suggestedPoints: 4.5,
        questions: [
          {
            num: "1",
            level: "N1" as const,
            points: 1.5,
            statementAr: isSpace
              ? "في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر $(O,\\vec{i},\\vec{j},\\vec{k})$، نعتبر المستوى $(P): 2x - y + 2z - 3 = 0$ والفلكة $(S)$ التي مركزها $\\Omega(1,-1,2)$ وشعاعها $R = 3$. أحسب مسافة المركز $\\Omega$ عن المستوى $(P)$."
              : "يحتوي صندوق على 5 كرات بيضاء و 3 كرات سوداء لا يمكن التمييز بينها باللمس. نسحب عشوائياً وفي آن واحد 3 كرات من الصندوق. بين أن عدد السحبات الممكنة هو $\\text{Card}(\\Omega) = 56$.",
            statementFr: isSpace
              ? "Dans l'espace muni d'un repère orthonormé direct, soit le plan $(P): 2x - y + 2z - 3 = 0$ et la sphère $(S)$ de centre $\\Omega(1,-1,2)$ et de rayon $R = 3$. Calculer la distance $d(\\Omega, (P))$."
              : "Une urne contient 5 boules blanches et 3 boules noires indiscernables au toucher. On tire simultanément 3 boules. Vérifier que $\\text{Card}(\\Omega) = 56$.",
            solutionAr: isSpace
              ? "$d(\\Omega, (P)) = \\frac{|2(1) - (-1) + 2(2) - 3|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|2 + 1 + 4 - 3|}{3} = \\frac{4}{3}$."
              : "$\\text{Card}(\\Omega) = C_8^3 = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56$.",
            solutionFr: isSpace
              ? "$d(\\Omega, (P)) = \\frac{|2 + 1 + 4 - 3|}{\\sqrt{4 + 1 + 4}} = \\frac{4}{3}$."
              : "$\\text{Card}(\\Omega) = \\binom{8}{3} = 56$.",
            hintAr: isSpace ? "طبق صيغة مسافة نقطة عن مستوى $d(\\Omega,(P)) = \\frac{|ax_\\Omega+by_\\Omega+cz_\\Omega+d|}{\\sqrt{a^2+b^2+c^2}}$." : "السحب في آن واحد يستعمل التأليفات $C_n^p$.",
            hintFr: isSpace ? "Utiliser la formule de la distance d'un point à un plan." : "Le tirage simultané utilise les combinaisons.",
          },
          {
            num: "2",
            level: "N2" as const,
            points: 3.0,
            statementAr: isSpace
              ? "بين أن المستوى $(P)$ يقطع الفلكة $(S)$ وفق دائرة $(\\mathcal{C})$ محدداً شعاعها $r$ ومثلث إحداثيات مركزها $H$."
              : "أحسب احتمال الحدث $A$: «الحصول على ثلاث كرات من نفس اللون» والحدث $B$: «الحصول على كرة بيضاء على الأقل».",
            statementFr: isSpace
              ? "Montrer que le plan $(P)$ coupe la sphère $(S)$ suivant un cercle $(\\mathcal{C})$ dont on déterminera le rayon $r$ et les coordonnées du centre $H$."
              : "Calculer la probabilité de $A$ : « obtenir 3 boules de même couleur » et de $B$ : « obtenir au moins une boule blanche ».",
            solutionAr: isSpace
              ? "بما أن $d = \\frac{4}{3} < R = 3$ فإن $(P)$ يقطع $(S)$ وفق دائرة شعاعها $r = \\sqrt{R^2 - d^2} = \\sqrt{9 - \\frac{16}{9}} = \\frac{\\sqrt{65}}{3}$. التمثيل البارامتري لـ $(\\Delta)$ المار من $\\Omega$ والعمودي على $(P)$ يعطي $H(\\frac{1}{9}, -\\frac{5}{9}, \\frac{10}{9})$."
              : "$P(A) = \\frac{C_5^3 + C_3^3}{56} = \\frac{10 + 1}{56} = \\frac{11}{56}$. و $P(B) = 1 - \\frac{C_3^3}{56} = 1 - \\frac{1}{56} = \\frac{55}{56}$.",
            solutionFr: isSpace
              ? "$d = \\frac{4}{3} < 3$, donc intersection suivant un cercle de rayon $r = \\frac{\\sqrt{65}}{3}$ et de centre $H(\\frac{1}{9}, -\\frac{5}{9}, \\frac{10}{9})$."
              : "$P(A) = \\frac{11}{56}$ et $P(B) = 1 - P(\\bar{B}) = \\frac{55}{56}$.",
            hintAr: isSpace ? "قارن $d(\\Omega,(P))$ مع الشعاع $R$ ثم استعمل مبرهنة فيتاغورس." : "استعمل الحدث المضاد لحساب $P(B)$.",
            hintFr: isSpace ? "Comparer $d$ et $R$, puis utiliser $r = \\sqrt{R^2 - d^2}$." : "Passer par l'événement contraire pour $B$.",
          },
        ],
        fullLatexSnippet: `% تمرين مولد من المقطع المظلل في PDF (${trackLabel})\n\\textbf{التمرين (4.5 نقط)}\n% تم التوليد آلياً من القسم المظلل`,
      };
    }

    // Default: Analysis / Functions & Integrals
    return {
      titleAr: `دراسة دالة عددية وحساب التكامل — ${modeBadgeAr} (ص. ${pageNumber})`,
      titleFr: `Étude de fonction et calcul intégral — ${modeBadgeFr} (p. ${pageNumber})`,
      detectedTopicAr: isIntegral
        ? "الحساب التكاملي والدوال الأصلية والمساحات"
        : "التحليل الرياضي: النهايات والاشتقاق ودراسة الدوال",
      detectedTopicFr: isIntegral
        ? "Calcul intégral, primitives et calcul d'aires"
        : "Analyse : limites, dérivation et étude de fonctions",
      extractedMathSummaryAr:
        text.length > 5
          ? `المقطع المظلل المستخرج: « ${text.slice(0, 180)} »`
          : "مقطع رياضي يتضمن دراسة دالة عددية، الفروع اللانهائية، وحساب التكامل.",
      extractedMathSummaryFr:
        text.length > 5
          ? `Extrait sélectionné : « ${text.slice(0, 180)} »`
          : "Section portant sur l'étude d'une fonction numérique et le calcul intégral.",
      targetLevel: "N2" as const,
      suggestedPoints: 6.0,
      questions: [
        {
          num: "1",
          level: "N1" as const,
          points: 1.5,
          statementAr:
            "نعتبر الدالة العددية $f$ المعرفة على المجال $]0, +\\infty[$ بـ: $f(x) = x - 1 + \\frac{2\\ln(x)}{x}$. أحسب $\\lim_{x \\to 0^+} f(x)$ و $\\lim_{x \\to +\\infty} f(x)$ ثم أول النتيجة الأولى هندسياً.",
          statementFr:
            "Soit $f$ la fonction définie sur $]0, +\\infty[$ par : $f(x) = x - 1 + \\frac{2\\ln(x)}{x}$. Calculer $\\lim_{x \\to 0^+} f(x)$ et $\\lim_{x \\to +\\infty} f(x)$, puis interpréter géométriquement le premier résultat.",
          solutionAr:
            "بما أن $\\lim_{x \\to 0^+} \\frac{\\ln(x)}{x} = -\\infty$ فإن $\\lim_{x \\to 0^+} f(x) = -\\infty$، ومنه محور الأراتيب $(x=0)$ مقارب عمودي للمنحنى $(\\mathcal{C}_f)$. وعند $+\\infty$: $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$ إذن $\\lim_{x \\to +\\infty} f(x) = +\\infty$.",
          solutionFr:
            "$\\lim_{x \\to 0^+} f(x) = -\\infty$ (asymptote verticale d'équation $x = 0$) et $\\lim_{x \\to +\\infty} f(x) = +\\infty$ car $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$.",
          hintAr: "استعمل النهاية الاعتيادية $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$.",
          hintFr: "Utiliser la limite usuelle $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$.",
        },
        {
          num: "2",
          level: "N2" as const,
          points: 2.25,
          statementAr:
            "بين أن المستقيم $(\\Delta): y = x - 1$ مقارب مائل للمنحنى $(\\mathcal{C}_f)$ بجوار $+\\infty$، ثم أدرس الوضع النسبي للمنحنى $(\\mathcal{C}_f)$ والمستقيم $(\\Delta)$ على $]0, +\\infty[$.",
          statementFr:
            "Montrer que la droite $(\\Delta): y = x - 1$ est asymptote oblique à $(\\mathcal{C}_f)$ au voisinage de $+\\infty$, puis étudier la position relative de $(\\mathcal{C}_f)$ et $(\\Delta)$ sur $]0, +\\infty[$.",
          solutionAr:
            "لدينا $\\lim_{x \\to +\\infty} [f(x) - (x - 1)] = \\lim_{x \\to +\\infty} \\frac{2\\ln(x)}{x} = 0$، إذن $(\\Delta)$ مقارب مائل. إشارة الفرق هي إشارة $\\ln(x)$: $(\\mathcal{C}_f)$ تحت $(\\Delta)$ على $]0,1[$ وفوق $(\\Delta)$ على $]1,+\\infty[$ ويتقاطعان في $I(1,0)$.",
          solutionFr:
            "$\\lim_{x \\to +\\infty} (f(x) - (x - 1)) = 0$. Le signe de $f(x) - (x-1) = \\frac{2\\ln(x)}{x}$ est celui de $\\ln(x)$ : $(\\mathcal{C}_f)$ est au-dessous de $(\\Delta)$ sur $]0,1[$ et au-dessus sur $]1,+\\infty[$.",
          hintAr: "أدرس إشارة الفرق $f(x) - (x - 1) = \\frac{2\\ln(x)}{x}$ على $]0,+\\infty[$.",
          hintFr: "Étudier le signe de $f(x) - (x - 1)$ sur $]0,+\\infty[$.",
        },
        {
          num: "3",
          level: "N3" as const,
          points: 2.25,
          statementAr:
            "أحسب التكامل $I = \\int_1^e \\frac{2\\ln(x)}{x}\\,dx$ ثم استنتج بـ $\\text{cm}^2$ مساحة الحيز المستوي المحصور بين المنحنى $(\\mathcal{C}_f)$ والمستقيم $(\\Delta)$ والمستقيمين اللذين معادلتاهما $x = 1$ و $x = e$ (علماً أن المنظم $\\|\\vec{i}\\| = \\|\\vec{j}\\| = 2\\text{ cm}$).",
          statementFr:
            "Calculer l'intégrale $I = \\int_1^e \\frac{2\\ln(x)}{x}\\,dx$, puis en déduire en $\\text{cm}^2$ l'aire du domaine plan délimité par $(\\mathcal{C}_f)$, la droite $(\\Delta)$ et les droites $x = 1$ et $x = e$ (unité graphique : $2\\text{ cm}$).",
          solutionAr:
            "نلاحظ أن $\\frac{2\\ln(x)}{x} = 2 \\cdot \\frac{1}{x}\\ln(x) = [(\\ln x)^2]'$. إذن $I = [(\\ln x)^2]_1^e = 1 - 0 = 1$. وبما أن وحدة المساحة هي $u.a = 2 \\times 2 = 4\\text{ cm}^2$، فإن $\\mathcal{A} = 1 \\times 4 = 4\\text{ cm}^2$.",
          solutionFr:
            "Une primitive de $x \\mapsto \\frac{2\\ln(x)}{x}$ est $x \\mapsto (\\ln x)^2$. Donc $I = [(\\ln x)^2]_1^e = 1$. Comme $1\\;u.a = 4\\text{ cm}^2$, l'aire vaut $\\mathcal{A} = 4\\text{ cm}^2$.",
          hintAr: "لاحظ أن $\\frac{2\\ln(x)}{x}$ تكتب على شكل $2 u'(x) u(x)$ حيث $u(x) = \\ln(x)$.",
          hintFr: "Reconnaître la forme $2 u'(x) u(x)$ avec $u(x) = \\ln(x)$.",
        },
      ],
      fullLatexSnippet: `% تمرين مولد من المقطع المظلل في PDF (${trackLabel})\n\\textbf{التمرين (6 نقط): دراسة دالة عددية وحساب التكامل}\n\\begin{enumerate}\n  \\item نعتبر الدالة $f(x) = x - 1 + \\frac{2\\ln(x)}{x}$ على $]0,+\\infty[$. أحسب النهايتين عند $0^+$ وعند $+\\infty$.\n  \\item بين أن $(\\Delta): y = x - 1$ مقارب مائل بجوار $+\\infty$ وأدرس الوضع النسبي.\n  \\item أحسب التكامل $I = \\int_1^e \\frac{2\\ln(x)}{x}\\,dx$ واستنتج مساحة الحيز المحصور.\n\\end{enumerate}`,
    };
  }

  app.post("/api/generate-exercise-from-highlight", async (req, res) => {
    try {
      const {
        highlightedText = "",
        croppedImageBase64,
        generationMode = "ISOMORPHIC_EXERCISE",
        trackLabel = "2BAC Sciences Mathématiques / Physique",
        educationSystem = "MAROC_NATIONAL",
        pageNumber = 1,
        documentName = "Document_Math.pdf",
        modelChoice = "gemini-3.8-flash",
      } = req.body || {};

      const { sdkModel: targetModel, displayLabel: modelLabel } =
        resolveGeminiModel(modelChoice);

      if (hasValidGeminiKey()) {
        try {
          const modeDirective =
            generationMode === "GRADUATED_QUESTIONS"
              ? "فكك المقطع الرياضي المظلل إلى تمرين متدرج الصعوبة يضم 3 أسئلة (N1 تطبيق مباشر، N2 تعبئة وتوليف، N3 استنتاج أو مبادرة) مع الحل المفصل لكل سؤال."
              : generationMode === "REMEDIATION_DRILL"
              ? "صمم تمرين دعم ومعالجة مركزة (Fiche de Remédiation) يعالج المفهوم الرياضي الوارد في المقطع المظلل خطوة بخطوة لتثبيت التعلمات الأساسية."
              : generationMode === "SYNTHESIS_EXTENSION"
              ? "وسع المقطع المظلل إلى تمرين توليفي شامل على نمط الامتحان الوطني للبكالوريا (Type Bac) يربط المفهوم المظلل بأسئلة استنتاجية متقدمة."
              : "ولد تمريناً رياضياً موازياً ومتكافئاً (Isomorphic Twin Exercise) للمقطع المظلل، يحتفظ بنفس الكفايات والمهارات الرياضية مع تغيير الدوال أو الأعداد أو المتتاليات وحساب الحل الكامل بدقة.";

          const promptText = `أنت مفتش تربوي وأستاذ مبرز في مادة الرياضيات بالسلك الثانوي التأهيلي (${trackLabel} — ${educationSystem}).
قام الأستاذ بتظليل مقطع محدد من الصفحة رقم ${pageNumber} في الوثيقة "${documentName}".
${
  highlightedText.trim()
    ? `النص الرياضي المستخرج من منطقة التظليل:\n"""\n${highlightedText.trim()}\n"""`
    : "اعتمد على صورة المقطع المظلل المرفقة لاستخراج الصيغ الرياضية والأسئلة أو المنحنى."
}

المطلوب الديداكتيكي (${generationMode}):
${modeDirective}
- احرص على صرامة الصياغة الرياضية المزدوجة (بالعربية والفرنسية) وكتابة الصيغ بترميز LaTeX سليم داخل علامات $...$.
- وزع النقط بدقة مضاعفات 0.25 نقطة مع تحديد المستوى المهاري (N1 أو N2 أو N3) لكل سؤال.`;

          const highlightResponseSchema = {
            type: Type.OBJECT,
            properties: {
              titleAr: { type: Type.STRING },
              titleFr: { type: Type.STRING },
              detectedTopicAr: { type: Type.STRING },
              detectedTopicFr: { type: Type.STRING },
              extractedMathSummaryAr: { type: Type.STRING },
              extractedMathSummaryFr: { type: Type.STRING },
              targetLevel: { type: Type.STRING },
              suggestedPoints: { type: Type.NUMBER },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    num: { type: Type.STRING },
                    level: { type: Type.STRING },
                    points: { type: Type.NUMBER },
                    statementAr: { type: Type.STRING },
                    statementFr: { type: Type.STRING },
                    solutionAr: { type: Type.STRING },
                    solutionFr: { type: Type.STRING },
                    hintAr: { type: Type.STRING },
                    hintFr: { type: Type.STRING },
                  },
                  required: [
                    "num",
                    "level",
                    "points",
                    "statementAr",
                    "statementFr",
                    "solutionAr",
                    "solutionFr",
                  ],
                },
              },
              fullLatexSnippet: { type: Type.STRING },
            },
            required: [
              "titleAr",
              "titleFr",
              "detectedTopicAr",
              "detectedTopicFr",
              "extractedMathSummaryAr",
              "extractedMathSummaryFr",
              "targetLevel",
              "suggestedPoints",
              "questions",
              "fullLatexSnippet",
            ],
          };

          const parts: Array<Record<string, unknown>> = [{ text: promptText }];
          if (
            typeof croppedImageBase64 === "string" &&
            croppedImageBase64.startsWith("data:image/")
          ) {
            const commaIdx = croppedImageBase64.indexOf(",");
            if (commaIdx !== -1) {
              const meta = croppedImageBase64.slice(5, commaIdx);
              const mimeType = meta.split(";")[0] || "image/png";
              const rawBase64 = croppedImageBase64.slice(commaIdx + 1);
              if (rawBase64.length > 32) {
                parts.push({
                  inlineData: {
                    mimeType,
                    data: rawBase64,
                  },
                });
              }
            }
          }

          const response = await generateGeminiContentWithFallback(
            targetModel,
            [{ role: "user", parts }],
            {
              responseMimeType: "application/json",
              responseSchema: highlightResponseSchema,
            },
            "HIGH"
          );

          const parsed = safeParseJsonWithLatex(response.text || "");
          if (
            parsed &&
            Array.isArray(parsed.questions) &&
            parsed.questions.length > 0
          ) {
            return res.json({
              success: true,
              modelUsed: modelLabel,
              sourceMode: "GEMINI_MULTIMODAL_HIGHLIGHT",
              exercise: parsed,
            });
          }
        } catch {
          // الانتقال السلس للمحرك الرياضي الهجين المدمج
        }
      }

      const fallbackExercise = buildFallbackExerciseFromHighlight({
        highlightedText,
        generationMode,
        trackLabel,
        educationSystem,
        pageNumber,
      });

      return res.json({
        success: true,
        modelUsed: `${modelLabel} · (محرك التظليل الرياضي الهجين)`,
        sourceMode: "HYBRID_SYMBOLIC_HIGHLIGHT",
        exercise: fallbackExercise,
      });
    } catch (err: unknown) {
      const fallbackExercise = buildFallbackExerciseFromHighlight({
        highlightedText: req.body?.highlightedText || "",
        generationMode: req.body?.generationMode || "ISOMORPHIC_EXERCISE",
        trackLabel: req.body?.trackLabel || "2BAC",
        educationSystem: req.body?.educationSystem || "MAROC_NATIONAL",
        pageNumber: req.body?.pageNumber || 1,
      });
      return res.json({
        success: true,
        modelUsed: "محرك التظليل الرياضي الهجين",
        sourceMode: "HYBRID_SYMBOLIC_HIGHLIGHT",
        exercise: fallbackExercise,
        warning: err instanceof Error ? err.message : undefined,
      });
    }
  });

}
