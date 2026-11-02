import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import {
  buildInteractiveQuizLinkForDocument,
  generateIsoQrMatrix,
} from "./qrCodeHelper";

export type PrintMarginPreset = "NARROW" | "STANDARD" | "OFFICIAL_EXAM";
export type PrintColorMode = "FULL_COLOR" | "LASER_MONO";
export type PrintDpiQuality = "STANDARD_150" | "HIGH_300" | "ULTRA_PRINT";
export type PrintPageSizePreset = "A4" | "LETTER" | "CUSTOM";

export interface PrintPageMetricsResult {
  preset: PrintPageSizePreset;
  labelAr: string;
  labelFr: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  printableWidthMm: number;
  printableHeightMm: number;
  pageBreakIntervalPx: number;
  marginBufferPx: number;
  estimatedPageCount: number;
  pageBreakOffsetsPx: number[];
  cssPageSizeValue: string;
  cssPageRule: string;
  cssMediaPrintBlock: string;
}

/**
 * محرك محاكاة استعلامات الطباعة الفورية (@media print & @page Simulator)
 * يحسب الأبعاد الفيزيائية والبيكسلات الدقيقة ونقاط فواصل الصفحات (Page Break Boundaries)
 * لمقاسات الورق القياسية (A4, US Letter) والمقاسات المخصصة (Custom @page)
 */
export function computePrintMediaQueryMetrics(params: {
  preset: PrintPageSizePreset;
  orientation?: "portrait" | "landscape" | "PORTRAIT" | "LANDSCAPE";
  customWidthMm?: number;
  customHeightMm?: number;
  marginTopMm?: number;
  marginBottomMm?: number;
  marginXMm?: number;
  contentHeightPx?: number;
  contentWidthPx?: number;
}): PrintPageMetricsResult {
  const isLandscape =
    String(params.orientation || "portrait").toUpperCase() === "LANDSCAPE";

  const baseW =
    params.preset === "A4"
      ? 210
      : params.preset === "LETTER"
      ? 215.9
      : Math.max(120, Math.min(350, Number(params.customWidthMm) || 210));

  const baseH =
    params.preset === "A4"
      ? 297
      : params.preset === "LETTER"
      ? 279.4
      : Math.max(160, Math.min(450, Number(params.customHeightMm) || 297));

  const widthMm = Number((isLandscape ? Math.max(baseW, baseH) : Math.min(baseW, baseH)).toFixed(1));
  const heightMm = Number((isLandscape ? Math.min(baseW, baseH) : Math.max(baseW, baseH)).toFixed(1));

  // معامل التحويل القياسي CSS 96 DPI: 1mm = 96 / 25.4 ≈ 3.779527559 px
  const MM_TO_PX = 96 / 25.4;
  const widthPx = Math.round(widthMm * MM_TO_PX);
  const heightPx = Math.round(heightMm * MM_TO_PX);

  const marginTopMm = Math.max(5, Math.min(30, params.marginTopMm ?? 10));
  const marginBottomMm = Math.max(5, Math.min(30, params.marginBottomMm ?? 12));
  const marginXMm = Math.max(5, Math.min(30, params.marginXMm ?? 12));

  const printableWidthMm = Number(Math.max(80, widthMm - marginXMm * 2).toFixed(1));
  const printableHeightMm = Number(
    Math.max(100, heightMm - marginTopMm - marginBottomMm).toFixed(1)
  );

  // حساب النسبة الفعلية للبيكسل في المعاينة الحية إذا كان عرض العنصر الفعلي متوفراً
  const effectivePxPerMm =
    params.contentWidthPx && params.contentWidthPx > 240
      ? params.contentWidthPx / widthMm
      : MM_TO_PX;

  const pageBreakIntervalPx = Math.max(
    360,
    Math.round(heightMm * effectivePxPerMm)
  );
  const marginBufferPx = Math.max(
    18,
    Math.round((marginTopMm + marginBottomMm) * effectivePxPerMm)
  );

  const totalContentHeightPx = Math.max(
    pageBreakIntervalPx,
    params.contentHeightPx || pageBreakIntervalPx
  );
  const estimatedPageCount = Math.max(
    1,
    Math.ceil(totalContentHeightPx / pageBreakIntervalPx - 0.02)
  );

  // توليد إحداثيات خطوط فواصل الصفحات (حتى 8 فواصل كحد أقصى للمعاينة الواضحة)
  const breakLinesCount = Math.max(4, Math.min(10, estimatedPageCount + 1));
  const pageBreakOffsetsPx: number[] = [];
  for (let p = 1; p <= breakLinesCount; p++) {
    pageBreakOffsetsPx.push(p * pageBreakIntervalPx);
  }

  const orientCss = isLandscape ? "landscape" : "portrait";
  const cssPageSizeValue =
    params.preset === "A4"
      ? `A4 ${orientCss}`
      : params.preset === "LETTER"
      ? `letter ${orientCss}`
      : `${widthMm}mm ${heightMm}mm`;

  const cssPageRule = `@page { size: ${cssPageSizeValue}; margin: ${marginTopMm}mm ${marginXMm}mm ${marginBottomMm}mm ${marginXMm}mm; }`;
  const cssMediaPrintBlock = `@media print {\n  ${cssPageRule}\n  .print-sheet { width: ${widthMm}mm !important; max-width: ${widthMm}mm !important; min-height: ${heightMm}mm !important; }\n}`;

  const labelAr =
    params.preset === "A4"
      ? `A4 القياسي (${widthMm}×${heightMm}mm)`
      : params.preset === "LETTER"
      ? `US Letter (${widthMm}×${heightMm}mm)`
      : `مقاس مخصص (${widthMm}×${heightMm}mm)`;

  const labelFr =
    params.preset === "A4"
      ? `A4 ISO (${widthMm}×${heightMm}mm)`
      : params.preset === "LETTER"
      ? `US Letter (${widthMm}×${heightMm}mm)`
      : `Format Sur-Mesure (${widthMm}×${heightMm}mm)`;

  return {
    preset: params.preset,
    labelAr,
    labelFr,
    widthMm,
    heightMm,
    widthPx,
    heightPx,
    printableWidthMm,
    printableHeightMm,
    pageBreakIntervalPx,
    marginBufferPx,
    estimatedPageCount,
    pageBreakOffsetsPx,
    cssPageSizeValue,
    cssPageRule,
    cssMediaPrintBlock,
  };
}

export interface A4LayoutOverflowReport {
  hasHorizontalOverflow: boolean;
  horizontalOverflowPx: number;
  hasTrailingOrphanOverflow: boolean;
  rawPageCount: number;
  adjustedPageCount: number;
  lastPageFillPercentBefore: number;
  lastPageFillPercentAfter: number;
  recommendedMarginMm: number;
  recommendedMarginTopMm: number;
  recommendedMarginBottomMm: number;
  recommendedMarginXMm: number;
  recommendedScaleFactor: number;
  recommendedVerticalGapClass: "space-y-4" | "space-y-6" | "space-y-8";
  adjustmentsApplied: string[];
}

export interface ExportPDFOptions {
  elementId?: string;
  fileName: string;
  orientation?: "portrait" | "landscape";
  showPageNumbers?: boolean;
  docTitle?: string;
  headerMeta?: string;
  marginPreset?: PrintMarginPreset;
  colorMode?: PrintColorMode;
  dpiQuality?: PrintDpiQuality;
  isMission?: boolean;
  isFrench?: boolean;
  /** رابط الاختبار التفاعلي لتوليد رمز QR تلقائياً في تذييل PDF */
  interactiveQuizUrl?: string;
  /** تفعيل إدراج رمز QR للاختبار التفاعلي تلقائياً في تذييل كل صفحة PDF (افتراضياً true) */
  includeFooterQrCode?: boolean;
  /** الكشف التلقائي عن تجاوز صفحات A4 وضبط الهوامش والتباعد قبل التصدير (افتراضياً true) */
  autoAdjustA4Layout?: boolean;
  /** دالة استرجاع اختيارية لتلقي تقرير الضبط التلقائي لتخطيط A4 */
  onLayoutAdjusted?: (report: A4LayoutOverflowReport) => void;
}

/**
 * محرك تحليلي نقي (Pure Analyzer) للكشف عن تجاوزات تخطيط A4 وحساب الهوامش المثلى للطباعة
 * يكشف:
 * 1. التجاوز الأفقي (Horizontal Overflow) للجداول أو المعادلات العريضة
 * 2. الذيل اليتيم في الصفحة الأخيرة (Trailing Orphan Page Overflow عندما يمتلئ أقل من 24% من الصفحة الأخيرة)
 * 3. الهوامش غير المتوازنة للطباعة الفعلية (يضمن هوامش آمنة >= 8mm)
 */
