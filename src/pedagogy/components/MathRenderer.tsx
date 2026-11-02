import React, { useMemo } from "react";
import katex from "katex";

export const KATEX_MOROCCAN_MACROS: Record<string, string> = {
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\Q": "\\mathbb{Q}",
  "\\C": "\\mathbb{C}",
  "\\K": "\\mathbb{K}",
  "\\dx": "\\,\\mathrm{d}x",
  "\\dt": "\\,\\mathrm{d}t",
  "\\du": "\\,\\mathrm{d}u",
  "\\e": "\\mathrm{e}",
  "\\vect": "\\vec{#1}",
  "\\ds": "\\displaystyle",
  "\\norme": "\\left\\|#1\\right\\|",
  "\\abs": "\\left|#1\\right|",
  "\\llbracket": "[\\![",
  "\\rrbracket": "]\\!]",
  "\\Cf": "\\mathcal{C}_f",
  "\\Cg": "\\mathcal{C}_g",
  "\\Ch": "\\mathcal{C}_h",
  "\\Df": "\\mathcal{D}_f",
  "\\Dg": "\\mathcal{D}_g",
  "\\Dh": "\\mathcal{D}_h",
  "\\Card": "\\mathrm{Card}",
  "\\card": "\\mathrm{Card}",
  "\\pgcd": "\\mathrm{PGCD}",
  "\\ppcm": "\\mathrm{PPCM}",
  "\\PGCD": "\\mathrm{PGCD}",
  "\\PPCM": "\\mathrm{PPCM}",
  "\\Re": "\\mathrm{Re}",
  "\\Im": "\\mathrm{Im}",
  "\\conj": "\\overline{#1}",
  "\\Oij": "(O;\\,\\vec{i},\\,\\vec{j})",
  "\\Ouv": "(O;\\,\\vec{u},\\,\\vec{v})",
  "\\Oijk": "(O;\\,\\vec{i},\\,\\vec{j},\\,\\vec{k})",
  "\\mathscr": "\\mathcal{#1}",
};

/**
 * Normalise la syntaxe mathématique pour KaTeX (support des notations marocaines et françaises).
 */
