import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Eye } from "lucide-react";
import { SpaceGeometry3DPresetType } from "../utils/mathjsValidator";

export interface Interactive3DSpaceCanvasProps {
  presetType: SpaceGeometry3DPresetType;
  paramA: number; // e.g. R for sphere or side a for cube
  paramB: number; // e.g. distance d for sphere or height h for pyramid
  showSection?: boolean;
  planeEquation?: string;
}

export const Interactive3DSpaceCanvas: React.FC<Interactive3DSpaceCanvasProps> = ({
  presetType,
  paramA,
  paramB,
  showSection = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // زوايا دوران الكاميرا
  const [rotX, setRotX] = useState<number>(0.45); // Elevation
  const [rotY, setRotY] = useState<number>(-0.65); // Azimuth
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // تفاعل الفأرة واللمس للتدوير ثلاثي الأبعاد
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev + dy * 0.01)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // تفاعل اللمس للشاشات واللوحات الذكية (Touch on Tablet/Mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev + dy * 0.01)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // إعادة ضبط زاوية الرؤية
  const handleResetCamera = () => {
    setRotX(0.45);
    setRotY(-0.65);
    setZoom(1.0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const scale = 38 * zoom;

    // مسح وتعبئة الخلفية
    ctx.clearRect(0, 0, width, height);

    // شبكة خلفية لطيفة
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    // دالة الإسقاط ثلاثي الأبعاد مع مصفوفة الدوران
    const project = (x: number, y: number, z: number): { px: number; py: number; depth: number } => {
      // دوران حول محور Y (Azimuth)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // دوران حول محور X (Elevation)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // إسقاط متوازي أو منظوري بسيط
      const fov = 600;
      const pScale = fov / (fov + z2 * 12);
      const px = cx + x1 * scale * pScale;
      const py = cy - y2 * scale * pScale;

      return { px, py, depth: z2 };
    };

    // رسم المحاور المتعامدة الممنظمة (O, i, j, k)
    const o = project(0, 0, 0);
    const axX = project(3.5, 0, 0);
    const axY = project(0, 3.5, 0);
    const axZ = project(0, 0, 3.5);

    ctx.lineWidth = 1.5;

    // محور X (أحمر)
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axX.px, axX.py);
    ctx.stroke();

    // محور Y (أخضر)
    ctx.strokeStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axY.px, axY.py);
    ctx.stroke();

    // محور Z (أزرق)
    ctx.strokeStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axZ.px, axZ.py);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("x", axX.px + 4, axX.py);
    ctx.fillText("y", axY.px + 4, axY.py);
    ctx.fillText("z", axZ.px + 4, axZ.py);

    if (presetType === "SPHERE_PLANE") {
      const R = Math.max(1, paramA);
      const d = Math.min(R - 0.2, Math.max(0, paramB));
      const rCircle = Math.sqrt(Math.max(0, R * R - d * d));

      // 1. رسم دوائر خطوط العرض والطول للفلكة (S)
      ctx.lineWidth = 1;
      const latSteps = 6;
      for (let i = -latSteps + 1; i < latSteps; i++) {
        const phi = (i / latSteps) * (Math.PI / 2);
        const rLat = R * Math.cos(phi);
        const yLat = R * Math.sin(phi);

        ctx.strokeStyle = i === 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(148, 163, 184, 0.15)";
        ctx.beginPath();
        const segments = 36;
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * 2 * Math.PI;
          const pt = project(rLat * Math.cos(theta), yLat, rLat * Math.sin(theta));
          if (j === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }

      // خطوط الطول
      const lonSteps = 8;
      for (let i = 0; i < lonSteps; i++) {
        const theta = (i / lonSteps) * Math.PI;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.beginPath();
        const segments = 36;
        for (let j = 0; j <= segments; j++) {
          const phi = (j / segments) * 2 * Math.PI;
          const pt = project(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
          if (j === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }

      if (showSection) {
        // 2. رسم المستوي القاطع (P) كشبه منحرف مظلل شفاف
        const pSize = R * 1.5;
        const p1 = project(-pSize, d, -pSize);
        const p2 = project(pSize, d, -pSize);
        const p3 = project(pSize, d, pSize);
        const p4 = project(-pSize, d, pSize);

        ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3. رسم دائرة التقاطع (Γ)
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const cSegments = 48;
        for (let i = 0; i <= cSegments; i++) {
          const theta = (i / cSegments) * 2 * Math.PI;
          const pt = project(rCircle * Math.cos(theta), d, rCircle * Math.sin(theta));
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }

      // 4. رسم المركز Ω والنقطة H والمسافة d
      const pOmega = project(0, 0, 0);
      const pH = project(0, d, 0);

      // المتجه المنظمي والمسافة d
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pOmega.px, pOmega.py);
      ctx.lineTo(pH.px, pH.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // شعاع الفلكة R من المركز إلى نقطة على الدائرة
      const pEdge = project(rCircle, d, 0);
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pOmega.px, pOmega.py);
      ctx.lineTo(pEdge.px, pEdge.py);
      ctx.stroke();

      // شعاع الدائرة r من H إلى النقطة على الدائرة
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pH.px, pH.py);
      ctx.lineTo(pEdge.px, pEdge.py);
      ctx.stroke();

      // نقاط المراكز
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(pOmega.px, pOmega.py, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(pH.px, pH.py, 3.5, 0, 2 * Math.PI);
      ctx.fill();

      // تسميات العناصر
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("Ω (مركز الفلكة)", pOmega.px + 6, pOmega.py + 4);

      ctx.fillStyle = "#10b981";
      ctx.fillText("H (المسقط العمودي)", pH.px + 6, pH.py - 4);

      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`d = ${d.toFixed(1)}`, (pOmega.px + pH.px) / 2 - 28, (pOmega.py + pH.py) / 2);

      ctx.fillStyle = "#ec4899";
      ctx.fillText(`R = ${R.toFixed(1)}`, (pOmega.px + pEdge.px) / 2 + 6, (pOmega.py + pEdge.py) / 2);

      ctx.fillStyle = "#10b981";
      ctx.fillText(`r = ${rCircle.toFixed(2)}`, (pH.px + pEdge.px) / 2, pH.py + 14);
    } else if (presetType === "CUBE") {
      const a = Math.min(3.2, Math.max(1, paramA * 0.45));
      // 8 رؤوس المكعب
      const v = [
        project(-a, -a, -a), // 0: A
        project(a, -a, -a),  // 1: B
        project(a, a, -a),   // 2: C
        project(-a, a, -a),  // 3: D
        project(-a, -a, a),  // 4: E
        project(a, -a, a),   // 5: F
        project(a, a, a),    // 6: G
        project(-a, a, a),   // 7: H
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // قاعدة خلفية
        [4, 5], [5, 6], [6, 7], [7, 4], // قاعدة أمامية
        [0, 4], [1, 5], [2, 6], [3, 7], // أحرف عمودية
      ];

      if (showSection) {
        // مقطع مستوٍ (BDE) مظلل
        ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
        ctx.beginPath();
        ctx.moveTo(v[1].px, v[1].py); // B
        ctx.lineTo(v[3].px, v[3].py); // D
        ctx.lineTo(v[4].px, v[4].py); // E
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // رسم الأحرف
      edges.forEach(([i, j]) => {
        const p1 = v[i];
        const p2 = v[j];
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      });

      // تسميات الرؤوس
      const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#ffffff";
      v.forEach((pt, idx) => {
        ctx.fillText(labels[idx], pt.px + 4, pt.py - 4);
      });
    } else if (presetType === "TETRAHEDRON") {
      // رباعي الأوجه المنتظم ABCD مع مقطع المنتصفات (IJK)
      const a = Math.min(3.2, Math.max(1.2, paramA * 0.55));
      const h = Math.min(3.5, Math.max(1.2, paramB * 0.65));

      const coordsA = { x: 0, y: h, z: 0 };
      const coordsB = { x: -a, y: -0.8, z: -a * 0.65 };
      const coordsC = { x: a, y: -0.8, z: -a * 0.65 };
      const coordsD = { x: 0, y: -0.8, z: a * 0.95 };

      const pA = project(coordsA.x, coordsA.y, coordsA.z);
      const pB = project(coordsB.x, coordsB.y, coordsB.z);
      const pC = project(coordsC.x, coordsC.y, coordsC.z);
      const pD = project(coordsD.x, coordsD.y, coordsD.z);

      // أحرف رباعي الأوجه ABCD
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.6;
      [
        [pA, pB],
        [pA, pC],
        [pA, pD],
        [pB, pC],
        [pC, pD],
        [pD, pB],
      ].forEach(([u, vPt]) => {
        ctx.beginPath();
        ctx.moveTo(u.px, u.py);
        ctx.lineTo(vPt.px, vPt.py);
        ctx.stroke();
      });

      if (showSection) {
        // منتصفات الأحرف I, J, K
        const pI = project(
          (coordsA.x + coordsB.x) / 2,
          (coordsA.y + coordsB.y) / 2,
          (coordsA.z + coordsB.z) / 2
        );
        const pJ = project(
          (coordsA.x + coordsC.x) / 2,
          (coordsA.y + coordsC.y) / 2,
          (coordsA.z + coordsC.z) / 2
        );
        const pK = project(
          (coordsA.x + coordsD.x) / 2,
          (coordsA.y + coordsD.y) / 2,
          (coordsA.z + coordsD.z) / 2
        );

        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.beginPath();
        ctx.moveTo(pI.px, pI.py);
        ctx.lineTo(pJ.px, pJ.py);
        ctx.lineTo(pK.px, pK.py);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("I", pI.px - 10, pI.py);
        ctx.fillText("J", pJ.px + 6, pJ.py);
        ctx.fillText("K", pK.px + 6, pK.py + 10);
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("A", pA.px + 4, pA.py - 6);
      ctx.fillText("B", pB.px - 12, pB.py + 4);
      ctx.fillText("C", pC.px + 6, pC.py + 4);
      ctx.fillText("D", pD.px + 4, pD.py + 12);
    } else {
      // هرم منتظم SABCD مع الارتفاع SO
      const a = Math.min(3.0, Math.max(1, paramA * 0.5));
      const h = Math.min(3.5, Math.max(1, paramB * 0.6));

      const s = project(0, h, 0); // القمة S
      const oBase = project(0, 0, 0); // مركز القاعدة O
      const aPt = project(-a, 0, -a);
      const bPt = project(a, 0, -a);
      const cPt = project(a, 0, a);
      const dPt = project(-a, 0, a);

      ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
      ctx.beginPath();
      ctx.moveTo(aPt.px, aPt.py);
      ctx.lineTo(bPt.px, bPt.py);
      ctx.lineTo(cPt.px, cPt.py);
      ctx.lineTo(dPt.px, dPt.py);
      ctx.closePath();
      ctx.fill();

      if (showSection) {
        // المقطع الموازي للقاعدة في منتصف الارتفاع
        const mA = project(-a / 2, h / 2, -a / 2);
        const mB = project(a / 2, h / 2, -a / 2);
        const mC = project(a / 2, h / 2, a / 2);
        const mD = project(-a / 2, h / 2, a / 2);

        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.beginPath();
        ctx.moveTo(mA.px, mA.py);
        ctx.lineTo(mB.px, mB.py);
        ctx.lineTo(mC.px, mC.py);
        ctx.lineTo(mD.px, mD.py);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // الارتفاع SO المتقطع
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(s.px, s.py);
      ctx.lineTo(oBase.px, oBase.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // أحرف الهرم
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 1.8;
      [aPt, bPt, cPt, dPt].forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(p.px, p.py);
        ctx.stroke();
      });

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(aPt.px, aPt.py);
      ctx.lineTo(bPt.px, bPt.py);
      ctx.lineTo(cPt.px, cPt.py);
      ctx.lineTo(dPt.px, dPt.py);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("S", s.px + 4, s.py - 4);
      ctx.fillText("O", oBase.px + 5, oBase.py - 3);
      ctx.fillText("A", aPt.px - 10, aPt.py);
      ctx.fillText("B", bPt.px + 4, bPt.py);
      ctx.fillText("C", cPt.px + 4, cPt.py + 8);
      ctx.fillText("D", dPt.px - 10, dPt.py + 8);
    }
  }, [presetType, paramA, paramB, showSection, rotX, rotY, zoom]);

  return (
    <div className="relative w-full rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
      {/* شريط معلومات تفاعلي */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold text-slate-300">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Eye className="w-3.5 h-3.5" />
          <span>محاكاة 3D مدارية تفاعلية (اسحب بالفأرة أو اللمس للتدوير)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition"
            title="إعادة ضبط زاوية الرؤية"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* لوحة الرسم Canvas 3D */}
      <canvas
        ref={canvasRef}
        width={640}
        height={380}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* تذييل تفصيلي للبيانات الفضائية */}
      <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>الزاوية الأفقية: {(rotY * (180 / Math.PI)).toFixed(0)}°</span>
          <span>الزاوية الرأسية: {(rotX * (180 / Math.PI)).toFixed(0)}°</span>
          <span>التكبير: {(zoom * 100).toFixed(0)}%</span>
        </div>
        {presetType === "SPHERE_PLANE" && (
          <div className="text-emerald-400 font-bold">
            شعاع دائرة التقاطع: r = √(R² - d²) ={" "}
            {Math.sqrt(Math.max(0, paramA * paramA - paramB * paramB)).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};