export function analyzeA4LayoutMetrics(params: {
  contentWidthPx: number;
  scrollWidthPx?: number;
  contentHeightPx: number;
  orientation?: "portrait" | "landscape";
  marginPreset?: PrintMarginPreset;
  currentMarginTopMm?: number;
  currentMarginBottomMm?: number;
  currentMarginXMm?: number;
  includeFooterQrCode?: boolean;
}): A4LayoutOverflowReport {
  const orientation = params.orientation || "portrait";
  const pageWidthMm = orientation === "landscape" ? 297 : 210;
  const pageHeightMm = orientation === "landscape" ? 210 : 297;
  const includeQr = params.includeFooterQrCode !== false;

  const basePresetMarginMm =
    params.marginPreset === "NARROW"
      ? 8.0
      : params.marginPreset === "OFFICIAL_EXAM"
      ? 11.0
      : 9.0;

  const footerHeightMm = includeQr ? 14.0 : 8.5;
  const runningHeaderMm = 6.5;

  const usableWidthMm = pageWidthMm - basePresetMarginMm * 2;
  const usableFirstPageHeightMm =
    pageHeightMm - basePresetMarginMm * 2 - footerHeightMm - runningHeaderMm;

  const safeWidthPx = Math.max(320, params.contentWidthPx || 794);
  const safeScrollWidthPx = Math.max(safeWidthPx, params.scrollWidthPx || safeWidthPx);
  const horizontalOverflowPx = Math.max(0, Math.round(safeScrollWidthPx - safeWidthPx));
  const hasHorizontalOverflow = horizontalOverflowPx > 2;

  const pxPerMm = safeWidthPx / usableWidthMm;
  const singlePageCapacityPx = Math.max(240, Math.floor(usableFirstPageHeightMm * pxPerMm));

  const safeHeightPx = Math.max(100, params.contentHeightPx || singlePageCapacityPx);
  const exactPagesFloat = safeHeightPx / singlePageCapacityPx;
  const rawPageCount = Math.max(1, Math.ceil(exactPagesFloat - 0.01));

  const remainderPx = safeHeightPx - (rawPageCount - 1) * singlePageCapacityPx;
  const lastPageFillPercentBefore =
    rawPageCount === 1
      ? Math.min(100, Math.round((safeHeightPx / singlePageCapacityPx) * 100))
      : Math.max(1, Math.min(100, Math.round((remainderPx / singlePageCapacityPx) * 100)));

  // إذا كانت الوثيقة تمتد لصفحة إضافية بنسبة امتلاء ضئيلة (<= 24%) نعتبرها تجاوزاً يتيماً قابلاً للضم
  const hasTrailingOrphanOverflow =
    rawPageCount > 1 && lastPageFillPercentBefore > 0 && lastPageFillPercentBefore <= 24;

  const adjustmentsApplied: string[] = [];
  let recommendedMarginMm = basePresetMarginMm;
  let recommendedMarginTopMm = Math.max(8, Math.min(18, params.currentMarginTopMm ?? 10));
  let recommendedMarginBottomMm = Math.max(10, Math.min(18, params.currentMarginBottomMm ?? 12));
  let recommendedMarginXMm = Math.max(10, Math.min(18, params.currentMarginXMm ?? 12));
  let recommendedScaleFactor = 1;
  let recommendedVerticalGapClass: "space-y-4" | "space-y-6" | "space-y-8" = "space-y-6";

  if (hasHorizontalOverflow) {
    const widthRatio = safeWidthPx / safeScrollWidthPx;
    recommendedScaleFactor = Math.max(0.88, Math.min(0.98, Number(widthRatio.toFixed(3))));
    recommendedMarginXMm = Math.max(8, recommendedMarginXMm - 2);
    adjustmentsApplied.push(
      `ضبط التجاوز الأفقي (${horizontalOverflowPx}px) وتقليص العناصر العريضة لتناسب عرض A4`
    );
  }

  if (hasTrailingOrphanOverflow) {
    recommendedMarginMm = Math.max(7.5, basePresetMarginMm - 1.5);
    recommendedMarginTopMm = 8;
    recommendedMarginBottomMm = 9;
    recommendedMarginXMm = 10;
    recommendedVerticalGapClass = "space-y-4";
    const neededCompaction =
      ((rawPageCount - 1) * singlePageCapacityPx) / Math.max(1, safeHeightPx);
    const orphanScale = Math.max(0.91, Math.min(0.97, Number(neededCompaction.toFixed(3))));
    recommendedScaleFactor = Math.min(recommendedScaleFactor, orphanScale);
    adjustmentsApplied.push(
      `ضم التجاوز اليتيم في الصفحة ${rawPageCount} (امتلاء ${lastPageFillPercentBefore}%) وتوفير ورقة طباعة كاملة`
    );
  } else if (rawPageCount === 1 && lastPageFillPercentBefore < 65) {
    recommendedMarginTopMm = Math.max(12, recommendedMarginTopMm);
    recommendedMarginBottomMm = Math.max(12, recommendedMarginBottomMm);
    recommendedMarginXMm = Math.max(13, recommendedMarginXMm);
    recommendedVerticalGapClass = "space-y-8";
    adjustmentsApplied.push("موازنة الهوامش والتباعد العمودي لملء ورقة A4 بشكل متناسق");
  } else {
    // ضمان هوامش طباعة قياسية آمنة لجميع الطابعات المكتبية (>= 8mm)
    if ((params.currentMarginTopMm ?? 10) < 8 || (params.currentMarginXMm ?? 12) < 8) {
      recommendedMarginTopMm = Math.max(8, params.currentMarginTopMm ?? 8);
      recommendedMarginXMm = Math.max(9, params.currentMarginXMm ?? 9);
      adjustmentsApplied.push("تأمين الحد الأدنى لهوامش الطابعة الفيزيائية (8mm) لمنع بتر الأطراف");
    }
  }

  const adjustedHeightPx = safeHeightPx * recommendedScaleFactor * (hasTrailingOrphanOverflow ? 0.93 : 1);
  const adjustedUsableHeightMm =
    pageHeightMm - recommendedMarginMm * 2 - footerHeightMm - runningHeaderMm;
  const adjustedCapacityPx = Math.max(240, Math.floor(adjustedUsableHeightMm * pxPerMm));
  const adjustedPageCount = hasTrailingOrphanOverflow
    ? Math.max(1, rawPageCount - 1)
    : Math.max(1, Math.ceil(adjustedHeightPx / adjustedCapacityPx - 0.01));

  const adjustedRemainderPx =
    adjustedHeightPx - (adjustedPageCount - 1) * adjustedCapacityPx;
  const lastPageFillPercentAfter =
    adjustedPageCount === 1
      ? Math.min(100, Math.round((adjustedHeightPx / adjustedCapacityPx) * 100))
      : Math.max(15, Math.min(98, Math.round((adjustedRemainderPx / adjustedCapacityPx) * 100)));

  return {
    hasHorizontalOverflow,
    horizontalOverflowPx,
    hasTrailingOrphanOverflow,
    rawPageCount,
    adjustedPageCount,
    lastPageFillPercentBefore,
    lastPageFillPercentAfter,
    recommendedMarginMm,
    recommendedMarginTopMm,
    recommendedMarginBottomMm,
    recommendedMarginXMm,
    recommendedScaleFactor,
    recommendedVerticalGapClass,
    adjustmentsApplied,
  };
}

/**
 * فحص عنصر ورقة A4 في DOM وتطبيق تحسينات تلقائية مؤقتة أثناء التصدير لمنع قص المعادلات أو الجداول أو الصفحات اليتيمة
 * مع إرجاع دالة restore() لإعادة العناصر إلى حالتها الأصلية فور انتهاء التصدير
 */
export function detectAndAdjustA4LayoutForExport(
  element: HTMLElement,
  options: {
    orientation?: "portrait" | "landscape";
    marginPreset?: PrintMarginPreset;
    includeFooterQrCode?: boolean;
  } = {}
): {
  report: A4LayoutOverflowReport;
  restore: () => void;
} {
  const rect = element.getBoundingClientRect();
  const contentWidthPx = Math.max(320, Math.round(rect.width || element.clientWidth || 794));
  const scrollWidthPx = Math.max(contentWidthPx, Math.round(element.scrollWidth || contentWidthPx));
  const contentHeightPx = Math.max(200, Math.round(element.scrollHeight || rect.height || 1122));

  const report = analyzeA4LayoutMetrics({
    contentWidthPx,
    scrollWidthPx,
    contentHeightPx,
    orientation: options.orientation,
    marginPreset: options.marginPreset,
    includeFooterQrCode: options.includeFooterQrCode,
  });

  const savedStyles: Array<{ el: HTMLElement; cssText: string }> = [];
  const recordAndStyle = (el: HTMLElement, mutator: (style: CSSStyleDeclaration) => void) => {
    savedStyles.push({ el, cssText: el.style.cssText });
    mutator(el.style);
  };

  // 1. حماية شاملة من التجاوز الأفقي للجداول والصيغ الرياضية العريضة والأشكال
  recordAndStyle(element, (style) => {
    style.boxSizing = "border-box";
    style.overflowX = "hidden";
    if (report.hasTrailingOrphanOverflow) {
      style.paddingTop = `${report.recommendedMarginTopMm}mm`;
      style.paddingBottom = `${report.recommendedMarginBottomMm}mm`;
      style.paddingLeft = `${report.recommendedMarginXMm}mm`;
      style.paddingRight = `${report.recommendedMarginXMm}mm`;
      style.lineHeight = "1.42";
    }
  });

  const wideBlocks = Array.from(
    element.querySelectorAll<HTMLElement>(
      "table, .katex-display, pre, svg, img, .inserted-figure-card"
    )
  );
  wideBlocks.forEach((child) => {
    const childScroll = child.scrollWidth;
    if (childScroll > contentWidthPx - 24) {
      const fitScale = Math.max(0.78, Math.min(0.98, (contentWidthPx - 36) / childScroll));
      recordAndStyle(child, (style) => {
        style.maxWidth = "100%";
        style.overflowX = "hidden";
        if (child.tagName === "TABLE" || child.classList.contains("katex-display")) {
          style.transform = `scale(${fitScale.toFixed(3)})`;
          style.transformOrigin = "center top";
        }
      });
    } else {
      recordAndStyle(child, (style) => {
        style.maxWidth = "100%";
      });
    }
  });

  // 2. إذا كان هناك ذيل يتيم قصير في الصفحة الأخيرة، نقوم بضغط المسافات العمودية بين التمارين تلقائياً
  if (report.hasTrailingOrphanOverflow) {
    const spacedContainers = Array.from(
      element.querySelectorAll<HTMLElement>(".space-y-8, .space-y-6, .mb-8, .mb-6, .py-6, .p-6")
    );
    spacedContainers.forEach((box) => {
      recordAndStyle(box, (style) => {
        style.marginBottom = "0.5rem";
        style.paddingTop = "0.45rem";
        style.paddingBottom = "0.45rem";
      });
    });
  }

  return {
    report,
    restore: () => {
      for (let i = savedStyles.length - 1; i >= 0; i--) {
        const item = savedStyles[i];
        item.el.style.cssText = item.cssText;
      }
    },
  };
}

