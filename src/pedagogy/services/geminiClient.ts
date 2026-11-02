/**
 * خدمة الاتصال بمحرك الذكاء الاصطناعي عبر الخادم الخلفي الآمن (Server-Side Gemini API Proxy)
 * جميع الطلبات تمر حصرياً عبر مسارات الخادم (/api/*) باستخدام مفتاح البيئة GEMINI_API_KEY
 * المدار عبر لوحة Settings > Secrets مع دعم المحرك الرياضي الهجين المدمج.
 */

export function getClientGeminiApiKey(): string {
  return "";
}

export function setClientGeminiApiKey(_key: string): void {
  // مدار تلقائياً في الخادم الخلفي عبر process.env.GEMINI_API_KEY
}

export function hasClientGeminiApiKey(): boolean {
  return true;
}

/**
 * اختبار جاهزية محرك الذكاء الاصطناعي عبر الخادم الخلفي
 */
export async function testGeminiApiKey(_rawKey?: string): Promise<{
  success: boolean;
  message: string;
  modelUsed?: string;
}> {
  try {
    const response = await fetch("/api/ai-math-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "SOLVE_STEP_BY_STEP",
        problemText: "أحسب النهاية lim_{x->0+} x * ln(x) وفسر النتيجة هندسياً.",
        trackLabel: "2BAC Sciences Mathématiques",
        educationSystem: "MAROC_NATIONAL",
        modelChoice: "gemini-3.8-flash",
        thinkingLevel: "LOW",
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `تعذر الاتصال بالخادم (HTTP ${response.status}).`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: `تم التحقق من جاهزية المحرك بنجاح (${data.modelUsed || "Gemini 3.8 Flash"})!`,
      modelUsed: data.modelUsed || "gemini-3.8-flash",
    };
  } catch {
    return {
      success: false,
      message: "تعذر الاتصال بالخادم الخلفي. يرجى التحقق من الشبكة.",
    };
  }
}

/**
 * توليد وثيقة الفرض المحروس أو السلسلة عبر مسار الخادم (/api/generate-document)
 */
export async function generateDocumentWithClientGemini(params: {
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  trackLabelAr: string;
  trackLabelFr: string;
  durationAr: string;
  durationFr: string;
  exportFormat: "LATEX" | "TYPST";
  examModel: string;
  activeModule: string;
  semester: string;
  dsKey: string;
  lessons: Array<{
    lessonAr: string;
    lessonFr: string;
    weight: number;
    capacitiesAr?: string[];
    capacitiesFr?: string[];
  }>;
  customTopicNote?: string;
  modelChoice?: string;
}): Promise<{ code: string; modelUsed: string }> {
  const response = await fetch("/api/generate-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      sem: params.semester,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.code) {
    throw new Error(data.error || "تعذر توليد الكود المصدري عبر الخادم.");
  }

  return {
    code: data.code,
    modelUsed: data.modelUsed || params.modelChoice || "gemini-3.8-flash",
  };
}
