import test from "node:test";
import assert from "node:assert/strict";
import {
  MATH_SYMBOLS_LIBRARY,
  MATH_SYMBOL_CATEGORIES,
  filterMathSymbols,
  shouldEnablePedagogyFullscreen,
} from "./mathSymbolsRegistry";

test("mathSymbolsRegistry includes arithmetic/algebraic operations and calculus symbols", () => {
  assert.ok(MATH_SYMBOLS_LIBRARY.length >= 45);
  assert.ok(MATH_SYMBOL_CATEGORIES.some((c) => c.id === "OPERATIONS"));

  const ops = filterMathSymbols("OPERATIONS");
  assert.ok(ops.length >= 12);
  assert.ok(ops.some((item) => item.glyph === "×"));
  assert.ok(ops.some((item) => item.glyph === "÷"));
  assert.ok(ops.some((item) => item.glyph === "a/b"));
  assert.ok(ops.some((item) => item.glyph === "xⁿ"));
});

test("filterMathSymbols filters accurately by category and Arabic/French/LaTeX query", () => {
  const analysisResults = filterMathSymbols("ANALYSIS", "تكامل");
  assert.equal(analysisResults.length, 1);
  assert.equal(analysisResults[0].glyph, "∫");

  const fracResults = filterMathSymbols("ALL", "frac");
  assert.ok(fracResults.some((i) => i.glyph === "a/b"));

  const greekDelta = filterMathSymbols("GREEK", "delta");
  assert.ok(greekDelta.some((i) => i.glyph === "Δ"));
});

test("shouldEnablePedagogyFullscreen returns true only when pedagogy tab is opened", () => {
  assert.equal(shouldEnablePedagogyFullscreen("pedagogy"), true);
  assert.equal(shouldEnablePedagogyFullscreen("home"), false);
  assert.equal(shouldEnablePedagogyFullscreen("absence"), false);
});