/**
 * رسم مصفوفة رمز QR القياسية (ISO/IEC 18004) مباشرة على Canvas بدقة عالية وحواف حادة
 */
function drawQrMatrixOnCanvas(
  ctx: CanvasRenderingContext2D,
  matrix: (boolean | number)[][],
  x: number,
  y: number,
  sizePx: number
): void {
  const N = matrix.length;
  if (!N) return;
  const quietZoneModules = 2;
  const totalModules = N + quietZoneModules * 2;
  const cellPx = sizePx / totalModules;

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, sizePx, sizePx);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = Math.max(1, Math.round(sizePx / 45));
  ctx.strokeRect(x, y, sizePx, sizePx);

  ctx.fillStyle = "#0f172a";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c]) {
        const rx = Math.floor(x + (c + quietZoneModules) * cellPx);
        const ry = Math.floor(y + (r + quietZoneModules) * cellPx);
        const rw = Math.ceil(x + (c + quietZoneModules + 1) * cellPx) - rx;
        const rh = Math.ceil(y + (r + quietZoneModules + 1) * cellPx) - ry;
        ctx.fillRect(rx, ry, rw, rh);
      }
    }
  }
  ctx.restore();
}

/**
 * دالة ذكية لتحديد نقاط القطع البيداغوجية المتجانسة بين الصفحات
 * لمنع قطع التمارين أو الصيغ الرياضية أو الجداول أو الأشكال الهندسية في منتصف السطر
 */
function calculateSmartPageSlices(
  element: HTMLElement,
  imgWidth: number,
  imgHeight: number,
  maxSliceHeightPx: number
): number[] {
  const elementRect = element.getBoundingClientRect();
  const scale = imgWidth / Math.max(1, elementRect.width);

  // فرض فواصل صفحات صريحة للعناصر الحاملة لفئة .page-break
  const explicitBreaks = Array.from(element.querySelectorAll(".page-break"))
    .map((el) => {
      const r = el.getBoundingClientRect();
      return Math.floor((r.top - elementRect.top) * scale);
    })
    .filter((y) => y > 80 && y < imgHeight - 40)
    .sort((a, b) => a - b);

  // البحث عن العناصر البنائية التي يجب تفادي قطعها في منتصفها
  const breakElements = Array.from(
    element.querySelectorAll(
      ".avoid-break, .a4-page, .exercise-card, h2, h3, h4, table, tr, ol > li, .inserted-figure-card, .border, .rounded-2xl, .rounded-xl, .p-4, .p-5, .katex-display-block, .math-display"
    )
  );

  const safeCutLinesPx: number[] = [];
  breakElements.forEach((el) => {
    const r = el.getBoundingClientRect();
    const topPx = Math.floor((r.top - elementRect.top) * scale);
    const bottomPx = Math.ceil((r.bottom - elementRect.top) * scale);
    if (topPx > 0 && topPx < imgHeight) safeCutLinesPx.push(topPx);
    if (bottomPx > 0 && bottomPx < imgHeight) safeCutLinesPx.push(bottomPx);
  });

  safeCutLinesPx.sort((a, b) => a - b);

  const sliceOffsets: number[] = [0];
  let currentY = 0;

  while (currentY + maxSliceHeightPx < imgHeight) {
    const theoreticalCut = currentY + maxSliceHeightPx;

    // 1. إذا كان هناك فاصل صفحة صريح (.page-break) ضمن الصفحة الحالية، نقطع عنده مباشرة
    const explicitInPage = explicitBreaks.find(
      (brk) => brk > currentY + 120 && brk <= theoreticalCut
    );
    if (explicitInPage !== undefined) {
      sliceOffsets.push(explicitInPage);
      currentY = explicitInPage;
      continue;
    }

    // 2. البحث عن أقرب نقطة قطع آمنة تقع قبل القطع النظري بهامش أمان (حتى 28% من الصفحة)
    const minAcceptableCut = currentY + maxSliceHeightPx * 0.7;
    const candidateCuts = safeCutLinesPx.filter(
      (cut) => cut >= minAcceptableCut && cut <= theoreticalCut - 10
    );

    let bestCut = theoreticalCut;
    if (candidateCuts.length > 0) {
      bestCut = candidateCuts[candidateCuts.length - 1];
    }

    sliceOffsets.push(bestCut);
    currentY = bestCut;
  }

  sliceOffsets.push(imgHeight);
  return sliceOffsets;
}

/**
 * تحويل لوحة Canvas إلى تدرج رمادي عالي التباين للطباعة الليزرية الاقتصادية (Laser Monochrome)
 */
function applyLaserMonochromeFilter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // معادلة النصوع القياسية مع تعزيز طفيف للتباين لطباعة الليزر
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 245) {
      lum = Math.max(0, Math.min(255, (lum - 128) * 1.08 + 122));
    }
    data[i] = lum;
    data[i + 1] = lum;
    data[i + 2] = lum;
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * رسم الترويسة الجارية للصفحات الموالية والتذييل الرسمي المشكّل بالعربية والفرنسية بدقة Canvas
 * مع إدراج رمز QR تلقائي للاختبار التفاعلي في التذييل السفلي
 */
