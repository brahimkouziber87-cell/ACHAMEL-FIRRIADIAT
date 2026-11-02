// مختبر الخوارزميات والبرمجة بلغة بايثون - المنهاج المغربي والبعثة الفرنسية AEFE
// Python Algorithms & Programming Lab for Secondary School Mathematics

export interface PythonAlgorithmPreset {
  id: string;
  titleAr: string;
  titleFr: string;
  topicCategory: "Suites" | "Analyse" | "Probabilités" | "Arithmétique" | "Géométrie";
  categoryAr: string;
  categoryFr: string;
  cycle: "TC" | "1BAC" | "2BAC" | "ALL";
  levelBadgeAr: string;
  levelBadgeFr: string;
  objectiveAr: string;
  objectiveFr: string;
  pythonCode: string;
  pedagogicalQuestionsAr: string[];
  pedagogicalQuestionsFr: string[];
  sampleInputs: Record<string, number | string>;
  expectedOutputAr: string;
  expectedOutputFr: string;
  latexCode: string;
  typstCode: string;
}

export const PYTHON_ALGORITHMS_BANK: PythonAlgorithmPreset[] = [
  {
    id: "suite_seuil_geometrique",
    titleAr: "خوارزمية البحث عن عتبة متتالية عددية (Algorithme de Seuil)",
    titleFr: "Calcul de seuil pour une suite convergente (Boucle While)",
    topicCategory: "Suites",
    categoryAr: "المتتاليات العددية",
    categoryFr: "Suites Numériques",
    cycle: "2BAC",
    levelBadgeAr: "2 باك علوم تجريبية ورياضية / Terminale Spécialité",
    levelBadgeFr: "Terminale Spécialité / 2BAC SM & PC",
    objectiveAr:
      "تحديد أصغر رتبة n بحيث يقترب الحد u_n من نهاية المتتالية L بمسافة أقل من عتبة معطاة ε (دراسة سلوك المتتالية u_n = 3 × 0.8^n + 2).",
    objectiveFr:
      "Déterminer le plus petit entier naturel n à partir duquel |u_n - L| < ε pour la suite u_n = 3 × (0.8)^n + 2.",
    pythonCode: `def seuil_suite(epsilon: float) -> int:
    """
    Détermine le premier rang n tel que |u_n - 2| < epsilon
    pour la suite u_{n+1} = 0.8 * u_n + 0.4 avec u_0 = 5
    (la limite de la suite est L = 2).
    """
    n = 0
    u = 5.0
    limite = 2.0
    while abs(u - limite) >= epsilon:
        u = 0.8 * u + 0.4
        n = n + 1
    return n

# Exemple d'exécution :
# print("Rang n pour epsilon = 1e-4 :", seuil_suite(0.0001))`,
    pedagogicalQuestionsAr: [
      "1. بين رياضياً بالترجع أن المتتالية (u_n) مصغورة بـ 2 وتناقصية قطعا.",
      "2. استنتج نهاية المتتالية L، ثم فسر دور الشرط المنطقي في حلقة while abs(u - limite) >= epsilon.",
      "3. ما هي القيمة التي ترجعها الدالة seuil_suite(0.01) ؟ تأكد بحل المتراجحة أسياً بواسطة الدالة ln.",
      "4. سؤال التعمق: عدل الكود المصدري ليرجع قائمة الأزواج (n, u_n) لتمثيلها مبيانياً.",
    ],
    pedagogicalQuestionsFr: [
      "1. Démontrer par récurrence que pour tout n ∈ ℕ, u_n > 2 et que la suite est strictement décroissante.",
      "2. Justifier la convergence de la suite et préciser sa limite L. Quel est le rôle du test dans la boucle while ?",
      "3. Quelle valeur renvoie l'appel seuil_suite(0.01) ? Retrouver ce résultat par le calcul algébrique avec la fonction ln.",
      "4. Approfondissement : Modifier l'algorithme pour qu'il renvoie également la liste des termes successifs.",
    ],
    sampleInputs: { epsilon: 0.0001 },
    expectedOutputAr: "الرتبة n = 47 (أي u_47 تقترب من 2 بدقة 10^-4)",
    expectedOutputFr: "Rang n = 47 (terme u_47 vérifiant |u_47 - 2| < 10^-4)",
    latexCode: `\\begin{tcolorbox}[colback=slate!5!white,colframe=blue!75!black,title={\\textbf{Algorithme Python : Recherche de seuil pour une suite}}]
\\begin{lstlisting}[language=Python]
def seuil_suite(epsilon: float) -> int:
    n = 0
    u = 5.0
    limite = 2.0
    while abs(u - limite) >= epsilon:
        u = 0.8 * u + 0.4
        n = n + 1
    return n
\\end{lstlisting}
\\end{tcolorbox}`,
    typstCode: `#block(
  fill: rgb("f8fafc"),
  inset: 10pt,
  radius: 6pt,
  stroke: rgb("2563eb"),
  [
    *Algorithme Python : Recherche de seuil*
    #raw(lang: "python", "def seuil_suite(epsilon):\\n    n = 0\\n    u = 5.0\\n    while abs(u - 2.0) >= epsilon:\\n        u = 0.8 * u + 0.4\\n        n += 1\\n    return n")
  ]
)`,
  },
  {
    id: "dichotomie_racine",
    titleAr: "خوارزمية التفرع الثنائي (Méthode de Dichotomie pour f(x)=0)",
    titleFr: "Résolution approchée par dichotomie de l'équation f(x) = 0",
    topicCategory: "Analyse",
    categoryAr: "التحليل ودراسة الدوال",
    categoryFr: "Analyse & Fonctions",
    cycle: "2BAC",
    levelBadgeAr: "2 باك علوم تجريبية ورياضية / Terminale",
    levelBadgeFr: "Terminale Spécialité / 2BAC",
    objectiveAr:
      "تطبيق مبرهنة القيم الوسيطية وخوارزمية التفرع الثنائي (Dichotomie) لحساب قيمة مقربة لحل المعادلة f(x) = 0 على مجال [a, b] بسعة ε.",
    objectiveFr:
      "Appliquer le théorème des valeurs intermédiaires et encadrer la solution unique α de f(x)=0 à une précision ε.",
    pythonCode: `def f(x: float) -> float:
    # Exemple : f(x) = x**3 + x - 1 sur [0, 1]
    return x**3 + x - 1.0

def dichotomie(a: float, b: float, epsilon: float) -> tuple[float, float, int]:
    """
    Encadre la racine unique de f sur [a, b] avec une amplitude <= epsilon.
    Renvoie le couple (a, b) et le nombre d'itérations.
    """
    iterations = 0
    while (b - a) > epsilon:
        m = (a + b) / 2.0
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
        iterations += 1
    return (a, b, iterations)

# Test : encadrement à 10^-3 près
# a_sol, b_sol, nb = dichotomie(0.0, 1.0, 0.001)
# print(f"Encadrement : [{a_sol:.4f}, {b_sol:.4f}] en {nb} étapes")`,
    pedagogicalQuestionsAr: [
      "1. أثبت أن الدالة f متصلة وتزايدية قطعا على [0, 1] وأن المعادلة f(x) = 0 تقبل حلاً وحيداً α في [0, 1].",
      "2. فسر هندسياً لماذا نعتمد الاختبار الشرطي if f(a) * f(m) <= 0: b = m.",
      "3. أثبت أنه بعد n تكراراً تصبح سعة المجال (b - a) مساوية لـ (1 - 0) / 2^n. ما هو عدد التكرارات اللازمة للحصول على دقة 10^-6 ؟",
      "4. سؤال البرمجة: أتمم الكود ليرجع القيمة المقربة المركزية (a + b) / 2 مع نسبة الخطأ المرتكب.",
    ],
    pedagogicalQuestionsFr: [
      "1. Justifier que l'équation f(x) = 0 admet une unique solution α sur l'intervalle [0, 1].",
      "2. Justifier le test conditionnel if f(a) * f(m) <= 0 dans le corps de la boucle.",
      "3. Démontrer que la largeur de l'intervalle après n itérations est (b - a)/2^n. En déduire le nombre minimal d'itérations pour une précision de 10^-6.",
      "4. Exercice de programmation : Adapter le code pour afficher chaque étape sous forme de tableau comparatif.",
    ],
    sampleInputs: { a: 0.0, b: 1.0, epsilon: 0.001 },
    expectedOutputAr: "المجال [0.6821, 0.6831] في 10 تكرارات، مع α ≈ 0.6823",
    expectedOutputFr: "Encadrement [0.6821, 0.6831] en 10 itérations, α ≈ 0.6823",
    latexCode: `\\begin{tcolorbox}[colback=slate!5!white,colframe=emerald!75!black,title={\\textbf{Algorithme Python : Méthode de Dichotomie}}]
\\begin{lstlisting}[language=Python]
def dichotomie(a, b, epsilon):
    nb = 0
    while (b - a) > epsilon:
        m = (a + b) / 2.0
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
        nb += 1
    return a, b, nb
\\end{lstlisting}
\\end{tcolorbox}`,
    typstCode: `#block(
  fill: rgb("f8fafc"),
  inset: 10pt,
  radius: 6pt,
  stroke: rgb("059669"),
  [
    *Algorithme Python : Dichotomie*
    #raw(lang: "python", "def dichotomie(a, b, eps):\\n    while (b - a) > eps:\\n        m = (a + b) / 2\\n        if f(a) * f(m) <= 0:\\n            b = m\\n        else:\\n            a = m\\n    return a, b")
  ]
)`,
  },
  {
    id: "monte_carlo_pi",
    titleAr: "محاكاة مونتي-كارلو لتقدير عدد π (Simulation de Monte-Carlo)",
    titleFr: "Méthode probabiliste de Monte-Carlo (Approximation de π)",
    topicCategory: "Probabilités",
    categoryAr: "الاحتمالات والإحصاء",
    categoryFr: "Probabilités & Simulations",
    cycle: "ALL",
    levelBadgeAr: "الجذع المشترك، 1 باك، 2 باك / Seconde à Terminale",
    levelBadgeFr: "Seconde à Terminale / Tronc Commun à 2BAC",
    objectiveAr:
      "تطبيق قانون الأعداد الكبيرة والنمذجة العشوائية لتقدير مساحة ربع القرص واستنتاج القيمة التقريبية للثابتة π.",
    objectiveFr:
      "Appliquer la loi des grands nombres et la simulation aléatoire pour estimer la valeur du nombre π.",
    pythonCode: `import random

def estimation_pi_monte_carlo(n_tirages: int) -> float:
    """
    Simule le tirage uniforme de n points dans le carré [0, 1] x [0, 1].
    Compte la proportion de points tombant dans le quart de disque x^2 + y^2 <= 1.
    L'aire du quart de disque vaut pi / 4, donc pi ~ 4 * (succes / n_tirages).
    """
    succes = 0
    for _ in range(n_tirages):
        x = random.random()  # Flottant uniforme sur [0, 1[
        y = random.random()
        if x**2 + y**2 <= 1.0:
            succes += 1
    return 4.0 * (succes / n_tirages)

# Exemple pour 100 000 tirages
# pi_estime = estimation_pi_monte_carlo(100000)
# print(f"Estimation de pi : {pi_estime:.5f}")`,
    pedagogicalQuestionsAr: [
      "1. بين أن احتمال سقوط نقطة عشوائية داخل ربع القرص يساوي P = π / 4.",
      "2. نعتبر المتغير العشوائي X_i الذي يأخذ القيمة 1 إذا سقطت النقطة داخل القرص و 0 في الحالة الأخرى. حدد قانون احتمال X_i وأمله الرياضي وتغايره.",
      "3. بين بالاعتماد على قانون الأعداد الكبيرة (Loi des grands nombres) أن التردد f_n يؤول في الاحتمال إلى π/4.",
      "4. سؤال محاكاة: أنجز تجارب بعدد سحوبات n = 1000 ثم n = 10000 ثم n = 100000 ولاحظ سرعة التقارب نحو 3.14159.",
    ],
    pedagogicalQuestionsFr: [
      "1. Justifier géométriquement que la probabilité qu'un point tiré appartienne au quart de disque est p = π / 4.",
      "2. Définir la variable de Bernoulli X_i associée au i-ème tirage et donner son espérance et sa variance.",
      "3. En exploitant la loi des grands nombres, justifier la convergence de l'estimateur vers π.",
      "4. Déterminer la taille d'échantillon n requise pour obtenir un intervalle de confiance à 95% de largeur 0,01.",
    ],
    sampleInputs: { n_tirages: 50000 },
    expectedOutputAr: "قيمة تقريبية: π ≈ 3.1412 (تختلف طفيفاً باختلاف البذرة العشوائية)",
    expectedOutputFr: "Valeur approchée : π ≈ 3.1412 (fluctuation d'échantillonnage)",
    latexCode: `\\begin{tcolorbox}[colback=slate!5!white,colframe=violet!75!black,title={\\textbf{Algorithme Python : Simulation de Monte-Carlo pour $\\pi$}}]
\\begin{lstlisting}[language=Python]
import random

def estimation_pi(n):
    succes = 0
    for _ in range(n):
        x = random.random()
        y = random.random()
        if x**2 + y**2 <= 1.0:
            succes += 1
    return 4.0 * (succes / n)
\\end{lstlisting}
\\end{tcolorbox}`,
    typstCode: `#block(
  fill: rgb("f8fafc"),
  inset: 10pt,
  radius: 6pt,
  stroke: rgb("7c3aed"),
  [
    *Simulation de Monte-Carlo (Estimation de $pi$)*
    #raw(lang: "python", "import random\\ndef estimation_pi(n):\\n    succes = sum(1 for _ in range(n) if random.random()**2 + random.random()**2 <= 1.0)\\n    return 4.0 * succes / n")
  ]
)`,
  },
  {
    id: "methode_rectangles_integrale",
    titleAr: "حساب التكامل العددي بطريقة المستطيلات (Méthode des Rectangles)",
    titleFr: "Calcul approché d'intégrales par la méthode des rectangles",
    topicCategory: "Analyse",
    categoryAr: "الحساب التكاملي",
    categoryFr: "Calcul Intégral",
    cycle: "2BAC",
    levelBadgeAr: "2 باك علوم رياضية وتجريبية / Terminale",
    levelBadgeFr: "Terminale Spécialité / 2BAC",
    objectiveAr:
      "تأطير وحساب قيمة مقربة لتكامل دالة متصلة ورتيبة I = ∫_a^b f(t) dt باستعمال مجموع ريمان ومستطيلات التقريب.",
    objectiveFr:
      "Approcher l'intégrale d'une fonction continue à l'aide des sommes de Riemann (rectangles à gauche et à droite).",
    pythonCode: `def f_integrale(x: float) -> float:
    # Exemple : f(x) = 1.0 / x sur [1, 2], dont l'intégrale exacte est ln(2)
    return 1.0 / x

def methode_rectangles(a: float, b: float, n: int) -> tuple[float, float]:
    """
    Calcule la somme des rectangles à gauche (somme_gauche)
    et à droite (somme_droite) avec un pas h = (b - a) / n.
    """
    h = (b - a) / n
    somme_gauche = 0.0
    somme_droite = 0.0
    for k in range(n):
        x_k = a + k * h
        somme_gauche += f_integrale(x_k)
        somme_droite += f_integrale(x_k + h)
    return (somme_gauche * h, somme_droite * h)

# Test pour n = 1000 sur [1, 2]
# gauche, droite = methode_rectangles(1.0, 2.0, 1000)
# print(f"ln(2) encadré par : [{droite:.6f}, {gauche:.6f}]")`,
    pedagogicalQuestionsAr: [
      "1. بين أنه إذا كانت الدالة f تناقصية قطعا على [a, b]، فإن مجموع المستطيلات باليمين يصغر التكامل والمجموع باليسار يكبره.",
      "2. أثبت أن الخطأ المرتكب محصور بـ |b - a| / n × |f(b) - f(a)|.",
      "3. احسب القيمة الدقيقة للتكامل I = ∫_1^2 1/x dx وقارنها مع المخرجات العددية للبرنامج عند n = 1000.",
      "4. سؤال البرمجة: اكتب دالة جديدة بطريقة شبه المنحرف (Méthode des trapèzes) وبين أنها أكثر دقة وسرعة في التقارب.",
    ],
    pedagogicalQuestionsFr: [
      "1. Justifier l'encadrement de l'intégrale par les deux sommes lorsque f est strictement monotone.",
      "2. Démontrer la majoration théorique de l'erreur d'approximation : |R_n - I| ≤ M (b - a)² / (2n).",
      "3. Comparer avec la valeur exacte ln(2) ≈ 0.693147 et calculer l'écart absolu.",
      "4. Programmer la méthode des trapèzes et vérifier l'amélioration de la convergence.",
    ],
    sampleInputs: { a: 1.0, b: 2.0, n: 1000 },
    expectedOutputAr: "مجموع اليسار ≈ 0.693647، مجموع اليمين ≈ 0.693147 (يقترب من ln 2)",
    expectedOutputFr: "Gauche ≈ 0.693647, Droite ≈ 0.693147 (limite = ln 2 ≈ 0.693147)",
    latexCode: `\\begin{tcolorbox}[colback=slate!5!white,colframe=cyan!75!black,title={\\textbf{Algorithme Python : Méthode des Rectangles}}]
\\begin{lstlisting}[language=Python]
def methode_rectangles(a, b, n):
    h = (b - a) / n
    gauche, droite = 0.0, 0.0
    for k in range(n):
        gauche += f(a + k * h)
        droite += f(a + (k + 1) * h)
    return gauche * h, droite * h
\\end{lstlisting}
\\end{tcolorbox}`,
    typstCode: `#block(
  fill: rgb("f8fafc"),
  inset: 10pt,
  radius: 6pt,
  stroke: rgb("0891b2"),
  [
    *Calcul d'Intégrale (Méthode des Rectangles)*
    #raw(lang: "python", "def methode_rectangles(a, b, n):\\n    h = (b - a) / n\\n    g = sum(f(a + k*h) for k in range(n)) * h\\n    d = sum(f(a + (k+1)*h) for k in range(n)) * h\\n    return g, d")
  ]
)`,
  },
  {
    id: "arithmetique_pgcd_euclide",
    titleAr: "خوارزمية إقليدس لحساب القاسم المشترك الأكبر (Algorithme d'Euclide)",
    titleFr: "Algorithme d'Euclide & Identité de Bézout (Arithmétique)",
    topicCategory: "Arithmétique",
    categoryAr: "الحسابيات والجبر",
    categoryFr: "Arithmétique dans Z",
    cycle: "2BAC",
    levelBadgeAr: "2 باك علوم رياضية / Spé Maths Lycée",
    levelBadgeFr: "2BAC Sciences Maths / Spé Maths",
    objectiveAr:
      "تطبيق خوارزمية إقليدس للقسمات الإقليدية المتتالية لحساب PGCD(a, b) وتحديد معاملي بوزو (u, v) بحيث au + bv = PGCD(a, b).",
    objectiveFr:
      "Implémenter l'algorithme d'Euclide étendu pour déterminer le PGCD et les coefficients de Bézout.",
    pythonCode: `def euclide_etendu(a: int, b: int) -> tuple[int, int, int]:
    """
    Calcule le PGCD de a et b ainsi que les coefficients de Bézout (u, v)
    tels que a*u + b*v = pgcd(a, b).
    """
    r_prev, r = a, b
    u_prev, u = 1, 0
    v_prev, v = 0, 1
    
    while r != 0:
        q = r_prev // r
        r_prev, r = r, r_prev - q * r
        u_prev, u = u, u_prev - q * u
        v_prev, v = v, v_prev - q * v
        
    return (r_prev, u_prev, v_prev)

# Exemple : a = 120, b = 23
# pgcd_val, u, v = euclide_etendu(120, 23)
# print(f"PGCD = {pgcd_val}, avec {a}*({u}) + {b}*({v}) = {pgcd_val}")`,
    pedagogicalQuestionsAr: [
      "1. أثبت رياضياً مبرهنة إقليدس: PGCD(a, b) = PGCD(b, a mod b).",
      "2. أنجز يدوياً القسمات الإقليدية المتتالية للعددين a = 120 و b = 23، وقارن البواقي مع مراحل تنفيذ البرنامج.",
      "3. استنتج حلاً خاصاً للمعادلة الديوفانتية 120x + 23y = 1 في Z × Z.",
      "4. سؤال أمان التشفير: كيف تستثمر هذه الخوارزمية في حساب مقلوب عدد بترديد n في نظام التشفير RSA ؟",
    ],
    pedagogicalQuestionsFr: [
      "1. Énoncer et démontrer la propriété fondamentale : PGCD(a, b) = PGCD(b, r).",
      "2. Retrouver les coefficients de Bézout pour 120 et 23 par la méthode de remontée d'Euclide.",
      "3. Résoudre dans ℤ × ℤ l'équation diophantienne 120x + 23y = 1.",
      "4. Application cryptographique : Expliquer l'utilité du calcul de l'inverse modulaire dans le protocole RSA.",
    ],
    sampleInputs: { a: 120, b: 23 },
    expectedOutputAr: "PGCD = 1، معاملا بوزو: u = -9 و v = 47 (حيث 120×(-9) + 23×47 = 1)",
    expectedOutputFr: "PGCD = 1, coefficients de Bézout : u = -9, v = 47",
    latexCode: `\\begin{tcolorbox}[colback=slate!5!white,colframe=amber!85!black,title={\\textbf{Algorithme Python : Euclide Étendu (PGCD et Bézout)}}]
\\begin{lstlisting}[language=Python]
def euclide_etendu(a, b):
    r0, r1 = a, b
    u0, u1 = 1, 0
    v0, v1 = 0, 1
    while r1 != 0:
        q = r0 // r1
        r0, r1 = r1, r0 - q * r1
        u0, u1 = u1, u0 - q * u1
        v0, v1 = v1, v0 - q * v1
    return r0, u0, v0
\\end{lstlisting}
\\end{tcolorbox}`,
    typstCode: `#block(
  fill: rgb("f8fafc"),
  inset: 10pt,
  radius: 6pt,
  stroke: rgb("d97706"),
  [
    *Algorithme d'Euclide Étendu (Arithmétique)*
    #raw(lang: "python", "def euclide_etendu(a, b):\\n    r0, r1, u0, u1, v0, v1 = a, b, 1, 0, 0, 1\\n    while r1 != 0:\\n        q = r0 // r1\\n        r0, r1 = r1, r0 - q*r1\\n        u0, u1 = u1, u0 - q*u1\\n        v0, v1 = v1, v0 - q*v1\\n    return r0, u0, v0")
  ]
)`,
  },
];

