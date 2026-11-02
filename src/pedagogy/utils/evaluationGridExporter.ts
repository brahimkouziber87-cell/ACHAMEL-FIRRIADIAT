import {
  computeExactExerciseEffectiveWeights,
  DMSubType,
  DocLanguage,
  DSQuestionDensity,
  EducationSystem,
  FRENCH_COMPETENCIES,
  generateMoroccanQCMExercise,
  generateMoroccanSynthesisProblem,
  getQuestionBaremesAndLevels,
  getSerieAndDMExercises,
  getVariantQuestions,
  LessonItem,
  ModuleType,
  MoroccanDSStructureMode,
  SemesterType,
  TrackData,
} from "../data/curriculum";
import { generateCustomCountSerieExercises } from "./seriesGenerator";

export type GridGranularity = "BY_QUESTION" | "BY_EXERCISE";

export interface EvaluationQuestionRow {
  exerciseIndex: number;
  exerciseNumber: number;
  exerciseTitleAr: string;
  exerciseTitleFr: string;
  subCategoryAr: string;
  subCategoryFr: string;
  exerciseWeight: number;
  exerciseTotalPoints: number;
  questionIndex: number;
  questionCode: string; // e.g. "Ex1-Q1"
  questionLabelAr: string;
  questionLabelFr: string;
  questionSnippetAr: string;
  questionSnippetFr: string;
  capacityAr: string;
  capacityFr: string;
  levelCode: "N1" | "N2" | "N3";
  levelLabelAr: string;
  levelLabelFr: string;
  boenCompetencyFr: string;
  points: number;
}

export interface EvaluationExerciseSummary {
  exerciseNumber: number;
  titleAr: string;
  titleFr: string;
  subCategoryAr: string;
  subCategoryFr: string;
  weight: number;
  totalPoints: number;
  questionCount: number;
  capacitiesAr: string[];
  capacitiesFr: string[];
  questions: EvaluationQuestionRow[];
}

export interface CustomEvaluationGridData {
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  exercises: EvaluationExerciseSummary[];
  allQuestions: EvaluationQuestionRow[];
  totalPoints: number;
  totalWeight: number;
}

export interface BuildEvaluationGridParams {
  track: TrackData;
  sem: SemesterType;
  dsKey: string;
  dmSubType: DMSubType;
  dmNumber: string;
  activeModule: ModuleType;
  lessons: LessonItem[];
  n1: number;
  n2: number;
  n3: number;
  modelCode?: "A" | "B";
  shuffleQuestions?: boolean;
  customExerciseTitles?: Record<number, string>;
  serieExerciseCount?: number;
  dsQuestionDensity?: DSQuestionDensity;
  dsStructureMode?: MoroccanDSStructureMode;
  isMission?: boolean;
  qcmQuestionCount?: number;
}

/**
 * يبني شبكة التقويم المخصصة (Grille d'évaluation) ديناميكياً بناءً على التمارين والأسئلة الفعلية المنشأة في الفرض
 */