function drawCanvasRunningHeaderAndFooter(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  headerHeightPx: number,
  footerHeightPx: number,
  pageIndex: number,
  totalPages: number,
  options: {
    docTitle?: string;
    headerMeta?: string;
    isMission?: boolean;
    isFrench?: boolean;
    qrMatrix?: (boolean | number)[][];
    interactiveQuizUrl?: string;
  }
) {
  const scaleFactor = Math.max(1, canvasWidth / 1200);
  const fontSizePx = Math.round(14 * scaleFactor);
  const smallFontPx = Math.round(12 * scaleFactor);
  const tinyFontPx = Math.round(10.5 * scaleFactor);

  // 1. الترويسة الجارية للصفحات الثانية فما فوق
  if (headerHeightPx > 0 && pageIndex > 0) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, headerHeightPx);

    // خط فاصل سفلي للترويسة الجارية
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = Math.max(1, Math.round(1.2 * scaleFactor));
    ctx.beginPath();
    ctx.moveTo(0, headerHeightPx - Math.round(8 * scaleFactor));
    ctx.lineTo(canvasWidth, headerHeightPx - Math.round(8 * scaleFactor));
    ctx.stroke();

    ctx.fillStyle = "#334155";
    ctx.font = `bold ${smallFontPx}px 'Cairo', 'IBM Plex Sans Arabic', sans-serif`;
    ctx.textBaseline = "middle";
    const headerY = Math.round((headerHeightPx - 8 * scaleFactor) / 2);

    // يمين الترويسة
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    const rightHeaderText = options.isFrench
      ? `Suite de l'épreuve · ${options.docTitle || "Mathématiques"}`
      : `تابع الموضوع · ${options.docTitle || "فرض محروس في الرياضيات"}`;
    ctx.fillText(rightHeaderText, canvasWidth - 8, headerY);

    // يسار الترويسة
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(
      `Page ${pageIndex + 1} / ${totalPages}${options.headerMeta ? ` · ${options.headerMeta}` : ""}`,
      8,
      headerY
    );
    ctx.restore();
  }

  // 2. التذييل الرسمي السفلي لكل صفحة (مع رمز QR للاختبار التفاعلي)
  if (footerHeightPx > 0) {
    const footerTopY = canvasHeight - footerHeightPx;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, footerTopY, canvasWidth, footerHeightPx);

    // خط علوي رفيع للتذييل
    const lineY = footerTopY + Math.round(6 * scaleFactor);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = Math.max(1, Math.round(1.2 * scaleFactor));
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(canvasWidth, lineY);
    ctx.stroke();

    const hasQr = Boolean(options.qrMatrix && options.qrMatrix.length > 0);
    const qrBoxSizePx = hasQr
      ? Math.max(36, Math.min(Math.round(footerHeightPx - 12 * scaleFactor), Math.round(74 * scaleFactor)))
      : 0;
    const qrX = 8;
    const qrY = lineY + Math.max(3, Math.round((footerHeightPx - (lineY - footerTopY) - qrBoxSizePx) / 2));

    if (hasQr && options.qrMatrix) {
      drawQrMatrixOnCanvas(ctx, options.qrMatrix, qrX, qrY, qrBoxSizePx);

      // تسمية توضيحية بجانب رمز QR في التذييل
      const labelX = qrX + qrBoxSizePx + Math.round(8 * scaleFactor);
      const labelPrimaryY = qrY + Math.round(qrBoxSizePx * 0.36);
      const labelSecondaryY = qrY + Math.round(qrBoxSizePx * 0.72);

      ctx.direction = "ltr";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = `bold ${smallFontPx}px 'Cairo', 'IBM Plex Sans Arabic', sans-serif`;
      ctx.fillText(
        options.isFrench
          ? "Quiz Interactif · Auto-Correction"
          : "امسح للاختبار التفاعلي · Quiz Interactif",
        labelX,
        labelPrimaryY
      );

      ctx.fillStyle = "#475569";
      ctx.font = `600 ${tinyFontPx}px 'Cairo', 'IBM Plex Sans Arabic', sans-serif`;
      const metaSummary =
        [options.docTitle, options.headerMeta].filter(Boolean).join(" · ") ||
        "نسخة رقمية تفاعلية مع تصحيح فوري";
      ctx.fillText(metaSummary.slice(0, 62), labelX, labelSecondaryY);
    }

    const textY = lineY + Math.round((footerHeightPx - (lineY - footerTopY)) * 0.52);

    // وسط التذييل: رقم الصفحة المزدوج
    ctx.fillStyle = "#0f172a";
    ctx.font = `bold ${fontSizePx}px 'Cairo', 'IBM Plex Sans Arabic', sans-serif`;
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.textAlign = "center";
    const pageBadge = options.isFrench
      ? `— Page ${pageIndex + 1} sur ${totalPages} —`
      : `— الصفحة ${pageIndex + 1} من ${totalPages} (Page ${pageIndex + 1}/${totalPages}) —`;
    ctx.fillText(pageBadge, Math.round(canvasWidth / 2), textY);

    // يمين التذييل: الهوية الأكاديمية
    ctx.fillStyle = "#475569";
    ctx.font = `600 ${smallFontPx}px 'Cairo', 'IBM Plex Sans Arabic', sans-serif`;
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    const rightFooter = options.isMission
      ? "Enseignement Français au Maroc (AEFE / OSUI)"
      : options.isFrench
      ? "Royaume du Maroc · Ministère de l'Éducation Nationale"
      : "المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة";
    ctx.fillText(rightFooter, canvasWidth - 8, textY);

    // يسار التذييل (عند عدم تفعيل QR): مرجع الوثيقة والسنة
    if (!hasQr) {
      ctx.direction = "ltr";
      ctx.textAlign = "left";
      const leftFooter =
        [options.docTitle, options.headerMeta].filter(Boolean).join(" · ") ||
        "Mathématiques · Format Officiel A4";
      ctx.fillText(leftFooter, 8, textY);
    }

    ctx.restore();
  }
}

/**
 * تصدير مباشر للوثيقة المعاينة إلى ملف PDF بحجم A4 مع الحفاظ الكامل على التنسيق والخطوط والشعارات
 * وتقسيم ذكي يراعي حدود التمارين والفقرات (Smart Pagination) وضبط تلقائي لتخطيط A4 ورمز QR تفاعلي في التذييل
 */
export async function exportPreviewToPDF({
  elementId = "printable-document-sheet",
  fileName,
  orientation = "portrait",
  showPageNumbers = true,
  docTitle,
  headerMeta,
  marginPreset = "STANDARD",
  colorMode = "FULL_COLOR",
  dpiQuality = "HIGH_300",
  isMission = false,
  isFrench = false,
  interactiveQuizUrl,
  includeFooterQrCode = true,
  autoAdjustA4Layout = true,
  onLayoutAdjusted,
}: ExportPDFOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("تعذر العثور على نافذة المعاينة لتصدير ملف PDF.");
  }

  // انتظار تحميل جميع الخطوط لضمان جودة عرض الحروف العربية والرموز الرياضية
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // 1. تحديد رابط الاختبار التفاعلي للوثيقة وتوليد مصفوفة رمز QR القياسية
  const domQuizUrl = element.getAttribute("data-interactive-quiz-url") || "";
  const resolvedQuizUrl =
    interactiveQuizUrl ||
    domQuizUrl ||
    buildInteractiveQuizLinkForDocument({
      educationSystem: isMission ? "MISSION_FR" : "MOROCCO_MEN",
      title: docTitle || fileName,
    });

  const qrMatrix =
    includeFooterQrCode && resolvedQuizUrl
      ? generateIsoQrMatrix(resolvedQuizUrl, "M")
      : undefined;

  // 2. الكشف التلقائي عن تجاوزات صفحات A4 وضبط التخطيط والهوامش قبل التقاط الوثيقة
  const layoutGuard = autoAdjustA4Layout
    ? detectAndAdjustA4LayoutForExport(element, {
        orientation,
        marginPreset,
        includeFooterQrCode,
      })
    : null;

  if (layoutGuard && onLayoutAdjusted) {
    onLayoutAdjusted(layoutGuard.report);
  }

  try {
    const pixelRatio =
      dpiQuality === "ULTRA_PRINT" ? 3.0 : dpiQuality === "STANDARD_150" ? 1.8 : 2.5;

    // استبعاد جميع أزرار وشرائط الأدوات التي تحمل الفئة .no-print داخل الورقة أثناء التصدير
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio,
      backgroundColor: "#ffffff",
      cacheBust: true,
      filter: (node: Node) => {
        if (node instanceof HTMLElement && node.classList.contains("no-print")) {
          return false;
        }
        return true;
      },
      style: {
        transform: "none",
        margin: "0",
        boxShadow: "none",
        borderRadius: "0",
        border: "none",
      },
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("تعذر معالجة صورة الوثيقة لتوليد ملف PDF."));
      img.src = dataUrl;
    });

    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidthMm = pdf.internal.pageSize.getWidth(); // 210mm (Portrait) أو 297mm (Landscape)
    const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297mm (Portrait) أو 210mm (Landscape)

    const baseMarginMm =
      marginPreset === "NARROW" ? 8.0 : marginPreset === "OFFICIAL_EXAM" ? 11.0 : 9.0;
    const marginMm = layoutGuard
      ? layoutGuard.report.recommendedMarginMm
      : baseMarginMm;

    const shouldRenderFooter = showPageNumbers || includeFooterQrCode;
    const footerHeightMm = includeFooterQrCode
      ? 14.0
      : showPageNumbers
      ? 8.5
      : 0;
    const runningHeaderMm = showPageNumbers ? 6.5 : 0;

    const contentWidthMm = pageWidthMm - marginMm * 2;
    const firstPageBodyMm = pageHeightMm - marginMm * 2 - footerHeightMm;

    const pxPerMm = img.width / contentWidthMm;
    const maxSliceHeightPx = Math.floor((firstPageBodyMm - runningHeaderMm) * pxPerMm);
    const footerHeightPx = Math.round(footerHeightMm * pxPerMm);
    const runningHeaderPx = Math.round(runningHeaderMm * pxPerMm);

    const cuts = calculateSmartPageSlices(element, img.width, img.height, maxSliceHeightPx);
    const totalPages = Math.max(1, cuts.length - 1);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const startY = cuts[i];
      const endY = cuts[i + 1];
      const sliceHeightPx = endY - startY;

      if (sliceHeightPx <= 0) continue;

      const currentHeaderPx = i > 0 ? runningHeaderPx : 0;
      const totalCanvasHeightPx = currentHeaderPx + sliceHeightPx + footerHeightPx;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = totalCanvasHeightPx;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // رسم محتوى الشريحة
        ctx.drawImage(
          img,
          0,
          startY,
          img.width,
          sliceHeightPx,
          0,
          currentHeaderPx,
          img.width,
          sliceHeightPx
        );

        // رسم الترويسة الجارية والتذييل بالعربية والفرنسية السليمة مع رمز QR التفاعلي
        if (shouldRenderFooter) {
          drawCanvasRunningHeaderAndFooter(
            ctx,
            canvas.width,
            canvas.height,
            currentHeaderPx,
            footerHeightPx,
            i,
            totalPages,
            {
              docTitle,
              headerMeta,
              isMission,
              isFrench,
              qrMatrix,
              interactiveQuizUrl: resolvedQuizUrl,
            }
          );
        }

        if (colorMode === "LASER_MONO") {
          applyLaserMonochromeFilter(ctx, canvas.width, canvas.height);
        }

        const sliceDataUrl = canvas.toDataURL("image/png", 0.98);
        const totalSliceMm = totalCanvasHeightPx / pxPerMm;
        const renderedSliceHeightMm = Math.min(totalSliceMm, pageHeightMm - marginMm * 2);

        pdf.addImage(
          sliceDataUrl,
          "PNG",
          marginMm,
          marginMm,
          contentWidthMm,
          renderedSliceHeightMm,
          undefined,
          "FAST"
        );

        // إضافة رابط تفاعلي قابل للنقر فوق منطقة رمز QR في ملف PDF
        if (includeFooterQrCode && resolvedQuizUrl) {
          const qrTopMm = marginMm + renderedSliceHeightMm - footerHeightMm + 1;
          pdf.link(marginMm, qrTopMm, 58, footerHeightMm - 1.5, {
            url: resolvedQuizUrl,
          });
        }
      }
    }

    const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } finally {
    if (layoutGuard) {
      layoutGuard.restore();
    }
  }
}