/**
 * محاكاة تنفيذ بايثون محلياً في المتصفح لتشغيل الخوارزميات ورؤية النتيجة فورياً
 */
export function executeSimulatedPython(
  algorithmId: string,
  userInputs: Record<string, number | string>
): { success: boolean; resultSummary: string; logs: string[] } {
  const logs: string[] = [];
  try {
    switch (algorithmId) {
      case "suite_seuil_geometrique": {
        const eps = parseFloat(String(userInputs.epsilon ?? 0.0001)) || 0.0001;
        let n = 0;
        let u = 5.0;
        const lim = 2.0;
        logs.push(`[Init] n = 0, u_0 = 5.0, seuil cible = ${eps}, limite = 2.0`);
        while (Math.abs(u - lim) >= eps && n < 10000) {
          u = 0.8 * u + 0.4;
          n++;
          if (n <= 5 || n % 10 === 0) {
            logs.push(`Étape n = ${n}: u_${n} = ${u.toFixed(7)}, |u - 2| = ${Math.abs(u - lim).toFixed(7)}`);
          }
        }
        logs.push(`[Terminé] Condition vérifiée au rang n = ${n} avec |u_${n} - 2| = ${Math.abs(u - lim).toExponential(4)}`);
        return {
          success: true,
          resultSummary: `الرتبة المحصل عليها: n = ${n} (قيمة u_${n} ≈ ${u.toFixed(6)})`,
          logs,
        };
      }
      case "dichotomie_racine": {
        let a = parseFloat(String(userInputs.a ?? 0.0)) || 0.0;
        let b = parseFloat(String(userInputs.b ?? 1.0)) || 1.0;
        const eps = parseFloat(String(userInputs.epsilon ?? 0.001)) || 0.001;
        const f = (x: number) => x * x * x + x - 1.0;
        let it = 0;
        logs.push(`[Init] Intervalle initial [${a}, ${b}], précision souhaitée = ${eps}`);
        while (b - a > eps && it < 100) {
          const m = (a + b) / 2.0;
          it++;
          const fa = f(a);
          const fm = f(m);
          logs.push(`Itération ${it}: m = ${m.toFixed(6)}, f(m) = ${fm.toFixed(6)}, amplitude = ${(b - a).toFixed(6)}`);
          if (fa * fm <= 0) {
            b = m;
          } else {
            a = m;
          }
        }
        const alpha = (a + b) / 2.0;
        logs.push(`[Terminé] Encadrement final : [${a.toFixed(6)}, ${b.toFixed(6)}] en ${it} itérations.`);
        return {
          success: true,
          resultSummary: `الحل المقرب: α ≈ ${alpha.toFixed(5)} ضمن المجال [${a.toFixed(5)}, ${b.toFixed(5)}]`,
          logs,
        };
      }
      case "monte_carlo_pi": {
        const nTirages = Math.min(100000, Math.max(100, parseInt(String(userInputs.n_tirages ?? 50000)) || 50000));
        let succes = 0;
        logs.push(`[Init] Début de la simulation de Monte-Carlo avec n = ${nTirages} tirages uniformes...`);
        for (let i = 0; i < nTirages; i++) {
          const x = Math.random();
          const y = Math.random();
          if (x * x + y * y <= 1.0) {
            succes++;
          }
        }
        const piEstime = 4.0 * (succes / nTirages);
        const ecart = Math.abs(piEstime - Math.PI);
        logs.push(`Nombre de points dans le quart de cercle : ${succes} / ${nTirages}`);
        logs.push(`Fréquence observée f_n = ${(succes / nTirages).toFixed(6)} (valeur théorique π/4 ≈ ${(Math.PI / 4).toFixed(6)})`);
        logs.push(`Valeur estimée : π ≈ ${piEstime.toFixed(6)} (écart absolu = ${ecart.toFixed(6)})`);
        return {
          success: true,
          resultSummary: `القيمة المقدرة: π ≈ ${piEstime.toFixed(5)} (فارق الخطأ: ${ecart.toFixed(5)})`,
          logs,
        };
      }
      case "methode_rectangles_integrale": {
        const a = parseFloat(String(userInputs.a ?? 1.0)) || 1.0;
        const b = parseFloat(String(userInputs.b ?? 2.0)) || 2.0;
        const n = Math.min(10000, Math.max(10, parseInt(String(userInputs.n ?? 1000)) || 1000));
        const f = (x: number) => 1.0 / x;
        const h = (b - a) / n;
        let g = 0.0;
        let d = 0.0;
        logs.push(`[Init] Calcul de l'intégrale de 1/x sur [${a}, ${b}] avec n = ${n} subdivisions (pas h = ${h.toFixed(6)})`);
        for (let k = 0; k < n; k++) {
          g += f(a + k * h);
          d += f(a + (k + 1) * h);
        }
        const resG = g * h;
        const resD = d * h;
        const exact = Math.log(b / a);
        logs.push(`Somme de gauche : ${resG.toFixed(6)}`);
        logs.push(`Somme de droite : ${resD.toFixed(6)}`);
        logs.push(`Valeur exacte théorique (ln 2) : ${exact.toFixed(6)}`);
        return {
          success: true,
          resultSummary: `تأطير التكامل: [${Math.min(resG, resD).toFixed(6)}, ${Math.max(resG, resD).toFixed(6)}] (القيمة الدقيقة: ${exact.toFixed(6)})`,
          logs,
        };
      }
      case "arithmetique_pgcd_euclide": {
        let r0 = Math.abs(parseInt(String(userInputs.a ?? 120)) || 120);
        let r1 = Math.abs(parseInt(String(userInputs.b ?? 23)) || 23);
        let u0 = 1, u1 = 0;
        let v0 = 0, v1 = 1;
        logs.push(`[Init] Recherche de PGCD(${r0}, ${r1}) et coefficients de Bézout`);
        let step = 0;
        while (r1 !== 0) {
          step++;
          const q = Math.floor(r0 / r1);
          const rNext = r0 - q * r1;
          const uNext = u0 - q * u1;
          const vNext = v0 - q * v1;
          logs.push(`Étape ${step}: ${r0} = ${q} × ${r1} + ${rNext} | Coeffs: u = ${uNext}, v = ${vNext}`);
          r0 = r1;
          r1 = rNext;
          u0 = u1;
          u1 = uNext;
          v0 = v1;
          v1 = vNext;
        }
        logs.push(`[Terminé] PGCD = ${r0}, Relation : ${userInputs.a}*(${u0}) + ${userInputs.b}*(${v0}) = ${r0}`);
        return {
          success: true,
          resultSummary: `PGCD = ${r0} | معاملا بوزو: u = ${u0} و v = ${v0}`,
          logs,
        };
      }
      default:
        return {
          success: true,
          resultSummary: "تمت المعالجة بنجاح",
          logs: ["Exécution standard terminée."],
        };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur d'exécution";
    return {
      success: false,
      resultSummary: `خطأ: ${msg}`,
      logs: [`[Erreur] ${msg}`],
    };
  }
}