export function buildCustomEvaluationGrid(
  params: BuildEvaluationGridParams
): CustomEvaluationGridData {
  const {
    track,
    sem,
    dsKey,
    dmSubType,
    dmNumber,
    activeModule,
    lessons,
    n1,
    n2,
    n3,
    modelCode = "A",
    shuffleQuestions = false,
    customExerciseTitles = {},
    serieExerciseCount = 6,
    dsQuestionDensity = "INTENSIVE",
    dsStructureMode = "EXERCICES_ET_PROBLEME",
    isMission = false,
    qcmQuestionCount = 4,
  } = params;

  const isDMModule = activeModule === "DM_SERIE";
  const isDM = dmSubType === "DEVOIR_MAISON";
  const isDS = activeModule === "DS_142_08";

  const hasQCM =
    isDS &&
    (dsStructureMode === "QCM_ET_EXERCICES" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC");
  const hasSynthesisProblem =
    isDS &&
    !isMission &&
    (dsStructureMode === "EXERCICES_ET_PROBLEME" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC");
  const fixedQcmPoints = hasQCM ? Number((Math.min(6, Math.max(2, qcmQuestionCount)) * 1.0).toFixed(2)) : 0;
  const fixedProblemPoints = hasSynthesisProblem ? 8.5 : 0;
  const exercisesPointBudget = Math.max(
    4,
    20 - fixedQcmPoints - fixedProblemPoints
  );

  const exercises: EvaluationExerciseSummary[] = [];
  const allQuestions: EvaluationQuestionRow[] = [];

  if (isDMModule && !isDM) {
    const serieBlocks = generateCustomCountSerieExercises(
      lessons,
      serieExerciseCount,
      modelCode
    );
    const perExWeight = Number((100 / Math.max(1, serieBlocks.length)).toFixed(1));
    serieBlocks.forEach((block, exIdx) => {
      const exerciseNumber = exIdx + 1;
      const lesson = lessons[exIdx % Math.max(1, lessons.length)] || lessons[0];
      const exTotalPts = Number(((perExWeight * 20) / 100).toFixed(2));
      const customTitle = customExerciseTitles[exIdx]?.trim();
      const titleAr = customTitle || block.badgeAr;
      const titleFr = customTitle || block.badgeFr;

      const qArList = block.questionsAr;
      const qFrList = block.questionsFr;
      const qCount = Math.max(1, qFrList.length);
      const qMetas = getQuestionBaremesAndLevels(perExWeight, qCount, n1, n2, n3);

      const exQuestions: EvaluationQuestionRow[] = qFrList.map((qFr, qIdx) => {
        const qAr = qArList[qIdx] || qFr;
        const meta = qMetas[qIdx] || {
          points: (exTotalPts / qCount).toFixed(2),
          level: "N2",
          levelLabelAr: "تعبئة وتوليف (N2)",
          levelLabelFr: "Mobilisation (N2)",
        };
        const capAr =
          lesson?.capacitiesAr[qIdx % Math.max(1, lesson.capacitiesAr.length)] ||
          lesson?.lessonAr ||
          "الرياضيات";
        const capFr =
          lesson?.capacitiesFr[qIdx % Math.max(1, lesson.capacitiesFr.length)] ||
          lesson?.lessonFr ||
          "Mathématiques";
        const comp =
          FRENCH_COMPETENCIES[(exIdx + qIdx) % FRENCH_COMPETENCIES.length];

        const cleanAr = qAr.replace(/^\d+[\.\)]\s*/, "").trim();
        const cleanFr = qFr.replace(/^\d+[\.\)]\s*/, "").trim();

        const row: EvaluationQuestionRow = {
          exerciseIndex: exIdx,
          exerciseNumber,
          exerciseTitleAr: titleAr,
          exerciseTitleFr: titleFr,
          subCategoryAr: lesson?.subCategory || "رياضيات",
          subCategoryFr: lesson?.subCategoryFr || lesson?.category || "Mathématiques",
          exerciseWeight: perExWeight,
          exerciseTotalPoints: exTotalPts,
          questionIndex: qIdx,
          questionCode: `Ex${exerciseNumber}-Q${qIdx + 1}`,
          questionLabelAr: `ت${exerciseNumber} - س${qIdx + 1}`,
          questionLabelFr: `Ex${exerciseNumber} - Q${qIdx + 1}`,
          questionSnippetAr:
            cleanAr.length > 85 ? `${cleanAr.slice(0, 82)}...` : cleanAr,
          questionSnippetFr:
            cleanFr.length > 85 ? `${cleanFr.slice(0, 82)}...` : cleanFr,
          capacityAr: capAr,
          capacityFr: capFr,
          levelCode: meta.level,
          levelLabelAr: meta.levelLabelAr,
          levelLabelFr: meta.levelLabelFr,
          boenCompetencyFr: comp.label,
          points: Number(parseFloat(meta.points).toFixed(2)),
        };

        allQuestions.push(row);
        return row;
      });

      exercises.push({
        exerciseNumber,
        titleAr,
        titleFr,
        subCategoryAr: lesson?.subCategory || "رياضيات",
        subCategoryFr: lesson?.subCategoryFr || lesson?.category || "Mathématiques",
        weight: perExWeight,
        totalPoints: exTotalPts,
        questionCount: exQuestions.length,
        capacitiesAr: lesson?.capacitiesAr || [],
        capacitiesFr: lesson?.capacitiesFr || [],
        questions: exQuestions,
      });
    });
  } else {
    let currentExNum = 1;

    // 1. إدراج تمرين QCM التمهيدي في شبكة التقويم إذا كان مفعلاً
    if (hasQCM) {
      const qcmBlock = generateMoroccanQCMExercise(lessons, modelCode, track.cycle, {
        questionCount: qcmQuestionCount,
        isMission,
      });
      const qcmExNum = currentExNum++;
      const qcmWeight = Math.round((fixedQcmPoints / 20) * 100);
      const qcmQuestions: EvaluationQuestionRow[] = qcmBlock.items.map(
        (item, qIdx) => {
          const row: EvaluationQuestionRow = {
            exerciseIndex: 0,
            exerciseNumber: qcmExNum,
            exerciseTitleAr: qcmBlock.titleAr,
            exerciseTitleFr: qcmBlock.titleFr,
            subCategoryAr: "أسئلة الاختيار من متعدد (QCM)",
            subCategoryFr: "Questions à Choix Multiples (QCM)",
            exerciseWeight: qcmWeight,
            exerciseTotalPoints: fixedQcmPoints,
            questionIndex: qIdx,
            questionCode: `QCM-Q${qIdx + 1}`,
            questionLabelAr: `QCM - س${qIdx + 1}`,
            questionLabelFr: `QCM - Q${qIdx + 1}`,
            questionSnippetAr:
              item.statementAr.length > 85
                ? `${item.statementAr.slice(0, 82)}...`
                : item.statementAr,
            questionSnippetFr:
              item.statementFr.length > 85
                ? `${item.statementFr.slice(0, 82)}...`
                : item.statementFr,
            capacityAr: "التمييز السريع والتعليل الرياضي الدقيق",
            capacityFr: "Identification rapide et justification rigoureuse",
            levelCode: "N1",
            levelLabelAr: "تطبيق مباشر (N1)",
            levelLabelFr: "Application directe (N1)",
            boenCompetencyFr: "Calculer / Raisonner",
            points: Number(parseFloat(item.points || "1.0").toFixed(2)),
          };
          allQuestions.push(row);
          return row;
        }
      );

      exercises.push({
        exerciseNumber: qcmExNum,
        titleAr: qcmBlock.titleAr,
        titleFr: qcmBlock.titleFr,
        subCategoryAr: "أسئلة موضوعية (QCM)",
        subCategoryFr: "QCM / Vrai-Faux",
        weight: qcmWeight,
        totalPoints: fixedQcmPoints,
        questionCount: qcmQuestions.length,
        capacitiesAr: ["التحقق من صحة المتساويات والخاصيات مع التعليل"],
        capacitiesFr: ["Vérification des propriétés et justification"],
        questions: qcmQuestions,
      });
    }

    // 2. إدراج التمارين المستقلة
    const exactDsWeights = computeExactExerciseEffectiveWeights(
      lessons,
      exercisesPointBudget
    );
    lessons.forEach((lesson, exIdx) => {
      const exerciseNumber = currentExNum++;
      const effectiveWeight = isDS
        ? exactDsWeights[exIdx] ?? lesson.weight
        : lesson.weight;
      const exTotalPts = Number(((effectiveWeight * 20) / 100).toFixed(2));
      const customTitle = customExerciseTitles[exIdx]?.trim();

      const titleAr =
        customTitle || `التمرين ${exerciseNumber}: ${lesson.lessonAr}`;
      const titleFr =
        customTitle || `Exercice ${exerciseNumber} : ${lesson.lessonFr}`;

      let qArList: string[] = [];
      let qFrList: string[] = [];

      if (isDMModule) {
        const blocks = getSerieAndDMExercises(lesson, dmSubType, modelCode);
        blocks.forEach((b, bIdx) => {
          b.questionsAr.forEach((qAr, qI) => {
            const qFr = b.questionsFr[qI] || qAr;
            const partAr = bIdx === 0 ? "الجزء I" : bIdx === 1 ? "الجزء II" : "الجزء III";
            const partFr = bIdx === 0 ? "Partie A" : bIdx === 1 ? "Partie B" : "Partie C";
            qArList.push(`[${partAr}] ${qAr}`);
            qFrList.push(`[${partFr}] ${qFr}`);
          });
        });
      } else {
        const variant = getVariantQuestions(
          lesson,
          modelCode,
          shuffleQuestions,
          0,
          dsQuestionDensity
        );
        qArList = variant.questionsAr;
        qFrList = variant.questionsFr;
      }

      const qCount = Math.max(1, qFrList.length);
      const qMetas = getQuestionBaremesAndLevels(
        effectiveWeight,
        qCount,
        n1,
        n2,
        n3,
        lesson.customQuestionBaremes,
        lesson.customQuestionLevels
      );

      const exQuestions: EvaluationQuestionRow[] = qFrList.map((qFr, qIdx) => {
        const qAr = qArList[qIdx] || qFr;
        const meta = qMetas[qIdx] || {
          points: (exTotalPts / qCount).toFixed(2),
          level: "N2",
          levelLabelAr: "تعبئة وتوليف (N2)",
          levelLabelFr: "Mobilisation (N2)",
        };
        const capAr =
          lesson.capacitiesAr[qIdx % Math.max(1, lesson.capacitiesAr.length)] ||
          lesson.lessonAr;
        const capFr =
          lesson.capacitiesFr[qIdx % Math.max(1, lesson.capacitiesFr.length)] ||
          lesson.lessonFr;
        const comp =
          FRENCH_COMPETENCIES[(exIdx + qIdx) % FRENCH_COMPETENCIES.length];

        const cleanAr = qAr.replace(/^\d+[\.\)]\s*/, "").trim();
        const cleanFr = qFr.replace(/^\d+[\.\)]\s*/, "").trim();

        const row: EvaluationQuestionRow = {
          exerciseIndex: exercises.length,
          exerciseNumber,
          exerciseTitleAr: titleAr,
          exerciseTitleFr: titleFr,
          subCategoryAr: lesson.subCategory || "رياضيات",
          subCategoryFr: lesson.subCategoryFr || lesson.category || "Mathématiques",
          exerciseWeight: effectiveWeight,
          exerciseTotalPoints: exTotalPts,
          questionIndex: qIdx,
          questionCode: `Ex${exerciseNumber}-Q${qIdx + 1}`,
          questionLabelAr: `ت${exerciseNumber} - س${qIdx + 1}`,
          questionLabelFr: `Ex${exerciseNumber} - Q${qIdx + 1}`,
          questionSnippetAr:
            cleanAr.length > 85 ? `${cleanAr.slice(0, 82)}...` : cleanAr,
          questionSnippetFr:
            cleanFr.length > 85 ? `${cleanFr.slice(0, 82)}...` : cleanFr,
          capacityAr: capAr,
          capacityFr: capFr,
          levelCode: meta.level,
          levelLabelAr: meta.levelLabelAr,
          levelLabelFr: meta.levelLabelFr,
          boenCompetencyFr: comp.label,
          points: Number(parseFloat(meta.points).toFixed(2)),
        };

        allQuestions.push(row);
        return row;
      });

      const actualExPts = Number(
        exQuestions.reduce((s, q) => s + q.points, 0).toFixed(2)
      );
      exQuestions.forEach((q) => {
        q.exerciseTotalPoints = actualExPts;
      });

      exercises.push({
        exerciseNumber,
        titleAr,
        titleFr,
        subCategoryAr: lesson.subCategory || "رياضيات",
        subCategoryFr: lesson.subCategoryFr || lesson.category || "Mathématiques",
        weight: effectiveWeight,
        totalPoints: actualExPts,
        questionCount: exQuestions.length,
        capacitiesAr: lesson.capacitiesAr,
        capacitiesFr: lesson.capacitiesFr,
        questions: exQuestions,
      });
    });

    // 3. إدراج المسألة التوليفية الشاملة في شبكة التقويم إذا كانت مفعلة
    if (hasSynthesisProblem) {
      const synthProb = generateMoroccanSynthesisProblem(lessons, modelCode);
      const probExNum = currentExNum++;
      const probWeight = 42.5;
      const probQuestions: EvaluationQuestionRow[] = synthProb.parts.map(
        (part, pIdx) => {
          const lvl: "N1" | "N2" | "N3" =
            pIdx === 0 ? "N1" : pIdx === 1 ? "N2" : "N3";
          const row: EvaluationQuestionRow = {
            exerciseIndex: exercises.length,
            exerciseNumber: probExNum,
            exerciseTitleAr: synthProb.titleAr,
            exerciseTitleFr: synthProb.titleFr,
            subCategoryAr: "مسألة توليفية شاملة",
            subCategoryFr: "Problème de Synthèse",
            exerciseWeight: probWeight,
            exerciseTotalPoints: 8.5,
            questionIndex: pIdx,
            questionCode: `Prob-P${pIdx + 1}`,
            questionLabelAr: `مسألة - ج${pIdx + 1}`,
            questionLabelFr: `Prob - P${pIdx + 1}`,
            questionSnippetAr: part.partTitleAr,
            questionSnippetFr: part.partTitleFr,
            capacityAr:
              part.questionsAr[0]?.slice(0, 75) || "التوليف والنمذجة الرياضية",
            capacityFr:
              part.questionsFr[0]?.slice(0, 75) || "Synthèse et modélisation",
            levelCode: lvl,
            levelLabelAr:
              lvl === "N1"
                ? "تطبيق مباشر (N1)"
                : lvl === "N2"
                ? "تعبئة وتوليف (N2)"
                : "تعمق ومبادرة (N3)",
            levelLabelFr:
              lvl === "N1"
                ? "Application directe (N1)"
                : lvl === "N2"
                ? "Mobilisation (N2)"
                : "Initiative & P3 (N3)",
            boenCompetencyFr: "Chercher / Modéliser / Raisonner",
            points: Number(parseFloat(part.partPoints || "2.5").toFixed(2)),
          };
          allQuestions.push(row);
          return row;
        }
      );

      exercises.push({
        exerciseNumber: probExNum,
        titleAr: synthProb.titleAr,
        titleFr: synthProb.titleFr,
        subCategoryAr: "مسألة توليفية شاملة",
        subCategoryFr: "Problème de Synthèse",
        weight: probWeight,
        totalPoints: 8.5,
        questionCount: probQuestions.length,
        capacitiesAr: [
          "الربط بين التحليل والدوال والمتتاليات والتأويل الهندسي في وضعية مركبة",
        ],
        capacitiesFr: [
          "Articulation Analyse, Suites et Interprétation géométrique",
        ],
        questions: probQuestions,
      });
    }
  }

  const totalWeight = Number(
    exercises.reduce((acc, ex) => acc + ex.weight, 0).toFixed(1)
  );
  const totalPoints = Number(
    allQuestions.reduce((acc, q) => acc + q.points, 0).toFixed(2)
  );

  const titleAr = isDMModule
    ? isDM
      ? `شبكة التقويم والتفريغ المخصصة — الفرض المنزلي ${dmNumber} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})`
      : `شبكة تقويم التمكن من قدرات سلسلة التمارين ${dmNumber}`
    : `شبكة التقويم والتفريغ المخصصة — الفرض المحروس ${dsKey} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})`;

  const titleFr = isDMModule
    ? isDM
      ? `Grille d'Évaluation & Barème — Devoir Maison ${dmNumber} (${sem})`
      : `Grille d'Évaluation par Compétences — Série TD ${dmNumber} (${sem})`
    : `Grille d'Évaluation & Dépouillement — Devoir Surveillé ${dsKey} (${sem})`;

  return {
    titleAr,
    titleFr,
    subtitleAr: `${track.labelAr} · مجموع النقط: ${totalPoints}/20 · عدد التمارين: ${exercises.length} · عدد الأسئلة: ${allQuestions.length}`,
    subtitleFr: `${track.labelFr} · Barème : ${totalPoints}/20 · ${exercises.length} Exercices · ${allQuestions.length} Questions`,
    exercises,
    allQuestions,
    totalPoints,
    totalWeight,
  };
}