/**
 * تنظيف نسخة DOM المستنسخة قبل تصديرها إلى HTML أو Word
 * في وضع Word يتم حذف شجرة .katex-mathml المخفية لتفادي تكرار الصيغ الرياضية مرتين في برنامج Microsoft Word
 */
function prepareCleanDocumentClone(
  element: HTMLElement,
  forWord: boolean = false
): HTMLElement {
  const cloned = element.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll(".no-print").forEach((el) => el.remove());
  cloned.removeAttribute("contenteditable");
  cloned.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });
  if (forWord) {
    cloned.querySelectorAll(".katex-mathml, annotation").forEach((el) => el.remove());
    cloned.querySelectorAll("button, select, input[type='range']").forEach((el) => el.remove());
    cloned.querySelectorAll(".katex").forEach((el) => {
      (el as HTMLElement).setAttribute("dir", "ltr");
    });
  }
  return cloned;
}

/**
 * تصدير ملف HTML مستقل متكامل (Standalone Offline HTML)
 * مزود بشريط طباعة A4 مدمج وتنسيق جاهز للفتح بدون إنترنت
 */
export function exportStandaloneHTML(
  elementId: string = "printable-document-sheet",
  fileName: string = "Examen_Mathematiques.html",
  title: string = "وثيقة الرياضيات الرسمية"
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("تعذر العثور على عنصر الوثيقة لتصدير HTML.");
  }

  const cloned = prepareCleanDocumentClone(element, false);
  const dirAttr = element.getAttribute("dir") || "rtl";

  const htmlContent = `<!DOCTYPE html>
<html lang="${dirAttr === "ltr" ? "fr" : "ar"}" dir="${dirAttr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;600;700;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=STIX+Two+Text:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    body {
      background-color: #e2e8f0;
      font-family: 'STIX Two Text', 'Amiri', 'Cairo', serif;
      color: #0f172a;
      margin: 0;
      padding: 24px 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .standalone-toolbar {
      max-width: 210mm;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Cairo', sans-serif;
    }
    .standalone-toolbar button {
      background: #06b6d4;
      color: #0f172a;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 13px;
    }
    .print-sheet {
      max-width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #ffffff;
      padding: 14mm 15mm;
      box-shadow: 0 12px 32px -4px rgb(15 23 42 / 0.15);
      border-radius: 8px;
    }
    .avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .standalone-toolbar, .no-print {
        display: none !important;
      }
      .print-sheet {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="standalone-toolbar no-print" dir="rtl">
    <div>
      <strong>${title}</strong>
      <span style="font-size: 12px; color: #94a3b8; margin-right: 10px;">نسخة مستقلة جاهزة للطباعة A4</span>
    </div>
    <button onclick="window.print()">🖨️ طباعة الوثيقة A4 (Ctrl+P)</button>
  </div>
  <div class="print-sheet">
    ${cloned.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".html") ? fileName : `${fileName}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * تصدير وثيقة Microsoft Word رسمية قابلة للتعديل المباشر (.doc)
 * مضبوطة الهوامش والأبعاد على مقاس A4 القياسي مع دعم العربية والفرنسية والجداول
 */
export function exportEditableWordDoc(
  elementId: string = "printable-document-sheet",
  fileName: string = "Examen_Mathematiques.doc",
  title: string = "وثيقة الرياضيات الرسمية",
  orientation: "portrait" | "landscape" = "portrait"
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("تعذر العثور على عنصر الوثيقة لتصدير ملف Word.");
  }

  const cloned = prepareCleanDocumentClone(element, true);
  const dirAttr = element.getAttribute("dir") || "rtl";
  const pageSizePt =
    orientation === "landscape" ? "841.9pt 595.3pt" : "595.3pt 841.9pt";

  const wordDocumentContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40"
