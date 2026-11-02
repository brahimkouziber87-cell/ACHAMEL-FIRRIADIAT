export interface DiagnosticQCMItem {
  id: string;
  questionAr: string;
  questionFr: string;
  domainAr: string;
  domainFr: string;
  points: string;
  optionsAr: { code: "A" | "B" | "C" | "D"; text: string; isCorrect: boolean }[];
  optionsFr: { code: "A" | "B" | "C" | "D"; text: string; isCorrect: boolean }[];
  correctCode: "A" | "B" | "C" | "D";
  justificationAr: string;
  justificationFr: string;
  commonErrorAr: string;
  commonErrorFr: string;
  didacticalOriginAr: string;
  didacticalOriginFr: string;
  remediationPlanAr: string;
  remediationPlanFr: string;
}

export interface DiagnosticExerciseItem {
  id: string;
  number: number;
  titleAr: string;
  titleFr: string;
  domainAr: string;
  domainFr: string;
  totalPoints: string;
  prerequisiteAr: string;
  prerequisiteFr: string;
  questionsAr: { label: string; text: string; points: string }[];
  questionsFr: { label: string; text: string; points: string }[];
  solutionsAr: string[];
  solutionsFr: string[];
  errorAnalysisAr: string;
  errorAnalysisFr: string;
  remediationAr: string;
  remediationFr: string;
}

export interface DiagnosticSynthesisProblem {
  titleAr: string;
  titleFr: string;
  contextAr: string;
  contextFr: string;
  totalPoints: string;
  partsAr: { partTitle: string; points: string; questions: string[]; solutions: string[] }[];
  partsFr: { partTitle: string; points: string; questions: string[]; solutions: string[] }[];
  remediationAr: string;
  remediationFr: string;
}

export interface MoroccanDiagnosticPaper {
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  duration: string;
  instructionsAr: string[];
  instructionsFr: string[];
  domains: { code: string; labelAr: string; labelFr: string; weightPercent: number }[];
  qcmItems: DiagnosticQCMItem[];
  directExercises: DiagnosticExerciseItem[];
  synthesisProblem: DiagnosticSynthesisProblem;
  masteryThresholdPercent: number; // usually 75%
}