function escapeXml(unsafe: string): string {
  return String(unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface ExcelExportOptions {
  gridData: CustomEvaluationGridData;
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  docLang: DocLanguage;
  system: EducationSystem;
  granularity: GridGranularity;
  studentCount: number;
  customStudentNames?: string[];
  n1: number;
  n2: number;
  n3: number;
}

/**
 * يصدر شبكة التقويم المخصصة وشبكة تفريغ نقط القسم إلى ملف Excel رسمي (.xls SpreadsheetML)
 * يضم ورقتي عمل (2 Worksheets):
 * 1. شبكة التقويم التحليلية وسلم التنقيط حسب التمارين والأسئلة والقدرات
 * 2. شبكة تفريغ نقط التلاميذ مع المعادلات التلقائية (=SUM, =AVERAGE, =MAX, =MIN, =IF)
 */
export function exportEvaluationGridToExcel(options: ExcelExportOptions): void {
  const {
    gridData,
    school,
    prof,
    year,
    academy,
    direction,
    docLang,
    system,
    granularity,
    studentCount,
    customStudentNames = [],
    n1,
    n2,
    n3,
  } = options;

  const isMission = system === "MISSION_FRANCAISE";
  const isFr = docLang === "FR" || isMission;

  const sheet1Name = isFr
    ? "1_Grille_Analytique_Bareme"
    : "1_شبكة_التقويم_وسلم_التنقيط";
  const sheet2Name = isFr
    ? "2_Depouillement_Notes_Classe"
    : "2_تفريغ_نقط_القسم_والإحصائيات";

  // بناء صفوف الورقة الأولى: شبكة التقويم التحليلية حسب الأسئلة والقدرات
  const sheet1RowsXml = gridData.allQuestions
    .map(
      (q) => `
      <Row ss:AutoFitHeight="1" ss:Height="24">
        <Cell ss:StyleID="CellCenterBold"><Data ss:Type="String">${escapeXml(
          isFr ? `Exercice ${q.exerciseNumber}` : `التمرين ${q.exerciseNumber}`
        )}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXml(
          isFr ? q.exerciseTitleFr : q.exerciseTitleAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(
          isFr ? q.subCategoryFr : q.subCategoryAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellCenterBold"><Data ss:Type="String">${escapeXml(
          isFr ? q.questionLabelFr : q.questionLabelAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXml(
          isFr ? q.questionSnippetFr : q.questionSnippetAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXml(
          isFr ? q.capacityFr : q.capacityAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(
          isMission
            ? `${q.boenCompetencyFr} (${q.levelCode})`
            : isFr
            ? q.levelLabelFr
            : q.levelLabelAr
        )}</Data></Cell>
        <Cell ss:StyleID="CellNumberBold"><Data ss:Type="Number">${
          q.points
        }</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">[  ] A   [  ] EC   [  ] NA</Data></Cell>
      </Row>`
    )
    .join("");

  // بناء أعمدة وصفوف الورقة الثانية: شبكة تفريغ نقط التلاميذ
  const dynamicColumns =
    granularity === "BY_QUESTION"
      ? gridData.allQuestions.map((q) => ({
          code: isFr ? q.questionLabelFr : q.questionLabelAr,
          sub: `${q.points} pt`,
          maxPts: q.points,
        }))
      : gridData.exercises.map((ex) => ({
          code: isFr
            ? `Ex ${ex.exerciseNumber} (${ex.subCategoryFr})`
            : `تمرين ${ex.exerciseNumber} (${ex.subCategoryAr})`,
          sub: `${ex.totalPoints} pts`,
          maxPts: ex.totalPoints,
        }));

  const numScoreCols = dynamicColumns.length;
  const totalStudents = Math.max(5, Math.min(60, studentCount));

  const headerDynamicCellsXml = dynamicColumns
    .map(
      (col) =>
        `<Cell ss:StyleID="TableHeader"><Data ss:Type="String">${escapeXml(
          `${col.code} [/${col.maxPts}]`
        )}</Data></Cell>`
    )
    .join("");

  const maxPointsRowCellsXml = dynamicColumns
    .map(
      (col) =>
        `<Cell ss:StyleID="SubHeaderNumber"><Data ss:Type="Number">${col.maxPts}</Data></Cell>`
    )
    .join("");

  const studentRowsXml = Array.from({ length: totalStudents }, (_, idx) => {
    const sNum = idx + 1;
    const studentName =
      customStudentNames[idx]?.trim() ||
      (isFr
        ? `Élève ${String(sNum).padStart(2, "0")} — ................................`
        : `التلميذ(ة) ${String(sNum).padStart(2, "0")} — ................................`);

    const emptyScoreCells = dynamicColumns
      .map(() => `<Cell ss:StyleID="CellScoreInput"><Data ss:Type="Number">0</Data></Cell>`)
      .join("");

    // معادلة المجموع التلقائية =SUM(RC[-numScoreCols]:RC[-1])
    const sumFormula = `=SUM(RC[-${numScoreCols}]:RC[-1])`;
    // معادلة التقدير والقرار البيداغوجي =IF(...)
    const appreciationFormula = isFr
      ? `=IF(RC[-1]&gt;=14,&quot;Acquis (Très bien)&quot;,IF(RC[-1]&gt;=10,&quot;En cours d'acquisition&quot;,&quot;Non acquis (Remédiation)&quot;))`
      : `=IF(RC[-1]&gt;=14,&quot;متحكم جيداً (A)&quot;,IF(RC[-1]&gt;=10,&quot;في طور التحكم (EC)&quot;,&quot;غير متحكم - يحتاج لدعم (NA)&quot;))`;

    return `
      <Row ss:Height="20">
        <Cell ss:StyleID="CellCenterBold"><Data ss:Type="Number">${sNum}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXml(
          studentName
        )}</Data></Cell>
        ${emptyScoreCells}
        <Cell ss:StyleID="CellTotalFormula" ss:Formula="${sumFormula}"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="CellCenter" ss:Formula="${appreciationFormula}"><Data ss:Type="String"></Data></Cell>
      </Row>`;
  }).join("");

  // صفوف الإحصائيات التلقائية في أسفل الجدول (المعدل، أعلى نقطة، أدنى نقطة)
  const avgCellsXml = dynamicColumns
    .map(
      () =>
        `<Cell ss:StyleID="StatCell" ss:Formula="=AVERAGE(R[-${totalStudents}]C:R[-1]C)"><Data ss:Type="Number">0</Data></Cell>`
    )
    .join("");

  const maxCellsXml = dynamicColumns
    .map(
      () =>
        `<Cell ss:StyleID="StatCell" ss:Formula="=MAX(R[-${
          totalStudents + 1
        }]C:R[-2]C)"><Data ss:Type="Number">0</Data></Cell>`
    )
    .join("");

  const minCellsXml = dynamicColumns
    .map(
      () =>
        `<Cell ss:StyleID="StatCell" ss:Formula="=MIN(R[-${
          totalStudents + 2
        }]C:R[-3]C)"><Data ss:Type="Number">0</Data></Cell>`
    )
    .join("");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Arial" ss:Size="10" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="TitleBanner">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Arial" ss:Size="13" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubBanner">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1E1B4B"/>
   <Interior ss:Color="#E0E7FF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1E293B"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1E293B"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#312E81" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubHeaderNumber">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="0.00"/>
  </Style>
  <Style ss:ID="CellText">
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenterBold">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1E1B4B"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CellNumberBold">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="0.00"/>
  </Style>
  <Style ss:ID="CellScoreInput">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <NumberFormat ss:Format="0.00"/>
  </Style>
  <Style ss:ID="CellTotalFormula">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1E1B4B"/>
   <Interior ss:Color="#EEF2FF" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="0.00"/>
  </Style>
  <Style ss:ID="StatCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1E293B"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1E293B"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="0.00"/>
  </Style>
 </Styles>

 <!-- الورقة الأولى: شبكة التقويم التحليلية وسلم التنقيط المفصل -->
 <Worksheet ss:Name="${escapeXml(sheet1Name)}" ${
    isFr ? "" : 'ss:RightToLeft="1"'
  }>
  <Table>
   <Column ss:Width="90"/>
   <Column ss:Width="170"/>
   <Column ss:Width="110"/>
   <Column ss:Width="80"/>
   <Column ss:Width="240"/>
   <Column ss:Width="220"/>
   <Column ss:Width="130"/>
   <Column ss:Width="80"/>
   <Column ss:Width="140"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="8" ss:StyleID="TitleBanner"><Data ss:Type="String">${escapeXml(
      isFr ? gridData.titleFr : gridData.titleAr
    )}</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="8" ss:StyleID="SubBanner"><Data ss:Type="String">${escapeXml(
      `${school} · ${prof} · ${year} · ${
        isFr ? gridData.subtitleFr : gridData.subtitleAr
      }`
    )}</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="8" ss:StyleID="CellCenterBold"><Data ss:Type="String">${escapeXml(
      isMission
        ? `Répartition Taxonomique : Niveau N1 (${n1}%) · Niveau N2 (${n2}%) · Niveau N3 (${n3}%)`
        : `${academy} · ${direction} · المستويات المهارية (مذكرة 142-08): N1=${n1}% | N2=${n2}% | N3=${n3}%`
    )}</Data></Cell>
   </Row>
   <Row ss:Height="26">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Exercice" : "التمرين"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Chapitre / Unité" : "الدرس / المحور"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Domaine" : "التصنيف الفرعي"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Code Q." : "رمز السؤال"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Énoncé de la question" : "مضمون السؤال في الفرض"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Capacité attendue / Compétence" : "القدرة المنتظرة المستهدفة"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Niveau / Compétence" : "المستوى المهاري"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Barème (pts)" : "التنقيط (ن)"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Degré de maîtrise" : "درجة التحكم"
    }</Data></Cell>
   </Row>
   ${sheet1RowsXml}
   <Row ss:Height="25">
    <Cell ss:MergeAcross="6" ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Total Général du Barème (/20)" : "المجموع العام لسلم التنقيط (/20)"
    }</Data></Cell>
    <Cell ss:StyleID="CellNumberBold" ss:Formula="=SUM(R[-${
      gridData.allQuestions.length
    }]C:R[-1]C)"><Data ss:Type="Number">${gridData.totalPoints}</Data></Cell>
    <Cell ss:StyleID="CellCenterBold"><Data ss:Type="String">100%</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- الورقة الثانية: شبكة تفريغ نقط القسم والإحصائيات التلقائية -->
 <Worksheet ss:Name="${escapeXml(sheet2Name)}" ${
    isFr ? "" : 'ss:RightToLeft="1"'
  }>
  <Table>
   <Column ss:Width="45"/>
   <Column ss:Width="195"/>
   ${dynamicColumns.map(() => `<Column ss:Width="85"/>`).join("")}
   <Column ss:Width="95"/>
   <Column ss:Width="175"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="${
      numScoreCols + 3
    }" ss:StyleID="TitleBanner"><Data ss:Type="String">${escapeXml(
    isFr
      ? `Grille de Dépouillement des Notes — ${gridData.titleFr}`
      : `شبكة تفريغ نقط التلاميذ واستثمار النتائج — ${gridData.titleAr}`
  )}</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="${
      numScoreCols + 3
    }" ss:StyleID="SubBanner"><Data ss:Type="String">${escapeXml(
    `${school} · ${prof} · ${year} · ${
      isFr ? gridData.subtitleFr : gridData.subtitleAr
    }`
  )}</Data></Cell>
   </Row>
   <Row ss:Height="28">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "N°" : "ر.ت"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Nom et Prénom de l'élève" : "الاسم الكامل للتلميذ(ة)"
    }</Data></Cell>
    ${headerDynamicCellsXml}
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Note Finale /20" : "النقطة النهائية /20"
    }</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">${
      isFr ? "Degré de maîtrise & Décision" : "درجة التحكم وقرار الدعم"
    }</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="1" ss:StyleID="CellCenterBold"><Data ss:Type="String">${
      isFr ? "Barème Maximum par item :" : "السقف الأقصى للنقطة (سلم التنقيط):"
    }</Data></Cell>
    ${maxPointsRowCellsXml}
    <Cell ss:StyleID="SubHeaderNumber"><Data ss:Type="Number">${
      gridData.totalPoints
    }</Data></Cell>
    <Cell ss:StyleID="CellCenterBold"><Data ss:Type="String">${
      isFr ? "Seuil de maîtrise : 10/20" : "عتبة التحكم: 10/20"
    }</Data></Cell>
   </Row>
   ${studentRowsXml}
   <Row ss:Height="22">
    <Cell ss:MergeAcross="1" ss:StyleID="StatCell"><Data ss:Type="String">${
      isFr ? "Moyenne de la classe" : "معدل القسم في كل تمرين/سؤال"
    }</Data></Cell>
    ${avgCellsXml}
    <Cell ss:StyleID="StatCell" ss:Formula="=AVERAGE(R[-${totalStudents}]C:R[-1]C)"><Data ss:Type="Number">0</Data></Cell>
    <Cell ss:StyleID="StatCell"><Data ss:Type="String">${
      isFr ? "Moyenne Générale" : "المعدل العام للقسم"
    }</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="1" ss:StyleID="StatCell"><Data ss:Type="String">${
      isFr ? "Note Maximale" : "أعلى نقطة مسجلة"
    }</Data></Cell>
    ${maxCellsXml}
    <Cell ss:StyleID="StatCell" ss:Formula="=MAX(R[-${
      totalStudents + 1
    }]C:R[-2]C)"><Data ss:Type="Number">0</Data></Cell>
    <Cell ss:StyleID="StatCell"><Data ss:Type="String">Max</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="1" ss:StyleID="StatCell"><Data ss:Type="String">${
      isFr ? "Note Minimale" : "أدنى نقطة مسجلة"
    }</Data></Cell>
    ${minCellsXml}
    <Cell ss:StyleID="StatCell" ss:Formula="=MIN(R[-${
      totalStudents + 2
    }]C:R[-3]C)"><Data ss:Type="Number">0</Data></Cell>
    <Cell ss:StyleID="StatCell"><Data ss:Type="String">Min</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeTrack = options.gridData.subtitleFr
    .split("·")[0]
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  link.download = `Grille_Evaluation_${safeTrack}_${granularity}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * يصدر شبكة التقويم وتفريغ النقط بصيغة CSV متوافقة مع Excel و LibreOffice (مع UTF-8 BOM لدعم العربية والفرنسية)
 */
export function exportEvaluationGridToCSV(options: ExcelExportOptions): void {
  const { gridData, school, prof, year, docLang, system, granularity, studentCount } =
    options;
  const isFr = docLang === "FR" || system === "MISSION_FRANCAISE";

  const lines: string[] = [];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

  lines.push([esc(isFr ? gridData.titleFr : gridData.titleAr)].join(";"));
  lines.push([esc(`${school} - ${prof} - ${year}`)].join(";"));
  lines.push("");

  // القسم الأول: شبكة التقويم التحليلية
  lines.push(
    [
      esc(isFr ? "Exercice" : "التمرين"),
      esc(isFr ? "Chapitre" : "الدرس"),
      esc(isFr ? "Question" : "السؤال"),
      esc(isFr ? "Capacité ciblée" : "القدرة المستهدفة"),
      esc(isFr ? "Niveau" : "المستوى المهاري"),
      esc(isFr ? "Barème (pts)" : "التنقيط"),
    ].join(";")
  );

  gridData.allQuestions.forEach((q) => {
    lines.push(
      [
        esc(isFr ? `Ex ${q.exerciseNumber}` : `ت ${q.exerciseNumber}`),
        esc(isFr ? q.exerciseTitleFr : q.exerciseTitleAr),
        esc(isFr ? q.questionLabelFr : q.questionLabelAr),
        esc(isFr ? q.capacityFr : q.capacityAr),
        esc(isFr ? q.levelLabelFr : q.levelLabelAr),
        esc(q.points),
      ].join(";")
    );
  });

  lines.push("");
  // القسم الثاني: جدول تفريغ النقط
  const cols =
    granularity === "BY_QUESTION"
      ? gridData.allQuestions.map((q) => `${q.questionCode} (/${q.points})`)
      : gridData.exercises.map(
          (ex) => `Ex${ex.exerciseNumber} (/${ex.totalPoints})`
        );

  lines.push(
    [
      esc("N°"),
      esc(isFr ? "Nom & Prénom" : "الاسم والنسب"),
      ...cols.map(esc),
      esc(isFr ? "Total /20" : "المجموع /20"),
      esc(isFr ? "Observation" : "الملاحظة وقرار الدعم"),
    ].join(";")
  );

  for (let i = 1; i <= studentCount; i++) {
    lines.push(
      [
        esc(i),
        esc(isFr ? `Élève ${i}` : `التلميذ(ة) ${i}`),
        ...cols.map(() => ""),
        esc(""),
        esc(""),
      ].join(";")
    );
  }

  const csvWithBom = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Grille_Depouillement_${granularity}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 1. تكامل منظومة «مسار» و Pronote (استيراد وتصدير لوائح التلاميذ والنقط)
// ============================================================================
export interface MassarStudentEntry {
  massarCode: string;
  fullNameAr: string;
  fullNameFr: string;
  codeMassar?: string;
  nomFr?: string;
  nomAr?: string;
}

export const DEFAULT_MOROCCAN_CLASS_ROSTER: MassarStudentEntry[] = [
  { massarCode: "G134589012", fullNameAr: "أمين العلمي الإدريسي", fullNameFr: "EL ALAMI IDRISSI Amine" },
  { massarCode: "G138902145", fullNameAr: "سلمى بنجلون التويمي", fullNameFr: "BENJELLOUN Salma" },
  { massarCode: "K142098761", fullNameAr: "يوسف المنصوري", fullNameFr: "EL MANSOURI Youssef" },
  { massarCode: "R139045123", fullNameAr: "فاطمة الزهراء الناصري", fullNameFr: "EN-NASSIRI Fatima-Zahra" },
  { massarCode: "D135678904", fullNameAr: "المهدي الشرايبي", fullNameFr: "CHRAIBI El Mehdi" },
  { massarCode: "J140192837", fullNameAr: "آية بوعبيد", fullNameFr: "BOUABID Aya" },
  { massarCode: "F137812390", fullNameAr: "إلياس التازي", fullNameFr: "TAZI Ilyas" },
  { massarCode: "M136549087", fullNameAr: "مريم الفاسي الفهري", fullNameFr: "EL FASSI FIHRI Maryam" },
  { massarCode: "S131209485", fullNameAr: "حمزة السكوري", fullNameFr: "SEKKOURI Hamza" },
  { massarCode: "L139874512", fullNameAr: "هبة الله القادري", fullNameFr: "EL KADIRI Hibatallah" },
  { massarCode: "N134091827", fullNameAr: "عمر برادة", fullNameFr: "BERRADA Omar" },
  { massarCode: "H138761209", fullNameAr: "ياسمين أيت الطالب", fullNameFr: "AIT TALEB Yasmine" },
  { massarCode: "Z135490812", fullNameAr: "سعد الصقلي", fullNameFr: "SQALLI Saad" },
  { massarCode: "C132908471", fullNameAr: "ريم الخطابي", fullNameFr: "EL KHATTABI Rim" },
  { massarCode: "B139081234", fullNameAr: "زكرياء المرابط", fullNameFr: "EL MRABET Zakaria" },
];

export function parseMassarPronoteCSV(csvText: string): MassarStudentEntry[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);
  const parsed: MassarStudentEntry[] = [];

  rows.forEach((row, idx) => {
    const clean = row.replace(/^"|"$/g, "");
    const parts = clean.split(/[;,\t]/).map((p) => p.replace(/^"|"$/g, "").trim());
    if (parts.length >= 2) {
      const first = parts[0];
      const second = parts[1];
      const isHeader =
        first.toLowerCase().includes("massar") ||
        first.toLowerCase().includes("code") ||
        first.includes("مسار") ||
        first.includes("الرقم") ||
        second.toLowerCase().includes("nom");
      if (isHeader) return;

      const hasMassarPattern = /^[A-Z]\d{6,10}$/i.test(first);
      const code = hasMassarPattern ? first.toUpperCase() : `G13900${String(idx + 1).padStart(4, "0")}`;
      const name = hasMassarPattern ? second : `${first} ${second}`.trim();
      if (name.length > 1) {
        parsed.push({
          massarCode: code,
          fullNameAr: name,
          fullNameFr: name,
        });
      }
    }
  });

  return parsed.length > 0 ? parsed : DEFAULT_MOROCCAN_CLASS_ROSTER;
}

export function exportMassarPronoteGradeSheet(
  options: ExcelExportOptions & { customStudents?: MassarStudentEntry[]; dsKey?: string; semester?: string }
): void {
  const {
    gridData,
    school,
    prof,
    year,
    docLang,
    system,
    granularity,
    studentCount,
    customStudents,
    dsKey = "DS1",
    semester = "S1",
  } = options;
  const isFr = docLang === "FR" || system === "MISSION_FRANCAISE";
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

  const lines: string[] = [];
  lines.push(
    [
      esc(isFr ? "Royaume du Maroc - MENPS (Import Massar / Pronote)" : "المملكة المغربية - وزارة التربية الوطنية (قالب استيراد النقط مسار / Pronote)"),
      esc(`${school} | ${prof} | ${year}`),
      esc(`${semester} - ${dsKey}`),
    ].join(";")
  );
  lines.push("");

  const detailCols =
    granularity === "BY_QUESTION"
      ? gridData.allQuestions.map((q) => `${q.questionCode} [/${q.points}]`)
      : gridData.exercises.map((ex) => `Ex${ex.exerciseNumber} [/${ex.totalPoints}]`);

  lines.push(
    [
      esc("N°"),
      esc(isFr ? "Code Massar / INE" : "رقم مسار (Code Massar)"),
      esc(isFr ? "Nom et Prénom de l'Élève" : "الاسم الكامل للتلميذ(ة)"),
      ...detailCols.map(esc),
      esc(isFr ? `Note ${dsKey} /20` : `نقطة الفرض (${dsKey}) /20`),
      esc(isFr ? "Appréciation Pédagogique (Massar/Pronote)" : "التقدير التربوي لمسار ( الملاحظة )"),
    ].join(";")
  );

  const roster =
    customStudents && customStudents.length > 0
      ? customStudents
      : DEFAULT_MOROCCAN_CLASS_ROSTER.slice(0, Math.max(5, studentCount));

  roster.forEach((st, idx) => {
    lines.push(
      [
        esc(idx + 1),
        esc(st.massarCode),
        esc(isFr ? st.fullNameFr : st.fullNameAr),
        ...detailCols.map(() => ""),
        esc(""),
        esc(
          isFr
            ? "Travail sérieux / À consolider selon le barème"
            : "عمل جاد / يحتاج لدعم في القدرات غير المتحكم فيها"
        ),
      ].join(";")
    );
  });

  const csvWithBom = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Massar_Pronote_Notes_${semester}_${dsKey}_${year}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * تصدير بوابة مسار الرسمية بصيغة مصنف Excel المنسق (.xls XML Spreadsheet)
 * يتضمن: لائحة مسار الرسمية + توزيع نقط المهارات (N1/N2/N3) + المؤشرات الإحصائية للقسم (المعدل، الانحراف الطرازي، نسبة التحكم) + قرار الدعم التربوي
 */
export function exportMassarExcelXmlWorkbook(options: {
  school: string;
  prof: string;
  year: string;
  trackLabel: string;
  semester?: string;
  dsKey?: string;
  students?: Array<{
    cne: string;
    fullNameAr: string;
    fullNameFr: string;
    grade20: number;
    n1Mastery?: string;
    n2Mastery?: string;
    n3Mastery?: string;
    observation?: string;
  }>;
}): void {
  const {
    school,
    prof,
    year,
    trackLabel,
    semester = "S1",
    dsKey = "DS1",
    students,
  } = options;

  const activeList =
    students && students.length > 0
      ? students
      : DEFAULT_MOROCCAN_CLASS_ROSTER.map((st, idx) => {
          const sampleGrades = [17.5, 14.25, 11.5, 8.75, 16.0, 12.5, 9.25, 18.25, 13.0, 7.5, 15.25, 10.5, 14.0, 11.75, 16.5];
          const g = sampleGrades[idx % sampleGrades.length];
          return {
            cne: st.massarCode,
            fullNameAr: st.fullNameAr,
            fullNameFr: st.fullNameFr,
            grade20: g,
            n1Mastery: g >= 10 ? "مكتسبة (A)" : "في طور الاكتساب (ECA)",
            n2Mastery: g >= 12 ? "مكتسبة (A)" : g >= 9 ? "في طور الاكتساب (ECA)" : "غير مكتسبة (NA)",
            n3Mastery: g >= 15 ? "مكتسبة (A)" : g >= 11 ? "في طور الاكتساب (ECA)" : "غير مكتسبة (NA)",
            observation:
              g >= 16
                ? "تميز واضح في الاستدلال والتوليف الرياضي — يُوجه لأنشطة الأولمبياد"
                : g >= 12
                ? "تحكم جيد في القدرات الأساسية؛ يُنصح بتعميق أسئلة التوليف N3"
                : g >= 10
                ? "متوسط؛ يحتاج إلى تثبيت تقنيات الحساب والاشتقاق (المستوى N2)"
                : "متعثر؛ مُدرج ضمن فوج الدعم التربوي الفردي في الأساسيات N1",
          };
        });

  const grades = activeList.map((s) => s.grade20);
  const count = Math.max(1, grades.length);
  const mean = grades.reduce((a, b) => a + b, 0) / count;
  const variance = grades.reduce((acc, g) => acc + Math.pow(g - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);
  const maxGrade = Math.max(...grades);
  const minGrade = Math.min(...grades);
  const passedCount = grades.filter((g) => g >= 10).length;
  const masteryRate = Math.round((passedCount / count) * 100);

  const xmlEsc = (s: string | number) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const rowsXml = activeList
    .map(
      (st, idx) => `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.cne)}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.fullNameAr)}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.fullNameFr)}</Data></Cell>
        <Cell><Data ss:Type="Number">${st.grade20.toFixed(2)}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.n1Mastery || "A")}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.n2Mastery || "ECA")}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.n3Mastery || "ECA")}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(
          st.grade20 >= 10 ? "متحكم — تعميق" : "يحتاج دعماً فردياً (Fiche N1/N2)"
        )}</Data></Cell>
        <Cell><Data ss:Type="String">${xmlEsc(st.observation || "")}</Data></Cell>
      </Row>`
    )
    .join("");

  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Massar_${xmlEsc(semester)}_${xmlEsc(dsKey)}">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">المملكة المغربية — وزارة التربية الوطنية والتعليم الأولي والرياضة (بوابة مسار الرسمية)</Data></Cell>
    <Cell><Data ss:Type="String">المؤسسة: ${xmlEsc(school)}</Data></Cell>
    <Cell><Data ss:Type="String">الأستاذ(ة): ${xmlEsc(prof)}</Data></Cell>
    <Cell><Data ss:Type="String">القسم/المسلك: ${xmlEsc(trackLabel)} (${xmlEsc(year)})</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">المؤشرات الإحصائية للقسم (Note 142-08)</Data></Cell>
    <Cell><Data ss:Type="String">المعدل العام: ${mean.toFixed(2)} / 20</Data></Cell>
    <Cell><Data ss:Type="String">الانحراف الطرازي: σ = ${stdDev.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">نسبة التحكم (≥10/20): ${masteryRate}% (${passedCount}/${count})</Data></Cell>
    <Cell><Data ss:Type="String">أعلى نقطة: ${maxGrade.toFixed(2)} | أدنى نقطة: ${minGrade.toFixed(2)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">الرقم الترتيبي</Data></Cell>
    <Cell><Data ss:Type="String">رقم مسار (Code Massar / CNE)</Data></Cell>
    <Cell><Data ss:Type="String">الاسم الكامل بالعربية</Data></Cell>
    <Cell><Data ss:Type="String">Nom et Prénom (FR)</Data></Cell>
    <Cell><Data ss:Type="String">النقطة النهائية /20 (${xmlEsc(dsKey)})</Data></Cell>
    <Cell><Data ss:Type="String">تملك مهارات N1 (35%)</Data></Cell>
    <Cell><Data ss:Type="String">تملك مهارات N2 (45%)</Data></Cell>
    <Cell><Data ss:Type="String">تملك مهارات N3 (20%)</Data></Cell>
    <Cell><Data ss:Type="String">قرار الدعم والمعالجة التربوية</Data></Cell>
    <Cell><Data ss:Type="String">ملاحظة مسار والتوجيه البيداغوجي</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([workbookXml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Massar_Gateway_${semester}_${dsKey}_${year}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 2. مُحاكي التوازن الزمني الحقيقي (قاعدة: زمن المترشح = 3 × زمن الأستاذ)
// ============================================================================
export interface ExamTimeSimulationResult {
  officialMinutes: number;
  teacherMinutes: number;
  estimatedStudentMinutes: number;
  reviewBufferMinutes: number;
  occupancyRatioPercent: number;
  status: "OPTIMAL" | "DENSE" | "OVERLOAD" | "SHORT";
  labelAr: string;
  labelFr: string;
  adviceAr: string;
  adviceFr: string;
}

export function calculateExamTimeBalance(params: {
  durationStr: string;
  questions: EvaluationQuestionRow[];
  hasQcm?: boolean;
  hasSynthesisProblem?: boolean;
}): ExamTimeSimulationResult {
  const { durationStr, questions, hasQcm = false, hasSynthesisProblem = false } = params;
  const officialMinutes = durationStr.includes("4")
    ? 240
    : durationStr.includes("3")
    ? 180
    : durationStr.includes("2")
    ? 120
    : 60;

  let teacherMins = 0;
  questions.forEach((q) => {
    if (q.levelCode === "N1") teacherMins += 1.3;
    else if (q.levelCode === "N2") teacherMins += 2.4;
    else teacherMins += 4.0;
  });

  if (questions.length === 0) {
    teacherMins = officialMinutes / 3.4;
  } else {
    if (hasQcm && !questions.some((q) => q.questionCode.includes("QCM"))) {
      teacherMins += 4.5;
    }
    if (hasSynthesisProblem && !questions.some((q) => q.questionCode.includes("Prob"))) {
      teacherMins += 10.5;
    }
  }

  const reviewBufferMinutes = Math.max(5, Math.round(officialMinutes * 0.08));
  const estimatedStudentMinutes = Math.round(teacherMins * 3 + reviewBufferMinutes);
  const occupancyRatioPercent = Math.round((estimatedStudentMinutes / officialMinutes) * 100);

  let status: ExamTimeSimulationResult["status"] = "OPTIMAL";
  let labelAr = "متوازن زمنياً (مثالي للحصيص الرسمي)";
  let labelFr = "Équilibre temporel optimal (Conforme BO/142-08)";
  let adviceAr = "زمن إنجاز التلميذ التقديري (3 × زمن الأستاذ + المراجعة) يتناسب تماماً مع مدة الفرض.";
  let adviceFr = "Le temps candidat estimé (3 × temps prof + relecture) correspond idéalement à la durée officielle.";

  if (occupancyRatioPercent > 112) {
    status = "OVERLOAD";
    labelAr = "تجاوز زمني (فرض طويل مقارنة بالحصيص)";
    labelFr = "Surcharge temporelle (> 112% du temps officiel)";
    adviceAr = "يُنصح بتخفيف كثافة الأسئلة إلى النمط القياسي (Standard) أو تقليص نسبة أسئلة التوليف N3.";
    adviceFr = "Conseil : Réduire la densité des questions en mode Standard ou alléger les questions N3.";
  } else if (occupancyRatioPercent > 98) {
    status = "DENSE";
    labelAr = "كثافة عالية (مناسب للأقسام المتميزة SM/PC)";
    labelFr = "Épreuve dense (Adaptée aux classes d'excellence)";
    adviceAr = "الموضوع غني ويستثمر كامل زمن الحصة؛ يُستحسن إضافة تلميحات استمرارية البحث (Coup de pouce).";
    adviceFr = "Sujet exigeant couvrant 100% du temps ; pensez à activer les indices Coup de pouce.";
  } else if (occupancyRatioPercent < 68) {
    status = "SHORT";
    labelAr = "موضوع قصير نسبياً (أقل من الحصيص الرسمي)";
    labelFr = "Sujet court (< 70% de la durée allouée)";
    adviceAr = "يمكنك رفع كثافة الأسئلة إلى النمط المكثف (Intensive) أو إرفاق مسألة توليفية.";
    adviceFr = "Vous pouvez passer en densité Intensive ou ajouter un problème de synthèse.";
  }

  return {
    officialMinutes,
    teacherMinutes: Number(teacherMins.toFixed(1)),
    estimatedStudentMinutes,
    reviewBufferMinutes,
    occupancyRatioPercent,
    status,
    labelAr,
    labelFr,
    adviceAr,
    adviceFr,
  };
}

// ============================================================================
// 3. مكتبة الأشكال الهندسية والمنحنيات المعلمية الجاهزة للباكالوريا (SVG + TikZ)
// ============================================================================
export interface BacCertifiedCurvePreset {
  id: string;
  badge: string;
  titleAr: string;
  titleFr: string;
  captionAr: string;
  captionFr: string;
  svgDataUrl: string;
  tikzCode: string;
}

function encodeSvgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const BAC_CERTIFIED_CURVE_PRESETS: BacCertifiedCurvePreset[] = [
  {
    id: "BAC_LN_ASYMPTOTE",
    badge: "Analyse · ln(x)",
    titleAr: "منحنى الدالة اللوغاريتمية C_f والمقارب المائل (D): y = x - 1",
    titleFr: "Courbe C_f : f(x) = x - 1 + ln(x)/x & Asymptote oblique (D)",
    captionAr: "الشكل 1: التمثيل المبياني للدالة f(x) = x - 1 + ln(x)/x ومقاربها المائل (D): y = x - 1 في معلم متعامد ممنظم (O, i, j).",
    captionFr: "Figure 1 : Courbe représentative (C_f) de f(x) = x - 1 + ln(x)/x et son asymptote oblique (D) : y = x - 1 dans un repère orthonormé.",
    svgDataUrl: encodeSvgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" width="520" height="340">
        <rect width="520" height="340" fill="#ffffff" rx="10"/>
        <g stroke="#e2e8f0" stroke-width="1">
          <line x1="40" y1="40" x2="480" y2="40"/><line x1="40" y1="90" x2="480" y2="90"/>
          <line x1="40" y1="140" x2="480" y2="140"/><line x1="40" y1="190" x2="480" y2="190"/>
          <line x1="40" y1="240" x2="480" y2="240"/><line x1="40" y1="290" x2="480" y2="290"/>
          <line x1="90" y1="20" x2="90" y2="320"/><line x1="140" y1="20" x2="140" y2="320"/>
          <line x1="190" y1="20" x2="190" y2="320"/><line x1="240" y1="20" x2="240" y2="320"/>
          <line x1="290" y1="20" x2="290" y2="320"/><line x1="340" y1="20" x2="340" y2="320"/>
          <line x1="390" y1="20" x2="390" y2="320"/><line x1="440" y1="20" x2="440" y2="320"/>
        </g>
        <!-- Axes -->
        <line x1="30" y1="240" x2="495" y2="240" stroke="#0f172a" stroke-width="1.8"/>
        <polygon points="495,240 486,235 486,245" fill="#0f172a"/>
        <line x1="90" y1="325" x2="90" y2="20" stroke="#0f172a" stroke-width="1.8"/>
        <polygon points="90,20 85,29 95,29" fill="#0f172a"/>
        <!-- Vectors i, j -->
        <line x1="90" y1="240" x2="140" y2="240" stroke="#0284c7" stroke-width="2.5"/>
        <line x1="90" y1="240" x2="90" y2="190" stroke="#0284c7" stroke-width="2.5"/>
        <text x="74" y="255" font-family="serif" font-size="13" font-weight="bold" fill="#0f172a">O</text>
        <text x="112" y="256" font-family="serif" font-style="italic" font-size="13" fill="#0284c7">i</text>
        <text x="74" y="218" font-family="serif" font-style="italic" font-size="13" fill="#0284c7">j</text>
        <text x="480" y="258" font-family="serif" font-style="italic" font-size="14" fill="#0f172a">x</text>
        <text x="100" y="32" font-family="serif" font-style="italic" font-size="14" fill="#0f172a">y</text>
        <!-- Oblique Asymptote y = x - 1 -->
        <line x1="90" y1="290" x2="440" y2="40" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6,4"/>
        <text x="365" y="65" font-family="serif" font-size="12" font-weight="bold" fill="#dc2626">(D) : y = x - 1</text>
        <!-- Curve f(x) = x - 1 + ln(x)/x -->
        <path d="M 105,318 C 115,285 125,255 140,240 C 165,212 200,180 250,148 C 310,110 375,72 440,32" fill="none" stroke="#1e3a8a" stroke-width="2.8"/>
        <circle cx="140" cy="240" r="4" fill="#1e3a8a"/>
        <text x="142" y="256" font-family="serif" font-size="12" font-weight="bold" fill="#1e3a8a">A(1, 0)</text>
        <text x="275" y="122" font-family="serif" font-weight="bold" font-size="15" fill="#1e3a8a">(C_f)</text>
      </svg>
    `),
    tikzCode: `\\begin{tikzpicture}[scale=1.05]
  \\draw[very thin,color=gray!30] (0,-2) grid (6,4);
  \\draw[-stealth,thick] (-0.5,0) -- (6.2,0) node[below] {$x$};
  \\draw[-stealth,thick] (0,-2.2) -- (0,4.2) node[left] {$y$};
  \\draw[dashed,red,thick] (0,-1) -- (5,4) node[pos=0.85,below right] {$(\\Delta): y=x-1$};
  \\draw[domain=0.35:5.2,smooth,variable=\\x,blue!80!black,very thick] plot ({\\x},{\\x - 1 + ln(\\x)/\\x});
  \\filldraw[blue!80!black] (1,0) circle (1.8pt) node[below right] {$A(1;0)$};
  \\node[blue!80!black,above left] at (3.2,2.6) {$(\\mathcal{C}_f)$};
\\end{tikzpicture}`,
  },
  {
    id: "BAC_EXP_INFLEXION",
    badge: "Analyse · exp(x)",
    titleAr: "منحنى الدالة الأسية C_f: f(x) = (x - 1)e^x + 1 والمقارب الأفقي y = 1",
    titleFr: "Courbe Exponentielle C_f : f(x) = (x - 1)e^x + 1 & Asymptote y = 1",
    captionAr: "الشكل 2: التمثيل المبياني للدالة الأسية f(x) = (x - 1)e^x + 1 مع المقارب الأفقي y = 1 بجوار -∞ والمماس في الصفر.",
    captionFr: "Figure 2 : Courbe représentative (C_f) de f(x) = (x - 1)e^x + 1 avec asymptote horizontale y = 1 en -∞.",
    svgDataUrl: encodeSvgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" width="520" height="340">
        <rect width="520" height="340" fill="#ffffff" rx="10"/>
        <g stroke="#e2e8f0" stroke-width="1">
          <line x1="40" y1="50" x2="480" y2="50"/><line x1="40" y1="100" x2="480" y2="100"/>
          <line x1="40" y1="150" x2="480" y2="150"/><line x1="40" y1="200" x2="480" y2="200"/>
          <line x1="40" y1="250" x2="480" y2="250"/><line x1="40" y1="300" x2="480" y2="300"/>
          <line x1="100" y1="20" x2="100" y2="320"/><line x1="160" y1="20" x2="160" y2="320"/>
          <line x1="220" y1="20" x2="220" y2="320"/><line x1="280" y1="20" x2="280" y2="320"/>
          <line x1="340" y1="20" x2="340" y2="320"/><line x1="400" y1="20" x2="400" y2="320"/>
        </g>
        <!-- Axes -->
        <line x1="30" y1="200" x2="495" y2="200" stroke="#0f172a" stroke-width="1.8"/>
        <polygon points="495,200 486,195 486,205" fill="#0f172a"/>
        <line x1="280" y1="325" x2="280" y2="20" stroke="#0f172a" stroke-width="1.8"/>
        <polygon points="280,20 275,29 285,29" fill="#0f172a"/>
        <!-- Horizontal Asymptote y = 1 -->
        <line x1="35" y1="150" x2="485" y2="150" stroke="#059669" stroke-width="1.7" stroke-dasharray="6,4"/>
        <text x="50" y="142" font-family="serif" font-size="12" font-weight="bold" fill="#059669">y = 1 (Asymptote en -∞)</text>
        <!-- Curve -->
        <path d="M 40,154 C 110,158 175,180 220,192 C 250,200 265,200 280,200 C 305,200 328,175 340,150 C 358,110 375,65 390,25" fill="none" stroke="#7c3aed" stroke-width="2.8"/>
        <circle cx="280" cy="200" r="4" fill="#7c3aed"/>
        <circle cx="340" cy="150" r="4" fill="#dc2626"/>
        <text x="262" y="217" font-family="serif" font-size="12" font-weight="bold" fill="#0f172a">O(0,0)</text>
        <text x="348" y="154" font-family="serif" font-size="12" font-weight="bold" fill="#dc2626">B(1, 1)</text>
        <text x="392" y="52" font-family="serif" font-weight="bold" font-size="15" fill="#7c3aed">(C_f)</text>
      </svg>
    `),
    tikzCode: `\\begin{tikzpicture}[scale=1.05]
  \\draw[very thin,color=gray!30] (-4,-1) grid (2.5,4);
  \\draw[-stealth,thick] (-4.2,0) -- (2.7,0) node[below] {$x$};
  \\draw[-stealth,thick] (0,-1.2) -- (0,4.2) node[left] {$y$};
  \\draw[dashed,emerald!70!black,thick] (-4,1) -- (2.5,1) node[pos=0.2,above] {$y=1$};
  \\draw[domain=-4:1.65,smooth,variable=\\x,violet!85!black,very thick] plot ({\\x},{(\\x - 1)*exp(\\x) + 1});
  \\filldraw[red] (0,0) circle (1.8pt) node[below left] {$O$};
  \\node[violet!85!black,right] at (1.5,2.8) {$(\\mathcal{C}_f)$};
\\end{tikzpicture}`,
  },
  {
    id: "BAC_SUITE_ESCALIER",
    badge: "Suites · u_{n+1}=f(u_n)",
    titleAr: "المتتالية الترجعية u_{n+1} = f(u_n) مع المنصف الأول (Δ): y = x والدرج",
    titleFr: "Suite récurrente u_{n+1} = f(u_n), bissectrice y = x et escalier",
    captionAr: "الشكل 3: التمثيل المبياني للمتتالية الترجعية u_{n+1} = f(u_n) وتقارب حدودها نحو النقطة الصامدة α تقاطع (C_f) والمنصف الأول (Δ): y = x.",
    captionFr: "Figure 3 : Construction en escalier des termes de la suite u_{n+1} = f(u_n) convergeant vers le point fixe α.",
    svgDataUrl: encodeSvgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" width="520" height="340">
        <rect width="520" height="340" fill="#ffffff" rx="10"/>
        <g stroke="#e2e8f0" stroke-width="1">
          <line x1="60" y1="40" x2="460" y2="40"/><line x1="60" y1="90" x2="460" y2="90"/>
          <line x1="60" y1="140" x2="460" y2="140"/><line x1="60" y1="190" x2="460" y2="190"/>
          <line x1="60" y1="240" x2="460" y2="240"/><line x1="60" y1="290" x2="460" y2="290"/>
          <line x1="130" y1="30" x2="130" y2="300"/><line x1="200" y1="30" x2="200" y2="300"/>
          <line x1="270" y1="30" x2="270" y2="300"/><line x1="340" y1="30" x2="340" y2="300"/>
          <line x1="410" y1="30" x2="410" y2="300"/>
        </g>
        <!-- Axes -->
        <line x1="50" y1="290" x2="480" y2="290" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="60" y1="305" x2="60" y2="25" stroke="#0f172a" stroke-width="1.8"/>
        <!-- Line y = x -->
        <line x1="60" y1="290" x2="410" y2="40" stroke="#475569" stroke-width="1.6" stroke-dasharray="5,4"/>
        <text x="360" y="55" font-family="serif" font-size="12" font-weight="bold" fill="#334155">(Δ) : y = x</text>
        <!-- Concave curve f(x) -->
        <path d="M 60,235 Q 210,115 430,72" fill="none" stroke="#0284c7" stroke-width="2.8"/>
        <!-- Staircase u0 -> u1 -> u2 -> alpha -->
        <polyline points="110,290 110,202 233,202 233,138 322,138 322,106 365,106" fill="none" stroke="#e11d48" stroke-width="1.8"/>
        <line x1="233" y1="202" x2="233" y2="290" stroke="#e11d48" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="322" y1="138" x2="322" y2="290" stroke="#e11d48" stroke-width="1" stroke-dasharray="3,3"/>
        <circle cx="368" cy="103" r="4.5" fill="#16a34a"/>
        <text x="103" y="308" font-family="serif" font-size="12" font-weight="bold" fill="#e11d48">u_0</text>
        <text x="226" y="308" font-family="serif" font-size="12" font-weight="bold" fill="#e11d48">u_1</text>
        <text x="315" y="308" font-family="serif" font-size="12" font-weight="bold" fill="#e11d48">u_2</text>
        <text x="364" y="92" font-family="serif" font-size="12" font-weight="bold" fill="#16a34a">α (Point fixe)</text>
        <text x="415" y="92" font-family="serif" font-weight="bold" font-size="14" fill="#0284c7">(C_f)</text>
      </svg>
    `),
    tikzCode: `\\begin{tikzpicture}[scale=1.1]
  \\draw[-stealth,thick] (-0.2,0) -- (5.2,0) node[below] {$x$};
  \\draw[-stealth,thick] (0,-0.2) -- (0,4.2) node[left] {$y$};
  \\draw[dashed,gray!80!black,thick] (0,0) -- (4,4) node[above right] {$(\\Delta): y=x$};
  \\draw[domain=0:4.6,smooth,variable=\\x,cyan!70!blue,very thick] plot ({\\x},{sqrt(3*\\x + 1)});
  \\draw[red,thick] (0.5,0) -- (0.5,1.58) -- (1.58,1.58) -- (1.58,2.39) -- (2.39,2.39) -- (2.39,2.86);
  \\node[below,red] at (0.5,0) {$u_0$};
  \\node[below,red] at (1.58,0) {$u_1$};
  \\node[below,red] at (2.39,0) {$u_2$};
\\end{tikzpicture}`,
  },
  {
    id: "BAC_COMPLEX_CIRCLE",
    badge: "Nombres Complexes · (O, u, v)",
    titleAr: "المستوى العقدي (O, u, v): الدائرة المثلثية، النقط A, B, C والمثلث المتساوي الأضلاع",
    titleFr: "Plan Complexe (O, u, v) : Cercle trigonométrique, affixes z_A, z_B, z_C",
    captionAr: "الشكل 4: تمثيل النقط A(z_A) و B(z_B) و C(z_C) في المستوى العقدي المنسوب لمعلم متعامد ممنظم مباشر (O, u, v).",
    captionFr: "Figure 4 : Représentation des points A(z_A), B(z_B) et C(z_C) dans le plan complexe rapporté au repère orthonormé direct (O, u, v).",
    svgDataUrl: encodeSvgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" width="520" height="340">
        <rect width="520" height="340" fill="#ffffff" rx="10"/>
        <!-- Axes -->
        <line x1="60" y1="170" x2="460" y2="170" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="260" y1="320" x2="260" y2="20" stroke="#0f172a" stroke-width="1.8"/>
        <!-- Trigonometric circle -->
        <circle cx="260" cy="170" r="110" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="5,3"/>
        <!-- Equilateral / Isocele Triangle A, B, C -->
        <polygon points="355,115 355,225 150,170" fill="rgba(14, 165, 233, 0.1)" stroke="#1e3a8a" stroke-width="2.2"/>
        <circle cx="355" cy="115" r="4.5" fill="#dc2626"/>
        <circle cx="355" cy="225" r="4.5" fill="#dc2626"/>
        <circle cx="150" cy="170" r="4.5" fill="#16a34a"/>
        <text x="364" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#dc2626">A(z_A = e^{iπ/6})</text>
        <text x="364" y="235" font-family="serif" font-size="13" font-weight="bold" fill="#dc2626">B(z_B = e^{-iπ/6})</text>
        <text x="95" y="162" font-family="serif" font-size="13" font-weight="bold" fill="#16a34a">C(z_C = -1)</text>
        <text x="245" y="186" font-family="serif" font-size="13" font-weight="bold" fill="#0f172a">O</text>
        <text x="440" y="188" font-family="serif" font-size="13" font-weight="bold" fill="#0f172a">Re(z)</text>
        <text x="268" y="34" font-family="serif" font-size="13" font-weight="bold" fill="#0f172a">Im(z)</text>
      </svg>
    `),
    tikzCode: `\\begin{tikzpicture}[scale=2]
  \\draw[-stealth,thick] (-1.4,0) -- (1.4,0) node[below] {$\\text{Re}(z)$};
  \\draw[-stealth,thick] (0,-1.3) -- (0,1.3) node[left] {$\\text{Im}(z)$};
  \\draw[dashed,cyan!70!blue,thick] (0,0) circle (1);
  \\coordinate (A) at (30:1);
  \\coordinate (B) at (-30:1);
  \\coordinate (C) at (180:1);
  \\draw[thick,blue!80!black,fill=cyan!10] (A) -- (B) -- (C) -- cycle;
  \\filldraw[red] (A) circle (1pt) node[above right] {$A(z_A)$};
  \\filldraw[red] (B) circle (1pt) node[below right] {$B(z_B)$};
  \\filldraw[teal] (C) circle (1pt) node[above left] {$C(z_C)$};
\\end{tikzpicture}`,
  },
];