export function normalizeMathSyntax(latex: string): string {
  if (!latex) return "";
  let s = latex
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/⁻¹/g, "^{-1}")
    .replace(/uₙ₊₁/g, "u_{n+1}")
    .replace(/uₙ/g, "u_n")
    .replace(/u₀/g, "u_0")
    .replace(/u₁/g, "u_1")
    .replace(/vₙ₊₁/g, "v_{n+1}")
    .replace(/vₙ/g, "v_n")
    .replace(/v₀/g, "v_0")
    .replace(/i⃗/g, "\\vec{i}")
    .replace(/j⃗/g, "\\vec{j}")
    .replace(/k⃗/g, "\\vec{k}")
    .replace(/u⃗/g, "\\vec{u}")
    .replace(/v⃗/g, "\\vec{v}")
    .replace(/w⃗/g, "\\vec{w}")
    .replace(/([A-Z])([A-Z])⃗/g, "\\vec{$1$2}")
    .replace(/([a-zA-Z])⃗/g, "\\vec{$1}")
    .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/√([a-zA-Z0-9]+)/g, "\\sqrt{$1}")
    .replace(/ℝ/g, "\\mathbb{R}")
    .replace(/ℂ/g, "\\mathbb{C}")
    .replace(/ℕ/g, "\\mathbb{N}")
    .replace(/ℤ/g, "\\mathbb{Z}")
    .replace(/ℚ/g, "\\mathbb{Q}")
    .replace(/∞/g, "\\infty")
    .replace(/≠/g, "\\neq ")
    .replace(/≤/g, "\\le ")
    .replace(/≥/g, "\\ge ")
    .replace(/≈/g, "\\approx ")
    .replace(/≡/g, "\\equiv ")
    .replace(/×/g, "\\times ")
    .replace(/·/g, "\\cdot ")
    .replace(/±/g, "\\pm ")
    .replace(/⇔/g, "\\iff ")
    .replace(/⇒/g, "\\implies ")
    .replace(/→/g, "\\to ")
    .replace(/∈/g, "\\in ")
    .replace(/∉/g, "\\notin ")
    .replace(/⊂/g, "\\subset ")
    .replace(/∪/g, "\\cup ")
    .replace(/∩/g, "\\cap ")
    .replace(/∀/g, "\\forall ")
    .replace(/∃/g, "\\exists ")
    .replace(/π/g, "\\pi ")
    .replace(/Δ/g, "\\Delta ")
    .replace(/Ω/g, "\\Omega ")
    .replace(/Γ/g, "\\Gamma ")
    .replace(/α/g, "\\alpha ")
    .replace(/β/g, "\\beta ")
    .replace(/γ/g, "\\gamma ")
    .replace(/θ/g, "\\theta ")
    .replace(/λ/g, "\\lambda ")
    .replace(/σ/g, "\\sigma ")
    .replace(/ω/g, "\\omega ")
    .replace(/\+oo\b/g, "+\\infty")
    .replace(/-oo\b/g, "-\\infty")
    .replace(/\bPGCD\b/g, "\\mathrm{PGCD}")
    .replace(/\bPPCM\b/g, "\\mathrm{PPCM}")
    .replace(/\(C_f\)/g, "(\\mathcal{C}_f)")
    .replace(/\(Cf\)/g, "(\\mathcal{C}_f)")
    .replace(/\(C_g\)/g, "(\\mathcal{C}_g)")
    .replace(/\(C_h\)/g, "(\\mathcal{C}_h)")
    .replace(/\bD_f\b/g, "\\mathcal{D}_f")
    .replace(/\bD_g\b/g, "\\mathcal{D}_g")
    .replace(/\bD_h\b/g, "\\mathcal{D}_h")
    .replace(/<=/g, "\\le ")
    .replace(/>=/g, "\\ge ")
    .replace(/!=/g, "\\neq ")
    .replace(/<=>/g, "\\iff ")
    .replace(/=>/g, "\\implies ")
    .replace(/->/g, "\\to ");

  // Normalisation des intégrales abrégées : ∫_a^b ... dx
  s = s
    .replace(/∫_\{([^}]+)\}\^\{([^}]+)\}/g, "\\int_{$1}^{$2}")
    .replace(/∫_([^\s^_]+)\^\{([^}]+)\}/g, "\\int_{$1}^{$2}")
    .replace(/∫_\{([^}]+)\}\^([^\s^_]+)/g, "\\int_{$1}^{$2}")
    .replace(/∫_([^\s^_]+)\^([^\s^_]+)/g, "\\int_{$1}^{$2}")
    .replace(/∫/g, "\\int ")
    .replace(/\s+d([xtyuz])\b/g, "\\,\\mathrm{d}$1");

  // Normalisation des limites abrégées : lim_{x->...}
  s = s
    .replace(/(?<!\\)\blim_\{([^}]+)\}/g, "\\lim_{$1}")
    .replace(/(?<!\\)\blim_([^\s]+)/g, "\\lim_{$1}")
    .replace(/(?<!\\)\blim\b/g, "\\lim");

  // Normalisation des fonctions mathématiques usuelles
  s = s.replace(
    /(?<!\\)\b(ln|log|exp|cos|sin|tan|cot|arcsin|arccos|arctan|arg|max|min|sup|inf|det)\b/g,
    "\\$1"
  );

  // Normalisation des fractions algébriques abrégées : (A)/(B), (A)/B, A/(B), f(x)/g(x), a/b
  s = s
    .replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}")
    .replace(/\(([^()]+)\)\s*\/\s*((?:[a-zA-Z0-9_]+|\{[^{}]*\})(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?)/g, "\\frac{$1}{$2}")
    .replace(
      /((?:\\?[a-zA-Z]+)'?\([^()]+\)|[a-zA-Z0-9_^{}]+)\s*\/\s*\(([^()]+)\)/g,
      "\\frac{$1}{$2}"
    )
    .replace(
      /((?:\\?[a-zA-Z]+)'?\([^()]+\)|\\pi\s*|[a-zA-Z0-9_^{}]+)\s*\/\s*((?:[a-zA-Z0-9_]+|\{[^{}]*\})(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?)/g,
      "\\frac{$1}{$2}"
    );

  return s;
}

// Caches LRU bornés en mémoire pour éviter de recalculer les mêmes formules KaTeX lors des rendus successifs
const MAX_MATH_CACHE_ENTRIES = 1500;
const LATEX_HTML_CACHE = new Map<string, string>();
const PARSED_SEGMENTS_CACHE = new Map<string, TextSegment[]>();

function getCachedValue<T>(cache: Map<string, T>, key: string): T | undefined {
  const val = cache.get(key);
  if (val !== undefined) {
    // Rafraîchir l'ordre LRU
    cache.delete(key);
    cache.set(key, val);
  }
  return val;
}

function setCachedValue<T>(cache: Map<string, T>, key: string, value: T): void {
  if (cache.size >= MAX_MATH_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }
  cache.set(key, value);
}

/**
 * Rendu sécurisé d'une formule LaTeX avec KaTeX (avec cache LRU rapide en mémoire).
 */
export function renderSingleLatexFormula(
  tex: string,
  displayMode: boolean = false
): string {
  const trimmed = tex.trim();
  if (!trimmed) return "";

  const cacheKey = `${displayMode ? "D:" : "I:"}${trimmed}`;
  const cachedHtml = getCachedValue(LATEX_HTML_CACHE, cacheKey);
  if (cachedHtml !== undefined) {
    return cachedHtml;
  }

  const normalized = normalizeMathSyntax(trimmed);
  if (!normalized) return "";

  let html: string;
  try {
    html = katex.renderToString(normalized, {
      displayMode,
      throwOnError: false,
      errorColor: "#b91c1c",
      macros: KATEX_MOROCCAN_MACROS,
      output: "htmlAndMathml",
      strict: false,
      trust: true,
    });
  } catch {
    html = `<code class="font-mono text-slate-800 bg-slate-100 px-1 rounded">${tex}</code>`;
  }

  setCachedValue(LATEX_HTML_CACHE, cacheKey, html);
  return html;
}

export interface TextSegment {
  type: "text" | "inline-math" | "display-math";
  content: string;
}

// Motif unifié pour détecter les expressions mathématiques implicites non délimitées par $...$
// Ne capture jamais les mots de prose français ou arabes.
const IMPLICIT_MATH_TOKEN_SOURCE = [
  // 1. Commandes LaTeX explicites
  "\\\\(?:frac|sqrt|lim|int|sum|prod|vec|vect|mathbb|mathrm|mathbf|mathcal|binom|over|left|right|alpha|beta|gamma|delta|Delta|lambda|theta|pi|infty|le|ge|neq|times|pm|in|notin|subset|cup|cap|to|iff|implies)\\b(?:\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}|\\[[^[\\]]*\\]|_\\{[^{}]*\\}|\\^\\{[^{}]*\\}|_[a-zA-Z0-9]|\\^[a-zA-Z0-9]|[a-zA-Z0-9+\\-*/=<>^_{}().,]+|\\s+)*",
  // 2. Intégrales et limites complètes (ex: I = ∫_0^1 (x + 1)e^{-x} dx, lim_{x→0^+} f(x) = +∞)
  "(?:\\b[A-Za-z](?:_[0-9a-zA-Z]+)?\\s*=\\s*)?(?:\\blim_\\{[^}]+\\}|∫_[^\\s,;:]+(?:\\^[^\\s,;:]+)?)\\s*(?:\\([^()]+\\)|\\b(?:ln|log|exp|cos|sin|tan|dx|dt|du)\\b|[A-Za-z0-9_^{}+\\-*/.·√π∞e']|\\s+(?=(?:\\([^()]+\\)|\\b(?:ln|log|exp|cos|sin|tan|dx|dt|du)\\b|[0-9√π∞=≤≥<>→]|[A-Za-z](?:_\\{|\\^\\{|[_^0-9'()=≤≥<>→+\\-*/]|\\b))))*(?:\\s*(?:=|≤|≥|<|>|→)\\s*[+\\-]?(?:∞|oo|[A-Za-z0-9_^{}()+\\-*/.·√π∞e']+))?",
  // 3. Repères du plan/espace, courbes et suites entre parenthèses : (O, i⃗, j⃗), (C_f), (u_n)
  "\\(O\\s*[,;]\\s*[^)]+\\)|\\(C_[a-zA-Z0-9]+\\)|\\(C[fgh]\\)|\\([uvUVwW]_(?:\\{[^}]+\\}|[a-zA-Z0-9+\\-]+)\\)",
  // 4. Intervalles réels : ]0, +∞[, [0, +∞[, ]-∞, +∞[, [0, π]
  "[\\][]\\s*(?:[+\\-]?∞|[+\\-]?oo|[0-9π√/\\-+]+)\\s*[;,]\\s*(?:[+\\-]?∞|[+\\-]?oo|[0-9π√/\\-+]+)\\s*[\\][]",
  // 5. Équations, inéquations et appartenances : u_{n+1} = (3u_n + 2)/(u_n + 2), f(x) = ..., n ∈ ℕ, z² - 2√3 z + 4 = 0
  "(?:\\b(?:PGCD|PPCM|Card|ln|log|exp|cos|sin|tan)\\s*\\([^()]+\\)|\\b[a-zA-Z](?:'+|''|⁻¹|_\\{[^}]+\\}|_[0-9a-zA-Z+\\-]+|\\^\\{[^}]+\\}|\\^[0-9a-zA-Z+\\-]+|[²³⁴⁻¹])*\\s*(?:\\([^()]+\\))?|\\([^()]+\\)|[0-9]+(?:[.,][0-9]+)?|[0-9]*√(?:\\([^)]+\\)|[a-zA-Z0-9]+))(?:\\s*[+\\-*/·×^]\\s*(?:\\b(?:ln|log|exp|cos|sin|tan)\\s*\\([^()]+\\)|\\b[a-zA-Z](?:'+|''|⁻¹|_\\{[^}]+\\}|_[0-9a-zA-Z+\\-]+|\\^\\{[^}]+\\}|\\^[0-9a-zA-Z+\\-]+|[²³⁴⁻¹])*\\s*(?:\\([^()]+\\))?|\\([^()]+\\)|[0-9]+(?:[.,][0-9]+)?|[0-9]*√(?:\\([^)]+\\)|[a-zA-Z0-9]+)|[π∞]))*\\s*(?:=|≤|≥|≠|≈|≡|∈|∉|⊂|⇔|⇒|<=|>=|!=|<=>|<|>)(?:\\s*(?:[\\][]\\s*(?:[+\\-]?∞|[+\\-]?oo|[0-9a-zA-Zπ√/\\-+]+)\\s*[;,]\\s*(?:[+\\-]?∞|[+\\-]?oo|[0-9a-zA-Zπ√/\\-+]+)\\s*[\\][]|\\b(?:ln|log|exp|cos|sin|tan)\\s*\\([^()]+\\)|\\b[a-zA-Z](?:'+|''|⁻¹|_\\{[^}]+\\}|_[0-9a-zA-Z+\\-]+|\\^\\{[^}]+\\}|\\^[0-9a-zA-Z+\\-]+|[²³⁴⁻¹])*\\s*(?:\\([^()]+\\))?|\\([^()]+\\)|[+\\-]?(?:∞|oo)|[ℝℕℤℚℂ](?:\\^\\*|_[+\\-]\\*?)?|[0-9]+(?:[.,][0-9]+)?|[0-9]*√(?:\\([^)]+\\)|[a-zA-Z0-9]+)|[πΔΩ])(?:\\s*[+\\-*/·×^≤≥=]\\s*(?:\\b(?:ln|log|exp|cos|sin|tan)\\s*\\([^()]+\\)|\\b[a-zA-Z](?:'+|''|⁻¹|_\\{[^}]+\\}|_[0-9a-zA-Z+\\-]+|\\^\\{[^}]+\\}|\\^[0-9a-zA-Z+\\-]+|[²³⁴⁻¹])*\\s*(?:\\([^()]+\\))?|\\([^()]+\\)|[+\\-]?(?:∞|oo)|[0-9]+(?:[.,][0-9]+)?|[0-9]*√(?:\\([^)]+\\)|[a-zA-Z0-9]+)|[πΔΩ]))*)+",
  // 6. Fractions entre parenthèses : (1 + i√3)/(1 - i√3), (b - a)/(c - a)
  "\\([^()]+\\)\\s*\\/\\s*\\([^()]+\\)",
  // 7. Appels de fonctions mathématiques et dérivées isolés : f(x), f'(x), f⁻¹(x), P(z), cos(x), ln(x)
  "\\b(?:[fghFGHpPqQ]|ln|log|exp|cos|sin|tan|PGCD|PPCM|Card)(?:'+|''|⁻¹|\\^\\{-1\\})?\\([a-zA-Z0-9_^{}+\\-*/.·√π∞,\\s]+\\)(?:\\s*\\/\\s*[a-zA-Z0-9_^{}]+)?",
  // 8. Termes isolés avec indices, exposants, racines, vecteurs ou ensembles : u_{n+1}, u_n, a^{12}, x², 2√3, AB⃗, ℝ, ℕ, ℤ, ℂ
  "\\b[a-zA-Z0-9]+(?:_\\{[^}]+\\}|_[0-9nmkab]+|\\^\\{[^}]+\\}|\\^[0-9nmk+\\-]+|[²³⁴⁻¹ₙ₀₁₊])+(?:\\s*[·×*/]\\s*[a-zA-Z0-9]+(?:_\\{[^}]+\\}|_[0-9nmkab]+|\\^\\{[^}]+\\}|\\^[0-9nmk+\\-]+|[²³⁴⁻¹ₙ₀₁₊])+)*|\\bD_[fghFGH]\\b|[0-9]*√(?:\\([^)]+\\)|[a-zA-Z0-9]+)|[A-Za-z]{1,2}⃗|[ℝℕℤℚℂ](?:\\^\\*|_[+\\-]\\*?)?",
].join("|");

const IMPLICIT_MATH_REGEX = new RegExp(`(${IMPLICIT_MATH_TOKEN_SOURCE})`, "g");

/**
 * Découpe un texte mixte (Arabe / Français / Formules LaTeX) en segments ordonnés (avec cache LRU).
 */
export function parseMixedMathText(raw: string): TextSegment[] {
  if (!raw) return [];

  const cachedSegments = getCachedValue(PARSED_SEGMENTS_CACHE, raw);
  if (cachedSegments !== undefined) {
    return cachedSegments;
  }

  const segments: TextSegment[] = [];

  // Matcher les délimiteurs explicites :
  // 1. $$ ... $$
  // 2. \[ ... \]
  // 3. $ ... $
  // 4. \( ... \)
  const pattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$(?!\$)[\s\S]+?\$|\\\([\s\S]+?\\\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(raw)) !== null) {
    const matchStart = match.index;
    const matchedStr = match[0];

    // Traitement du texte ordinaire précédent
    if (matchStart > lastIndex) {
      const textPiece = raw.substring(lastIndex, matchStart);
      if (textPiece) {
        processPlainTextChunk(textPiece, segments);
      }
    }

    if (matchedStr.startsWith("$$") && matchedStr.endsWith("$$")) {
      segments.push({
        type: "display-math",
        content: matchedStr.slice(2, -2).trim(),
      });
    } else if (matchedStr.startsWith("\\[") && matchedStr.endsWith("\\]")) {
      segments.push({
        type: "display-math",
        content: matchedStr.slice(2, -2).trim(),
      });
    } else if (matchedStr.startsWith("$") && matchedStr.endsWith("$")) {
      segments.push({
        type: "inline-math",
        content: matchedStr.slice(1, -1).trim(),
      });
    } else if (matchedStr.startsWith("\\(") && matchedStr.endsWith("\\)")) {
      segments.push({
        type: "inline-math",
        content: matchedStr.slice(2, -2).trim(),
      });
    }

    lastIndex = pattern.lastIndex;
  }

  // Traitement du reste du texte
  if (lastIndex < raw.length) {
    const trailing = raw.substring(lastIndex);
    if (trailing) {
      processPlainTextChunk(trailing, segments);
    }
  }

  setCachedValue(PARSED_SEGMENTS_CACHE, raw, segments);
  return segments;
}

/**
 * Détecte intelligemment les expressions mathématiques implicites ou commandes LaTeX dans le texte sans $...$
 */
function processPlainTextChunk(chunk: string, segments: TextSegment[]): void {
  if (!chunk) return;

  let lastIdx = 0;
  IMPLICIT_MATH_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = IMPLICIT_MATH_REGEX.exec(chunk)) !== null) {
    const start = m.index;
    const matchedMath = m[0];

    if (start > lastIdx) {
      segments.push({
        type: "text",
        content: chunk.substring(lastIdx, start),
      });
    }

    segments.push({
      type: "inline-math",
      content: matchedMath.trim(),
    });

    lastIdx = IMPLICIT_MATH_REGEX.lastIndex;
  }

  if (lastIdx < chunk.length) {
    segments.push({
      type: "text",
      content: chunk.substring(lastIdx),
    });
  }
}

