import JSZip from "jszip";
import { AppliedTitleCalligraphyConfig } from "../components/ArabicCalligraphySimulator";

export interface OverleafBundleConfig {
  docTitle: string;
  docSubtitle?: string;
  school: string;
  prof: string;
  year: string;
  academy?: string;
  direction?: string;
  trackLabelAr: string;
  trackLabelFr: string;
  examModel: string;
  durationAr?: string;
  durationFr?: string;
  latexCode: string;
  hasQcm?: boolean;
  hasPython?: boolean;
  hasGeoGebra?: boolean;
  appliedTitleCalligraphy?: AppliedTitleCalligraphyConfig;
}

/**
 * يولد حزمة Overleaf ZIP المتكاملة القابلة للتجميع الفوري
 */
export async function generateOverleafZipBundle(
  config: OverleafBundleConfig
): Promise<Blob> {
  const zip = new JSZip();

  const calligraphyCfg = config.appliedTitleCalligraphy;
  const xeLatexLetterSpace = Number(
    ((calligraphyCfg?.customLetterSpacingEm ?? 0.025) * 100).toFixed(1)
  );
  const xeLatexFontFamilyName =
    calligraphyCfg?.fontId === "KUFI_GEOMETRIC"
      ? "Reem Kufi"
      : calligraphyCfg?.fontId === "DIWANI_JALI"
      ? "Rakkas"
      : calligraphyCfg?.fontId === "DIWANI_SULTANI" ||
        calligraphyCfg?.fontId === "RUQAA_INK"
      ? "Aref Ruqaa"
      : "Amiri";

  // 1. ملف README.md الإرشادي
  const readmeContent = `# ${config.docTitle} - Overleaf LaTeX Package
## Projet LaTeX Officiel pour Overleaf (Lycée & Baccalauréat)

### 📌 الإرشادات والتجميع على Overleaf (Instructions de Compilation) :
1. سجل الدخول إلى حسابك على [Overleaf](https://www.overleaf.com).
2. اضغط على **"New Project"** ثم اختر **"Upload Project"**.
3. قم بسحب وإفلات هذا الملف المضغوط (\`.zip\`) بالكامل.
4. من القائمة العلوية **Menu** في Overleaf:
   - **Compiler** : اختر **XeLaTeX** (مستحسن للوثائق المزدوجة اللغة أو الخط الأندلسي المغربي \`${xeLatexFontFamilyName}\` بتباعد \`LetterSpace=${xeLatexLetterSpace}\`) أو **pdfLaTeX** (للوثائق بالفرنسية الصرفة).
   - **TeX Live version** : 2024 أو أحدث.
   - **Main document** : تأكد من اختياره لـ \`main.tex\`.
5. اضغط على الزر الأخضر **Recompile** للحصول على ملف PDF عالي الدقة 300 DPI.

---

### 📦 الحزم المضمنة في هذا المشروع (Packages Inclus) :
- \`amsmath\`, \`amssymb\`, \`amsfonts\`, \`mathtools\` : الرموز الرياضية والصيغ المتقدمة.
- \`fontspec\` & \`polyglossia\` : دعم الخط الأندلسي المغربي والتقليدي (\`${xeLatexFontFamilyName}\`, \`LetterSpace=${xeLatexLetterSpace}\`) في محرك XeLaTeX.
- \`tcolorbox\` (skins, breakable, listingsutf8) : إطارات التمارين الرياضية والأسئلة.
- \`tikz\` & \`tkz-tab\` : جداول تغيرات الدوال (Tableaux de variations) وإشارة الدوال.
- \`listings\` : تلوين كود خوارزميات بايثون (Coloration syntaxique Python).
- \`fancyhdr\` & \`geometry\` : ترويسة وتذييل وهوامش الصفحة الرسمية (A4, 1.5cm).

---
*Généré par la Plateforme d'Ingénierie Pédagogique et d'Évaluation en Mathématiques*
*Établissement : ${config.school} | Enseignant : ${config.prof} | Année : ${config.year}*
`;

  zip.file("README.md", readmeContent);

  // 2. ملف preamble.tex النمطي
  const preambleContent = `% ==============================================================================
% Preamble officiel : Configuration & Styles Graphiques tcolorbox + XeLaTeX Maghribi
% Plateforme d'Ingénierie Pédagogique des Mathématiques - Prof Kouziber Brahim
% Police de titre configurée : ${xeLatexFontFamilyName} (LetterSpace=${xeLatexLetterSpace})
% ==============================================================================

\\usepackage{iftex}
\\ifPDFTeX
  \\usepackage[utf8]{inputenc}
  \\usepackage[T1]{fontenc}
\\else
  \\usepackage{fontspec}
  \\usepackage{polyglossia}
  \\setmainlanguage{french}
  \\setotherlanguage{arabic}
  \\newfontfamily\\arabicfont[Script=Arabic]{Amiri}
  \\newfontfamily\\maghribititlefont[Script=Arabic,LetterSpace=${xeLatexLetterSpace}]{${xeLatexFontFamilyName}}
\\fi
\\usepackage{amsmath,amssymb,amsfonts,mathtools}
\\usepackage[top=1.8cm,bottom=1.8cm,left=1.5cm,right=1.5cm]{geometry}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{tikz}
\\usepackage{tkz-tab}
\\usepackage{listings}
\\usepackage[most]{tcolorbox}
\\usepackage{enumitem}

% Palette de couleurs officielles
\\definecolor{docPrimary}{HTML}{0f172a}
\\definecolor{docAccentBlue}{HTML}{1d4ed8}
\\definecolor{docAccentGreen}{HTML}{047857}
\\definecolor{docAccentPurple}{HTML}{7e22ce}
\\definecolor{docAccentAmber}{HTML}{b45309}
\\definecolor{codeBackground}{HTML}{f8fafc}
\\definecolor{codeBorder}{HTML}{cbd5e1}

% Configuration de listings pour Python
\\lstdefinestyle{pythonStyle}{
    backgroundcolor=\\color{codeBackground},
    basicstyle=\\ttfamily\\small\\color{slate!90!black},
    keywordstyle=\\bfseries\\color{blue!80!black},
    commentstyle=\\itshape\\color{green!60!black},
    stringstyle=\\color{orange!80!black},
    numberstyle=\\tiny\\color{gray},
    numbers=left,
    stepnumber=1,
    numbersep=8pt,
    tabsize=4,
    showstringspaces=false,
    breaklines=true,
    breakatwhitespace=true,
    frame=none
}
\\lstset{style=pythonStyle}

% Boîte personnalisée pour les Exercices
\\newtcolorbox[auto counter,number within=section]{tcbexercise}[2][]{
    enhanced,
    breakable,
    colback=white,
    colframe=docAccentBlue,
    arc=3mm,
    fonttitle=\\bfseries\\sffamily,
    title={Exercice \\thetcbcounter\\ : #2},
    coltitle=white,
    attach boxed title to top left={yshift=-2mm,xshift=4mm},
    boxed title style={colback=docAccentBlue,rounded corners},
    #1
}

% Boîte personnalisée pour le code Python
\\newtcolorbox{tcbpython}[1][]{
    enhanced,
    breakable,
    colback=codeBackground,
    colframe=docAccentGreen,
    arc=2mm,
    fonttitle=\\bfseries\\sffamily,
    title={Algorithme Python : #1},
    coltitle=white,
    attach boxed title to top left={yshift=-2mm,xshift=4mm},
    boxed title style={colback=docAccentGreen,rounded corners}
}

% Boîte pour QCM
\\newtcolorbox{tcbqcm}[1][]{
    enhanced,
    breakable,
    colback=purple!3!white,
    colframe=docAccentPurple,
    arc=3mm,
    fonttitle=\\bfseries\\sffamily,
    title={Questionnaire à Choix Multiples (QCM)},
    coltitle=white,
    attach boxed title to top left={yshift=-2mm,xshift=4mm},
    boxed title style={colback=docAccentPurple,rounded corners},
    #1
}

% En-tête et pied de page
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\small\\sffamily ${config.school}}
\\fancyhead[C]{\\small\\bfseries\\sffamily ${config.docTitle}}
\\fancyhead[R]{\\small\\sffamily Année : ${config.year}}
\\fancyfoot[L]{\\footnotesize\\sffamily ${config.prof}}
\\fancyfoot[C]{\\footnotesize\\sffamily Modèle : ${config.examModel}}
\\fancyfoot[R]{\\footnotesize\\thepage}
\\renewcommand{\\headrulewidth}{0.6pt}
\\renewcommand{\\footrulewidth}{0.4pt}
`;

  zip.file("preamble.tex", preambleContent);

  // 3. ملف main.tex الأساسي القابل للتجميع
  const isCustomCodeProvided = config.latexCode && config.latexCode.includes("\\documentclass");
  let mainTexContent = "";

  if (isCustomCodeProvided) {
    // إذا كان كود LaTeX الكامل مولداً مسبقاً، نضمنه مع التأكد من الربط بـ preamble
    mainTexContent = config.latexCode;
  } else {
    mainTexContent = `\\documentclass[11pt,a4paper]{article}

% Inclusion du préambule officiel
\\input{preamble}

\\begin{document}

% ==========================================
% Tête du document officiel (Cartouche)
% ==========================================
\\begin{center}
    {\\Large\\bfseries\\sffamily ${config.school}}\\\\[1mm]
    {\\small\\sffamily Direction : ${config.direction || "Délégation Provinciale"} --- ${config.academy || "Académie Régionale"}}\\\\[2mm]
    \\hrule height 1.2pt
    \\vspace{2mm}
    {\\LARGE\\bfseries\\color{docPrimary} ${config.docTitle}}\\\\[1mm]
    {\\large\\bfseries\\color{docAccentBlue} ${config.trackLabelFr} (${config.trackLabelAr})}\\\\[2mm]
    \\begin{tabular}{p{5cm} p{5cm} p{4cm}}
        \\textbf{Enseignant :} ${config.prof} & \\textbf{Durée :} ${config.durationFr || "2 Heures"} & \\textbf{Modèle :} ${config.examModel}
    \\end{tabular}
    \\vspace{1mm}
    \\hrule height 0.6pt
\\end{center}

\\vspace{4mm}

% ==========================================
% Consignes officielles
% ==========================================
\\begin{tcolorbox}[colback=slate!5!white,colframe=slate!60!black,arc=2mm,title={\\textbf{Directives & Consignes d'Évaluation}}]
\\begin{itemize}[leftmargin=5mm,noitemsep]
    \\item La qualité de la rédaction, la clarté et la précision des raisonnements sont prises en compte dans le barème.
    \\item Calculatrice autorisée conformément aux circulaires officielles.
    \\item Les exercices sont indépendants et peuvent être traités dans l'ordre choisi.
\\end{itemize}
\\end{tcolorbox}

\\vspace{3mm}

${
  config.hasQcm
    ? `% ==========================================
% Exercice 1 : QCM & Automatismes
% ==========================================
\\begin{tcbqcm}
Pour chaque question, une seule réponse est exacte. Justifier rigoureusement chaque choix pour obtenir l'intégralité des points.
\\begin{enumerate}[label=\\textbf{\\arabic*.},leftmargin=6mm]
    \\item \\textbf{Question 1 :} Déterminer la limite $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x}$.
    \\begin{itemize}[label=$\\square$]
        \\item \\textbf{A.} $0$ \\quad (Réponse exacte)
        \\item \\textbf{B.} $+1$
        \\item \\textbf{C.} $+\\infty$
        \\item \\textbf{D.} $-1$
    \\end{itemize}
    \\item \\textbf{Question 2 :} Soit $z = 1 + i\\sqrt{3}$. Le module $|z|$ et un argument $\\arg(z)$ sont :
    \\begin{itemize}[label=$\\square$]
        \\item \\textbf{A.} $|z| = 2$ et $\\arg(z) \\equiv \\frac{\\pi}{3} [2\\pi]$
        \\item \\textbf{B.} $|z| = 2$ et $\\arg(z) \\equiv \\frac{\\pi}{6} [2\\pi]$
        \\item \\textbf{C.} $|z| = 4$ et $\\arg(z) \\equiv \\frac{\\pi}{3} [2\\pi]$
    \\end{itemize}
\\end{enumerate}
\\end{tcbqcm}
\\vspace{3mm}
`
    : ""
}

${
  config.hasPython
    ? `% ==========================================
% Exercice Algorithmique & Python
% ==========================================
\\begin{tcbpython}[Recherche de seuil pour une suite numérique]
On s'intéresse à la suite $(u_n)$ définie par $u_0 = 5$ et $u_{n+1} = 0.8 u_n + 0.4$ dont la limite est $L = 2$.
\\begin{lstlisting}[language=Python]
def seuil_suite(epsilon: float) -> int:
    n = 0
    u = 5.0
    while abs(u - 2.0) >= epsilon:
        u = 0.8 * u + 0.4
        n = n + 1
    return n
\\end{lstlisting}
\\textbf{Questions d'évaluation :}
\\begin{enumerate}[leftmargin=5mm]
    \\item Déterminer le rôle de la boucle \\texttt{while} dans la fonction ci-dessus.
    \\item Quelle valeur renvoie l'instruction \\texttt{seuil\\_suite(0.01)} ? Retrouver ce résultat par le calcul.
\\end{enumerate}
\\end{tcbpython}
\\vspace{3mm}
`
    : ""
}

% ==========================================
% Exercice d'Analyse (Étude de fonction)
% ==========================================
\\begin{tcbexercise}{Étude d'une fonction et calcul intégral [7.0 points]}
Soit $f$ la fonction numérique définie sur $]0, +\\infty[$ par :
\\[ f(x) = x - 1 + \\frac{\\ln(x)}{x} \\]
et $(C_f)$ sa courbe représentative dans un repère orthonormé $(O, \\vec{i}, \\vec{j})$ (unité : 2 cm).
\\begin{enumerate}[leftmargin=6mm]
    \\item Calculer $\\lim_{x \\to 0^+} f(x)$ et interpréter géométriquement le résultat.
    \\item Calculer $\\lim_{x \\to +\\infty} f(x)$ et montrer que la droite $(\\Delta) : y = x - 1$ est asymptote oblique à $(C_f)$ au voisinage de $+\\infty$.
    \\item Étudier la position relative de $(C_f)$ et $(\\Delta)$ sur $]0, +\\infty[$.
    \\item Montrer que pour tout $x > 0$, $f'(x) = \\frac{g(x)}{x^2}$ où $g(x) = x^2 + 1 - \\ln(x)$.
    \\item Dresser le tableau de variations complet de $f$.
    \\item Calculer l'intégrale $I = \\int_1^e \\frac{\\ln(x)}{x}\\,dx$ et en déduire en $\\text{cm}^2$ l'aire du domaine délimité par $(C_f)$, $(\\Delta)$ et les droites $x=1$ et $x=e$.
\\end{enumerate}
\\end{tcbexercise}

\\vspace{3mm}

% ==========================================
% Exercice d'Algèbre / Nombres Complexes ou Géométrie
% ==========================================
\\begin{tcbexercise}{Géométrie dans l'espace / Nombres Complexes [5.0 points]}
Dans l'espace rapporté à un repère orthonormé $(O, \\vec{i}, \\vec{j}, \\vec{k})$, on considère les points $A(1, 0, 2)$, $B(2, 1, 0)$ et le plan $(P) : 2x - y + 2z - 3 = 0$.
\\begin{enumerate}[leftmargin=6mm]
    \\item Déterminer les coordonnées du vecteur $\\vec{n}$ normal au plan $(P)$.
    \\item Calculer la distance du point $A$ au plan $(P)$.
    \\item Déterminer une équation cartésienne de la sphère $(S)$ de centre $A$ et tangente au plan $(P)$.
\\end{enumerate}
\\end{tcbexercise}

\\end{document}
`;
  }

  zip.file("main.tex", mainTexContent);

  // 4. ملف metadata.json للمشروع
  const metadata = {
    title: config.docTitle,
    school: config.school,
    teacher: config.prof,
    academicYear: config.year,
    track: config.trackLabelFr,
    model: config.examModel,
    generationDate: new Date().toISOString(),
    overleafCompiler: "xelatex",
    packagesUsed: [
      "amsmath",
      "tcolorbox",
      "tikz",
      "tkz-tab",
      "listings",
      "geometry",
      "fancyhdr",
    ],
  };

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  // 5. توليد حزمة ZIP
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}