lang="${dirAttr === "ltr" ? "fr" : "ar"}" dir="${dirAttr}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: ${pageSizePt};
      margin: 28.35pt 34.0pt 28.35pt 34.0pt;
      mso-header-margin: 18.0pt;
      mso-footer-margin: 18.0pt;
    }
    div.WordSection1 {
      page: WordSection1;
      direction: ${dirAttr};
    }
    body {
      font-family: 'Amiri', 'Traditional Arabic', 'Times New Roman', serif;
      font-size: 11.5pt;
      color: #0f172a;
      line-height: 1.55;
    }
    .katex, .katex-html {
      direction: ltr !important;
      unicode-bidi: isolate !important;
      font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0;
    }
    th, td {
      border: 1pt solid #334155;
      padding: 5pt 7pt;
      font-size: 10.5pt;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      margin-top: 8pt;
      margin-bottom: 4pt;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="WordSection1" dir="${dirAttr}">
    ${cloned.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob(["\ufeff", wordDocumentContent], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".doc") ? fileName : `${fileName}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * ============================================================================
 * 1. التصدير التلقائي والمستقل لتقرير "مرصد التدقيق البيداغوجي والتقني الشامل" (PDF)
 * يحتوي على جميع التوصيات البيداغوجية والتقنية الحالية، مصفوفة الأوزان، والمؤشرات القياسية
 * ============================================================================
 */
export interface PedagogicalAuditPDFItem {
  id: string;
  title: string;
  status: "PASS" | "WARN" | "RECOMMEND";
  detail: string;
  actionLabel?: string;
}

export interface PedagogicalAuditPDFPayload {
  fileName?: string;
  academy: string;
  direction: string;
  school: string;
  prof: string;
  year: string;
  trackLabelAr: string;
  trackLabelFr: string;
  trackCode: string;
  semester: string;
  dsKey: string;
  docTitle: string;
  durationFr: string;
  examModel: string;
  scorePercent: number;
  passCount: number;
  issueCount: number;
  totalPoints: number;
  totalQuestions: number;
  totalExercises: number;
  n1: number;
  n2: number;
  n3: number;
  items: PedagogicalAuditPDFItem[];
  technicalMetrics?: {
    doublePenaltyCount: number;
    doublePenaltySummary: string;
    estimatedStudentMinutes: number;
    officialDurationMinutes: number;
    timeBudgetStatus: string;
    inversionCount: number;
    estimatedA4Pages: number;
    lastPageFillPercent: number;
    latexDelimiterWarningsCount: number;
  };
  lessonsSummary?: Array<{
    lessonAr: string;
    lessonFr: string;
    weight: number;
    points: number;
  }>;
}

function escapeHtmlSafe(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function exportPedagogicalAuditReportToPDF(
  payload: PedagogicalAuditPDFPayload
): Promise<string> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "0";
  host.style.width = "794px";
  host.style.backgroundColor = "#ffffff";
  host.style.zIndex = "-100";
  host.setAttribute("dir", "rtl");

  const nowDateAr = new Date().toLocaleDateString("ar-MA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metrics = payload.technicalMetrics || {
    doublePenaltyCount: 0,
    doublePenaltySummary: "خالٍ من الأسئلة الوسطية المفتوحة المسببة للعقوبة المزدوجة.",
    estimatedStudentMinutes: 90,
    officialDurationMinutes: 120,
    timeBudgetStatus: "OPTIMAL",
    inversionCount: 0,
    estimatedA4Pages: 2,
    lastPageFillPercent: 85,
    latexDelimiterWarningsCount: 0,
  };

  const pendingRecommendations = payload.items.filter((i) => i.status !== "PASS");

  const lessonsRowsHtml =
    payload.lessonsSummary && payload.lessonsSummary.length > 0
      ? payload.lessonsSummary
          .map(
            (l, idx) => `
          <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
            <td style="border:1px solid #cbd5e1; padding:6px 10px; font-weight:800; text-align:center;">${idx + 1}</td>
            <td style="border:1px solid #cbd5e1; padding:6px 10px; font-weight:700; color:#0f172a;">${escapeHtmlSafe(l.lessonAr)}</td>
            <td style="border:1px solid #cbd5e1; padding:6px 10px; font-family:monospace; color:#334155; direction:ltr; text-align:left;">${escapeHtmlSafe(l.lessonFr)}</td>
            <td style="border:1px solid #cbd5e1; padding:6px 10px; font-weight:800; text-align:center; color:#0f766e;">${l.weight}%</td>
            <td style="border:1px solid #cbd5e1; padding:6px 10px; font-weight:800; text-align:center; color:#1e1b4b;">${l.points.toFixed(2)} ن</td>
          </tr>`
          )
          .join("")
      : "";

  const auditRowsHtml = payload.items
    .map((item, idx) => {
      const isPass = item.status === "PASS";
      const isWarn = item.status === "WARN";
      const statusLabel = isPass
        ? "✓ مستوفى ومطابق"
        : isWarn
        ? "! تنبيه عاجل"
        : "★ توصية تطويرية";
      const statusBg = isPass ? "#ecfdf5" : isWarn ? "#fff1f2" : "#fffbeb";
      const statusColor = isPass ? "#065f46" : isWarn ? "#9f1239" : "#92400e";
      const statusBorder = isPass ? "#a7f3d0" : isWarn ? "#fecdd3" : "#fde68a";

      return `
        <div class="avoid-break" style="border:1px solid ${statusBorder}; background:${statusBg}; border-radius:8px; padding:10px 12px; margin-bottom:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
            <div style="font-size:12.5px; font-weight:900; color:#0f172a;">
              ${idx + 1}. ${escapeHtmlSafe(item.title)}
            </div>
            <span style="font-size:10.5px; font-weight:900; color:${statusColor}; border:1px solid ${statusBorder}; background:#ffffff; padding:2px 8px; border-radius:4px; white-space:nowrap;">
              ${statusLabel}
            </span>
          </div>
          <div style="font-size:11.5px; color:#334155; line-height:1.55;">
            ${escapeHtmlSafe(item.detail)}
          </div>
          ${
            !isPass && item.actionLabel
              ? `<div style="margin-top:5px; font-size:10.5px; font-weight:800; color:${statusColor};">
                  ← الإجراء التصحيحي المقترح: ${escapeHtmlSafe(item.actionLabel)}
                 </div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  const actionableListHtml =
    pendingRecommendations.length > 0
      ? pendingRecommendations
          .map(
            (rec, idx) => `
          <li style="margin-bottom:6px; font-size:11.5px; color:#1e293b; line-height:1.5;">
            <strong style="color:#92400e;">[توصية ${idx + 1} — ${escapeHtmlSafe(rec.title)}]:</strong>
            ${escapeHtmlSafe(rec.detail)}
            ${rec.actionLabel ? `<span style="color:#0f766e; font-weight:800;"> (${escapeHtmlSafe(rec.actionLabel)})</span>` : ""}
          </li>`
          )
          .join("")
      : `<li style="font-size:12px; font-weight:800; color:#065f46; line-height:1.6;">
          ✓ جميع المعايير الـ ${payload.items.length} البيداغوجية والديداكتيكية والتقنية مستوفاة بنسبة 100% وفق المذكرة الوزارية 142-08 والتوجيهات التربوية 2007. الوثيقة جاهزة للطباعة والتأشير التربوي.
        </li>`;

  host.innerHTML = `
    <div style="font-family:'Cairo','IBM Plex Sans Arabic','Amiri',sans-serif; color:#0f172a; padding:28px 34px; background:#ffffff; line-height:1.5;">
      <!-- الترويسة الرسمية للتقرير -->
      <div class="avoid-break" style="border:2px solid #0f172a; border-radius:10px; padding:14px 18px; margin-bottom:16px; background:#f8fafc;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; border-bottom:1.5px solid #cbd5e1; padding-bottom:10px; margin-bottom:10px;">
          <div style="font-size:11.5px; font-weight:800; color:#0f172a; line-height:1.6;">
            <div>المملكة المغربية — وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
            <div>الأكاديمية الجهوية للتربية والتكوين: ${escapeHtmlSafe(payload.academy)}</div>
            <div>المديرية الإقليمية: ${escapeHtmlSafe(payload.direction)}</div>
            <div>المؤسسة: ${escapeHtmlSafe(payload.school)}</div>
          </div>
          <div style="text-align:left; font-size:11.5px; font-weight:800; color:#1e293b; line-height:1.6;">
            <div>السنة الدراسية: <span style="font-family:monospace;">${escapeHtmlSafe(payload.year)}</span></div>
            <div>الأستاذ(ة) المنجز(ة): ${escapeHtmlSafe(payload.prof)}</div>
            <div>المسلك: ${escapeHtmlSafe(payload.trackLabelAr)} (<span style="font-family:monospace;">${escapeHtmlSafe(payload.trackCode)}</span>)</div>
            <div>تاريخ استخراج التقرير: ${escapeHtmlSafe(nowDateAr)}</div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
          <div>
            <div style="font-size:17px; font-weight:900; color:#0f172a;">
              تقرير مرصد التدقيق البيداغوجي والتقني الشامل (المذكرة الوزارية 142-08)
            </div>
            <div style="font-size:12px; font-weight:700; color:#475569; margin-top:2px;">
              الوثيقة المفحوصة: ${escapeHtmlSafe(payload.docTitle)} · الدورة ${escapeHtmlSafe(payload.semester)} · الفرض ${escapeHtmlSafe(payload.dsKey)} · النموذج (${escapeHtmlSafe(payload.examModel)}) · المدة (${escapeHtmlSafe(payload.durationFr)})
            </div>
          </div>
          <div style="background:${payload.scorePercent >= 90 ? "#065f46" : payload.scorePercent >= 70 ? "#0f766e" : "#b45309"}; color:#ffffff; padding:8px 16px; border-radius:8px; text-align:center; min-width:125px;">
            <div style="font-size:10px; font-weight:700; opacity:0.9;">نسبة المطابقة الرسمية</div>
            <div style="font-size:22px; font-weight:900; font-family:monospace; line-height:1.15;">${payload.scorePercent}%</div>
            <div style="font-size:9.5px; font-weight:700;">${payload.passCount} مستوفى / ${payload.items.length} معياراً</div>
          </div>
        </div>
      </div>

      <!-- القسم 1: خلاصة المؤشرات القياسية والتقنية (Telemetry & Didactic Metrics) -->
      <div class="avoid-break" style="margin-bottom:16px;">
        <h3 style="font-size:13.5px; font-weight:900; color:#0f172a; margin:0 0 8px 0; border-right:4px solid #0f766e; padding-right:8px;">
          أولاً: خلاصة المؤشرات البيداغوجية والقياسية والتقنية (Didactic & EdTech Diagnostics)
        </h3>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
          <div style="border:1px solid #cbd5e1; border-radius:8px; padding:9px 10px; background:#f8fafc;">
            <div style="font-size:10px; font-weight:800; color:#64748b;">سلم التنقيط وبنية الفرض</div>
            <div style="font-size:14px; font-weight:900; color:#0f172a; margin-top:2px;">${payload.totalPoints.toFixed(2)} / 20.00 ن</div>
            <div style="font-size:10.5px; color:#334155; margin-top:2px;">${payload.totalExercises} تمارين · ${payload.totalQuestions} سؤالاً فرعياً</div>
          </div>
          <div style="border:1px solid #cbd5e1; border-radius:8px; padding:9px 10px; background:#f8fafc;">
            <div style="font-size:10px; font-weight:800; color:#64748b;">توزيع المستويات المهارية (142-08)</div>
            <div style="font-size:13px; font-weight:900; color:#0f766e; margin-top:2px; font-family:monospace;">N1:${payload.n1}% | N2:${payload.n2}% | N3:${payload.n3}%</div>
            <div style="font-size:10.5px; color:#334155; margin-top:2px;">المعيار المرجعي: 35% / 45% / 20%</div>
          </div>
          <div style="border:1px solid #cbd5e1; border-radius:8px; padding:9px 10px; background:#f8fafc;">
            <div style="font-size:10px; font-weight:800; color:#64748b;">ميزانية الزمن (قاعدة المفتش 1×3)</div>
            <div style="font-size:14px; font-weight:900; color:#1e1b4b; margin-top:2px;">${metrics.estimatedStudentMinutes} د / ${metrics.officialDurationMinutes} د</div>
            <div style="font-size:10.5px; color:#334155; margin-top:2px;">انقلاب التدرج: ${metrics.inversionCount} · العقوبة المزدوجة: ${metrics.doublePenaltyCount}</div>
          </div>
          <div style="border:1px solid #cbd5e1; border-radius:8px; padding:9px 10px; background:#f8fafc;">
            <div style="font-size:10px; font-weight:800; color:#64748b;">معايرة الورقة A4 وشجرة LaTeX</div>
            <div style="font-size:14px; font-weight:900; color:#0f172a; margin-top:2px;">${metrics.estimatedA4Pages} صفحات A4 (${metrics.lastPageFillPercent}%)</div>
            <div style="font-size:10.5px; color:#334155; margin-top:2px;">أقواس LaTeX غير متوازنة: ${metrics.latexDelimiterWarningsCount}</div>
          </div>
        </div>
      </div>

      <!-- القسم 2: جدول موازنة الأوزان النسبية للدروس -->
      ${
        lessonsRowsHtml
          ? `
      <div class="avoid-break" style="margin-bottom:16px;">
        <h3 style="font-size:13.5px; font-weight:900; color:#0f172a; margin:0 0 8px 0; border-right:4px solid #1e1b4b; padding-right:8px;">
          ثانياً: جدول موازنة الأوزان النسبية للدروس المختارة وتوزيع النقط (مصفوفة التخصيص)
        </h3>
        <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
          <thead>
            <tr style="background:#f1f5f9; color:#0f172a;">
              <th style="border:1px solid #cbd5e1; padding:6px 10px; width:40px;">#</th>
              <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:right;">عنوان الدرس / المكون البيداغوجي (عربي)</th>
              <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Intitulé du Chapitre (BIOF / FR)</th>
              <th style="border:1px solid #cbd5e1; padding:6px 10px; width:90px;">الوزن النسبي</th>
              <th style="border:1px solid #cbd5e1; padding:6px 10px; width:95px;">الحصة من 20</th>
            </tr>
          </thead>
          <tbody>
            ${lessonsRowsHtml}
          </tbody>
        </table>
      </div>`
          : ""
      }

      <!-- القسم 3: مصفوفة بنود التدقيق البيداغوجي والتقني المفصلة -->
      <div style="margin-bottom:16px;">
        <h3 style="font-size:13.5px; font-weight:900; color:#0f172a; margin:0 0 8px 0; border-right:4px solid #0f766e; padding-right:8px;">
          ثالثاً: مصفوفة الفحص التفصيلي لبنود المطابقة البيداغوجية والتقنية (${payload.items.length} معياراً)
        </h3>
        ${auditRowsHtml}
      </div>

      <!-- القسم 4: خلاصة التوصيات البيداغوجية والتقنية الحالية وتأشيرة المصادقة -->
      <div class="avoid-break" style="border:1.5px solid #0f172a; border-radius:10px; padding:14px 16px; background:#f8fafc;">
        <h3 style="font-size:13.5px; font-weight:900; color:#0f172a; margin:0 0 8px 0;">
          رابعاً: التوصيات البيداغوجية والتقنية الحالية وخلاصة الخبرة التربوية
        </h3>
        <ul style="margin:0 0 14px 0; padding-right:18px;">
          ${actionableListHtml}
          <li style="margin-top:6px; font-size:11.5px; color:#334155; line-height:1.5;">
            <strong>تشخيص العقوبة المزدوجة (Double Penalty):</strong> ${escapeHtmlSafe(metrics.doublePenaltySummary)}
          </li>
        </ul>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; border-top:1px dashed #94a3b8; padding-top:12px; margin-top:8px; text-align:center; font-size:11px; font-weight:800; color:#334155;">
          <div style="border:1px solid #cbd5e1; background:#ffffff; border-radius:6px; padding:10px 8px; min-height:64px;">
            <div>توقيع الأستاذ(ة) المنجز(ة)</div>
            <div style="font-size:10px; color:#64748b; margin-top:4px;">${escapeHtmlSafe(payload.prof)}</div>
          </div>
          <div style="border:1px solid #cbd5e1; background:#ffffff; border-radius:6px; padding:10px 8px; min-height:64px;">
            <div>خاتم وتأشيرة إدارة المؤسسة</div>
            <div style="font-size:10px; color:#64748b; margin-top:4px;">${escapeHtmlSafe(payload.school)}</div>
          </div>
          <div style="border:1px solid #cbd5e1; background:#ffffff; border-radius:6px; padding:10px 8px; min-height:64px;">
            <div>تأشيرة السيد(ة) المفتش(ة) التربوي(ة)</div>
            <div style="font-size:10px; color:#64748b; margin-top:4px;">المذكرة الوزارية 142-08</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(host);

  try {
    const dataUrl = await toPng(host, {
      quality: 1.0,
      pixelRatio: 2.5,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () =>
        reject(new Error("تعذر معالجة صورة تقرير التدقيق البيداغوجي لتوليد ملف PDF."));
      img.src = dataUrl;
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidthMm = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297mm
    const marginMm = 9;
    const footerHeightMm = 8.5;
    const runningHeaderMm = 6.5;

    const contentWidthMm = pageWidthMm - marginMm * 2;
    const firstPageBodyMm = pageHeightMm - marginMm * 2 - footerHeightMm;

    const pxPerMm = img.width / contentWidthMm;
    const maxSliceHeightPx = Math.floor((firstPageBodyMm - runningHeaderMm) * pxPerMm);
    const footerHeightPx = Math.round(footerHeightMm * pxPerMm);
    const runningHeaderPx = Math.round(runningHeaderMm * pxPerMm);

    const cuts = calculateSmartPageSlices(host, img.width, img.height, maxSliceHeightPx);
    const totalPages = Math.max(1, cuts.length - 1);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const startY = cuts[i];
      const endY = cuts[i + 1];
      const sliceHeightPx = endY - startY;
      if (sliceHeightPx <= 0) continue;

      const currentHeaderPx = i > 0 ? runningHeaderPx : 0;
      const totalCanvasHeightPx = currentHeaderPx + sliceHeightPx + footerHeightPx;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = totalCanvasHeightPx;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          img,
          0,
          startY,
          img.width,
          sliceHeightPx,
          0,
          currentHeaderPx,
          img.width,
          sliceHeightPx
        );

        drawCanvasRunningHeaderAndFooter(
          ctx,
          canvas.width,
          canvas.height,
          currentHeaderPx,
          footerHeightPx,
          i,
          totalPages,
          {
            docTitle: `تقرير مرصد التدقيق البيداغوجي (${payload.scorePercent}%) — ${payload.trackLabelAr}`,
            headerMeta: `${payload.school} · ${payload.prof} · ${payload.year}`,
            isMission: false,
            isFrench: false,
          }
        );

        const sliceDataUrl = canvas.toDataURL("image/png", 0.98);
        const totalSliceMm = totalCanvasHeightPx / pxPerMm;

        pdf.addImage(
          sliceDataUrl,
          "PNG",
          marginMm,
          marginMm,
          contentWidthMm,
          Math.min(totalSliceMm, pageHeightMm - marginMm * 2),
          undefined,
          "FAST"
        );
      }
    }

    const defaultName = `Rapport_Audit_Pedagogique_${payload.trackCode}_${payload.semester}_${payload.dsKey}_${payload.year}.pdf`;
    const finalFileName = payload.fileName
      ? payload.fileName.endsWith(".pdf")
        ? payload.fileName
        : `${payload.fileName}.pdf`
      : defaultName;

    pdf.save(finalFileName);
    return finalFileName;
  } finally {
    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  }
}

/**
 * ============================================================================
 * 2. محرك الترتيب والطي التلقائي بتخطيط "كتيب" (Booklet Imposition A4 -> A5)
 * يرتب صفحات الوثيقة ليتم طباعتها على ورق A4 أفقي (Landscape) وطيها من الوسط إلى كتيب A5
 * ============================================================================
 */
export interface BookletSpreadPair {
  sheetIndex: number; // رقم الورقة الفعلية A4 (1, 2, ...)
  side: "RECTO" | "VERSO"; // وجه الورقة أو ظهرها
  sideLabelAr: string;
  leftPageNumber: number; // رقم الصفحة على النصف الأيسر من ورقة A4
  rightPageNumber: number; // رقم الصفحة على النصف الأيمن من ورقة A4
  isLeftBlankPadding: boolean;
  isRightBlankPadding: boolean;
}

/**
 * حساب خريطة ترتيب صفحات الكتيب المطوي (Saddle-Stitch Booklet Imposition)
 * حيث يتم تكميل عدد الصفحات إلى أقرب مضاعف للعدد 4، ثم توزيع الصفحات المتقابلة
 * بحيث بعد طي الأوراق من المنتصف، تتسلسل الصفحات (1، 2، 3، ... N) بشكل طبيعي.
 */
export function computeBookletImpositionSpreads(
  originalPageCount: number,
  bindingEdge: "RTL_RIGHT" | "LTR_LEFT" = "RTL_RIGHT"
): {
  originalPages: number;
  paddedBookletPages: number;
  physicalA4Sheets: number;
  spreads: BookletSpreadPair[];
} {
  const safeOriginal = Math.max(1, Math.round(originalPageCount));
  const paddedBookletPages = Math.max(4, Math.ceil(safeOriginal / 4) * 4);
  const physicalA4Sheets = paddedBookletPages / 4;
  const spreads: BookletSpreadPair[] = [];

  for (let s = 0; s < physicalA4Sheets; s++) {
    // في الكتيب القياسي (LTR): الوجه الخارجي للورقة s يحمل [P - 2s | 1 + 2s] والظهر يحمل [2 + 2s | P - 1 - 2s]
    // في الكتيب العربي (RTL - الطي من اليمين): الغلاف الأمامي (ص 1) يكون على اليسار الخارجي عند الفتح أو اليمين عند الطي
    // بحيث عند طي الورقة A4 نصفين عمودياً يصبح الغلاف العربي (ص 1) في الواجهة اليمنى
    const outerFirst = 1 + 2 * s;
    const outerLast = paddedBookletPages - 2 * s;
    const innerFirst = 2 + 2 * s;
    const innerLast = paddedBookletPages - 1 - 2 * s;

    const rectoLeft = bindingEdge === "RTL_RIGHT" ? outerFirst : outerLast;
    const rectoRight = bindingEdge === "RTL_RIGHT" ? outerLast : outerFirst;

    const versoLeft = bindingEdge === "RTL_RIGHT" ? innerLast : innerFirst;
    const versoRight = bindingEdge === "RTL_RIGHT" ? innerFirst : innerLast;

    spreads.push({
      sheetIndex: s + 1,
      side: "RECTO",
      sideLabelAr: `الورقة ${s + 1} — الوجه (Recto)`,
      leftPageNumber: rectoLeft,
      rightPageNumber: rectoRight,
      isLeftBlankPadding: rectoLeft > safeOriginal,
      isRightBlankPadding: rectoRight > safeOriginal,
    });

    spreads.push({
      sheetIndex: s + 1,
      side: "VERSO",
      sideLabelAr: `الورقة ${s + 1} — الظهر (Verso)`,
      leftPageNumber: versoLeft,
      rightPageNumber: versoRight,
      isLeftBlankPadding: versoLeft > safeOriginal,
      isRightBlankPadding: versoRight > safeOriginal,
    });
  }

  return {
    originalPages: safeOriginal,
    paddedBookletPages,
    physicalA4Sheets,
    spreads,
  };
}

export interface ExportBookletPDFOptions {
  elementId?: string;
  fileName?: string;
  bindingEdge?: "RTL_RIGHT" | "LTR_LEFT";
  addFoldGuides?: boolean;
  docTitle?: string;
  headerMeta?: string;
  isMission?: boolean;
  isFrench?: boolean;
  colorMode?: PrintColorMode;
  interactiveQuizUrl?: string;
  includeFooterQrCode?: boolean;
}

/**
 * تصدير ملف PDF جاهز للطباعة بتخطيط "كتيب" (Booklet A4 Landscape -> Folded A5)
 * يقوم بتقطيع الوثيقة إلى صفحات A5، ويكملها إلى مضاعفات 4 بصفحات مسودة مؤطرة،
 * ثم يرتب كل صفحتين متقابلتين في ورقة A4 أفقية وفق خوارزمية الطي المركزي (Saddle-Stitch).
 */
export async function exportBookletImposedPDF(
  options: ExportBookletPDFOptions = {}
): Promise<{
  fileName: string;
  originalPages: number;
  paddedBookletPages: number;
  physicalA4Sheets: number;
}> {
  const {
    elementId = "printable-document-sheet",
    fileName = "Livret_Booklet_A4_to_A5.pdf",
    bindingEdge = "RTL_RIGHT",
    addFoldGuides = true,
    docTitle = "كتيب الفرض المحروس (Booklet A4 → A5)",
    headerMeta = "وزارة التربية الوطنية · المملكة المغربية",
    isMission = false,
    isFrench = false,
    colorMode = "FULL_COLOR",
    interactiveQuizUrl,
    includeFooterQrCode = true,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("تعذر العثور على عنصر الوثيقة لتوليد كتيب الطباعة (Booklet).");
  }

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const domQuizUrl = element.getAttribute("data-interactive-quiz-url") || "";
  const resolvedQuizUrl =
    interactiveQuizUrl ||
    domQuizUrl ||
    buildInteractiveQuizLinkForDocument({
      educationSystem: isMission ? "MISSION_FR" : "MOROCCO_MEN",
      title: docTitle || fileName,
    });
  const qrMatrix =
    includeFooterQrCode && resolvedQuizUrl
      ? generateIsoQrMatrix(resolvedQuizUrl, "M")
      : undefined;

  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2.4,
    backgroundColor: "#ffffff",
    cacheBust: true,
    filter: (node: Node) => {
      if (node instanceof HTMLElement && node.classList.contains("no-print")) {
        return false;
      }
      return true;
    },
    style: {
      transform: "none",
      margin: "0",
      boxShadow: "none",
      borderRadius: "0",
      border: "none",
    },
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("تعذر معالجة صورة الوثيقة لتوليد الكتيب."));
    img.src = dataUrl;
  });

  // أبعاد صفحة A5 العمودية داخل ورقة A4 الأفقية: 148.5mm × 210mm
  const a5WidthMm = 148.5;
  const a5HeightMm = 210;
  const a5MarginMm = 7.5;
  const footerHeightMm = includeFooterQrCode ? 12.0 : 7.5;
  const runningHeaderMm = 5.5;

  const contentWidthMm = a5WidthMm - a5MarginMm * 2;
  const bodyHeightMm = a5HeightMm - a5MarginMm * 2 - footerHeightMm - runningHeaderMm;

  const pxPerMm = img.width / contentWidthMm;
  const maxSliceHeightPx = Math.floor(bodyHeightMm * pxPerMm);
  const footerHeightPx = Math.round(footerHeightMm * pxPerMm);
  const runningHeaderPx = Math.round(runningHeaderMm * pxPerMm);
  const fullA5CanvasHeightPx = runningHeaderPx + maxSliceHeightPx + footerHeightPx;

  const cuts = calculateSmartPageSlices(element, img.width, img.height, maxSliceHeightPx);
  const originalPages = Math.max(1, cuts.length - 1);

  const imposition = computeBookletImpositionSpreads(originalPages, bindingEdge);

  // دالة مساعدة لتوليد صورة صفحة فردية رقْم pageNumber (من 1 إلى paddedBookletPages)
  const renderSingleA5PageCanvas = (pageNumber1Based: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = fullA5CanvasHeightPx;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (pageNumber1Based <= originalPages) {
      const idx = pageNumber1Based - 1;
      const startY = cuts[idx];
      const endY = cuts[idx + 1];
      const sliceHeightPx = Math.max(0, endY - startY);

      if (sliceHeightPx > 0) {
        ctx.drawImage(
          img,
          0,
          startY,
          img.width,
          sliceHeightPx,
          0,
          runningHeaderPx,
          img.width,
          sliceHeightPx
        );
      }
    } else {
      // صفحة مسودة منقطة ومؤطرة لتكميل مضاعفات 4 في الكتيب المطوي
      const padX = Math.round(canvas.width * 0.05);
      const topY = runningHeaderPx + Math.round(canvas.height * 0.04);
      const boxH = maxSliceHeightPx - Math.round(canvas.height * 0.08);

      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = Math.max(1.5, Math.round(canvas.width / 450));
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(padX, topY, canvas.width - padX * 2, boxH);
      ctx.setLineDash([]);

      ctx.fillStyle = "#475569";
      const titleFontPx = Math.max(18, Math.round(canvas.width / 36));
      ctx.font = `700 ${titleFontPx}px "Cairo", "IBM Plex Sans Arabic", sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(
        isMission || isFrench
          ? `Page de brouillon et notes (${pageNumber1Based}/${imposition.paddedBookletPages})`
          : `مسودة العمليات الحسابية وملاحظات المترشح(ة) — صفحة (${pageNumber1Based}/${imposition.paddedBookletPages})`,
        canvas.width / 2,
        topY + titleFontPx * 1.8
      );

      // رسم أسطر مسودة خفيفة
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      const lineStep = Math.round(titleFontPx * 1.9);
      for (
        let y = topY + titleFontPx * 3.2;
        y < topY + boxH - lineStep;
        y += lineStep
      ) {
        ctx.beginPath();
        ctx.moveTo(padX + 24, y);
        ctx.lineTo(canvas.width - padX - 24, y);
        ctx.stroke();
      }
    }

    drawCanvasRunningHeaderAndFooter(
      ctx,
      canvas.width,
      canvas.height,
      runningHeaderPx,
      footerHeightPx,
      pageNumber1Based - 1,
      imposition.paddedBookletPages,
      {
        docTitle,
        headerMeta,
        isMission,
        isFrench,
        qrMatrix,
        interactiveQuizUrl: resolvedQuizUrl,
      }
    );

    if (colorMode === "LASER_MONO") {
      applyLaserMonochromeFilter(ctx, canvas.width, canvas.height);
    }

    return canvas;
  };

  // تخزين الصفحات المولدة في الذاكرة لتوزيعها على أوراق A4 الأفقية
  const pageCanvasesMap = new Map<number, string>();
  for (let p = 1; p <= imposition.paddedBookletPages; p++) {
    const c = renderSingleA5PageCanvas(p);
    pageCanvasesMap.set(p, c.toDataURL("image/png", 0.96));
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // كل Spread يمثل وجهاً واحداً لورقة A4 أفقية (297mm × 210mm) مقسومة إلى صفحتي A5 (148.5mm لكل نصف)
  imposition.spreads.forEach((spread, idx) => {
    if (idx > 0) {
      pdf.addPage("a4", "landscape");
    }

    const leftDataUrl = pageCanvasesMap.get(spread.leftPageNumber);
    const rightDataUrl = pageCanvasesMap.get(spread.rightPageNumber);

    const halfWidthMm = 148.5;
    const fullHeightMm = 210;
    const innerPadMm = 6;
    const targetW = halfWidthMm - innerPadMm * 2;
    const targetH = fullHeightMm - innerPadMm * 2;

    if (leftDataUrl) {
      pdf.addImage(
        leftDataUrl,
        "PNG",
        innerPadMm,
        innerPadMm,
        targetW,
        targetH,
        undefined,
        "FAST"
      );
    }

    if (rightDataUrl) {
      pdf.addImage(
        rightDataUrl,
        "PNG",
        halfWidthMm + innerPadMm,
        innerPadMm,
        targetW,
        targetH,
        undefined,
        "FAST"
      );
    }

    if (addFoldGuides) {
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.35);
      pdf.setLineDashPattern([2.5, 2.5], 0);
      pdf.line(halfWidthMm, 4, halfWidthMm, fullHeightMm - 4);
      pdf.setLineDashPattern([], 0);

      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Sheet ${spread.sheetIndex} (${spread.side}) | Fold A4 -> A5 | [P.${spread.leftPageNumber} | P.${spread.rightPageNumber}]`,
        halfWidthMm,
        3.5,
        { align: "center" }
      );
    }
  });

  const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  pdf.save(cleanFileName);

  return {
    fileName: cleanFileName,
    originalPages: imposition.originalPages,
    paddedBookletPages: imposition.paddedBookletPages,
    physicalA4Sheets: imposition.physicalA4Sheets,
  };
}