/**
 * Convertit un texte avec formules mathématiques en chaîne HTML sécurisée avec KaTeX rendu.
 */
export function renderMathHtml(text: string): string {
  if (!text) return "";

  const segments = parseMixedMathText(text);

  return segments
    .map((seg) => {
      if (seg.type === "display-math") {
        const rendered = renderSingleLatexFormula(seg.content, true);
        return `<div class="katex-display-block my-2 text-center" dir="ltr">${rendered}</div>`;
      }
      if (seg.type === "inline-math") {
        const rendered = renderSingleLatexFormula(seg.content, false);
        return `<span class="katex-inline-math" dir="ltr">${rendered}</span>`;
      }
      return seg.content;
    })
    .join("");
}

export interface MathTextProps {
  text?: string | null;
  className?: string;
  inline?: boolean;
}

/**
 * Composant React haute fidélité mémoïsé pour le rendu des énoncés, questions et solutions mathématiques.
 * Assure une isolation bidirectionnelle parfaite (LTR pour les formules KaTeX, RTL pour l'Arabe).
 */
export const MathText: React.FC<MathTextProps> = React.memo(
  ({ text, className = "", inline = false }) => {
    const safeText = text || "";
    const segments = useMemo(() => parseMixedMathText(safeText), [safeText]);

    if (!safeText) return null;

    // Optimisation : si aucun segment mathématique, rendu direct
    if (segments.every((s) => s.type === "text")) {
      return <span className={className}>{text}</span>;
    }

    const Container = inline ? "span" : "span";

    return (
      <Container className={`math-text-container ${className}`}>
        {segments.map((seg, idx) => {
          if (seg.type === "display-math") {
            const html = renderSingleLatexFormula(seg.content, true);
            return (
              <div
                key={idx}
                className="katex-display-block my-2 text-center select-text"
                dir="ltr"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          if (seg.type === "inline-math") {
            const html = renderSingleLatexFormula(seg.content, false);
            return (
              <span
                key={idx}
                className="katex-inline-math select-text"
                dir="ltr"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        })}
      </Container>
    );
  }
);

MathText.displayName = "MathText";

export default MathText;
