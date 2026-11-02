import test from "node:test";
import assert from "node:assert/strict";
import {
  computePrintMediaQueryMetrics,
  analyzeA4LayoutMetrics,
} from "./pdfExporter.ts";
import {
  DOC_VIEW_MARGIN_MODELS,
  resolveAutoDocViewMarginModel,
} from "../components/PrintablePreview.tsx";

test("resolveAutoDocViewMarginModel maps modules to accurate Moroccan ministerial margins", () => {
  const dsModel = resolveAutoDocViewMarginModel("DS_142_08");
  assert.equal(dsModel.id, "DS_EXAM_OFFICIAL");
  assert.equal(dsModel.topMm, 16);
  assert.equal(dsModel.bottomMm, 16);
  assert.equal(dsModel.xMm, 15);

  const tdModel = resolveAutoDocViewMarginModel("DM_SERIE", "SERIE_TD");
  assert.equal(tdModel.id, "SERIE_TD_COMPACT");
  assert.equal(tdModel.topMm, 8);
  assert.equal(tdModel.xMm, 8);

  const dmModel = resolveAutoDocViewMarginModel("DM_SERIE", "DEVOIR_MAISON");
  assert.equal(dmModel.id, "DEVOIR_MAISON_BALANCED");
  assert.equal(dmModel.topMm, 12);

  const ficheModel = resolveAutoDocViewMarginModel("FICHE_OP2007");
  assert.equal(ficheModel.id, "FICHE_PEDAGOGIQUE_WIDE");
  assert.equal(ficheModel.topMm, 10);
});

test("computePrintMediaQueryMetrics calculates exact printable area and css @page rules", () => {
  const metrics = computePrintMediaQueryMetrics({
    preset: "A4",
    orientation: "PORTRAIT",
    marginTopMm: 16,
    marginBottomMm: 16,
    marginXMm: 15,
    contentWidthPx: 794,
    contentHeightPx: 1050,
  });

  assert.equal(metrics.widthMm, 210);
  assert.equal(metrics.heightMm, 297);
  assert.equal(metrics.printableWidthMm, 210 - 2 * 15); // 180mm
  assert.equal(metrics.printableHeightMm, 297 - 2 * 16); // 265mm
  assert.match(metrics.cssPageRule, /@page \{ size: A4 portrait; margin: 16mm 15mm 16mm 15mm; \}/);
  assert.match(metrics.cssMediaPrintBlock, /@media print/);
});

test("analyzeA4LayoutMetrics detects layout overflow and recommends corrective margins", () => {
  const report = analyzeA4LayoutMetrics({
    contentWidthPx: 794,
    scrollWidthPx: 794,
    contentHeightPx: 1050,
    orientation: "portrait",
    currentMarginTopMm: 16,
    currentMarginBottomMm: 16,
    currentMarginXMm: 15,
    includeFooterQrCode: true,
  });

  assert.ok(report.rawPageCount >= 1);
  assert.ok(report.recommendedMarginMm > 0);
  assert.ok(report.recommendedScaleFactor <= 1 && report.recommendedScaleFactor >= 0.85);
});
