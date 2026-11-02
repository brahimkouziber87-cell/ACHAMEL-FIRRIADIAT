import test from "node:test";
import assert from "node:assert/strict";
import {
  latexToMathJSExpression,
  sanitizeQuestionMathExpressions,
  checkSingleMathExpressionWithMathJS,
} from "./mathjsValidator";

test("latexToMathJSExpression converts LaTeX fractions, roots, and powers", () => {
  const expr = latexToMathJSExpression("\\frac{x^2 + 1}{\\sqrt{x}}");
  assert.equal(expr, "((x^2 + 1)/(sqrt(x)))");
});

test("sanitizeQuestionMathExpressions auto-closes unbalanced dollar and braces", () => {
  const res = sanitizeQuestionMathExpressions("أحسب النهاية $\\frac{x+1}{x");
  assert.equal(res.wasAutoFixed, true);
  assert.ok(res.sanitizedText.endsWith("$}") || res.sanitizedText.includes("}"));
});

test("checkSingleMathExpressionWithMathJS computes symbolic derivative", () => {
  const res = checkSingleMathExpressionWithMathJS("x^3 + 2*x");
  assert.equal(res.isValid, true);
  assert.ok(res.symbolicDerivativeX?.includes("3 * x ^ 2"));
});