export function generateMoroccanDiagnosticPaper(
  trackCode: string = "1BAC_SM",
  duration: string = "1h30",
  model: "A" | "B" = "A"
): MoroccanDiagnosticPaper {
  const is2Bac = trackCode.startsWith("2BAC") || trackCode.startsWith("TERM_");
  const is1Bac = trackCode.startsWith("1BAC") || trackCode.startsWith("1ERE_");
  const isTC = trackCode.startsWith("TC") || trackCode.startsWith("2NDE");
  const isMissionTrack =
    trackCode.endsWith("_FR") ||
    trackCode.startsWith("TERM_") ||
    trackCode.startsWith("1ERE_") ||
    trackCode.startsWith("2NDE");
  const isModelA = model === "A";

  // توليد الرائز التشخيصي حسب السلك والشعبة وفق المنهاج المغربي الرسمي أو البعثة الفرنسية (AEFE)
  if (is2Bac) {
    return {
      titleAr: "الرائز التشخيصي الرسمي لتقويم المستلزمات والمكتسبات القبلية في مادة الرياضيات",
      titleFr: isMissionTrack
        ? "Test de Positionnement & Diagnostic des Acquis en Mathématiques (Entrée en Terminale — AEFE / BOEN)"
        : "Test Diagnostique Officiel d'Évaluation des Prérequis en Mathématiques",
      subtitleAr: `المستوى: السنة الثانية من سلك البكالوريا (${isModelA ? "النموذج أ" : "النموذج ب"}) · المدة: ${duration}`,
      subtitleFr: isMissionTrack
        ? `Niveau : Classe de Terminale (${isModelA ? "Sujet A" : "Sujet B"}) · Durée : ${duration}`
        : `Niveau : 2ème Année du Baccalauréat (${isModelA ? "Sujet A" : "Sujet B"}) · Durée : ${duration}`,
      duration,
      masteryThresholdPercent: 75,
      instructionsAr: [
        "يُعد هذا الرائز أداة بيداغوجية لرصد مواطن القوة والتعثرات في المكتسبات القبلية الأساسية (السنة الأولى بكالوريا والجذع المشترك).",
        "ضع علامة (X) في الخانة المقابلة للاختيار الصحيح لكل سؤال في الجزء الأول (QCM).",
        "حرر خطوات الاستدلال والحساب بدقة ووضوح في التمارين التطبيقية والمسألة التوليفية.",
        "الخطأ وسيلة ديداكتيكية لتشخيص الصعوبات وتنظيم حصص الدعم الاستدراكي المبرمجة في مستهل السنة الدراسية.",
      ],
      instructionsFr: [
        "Ce test diagnostique est un outil pédagogique destiné à repérer les acquis et les lacunes des années antérieures (1ère Bac et TC).",
        "Cochez d'une croix (X) la case correspondant à la bonne réponse pour le QCM de la Partie I.",
        "Rédigez rigoureusement les étapes de calcul et de justification dans les exercices d'application et le problème.",
        "L'erreur est un indicateur didactique essentiel pour planifier le soutien et la remédiation en début d'année.",
      ],
      domains: [
        { code: "D1", labelAr: "الحسابيات والجبر والمنطق", labelFr: "Algèbre, Logique & Calcul", weightPercent: 30 },
        { code: "D2", labelAr: "الدوال والتحليل والاشتقاق", labelFr: "Analyse, Fonctions & Dérivation", weightPercent: 40 },
        { code: "D3", labelAr: "الهندسة والمثلثات والمتجهات", labelFr: "Géométrie repérée & Trigonométrie", weightPercent: 20 },
        { code: "D4", labelAr: "المتتاليات العددية والاحتمالات", labelFr: "Suites numériques & Probabilités", weightPercent: 10 },
      ],
      qcmItems: [
        {
          id: "qcm_1",
          questionAr: `ما هي مجموعة تعريف الدالة f المعرفة بـ: f(x) = √(${isModelA ? "x² - 4" : "x² - 9"}) / (x - ${isModelA ? "3" : "4"}) ؟`,
          questionFr: `Quel est le domaine de définition de f(x) = √(${isModelA ? "x² - 4" : "x² - 9"}) / (x - ${isModelA ? "3" : "4"}) ?`,
          domainAr: "الدوال والتحليل",
          domainFr: "Analyse & Fonctions",
          points: "1.0",
          optionsAr: [
            { code: "A", text: isModelA ? "] -∞, -2] ∪ [2, +∞[" : "] -∞, -3] ∪ [3, +∞[", isCorrect: false },
            { code: "B", text: isModelA ? "(] -∞, -2] ∪ [2, +∞[) \\ {3}" : "(] -∞, -3] ∪ [3, +∞[) \\ {4}", isCorrect: true },
            { code: "C", text: isModelA ? "[2, +∞[ \\ {3}" : "[3, +∞[ \\ {4}", isCorrect: false },
            { code: "D", text: isModelA ? "ℝ \\ {3}" : "ℝ \\ {4}", isCorrect: false },
          ],
          optionsFr: [
            { code: "A", text: isModelA ? "] -∞, -2] ∪ [2, +∞[" : "] -∞, -3] ∪ [3, +∞[", isCorrect: false },
            { code: "B", text: isModelA ? "(] -∞, -2] ∪ [2, +∞[) \\ {3}" : "(] -∞, -3] ∪ [3, +∞[) \\ {4}", isCorrect: true },
            { code: "C", text: isModelA ? "[2, +∞[ \\ {3}" : "[3, +∞[ \\ {4}", isCorrect: false },
            { code: "D", text: isModelA ? "ℝ \\ {3}" : "ℝ \\ {4}", isCorrect: false },
          ],
          correctCode: "B",
          justificationAr: `الشرط: ما تحت الجذر موجب قطعا أو منعدم (x² ≥ ${isModelA ? "4" : "9"}) والمقام غير منعدم (x ≠ ${isModelA ? "3" : "4"}).`,
          justificationFr: `Condition : x² - a² ≥ 0 et x - b ≠ 0.`,
          commonErrorAr: "نسيان شرط انعدام المقام أو الاكتفاء بحل متراجحة الجذر واستبعاد الأعداد السالبة.",
          commonErrorFr: "Omission de la valeur interdite du dénominateur ou oubli des réels négatifs pour x² ≥ a².",
          didacticalOriginAr: "خلط في تقاطع الشروط المنطقية لحساب مجموعة التعريف.",
          didacticalOriginFr: "Confusion sur l'intersection des contraintes algébriques de D_f.",
          remediationPlanAr: "تذكير بجدول إشارة ثلاثية الحدود وحل النظمات المقترنة بالشرطين (و المنطقية).",
          remediationPlanFr: "Rappels sur le tableau de signes et l'intersection d'intervalles.",
        },
        {
          id: "qcm_2",
          questionAr: `نهاية الدالة lim_{x → 0} (sin(${isModelA ? "3x" : "5x"})) / (${isModelA ? "2x" : "4x"}) تساوي:`,
          questionFr: `La limite lim_{x → 0} (sin(${isModelA ? "3x" : "5x"})) / (${isModelA ? "2x" : "4x"}) est égale à :`,
          domainAr: "النهايات والاتصال",
          domainFr: "Limites & Continuité",
          points: "1.0",
          optionsAr: [
            { code: "A", text: "0", isCorrect: false },
            { code: "B", text: "1", isCorrect: false },
            { code: "C", text: isModelA ? "3/2" : "5/4", isCorrect: true },
            { code: "D", text: "+∞", isCorrect: false },
          ],
          optionsFr: [
            { code: "A", text: "0", isCorrect: false },
            { code: "B", text: "1", isCorrect: false },
            { code: "C", text: isModelA ? "3/2" : "5/4", isCorrect: true },
            { code: "D", text: "+∞", isCorrect: false },
          ],
          correctCode: "C",
          justificationAr: `نعلم أن lim_{x→0} sin(ax)/x = a، وبالتالي lim = a/b = ${isModelA ? "3/2" : "5/4"}.`,
          justificationFr: `Propriété usuelle : lim_{X→0} sin(X)/X = 1 donc lim sin(ax)/(bx) = a/b.`,
          commonErrorAr: "اعتبار أن النتيجة تساوي 0/0 شكل غير محدد والتوقف، أو افتراض أن sin(0)=0 فيكون الجواب 0.",
          commonErrorFr: "Considérer la forme indéterminée 0/0 comme insoluble ou simplifier abusivement par x.",
          didacticalOriginAr: "عدم تملك النهايات المثلثية الهامة وخاصية التغيير في المتغير.",
          didacticalOriginFr: "Non-maîtrise des limites trigonométriques remarquables.",
          remediationPlanAr: "سلسلة تمارين فورية حول النهايات المثلثية الهامة وتطبيق قاعدة التغيير المتغير.",
          remediationPlanFr: "Fiche d'exercices flash sur les limites de référence en zéro.",
        },
        {
          id: "qcm_3",
          questionAr: `مشتقة الدالة g(x) = (2x + 1)³ على ℝ هي:`,
          questionFr: `La fonction dérivée de g(x) = (2x + 1)³ sur ℝ est :`,
          domainAr: "الاشتقاق ودراسة الدوال",
          domainFr: "Dérivation",
          points: "1.0",
          optionsAr: [
            { code: "A", text: "3(2x + 1)²", isCorrect: false },
            { code: "B", text: "6(2x + 1)²", isCorrect: true },
            { code: "C", text: "6x² + 3", isCorrect: false },
            { code: "D", text: "2(2x + 1)³", isCorrect: false },
          ],
          optionsFr: [
            { code: "A", text: "3(2x + 1)²", isCorrect: false },
            { code: "B", text: "6(2x + 1)²", isCorrect: true },
            { code: "C", text: "6x² + 3", isCorrect: false },
            { code: "D", text: "2(2x + 1)³", isCorrect: false },
          ],
          correctCode: "B",
          justificationAr: `قاعدة اشتقاق دالة القوة: (u^n)' = n · u' · u^{n-1}، وهنا u'(x) = 2 إذن g'(x) = 3 × 2 × (2x + 1)² = 6(2x + 1)².`,
          justificationFr: `Formule : (u^n)' = n · u' · u^{n-1}. Ici u'(x) = 2, donc g'(x) = 6(2x + 1)².`,
          commonErrorAr: "نسيان ضرب النتيجة في المشتقة الداخلية u'(x) واختيار 3(2x + 1)².",
          commonErrorFr: "Oubli systématique de la dérivée interne u' dans (u^n)'.",
          didacticalOriginAr: "تطبيق سطحي لقاعدة مشتقة x^n على الدوال المركبة u^n دون استحضار قاعدة اشتقاق مركب دالتين.",
          didacticalOriginFr: "Application erronée de (x^n)' à une fonction composée u^n.",
          remediationPlanAr: "تثبيت قاعدة اشتقاق مركب دالتين و(u^n)' و √(u) عبر أمثلة مقارنة.",
          remediationPlanFr: "Activités d'ancrage sur la dérivation des fonctions composées.",
        },
        {
          id: "qcm_4",
          questionAr: `لتكن (u_n) متتالية هندسية حدها الأول u_0 = 3 وأساسها q = 1/2. نهاية المتتالية lim_{n → +∞} u_n تساوي:`,
          questionFr: `Soit (u_n) une suite géométrique de premier terme u_0 = 3 et de raison q = 1/2. La limite lim_{n → +∞} u_n est :`,
          domainAr: "المتتاليات العددية",
          domainFr: "Suites numériques",
          points: "1.0",
          optionsAr: [
            { code: "A", text: "+∞", isCorrect: false },
            { code: "B", text: "3", isCorrect: false },
            { code: "C", text: "0", isCorrect: true },
            { code: "D", text: "1/2", isCorrect: false },
          ],
          optionsFr: [
            { code: "A", text: "+∞", isCorrect: false },
            { code: "B", text: "3", isCorrect: false },
            { code: "C", text: "0", isCorrect: true },
            { code: "D", text: "1/2", isCorrect: false },
          ],
          correctCode: "C",
          justificationAr: `بما أن |q| = 1/2 < 1 فإن lim q^n = 0، وبالتالي lim u_n = 3 × 0 = 0.`,
          justificationFr: `Comme -1 < q < 1, lim q^n = 0 donc lim u_n = 0.`,
          commonErrorAr: "الاعتقاد بأن النهاية تساوي الحد الأول u_0 أو الأساس q.",
          commonErrorFr: "Confusion entre la valeur de convergence et le premier terme ou la raison.",
          didacticalOriginAr: "عدم استيعاب سلوك القوى q^n عندما يكون الأساس أصغر قطعا من 1.",
          didacticalOriginFr: "Méconnaissance de la limite de q^n selon les valeurs de q.",
          remediationPlanAr: "تذكير بمبرهنة نهاية المتتاليات الهندسية والتمييز بين الحالات (|q| < 1 و q > 1).",
          remediationPlanFr: "Tableau récapitulatif des limites des suites géométriques de référence.",
        },
      ],
      directExercises: [
        {
          id: "diag_ex_1",
          number: 1,
          titleAr: "التمرين الأول : حل المعادلات والمتراجحات ودراسة إشارة التعابير الجبرية (4 نقط)",
          titleFr: "Exercice 1 : Équations, inéquations et étude de signes algébriques (4 points)",
          domainAr: "الجبر والتحليل",
          domainFr: "Algèbre & Inéquations",
          totalPoints: "4.0",
          prerequisiteAr: "حل معادلات الدرجة الثانية باستعمال المميز Δ وجدول إشارة ثلاثية الحدود",
          prerequisiteFr: "Discriminant Δ, factorisation du trinôme et tableau de signes",
          questionsAr: [
            { label: "1. أ)", text: `حل في ℝ المعادلة: 2x² - ${isModelA ? "5x + 2 = 0" : "7x + 3 = 0"}.`, points: "1.5 ن" },
            { label: "1. ب)", text: `استنتج في ℝ مجموعة حلول المتراجحة: (2x² - ${isModelA ? "5x + 2" : "7x + 3"}) / (x - 1) ≤ 0.`, points: "1.5 ن" },
            { label: "2.", text: `حل في ℝ² النظمة الخطية باستعمال المحددات (Cramer): { 3x + 2y = 8 ; 5x - y = 9 }.`, points: "1.0 ن" },
          ],
          questionsFr: [
            { label: "1. a)", text: `Résoudre dans ℝ l'équation : 2x² - ${isModelA ? "5x + 2 = 0" : "7x + 3 = 0"}.`, points: "1.5 pt" },
            { label: "1. b)", text: `En déduire dans ℝ les solutions de l'inéquation : (2x² - ${isModelA ? "5x + 2" : "7x + 3"}) / (x - 1) ≤ 0.`, points: "1.5 pt" },
            { label: "2.", text: `Résoudre dans ℝ² le système linéaire par déterminants (Cramer) : { 3x + 2y = 8 ; 5x - y = 9 }.`, points: "1.0 pt" },
          ],
          solutionsAr: [
            `1. أ) حساب المميز: Δ = b² - 4ac = ${isModelA ? "25 - 16 = 9 > 0" : "49 - 24 = 25 > 0"}. إذن الحلان هما: x_1 = ${isModelA ? "(5-3)/4 = 1/2" : "(7-5)/4 = 1/2"} و x_2 = ${isModelA ? "(5+3)/4 = 2" : "(7+5)/4 = 3"}. إذن S = {1/2, ${isModelA ? "2" : "3"}}.`,
            `1. ب) ننشئ جدول الإشارة الموحد للكسر مع مراعاة أن x = 1 قيمة ممنوعة. إشارة البسط موجبة خارج الحلين وسالبة بينهما. نجد مجموعة الحلول: S = ] -∞, 1/2] ∪ ]1, ${isModelA ? "2" : "3"}].`,
            `2. محدد النظمة: D = 3(-1) - 2(5) = -13 ≠ 0. D_x = 8(-1) - 2(9) = -26 ومنه x = 2. D_y = 3(9) - 8(5) = -13 ومنه y = 1. إذن S = {(2, 1)}.`,
          ],
          solutionsFr: [
            `1. a) Δ = b² - 4ac = ${isModelA ? "9 > 0" : "25 > 0"}. Solutions : S = {1/2, ${isModelA ? "2" : "3"}}.`,
            `1. b) Tableau de signes du quotient en excluant la valeur interdite x = 1. Solution : S = ] -∞, 1/2] ∪ ]1, ${isModelA ? "2" : "3"}].`,
            `2. Déterminant principal D = -13 ≠ 0. D_x = -26 => x = 2, D_y = -13 => y = 1. S = {(2, 1)}.`,
          ],
          errorAnalysisAr: "أخطاء شائعة في إشارة المعامل b عند حساب المميز، وإغفال استبعاد القيمة الممنوعة للمقام في جدول الإشارة.",
          errorAnalysisFr: "Erreurs de calcul sur le signe de -b et inclusion de la valeur interdite dans les crochets de solution.",
          remediationAr: "أنشطة تدريبية حول جداول الإشارة والتمييز بين القيم الملغاة وأصفار التعبير.",
          remediationFr: "Entraînement guidé sur les tableaux de signes des quotients rationnels.",
        },
        {
          id: "diag_ex_2",
          number: 2,
          titleAr: "التمرين الثاني : الهندسة التحليلية والجداء السلمي والحساب المثلثي (4 نقط)",
          titleFr: "Exercice 2 : Géométrie repérée, produit scalaire et trigonométrie (4 points)",
          domainAr: "الهندسة والمثلثات",
          domainFr: "Géométrie & Trigonométrie",
          totalPoints: "4.0",
          prerequisiteAr: "معادلة المستقيم والمسافة والجداء السلمي وصيغ التحويل المثلثية الأساسية",
          prerequisiteFr: "Équation de droite, produit scalaire, distance et formules trigonométriques",
          questionsAr: [
            { label: "1.", text: `في معلم متعامد ممنظم (O, i⃗, j⃗)، نعتبر النقط A(1, 2) و B(4, -2). أحسب المسافة AB وإحداثيات المتجهة AB⃗.`, points: "1.0 ن" },
            { label: "2.", text: `حدد معادلة ديكارتية للمستقيم (Δ) المار من النقطة C(2, 3) والعمودي على المتجهة n⃗(3, 4).`, points: "1.5 ن" },
            { label: "3.", text: `بين أنه لكل x من ℝ: cos(x + π/3) + cos(x - π/3) = cos(x).`, points: "1.5 ن" },
          ],
          questionsFr: [
            { label: "1.", text: `Dans un repère orthonormé (O, i⃗, j⃗), soient A(1, 2) et B(4, -2). Calculer la distance AB et les coordonnées du vecteur AB⃗.`, points: "1.0 pt" },
            { label: "2.", text: `Déterminer une équation cartésienne de la droite (Δ) passant par C(2, 3) et de vecteur normal n⃗(3, 4).`, points: "1.5 pt" },
            { label: "3.", text: `Montrer que pour tout x ∈ ℝ : cos(x + π/3) + cos(x - π/3) = cos(x).`, points: "1.5 pt" },
          ],
          solutionsAr: [
            `1. إحداثيات المتجهة: AB⃗(4 - 1, -2 - 2) = AB⃗(3, -4). المسافة: AB = √(3² + (-4)²) = √(9 + 16) = √25 = 5.`,
            `2. بما أن n⃗(3, 4) منظمية على (Δ) فإن المعادلة على شكل: 3x + 4y + c = 0. بتعويض C(2, 3): 3(2) + 4(3) + c = 0 أي 6 + 12 + c = 0 إذن c = -18. المعادلة هي: 3x + 4y - 18 = 0.`,
            `3. باستعمال صيغ الجمع: cos(a+b) + cos(a-b) = 2 cos(a) cos(b). إذن: 2 cos(x) cos(π/3) = 2 cos(x) × (1/2) = cos(x).`,
          ],
          solutionsFr: [
            `1. AB⃗(3, -4) et AB = √(9 + 16) = 5.`,
            `2. Vecteur normal n⃗(3, 4) donne 3x + 4y + c = 0. C(2, 3) ∈ (Δ) => 6 + 12 + c = 0 => c = -18. Équation : 3x + 4y - 18 = 0.`,
            `3. cos(a+b) + cos(a-b) = 2cos(a)cos(b) = 2 cos(x) × (1/2) = cos(x).`,
          ],
          errorAnalysisAr: "خلط بين المتجهة الموجهة والمتجهة المنظمية، ونسيان صيغ التحويل المثلثية الأساسية.",
          errorAnalysisFr: "Confusion entre vecteur directeur et vecteur normal, méconnaissance des formules d'addition.",
          remediationAr: "مراجعة بطاقة القوانين المثلثية وملخص الهندسة التحليلية في المستوى.",
          remediationFr: "Fiche mémo sur les formules trigonométriques et le produit scalaire.",
        },
      ],
      synthesisProblem: {
        titleAr: "المسألة التشخيصية التوليفية : دراسة دالة حدودية ونمذجة هندسية (8 نقط)",
        titleFr: "Problème Diagnostique de Synthèse : Étude de fonction et optimisation géométrique (8 points)",
        contextAr: `نعتبر الدالة العددية f المعرفة على ℝ بـ: f(x) = x³ - 3x + 2، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i⃗, j⃗). يُراد من خلال هذا التمرين التحقق من تملك أدوات التحليل الرياضي الأساسية (النهايات، جدول التغيرات، المماس، والرسم البياني).`,
        contextFr: `On considère la fonction numérique f définie sur ℝ par f(x) = x³ - 3x + 2 et (C_f) sa courbe représentative dans un repère orthonormé (O, i⃗, j⃗).`,
        totalPoints: "8.0",
        partsAr: [
          {
            partTitle: "الجزء الأول : النهايات ودراسة التغيرات وجدول التغيرات (4.5 ن)",
            points: "4.5",
            questions: [
              "1. أحسب نهايتي الدالة f عند -∞ وعند +∞.",
              "2. أحسب المشتقة f'(x) لكل x من ℝ، ثم بين أن f تزايدية على ]-∞, -1] وعلى [1, +∞[ وتناقصية على [-1, 1].",
              "3. ضع جدول تغيرات الدالة f وحدد القيم القصوية والدنوية المحلية.",
            ],
            solutions: [
              "1. بما أن f دالة حدودية: lim_{x→+∞} f(x) = lim x³ = +∞ و lim_{x→-∞} f(x) = lim x³ = -∞.",
              "2. لكل x من ℝ: f'(x) = 3x² - 3 = 3(x² - 1) = 3(x - 1)(x + 1). إشارة f'(x) موجبة خارج [-1, 1] وسالبة داخله.",
              "3. جدول التغيرات: f تزايدية من -∞ إلى f(-1)=4 ثم تناقصية إلى f(1)=0 ثم تزايدية إلى +∞. القيمة القصوية المحلية هي 4 عند x=-1، والدنوية هي 0 عند x=1.",
            ],
          },
          {
            partTitle: "الجزء الثاني : المماس والتقاطع مع المحاور والإنشاء الهندسي (3.5 ن)",
            points: "3.5",
            questions: [
              "1. حدد معادلة المماس (T) لمنحنى الدالة (C_f) عند النقطة ذات الأفصول x_0 = 0.",
              "2. بين أن f(x) = (x - 1)²(x + 2) لكل x من ℝ، واستنتج نقط تقاطع (C_f) مع محور الأفاصيل.",
              "3. أنشئ المماس (T) والمنحنى (C_f) في المعلم المتعامد الممنظم.",
            ],
            solutions: [
              "1. معادلة المماس: y = f'(0)(x - 0) + f(0). لدينا f'(0) = -3 و f(0) = 2، إذن (T): y = -3x + 2.",
              "2. بنشر الطرف الأيمن: (x² - 2x + 1)(x + 2) = x³ + 2x² - 2x² - 4x + x + 2 = x³ - 3x + 2 = f(x). إذن تقاطع (C_f) مع محور الأفاصيل يتم في النقطتين A(1, 0) و B(-2, 0).",
              "3. الإنشاء: رسم محوري المعلم، تعيين النقط المميزة (-1, 4) و (1, 0) و (0, 2)، رسم المماس (T) ومماسات أفقية عند الذروات، ثم رسم المنحنى بانسيابية تامة.",
            ],
          },
        ],
        partsFr: [
          {
            partTitle: "Partie I : Limites, dérivabilité et tableau de variations (4.5 pts)",
            points: "4.5",
            questions: [
              "1. Calculer les limites de f en -∞ et en +∞.",
              "2. Calculer la dérivée f'(x) pour tout x ∈ ℝ et étudier son signe.",
              "3. Dresser le tableau de variations complet de f et préciser les extremums locaux.",
            ],
            solutions: [
              "1. Limites du terme de plus haut degré : lim_{x→+∞} x³ = +∞ et lim_{x→-∞} x³ = -∞.",
              "2. f'(x) = 3x² - 3 = 3(x - 1)(x + 1). f' > 0 sur ]-∞, -1] et [1, +∞[, et f' < 0 sur [-1, 1].",
              "3. f(-1) = 4 (maximum local) et f(1) = 0 (minimum local).",
            ],
          },
          {
            partTitle: "Partie II : Tangente, intersections et tracé de la courbe (3.5 pts)",
            points: "3.5",
            questions: [
              "1. Déterminer l'équation de la tangente (T) à (C_f) au point d'abscisse x_0 = 0.",
              "2. Montrer que f(x) = (x - 1)²(x + 2) et déterminer les points d'intersection de (C_f) avec l'axe des abscisses.",
              "3. Tracer la tangente (T) et la courbe (C_f) dans le repère orthonormé.",
            ],
            solutions: [
              "1. y = f'(0)(x - 0) + f(0) = -3x + 2.",
              "2. Développer pour identifier f(x). Points d'intersection : (1, 0) et (-2, 0).",
              "3. Tracé régulier avec les tangentes horizontales en (-1, 4) et (1, 0).",
            ],
          },
        ],
        remediationAr: "معالجة صعوبات قراءة جدول التغيرات ورسم المماسات الأفقية والنقط المميزة للمنحنى.",
        remediationFr: "Remédiation sur le lien entre variations, tangentes remarquables et allure géométrique de la courbe.",
      },
    };
  }

  // إذا كان السلك جذع مشترك علمي أو سنة أولى باكالوريا
  const isLsh = trackCode.includes("LSH") || trackCode.includes("SH") || trackCode.includes("LETTRE");
  return {
    titleAr: isTC
      ? "الرائز التشخيصي لتقويم المكتسبات القبلية لمرحلة التعليم الإعدادي (الجذع المشترك)"
      : "الرائز التشخيصي الرسمي لتقويم المستلزمات والمكتسبات القبلية في مادة الرياضيات",
    titleFr: isTC
      ? "Test Diagnostique d'Entrée au Tronc Commun (Prérequis du Collège)"
      : isLsh
      ? "Test Diagnostique d'Entrée en 1ère Bac Lettres & Sciences Humaines"
      : "Test Diagnostique d'Évaluation des Prérequis en Mathématiques (1ère Année Bac)",
    subtitleAr: `المستوى: ${isTC ? "الجذوع المشتركة" : isLsh ? "السنة الأولى بكالوريا - شعبة الآداب والعلوم الإنسانية (1Bac SH / 1Bac LSH)" : "السنة الأولى بكالوريا علوم"} (${isModelA ? "النموذج أ" : "النموذج ب"}) · المدة: ${duration}`,
    subtitleFr: `Niveau : ${isTC ? "Tronc Commun" : isLsh ? "1ère Bac Lettres et Sciences Humaines (1Bac SH / 1Bac LSH)" : "1ère Année Baccalauréat"} (${isModelA ? "Sujet A" : "Sujet B"}) · Durée : ${duration}`,
    duration,
    masteryThresholdPercent: 75,
    instructionsAr: [
      "يهدف هذا الرائز إلى تحديد مستوى تملك المتعلم(ة) للمعارف والمهارات الأساسية اللازمة للنجاح في هذا المستوى.",
      "أجب عن جميع الأسئلة بعناية: أسئلة QCM بوضع علامة (X)، والتمارين بالتحرير الكامل والمنظم.",
      "النتائج ستساعد الأستاذ في تصميم وتوجيه حصص الدعم الاستدراكي المؤسساتي والوقائي.",
    ],
    instructionsFr: [
      "Ce test permet de diagnostiquer le niveau d'assimilation des compétences clés indispensables pour l'année en cours.",
      "Répondez avec soin à l'ensemble des questions dans les espaces réservés.",
      "Les résultats permettront d'établir le plan d'action pédagogique et de soutien individualisé.",
    ],
    domains: [
      { code: "D1", labelAr: "الحساب العددي والجبر", labelFr: "Calcul numérique & Algèbre", weightPercent: 35 },
      { code: "D2", labelAr: "الهندسة المستوية والمثلثية", labelFr: "Géométrie plane & Trigonométrie", weightPercent: 35 },
      { code: "D3", labelAr: "الدوال والتمثيل المبياني", labelFr: "Fonctions & Graphiques", weightPercent: 20 },
      { code: "D4", labelAr: "حل المشكلات والإحصاء", labelFr: "Résolution de problèmes & Stats", weightPercent: 10 },
    ],
    qcmItems: [
      {
        id: "qcm_tc_1",
        questionAr: `تبسيط التعبير A = √(${isModelA ? "75" : "48"}) - √(${isModelA ? "12" : "27"}) هو:`,
        questionFr: `La forme simplifiée de A = √(${isModelA ? "75" : "48"}) - √(${isModelA ? "12" : "27"}) est :`,
        domainAr: "الحساب العددي",
        domainFr: "Calcul numérique",
        points: "1.0",
        optionsAr: [
          { code: "A", text: isModelA ? "3√3" : "√3", isCorrect: true },
          { code: "B", text: isModelA ? "√63" : "√21", isCorrect: false },
          { code: "C", text: isModelA ? "7√3" : "5√3", isCorrect: false },
          { code: "D", text: "3", isCorrect: false },
        ],
        optionsFr: [
          { code: "A", text: isModelA ? "3√3" : "√3", isCorrect: true },
          { code: "B", text: isModelA ? "√63" : "√21", isCorrect: false },
          { code: "C", text: isModelA ? "7√3" : "5√3", isCorrect: false },
          { code: "D", text: "3", isCorrect: false },
        ],
        correctCode: "A",
        justificationAr: isModelA
          ? `√75 = √(25×3) = 5√3 و √12 = √(4×3) = 2√3، إذن A = 5√3 - 2√3 = 3√3.`
          : `√48 = √(16×3) = 4√3 و √27 = √(9×3) = 3√3، إذن A = 4√3 - 3√3 = √3.`,
        justificationFr: `Décomposition en facteurs carrés parfaits et réduction des radicaux semblables.`,
        commonErrorAr: "طرح ما تحت الجذرين واختيار √(75-12)=√63 (خطأ فادح شائع).",
        commonErrorFr: "Croire faussement que √(a) - √(b) = √(a-b).",
        didacticalOriginAr: "تمثل خاطئ بأن الجذر المربع خطي على عمليتي الجمع والطرح.",
        didacticalOriginFr: "Obstacle de la distributivité présumée de la racine carrée.",
        remediationPlanAr: "تذكير بقواعد الجذور المربعة والتدريب على تفكيك الأعداد إلى جداء مربعات كاملة.",
        remediationPlanFr: "Fiche d'exercices sur les simplifications de radicaux et contre-exemples.",
      },
      {
        id: "qcm_tc_2",
        questionAr: `حل المعادلة: (2x - 3)(x + 5) = 0 في مجموعة الأعداد الحقيقية ℝ هو:`,
        questionFr: `Les solutions de l'équation (2x - 3)(x + 5) = 0 dans ℝ sont :`,
        domainAr: "المعادلات والجبر",
        domainFr: "Équations & Algèbre",
        points: "1.0",
        optionsAr: [
          { code: "A", text: "{3/2, -5}", isCorrect: true },
          { code: "B", text: "{-3/2, 5}", isCorrect: false },
          { code: "C", text: "{3/2, 5}", isCorrect: false },
          { code: "D", text: "{-3, 5}", isCorrect: false },
        ],
        optionsFr: [
          { code: "A", text: "{3/2, -5}", isCorrect: true },
          { code: "B", text: "{-3/2, 5}", isCorrect: false },
          { code: "C", text: "{3/2, 5}", isCorrect: false },
          { code: "D", text: "{-3, 5}", isCorrect: false },
        ],
        correctCode: "A",
        justificationAr: `جداء عاملين منعدم يعني أن: 2x - 3 = 0 أو x + 5 = 0 ومنه x = 3/2 أو x = -5.`,
        justificationFr: `Règle du produit nul : A × B = 0 <=> A = 0 ou B = 0.`,
        commonErrorAr: "نسيان تغيير الإشارة عند النقل إلى الطرف الآخر واختيار {-3/2, 5}.",
        commonErrorFr: "Erreurs de signe lors de la résolution de ax + b = 0.",
        didacticalOriginAr: "عدم ضبط قواعد النقل وتغيير الإشارة في المعادلات البسيطة.",
        didacticalOriginFr: "Manque d'automatismes sur la transposition de termes.",
        remediationPlanAr: "سلسلة معادلات جداء منعدم ومراجعة قاعدة الإشارات.",
        remediationPlanFr: "Exercices d'automatisation sur les équations-produits.",
      },
      {
        id: "qcm_tc_3",
        questionAr: `في مثلث ABC قائم الزاوية في A، إذا كان AB = 3 و AC = 4، فإن cos(ABC) يساوي:`,
        questionFr: `Dans un triangle ABC rectangle en A avec AB = 3 et AC = 4, cos(ABC) vaut :`,
        domainAr: "الحساب المثلثي",
        domainFr: "Trigonométrie",
        points: "1.0",
        optionsAr: [
          { code: "A", text: "3/5", isCorrect: true },
          { code: "B", text: "4/5", isCorrect: false },
          { code: "C", text: "3/4", isCorrect: false },
          { code: "D", text: "4/3", isCorrect: false },
        ],
        optionsFr: [
          { code: "A", text: "3/5", isCorrect: true },
          { code: "B", text: "4/5", isCorrect: false },
          { code: "C", text: "3/4", isCorrect: false },
          { code: "D", text: "4/3", isCorrect: false },
        ],
        correctCode: "A",
        justificationAr: `حسب مبرهنة فيثاغورس: BC = √(3² + 4²) = 5. وبما أن cos = المحاذي / الوتر، فإن cos(ABC) = AB / BC = 3/5.`,
        justificationFr: `BC = 5 (Pythagore). cos(B) = Côté adjacent / Hypoténuse = AB / BC = 3/5.`,
        commonErrorAr: "خلط بين جيب التمام (cos) والجيب (sin) أو الظل (tan).",
        commonErrorFr: "Confusion entre côté adjacent et côté opposé.",
        didacticalOriginAr: "عدم التمييز الدقيق بين نسب المثلث القائم الزاوية.",
        didacticalOriginFr: "Confusion des définitions trigonométriques du collège.",
        remediationPlanAr: "استثمار الأشكال الهندسية لترسيخ الضلع المحاذي والضلع المقابل والوتر.",
        remediationPlanFr: "Activités visuelles sur le repérage des côtés dans le triangle rectangle.",
      },
      {
        id: "qcm_tc_4",
        questionAr: `معامل توجيه (ميل) المستقيم المار من النقطتين M(1, 2) و N(3, 8) هو:`,
        questionFr: `La pente (coefficient directeur) de la droite passant par M(1, 2) et N(3, 8) est :`,
        domainAr: "الهندسة التحليلية",
        domainFr: "Géométrie analytique",
        points: "1.0",
        optionsAr: [
          { code: "A", text: "3", isCorrect: true },
          { code: "B", text: "1/3", isCorrect: false },
          { code: "C", text: "6", isCorrect: false },
          { code: "D", text: "4", isCorrect: false },
        ],
        optionsFr: [
          { code: "A", text: "3", isCorrect: true },
          { code: "B", text: "1/3", isCorrect: false },
          { code: "C", text: "6", isCorrect: false },
          { code: "D", text: "4", isCorrect: false },
        ],
        correctCode: "A",
        justificationAr: `الميل m = (y_N - y_M) / (x_N - x_M) = (8 - 2) / (3 - 1) = 6 / 2 = 3.`,
        justificationFr: `m = Δy / Δx = (8 - 2) / (3 - 1) = 6 / 2 = 3.`,
        commonErrorAr: "قلب النسبة وحساب (x_N - x_M)/(y_N - y_M) = 2/6 = 1/3.",
        commonErrorFr: "Inversion de la formule en calculant Δx / Δy.",
        didacticalOriginAr: "خلط بين التغير في الأراتيب والتغير في الأفاصيل.",
        didacticalOriginFr: "Confusion fréquente entre ordonnée et abscisse dans la formule.",
        remediationPlanAr: "تثبيت صيغة الميل عبر التمثيل المبياني والتطبيق الحسابي المتكرر.",
        remediationPlanFr: "Rappels sur le calcul du coefficient directeur avec interprétation graphique.",
      },
    ],
    directExercises: [
      {
        id: "diag_tc_ex_1",
        number: 1,
        titleAr: "التمرين الأول : النشر والتعميل والمتطابقات الهامة (4 نقط)",
        titleFr: "Exercice 1 : Développement, factorisation et identités remarquables (4 points)",
        domainAr: "الجبر والحسابيات",
        domainFr: "Algèbre & Calcul",
        totalPoints: "4.0",
        prerequisiteAr: "التحكم في المتطابقات الهامة الثلاث وتقنيات النشر والتعميل",
        prerequisiteFr: "Maîtrise des trois identités remarquables et de la factorisation",
        questionsAr: [
          { label: "1.", text: `انشر وبسط التعبير: E = (2x - 3)² - (x + 1)(x - 1).`, points: "2.0 ن" },
          { label: "2.", text: `عمل التعبير: F = 4x² - 9 + (2x - 3)(x + 4).`, points: "2.0 ن" },
        ],
        questionsFr: [
          { label: "1.", text: `Développer et réduire : E = (2x - 3)² - (x + 1)(x - 1).`, points: "2.0 pt" },
          { label: "2.", text: `Factoriser l'expression : F = 4x² - 9 + (2x - 3)(x + 4).`, points: "2.0 pt" },
        ],
        solutionsAr: [
          `1. E = (4x² - 12x + 9) - (x² - 1) = 4x² - 12x + 9 - x² + 1 = 3x² - 12x + 10.`,
          `2. نلاحظ أن 4x² - 9 = (2x - 3)(2x + 3). إذن F = (2x - 3)(2x + 3) + (2x - 3)(x + 4) = (2x - 3)[(2x + 3) + (x + 4)] = (2x - 3)(3x + 7).`,
        ],
        solutionsFr: [
          `1. E = (4x² - 12x + 9) - (x² - 1) = 3x² - 12x + 10.`,
          `2. 4x² - 9 = (2x - 3)(2x + 3), donc F = (2x - 3)[(2x + 3) + (x + 4)] = (2x - 3)(3x + 7).`,
        ],
        errorAnalysisAr: "نسيان تغيير الإشارة داخل القوس المسبوق بعلامة ناقص، وصعوبة رصد العامل المشترك الخفي.",
        errorAnalysisFr: "Oubli du changement de signe après un signe moins et non-reconnaissance du facteur commun caché.",
        remediationAr: "أنشطة استدراكية في تقنيات التعميل بالمتطابقات الهامة.",
        remediationFr: "Entraînement pas à pas sur les factorisations avec facteur commun composé.",
      },
      {
        id: "diag_tc_ex_2",
        number: 2,
        titleAr: "التمرين الثاني : الهندسة وحساب المساحات ومبرهنة طاليس (4 نقط)",
        titleFr: "Exercice 2 : Géométrie plane, aires et théorème de Thalès (4 points)",
        domainAr: "الهندسة المستوية",
        domainFr: "Géométrie plane",
        totalPoints: "4.0",
        prerequisiteAr: "مبرهنة طاليس المباشرة وحساب المسافات والتوازي",
        prerequisiteFr: "Théorème de Thalès direct et calcul de longueurs",
        questionsAr: [
          { label: "1.", text: `ليكن ABC مثلثاً بحيث AB = 6 و AC = 8 و BC = 10. بين أن المثلث ABC قائم الزاوية في A.`, points: "1.5 ن" },
          { label: "2.", text: `لتكن M نقطة من [AB] بحيث AM = 2. المستقيم المار من M والموازي لـ (BC) يقطع [AC] في N. أحسب الطولين AN و MN.`, points: "2.5 ن" },
        ],
        questionsFr: [
          { label: "1.", text: `Soit ABC un triangle tel que AB = 6, AC = 8 et BC = 10. Démontrer que ABC est rectangle en A.`, points: "1.5 pt" },
          { label: "2.", text: `Soit M ∈ [AB] tel que AM = 2. La parallèle à (BC) passant par M coupe [AC] en N. Calculer AN et MN.`, points: "2.5 pt" },
        ],
        solutionsAr: [
          `1. لدينا BC² = 100، و AB² + AC² = 36 + 64 = 100. بما أن BC² = AB² + AC² فإن حسب عكسية فيثاغورس المثلث ABC قائم الزاوية في A.`,
          `2. بما أن (MN) // (BC) فحسب مبرهنة طاليس المباشرة: AM/AB = AN/AC = MN/BC. لدينا 2/6 = 1/3، إذن AN = 8 × (1/3) = 8/3 ≈ 2.67 و MN = 10 × (1/3) = 10/3 ≈ 3.33.`,
        ],
        solutionsFr: [
          `1. BC² = 100 et AB² + AC² = 100. D'après la réciproque du théorème de Pythagore, ABC est rectangle en A.`,
          `2. D'après Thalès : AM/AB = AN/AC = MN/BC = 1/3. D'où AN = 8/3 et MN = 10/3.`,
        ],
        errorAnalysisAr: "خلط بين المبرهنة المباشرة والعكسية لفيثاغورس وطاليس.",
        errorAnalysisFr: "Confusion classique entre théorème direct et sa réciproque.",
        remediationAr: "التدريب على الصياغة السليمة للاستدلال الهندسي وشرط التوازي.",
        remediationFr: "Clarification de l'usage des théorèmes directs versus réciproques.",
      },
    ],
    synthesisProblem: {
      titleAr: "المسألة التشخيصية التوليفية : نمذجة مسألة واقعية وتوظيف الدالة التآلفية (8 نقط)",
      titleFr: "Problème Diagnostique de Synthèse : Modélisation et fonctions affines (8 points)",
      contextAr: `تقترح مكتبة مدرسية صيغتين لكراء كتب الرياضيات المدرسية خلال السنة:\n- الصيغة (A) : دفع اشتراك سنوي قدره 80 درهماً، ودفع 5 دراهم عن كل كتاب يتم كراؤه.\n- الصيغة (B) : عدم دفع أي اشتراك، مع دفع 15 درهماً عن كل كتاب يتم كراؤه.\nليكن x عدد الكتب المعارة خلال السنة.`,
      contextFr: `Une bibliothèque propose deux tarifs de location de manuels :\n- Tarif A : Abonnement de 80 DH puis 5 DH par livre.\n- Tarif B : Sans abonnement, 15 DH par livre.\nSoit x le nombre de livres empruntés.`,
      totalPoints: "8.0",
      partsAr: [
        {
          partTitle: "الجزء الأول : التعبير الجبري وجدول المقارنة (4.0 ن)",
          points: "4.0",
          questions: [
            "1. أحسب التكلفة المدفوعة بالصيغتين A و B عند استعارة 4 كتب، ثم عند استعارة 10 كتب.",
            "2. عبر بدلالة x عن f(x) التكلفة بالصيغة (A)، وعن g(x) التكلفة بالصيغة (B).",
            "3. حدد طبيعة الدالتين f و g معللاً جوابك.",
          ],
          solutions: [
            "1. لكراء 4 كتب: الصيغة A تدفع 80 + 5×4 = 100 DH. الصيغة B تدفع 15×4 = 60 DH. لكراء 10 كتب: الصيغة A تدفع 80 + 5×10 = 130 DH. الصيغة B تدفع 15×10 = 150 DH.",
            "2. التعبير الجبري: f(x) = 5x + 80 و g(x) = 15x.",
            "3. الدالة f دالة تآلفية لأنها تكتب على شكل ax + b (مع a = 5 و b = 80). الدالة g دالة خطية لأنها تكتب على شكل ax (مع a = 15).",
          ],
        },
        {
          partTitle: "الجزء الثاني : التمثيل المبياني واتخاذ القرار الأمثل (4.0 ن)",
          points: "4.0",
          questions: [
            "1. حل المعادلة f(x) = g(x)، وأعط تأويلاً واقعياً للحل المحصل عليه.",
            "2. حل المتراجحة f(x) ≤ g(x)، واستنتج ابتداءً من أي عدد من الكتب تصبح الصيغة (A) أكثر تفضيلاً واقتصاداً للمتعلم.",
            "3. مثل مبيانياً الدالتين f و g في نفس المعلم المتعامد.",
          ],
          solutions: [
            "1. f(x) = g(x) <=> 5x + 80 = 15x <=> 10x = 80 <=> x = 8. التأويل: عند كراء 8 كتب تتساوى تكلفة الصيغتين وتكون 120 درهماً.",
            "2. f(x) ≤ g(x) <=> 5x + 80 ≤ 15x <=> 10x ≥ 80 <=> x ≥ 8. الاستنتاج: تصبح الصيغة (A) أكثر اقتصاداً وفائدة للتلميذ عندما يستعير 8 كتب فأكثر في السنة.",
            "3. الإنشاء: المستقيم (D_g) يمر من أصل المعلم (0, 0) والنقطة (8, 120)، والمستقيم (D_f) يمر من (0, 80) والنقطة (8, 120). نقطة التقاطع هي (8, 120).",
          ],
        },
      ],
      partsFr: [
        {
          partTitle: "Partie I : Modélisation algébrique (4.0 pts)",
          points: "4.0",
          questions: [
            "1. Calculer le coût pour 4 livres puis pour 10 livres avec chaque formule.",
            "2. Exprimer f(x) (tarif A) et g(x) (tarif B) en fonction de x.",
            "3. Préciser la nature de f et de g.",
          ],
          solutions: [
            "1. Pour 4 livres : A = 100 DH, B = 60 DH. Pour 10 livres : A = 130 DH, B = 150 DH.",
            "2. f(x) = 5x + 80 et g(x) = 15x.",
            "3. f est une fonction affine et g est une fonction linéaire.",
          ],
        },
        {
          partTitle: "Partie II : Résolution et choix optimal (4.0 pts)",
          points: "4.0",
          questions: [
            "1. Résoudre f(x) = g(x) et interpréter le résultat.",
            "2. Résoudre f(x) ≤ g(x) et déduire le choix le plus économique.",
            "3. Représenter graphiquement f et g dans un repère orthogonal.",
          ],
          solutions: [
            "1. 5x + 80 = 15x <=> x = 8. Les deux tarifs sont équivalents pour 8 livres (120 DH).",
            "2. f(x) ≤ g(x) <=> x ≥ 8. Le tarif A devient plus avantageux à partir de 8 livres.",
            "3. Tracé des deux droites sécantes en (8, 120).",
          ],
        },
      ],
      remediationAr: "الربط بين الحل الجبري للمعادلة والتأويل الهندسي لتقاطع المستقيمات وتطبيقات النمذجة.",
      remediationFr: "Sensibilisation à la résolution graphique d'inéquations et modélisation de problèmes concrets.",
    },
  };
}
