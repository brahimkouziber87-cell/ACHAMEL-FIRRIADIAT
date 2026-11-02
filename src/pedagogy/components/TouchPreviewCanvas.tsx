import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Eraser,
  Highlighter,
  Maximize2,
  Minimize2,
  Move,
  PenTool,
  Printer,
  Radio,
  RotateCcw,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export interface TouchPreviewCanvasProps {
  children: React.ReactNode;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  pageOrientation?: "PORTRAIT" | "LANDSCAPE";
  className?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  syncScrollEnabled?: boolean;
  viewMode?: "PREVIEW" | "SPLIT" | "CODE";
}

export interface TouchPreviewCanvasHandle {
  resetView: () => void;
  fitToWidth: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getContainer: () => HTMLDivElement | null;
}

type AnnotationTool = "PEN" | "HIGHLIGHTER" | "LASER" | "ERASER";

interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
}

interface AnnotationStroke {
  id: string;
  tool: "PEN" | "HIGHLIGHTER";
  color: string;
  baseWidth: number;
  points: StrokePoint[];
}

const ANNOTATION_COLORS = [
  { id: "sky", hex: "#0284c7", label: "أزرق أكاديمي" },
  { id: "crimson", hex: "#e11d48", label: "أحمر تصحيح" },
  { id: "emerald", hex: "#059669", label: "أخضر برهان" },
  { id: "amber", hex: "#d97706", label: "عنبري تنبيه" },
  { id: "indigo", hex: "#4f46e5", label: "نيلي هندسي" },
  { id: "ink", hex: "#0f172a", label: "أسود حبر" },
];

export const TouchPreviewCanvas = forwardRef<
  HTMLDivElement,
  TouchPreviewCanvasProps
>(function TouchPreviewCanvas(
  {
    children,
    zoom,
    onZoomChange,
    pageOrientation = "PORTRAIT",
    className = "",
    onScroll,
    syncScrollEnabled = false,
    viewMode = "PREVIEW",
  },
  forwardedRef
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  // Expose the inner container DOM element to the forwarded ref
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    forwardedRef,
    () => containerRef.current
  );

  // Multi-touch Pan state
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isGesturing, setIsGesturing] = useState<boolean>(false);
  const [showGestureHint, setShowGestureHint] = useState<boolean>(true);

  // Stylus & Touch Live Annotation State (Tablets, iPad Pencil, S-Pen, Surface Pen, TBI & Desktop)
  const [isAnnotating, setIsAnnotating] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("PEN");
  const [strokeColor, setStrokeColor] = useState<string>("#0284c7");
  const [strokeWidth, setStrokeWidth] = useState<number>(2.6);
  const [palmRejection, setPalmRejection] = useState<boolean>(false);
  const [stylusDetected, setStylusDetected] = useState<boolean>(false);
  const [includeAnnotationsInPrint, setIncludeAnnotationsInPrint] =
    useState<boolean>(false);
  const [strokes, setStrokes] = useState<AnnotationStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<AnnotationStroke | null>(
    null
  );
  const [laserTrail, setLaserTrail] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [isFullscreenPresentation, setIsFullscreenPresentation] =
    useState<boolean>(false);

  const isDrawingRef = useRef<boolean>(false);
  const laserTimeoutRef = useRef<number | null>(null);

  // Gesture tracking refs
  const touchTrackingRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialMidpoint: { x: number; y: number };
    initialPan: { x: number; y: number };
    lastTapTime: number;
    isPinching: boolean;
    isPanning: boolean;
    singleTouchStart: { x: number; y: number };
  }>({
    initialDist: 0,
    initialZoom: zoom,
    initialMidpoint: { x: 0, y: 0 },
    initialPan: { x: 0, y: 0 },
    lastTapTime: 0,
    isPinching: false,
    isPanning: false,
    singleTouchStart: { x: 0, y: 0 },
  });

  // Auto-dismiss gesture hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGestureHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Quick actions
  const handleReset = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    onZoomChange(100);
  }, [onZoomChange]);

  const handleZoomIn = useCallback(() => {
    onZoomChange(Math.min(200, zoom + 15));
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    onZoomChange(Math.max(50, zoom - 15));
  }, [zoom, onZoomChange]);

  const handleFitToWidth = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 32; // account for padding
    // Approximate A4 width in px at 100%: 794px in portrait, 1123px in landscape
    const sheetWidth = pageOrientation === "PORTRAIT" ? 794 : 1123;
    if (sheetWidth > 0 && containerWidth > 0) {
      const targetPercent = Math.min(
        150,
        Math.max(50, Math.round((containerWidth / sheetWidth) * 100))
      );
      setPanOffset({ x: 0, y: 0 });
      onZoomChange(targetPercent);
    }
  }, [pageOrientation, onZoomChange]);

  const handleToggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
        .then(() => setIsFullscreenPresentation(true))
        .catch(() => setIsFullscreenPresentation((v) => !v));
    } else {
      document.exitFullscreen?.()
        .then(() => setIsFullscreenPresentation(false))
        .catch(() => setIsFullscreenPresentation(false));
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreenPresentation(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Touch Event Listeners (using non-passive listeners where needed to allow preventDefault on pinch)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const calcDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const calcMidpoint = (t1: Touch, t2: Touch) => ({
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    });

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Multi-touch Pinch / Pan started (works even when annotating!)
        e.preventDefault();
        isDrawingRef.current = false;
        setCurrentStroke(null);
        const dist = calcDistance(e.touches[0], e.touches[1]);
        const mid = calcMidpoint(e.touches[0], e.touches[1]);
        touchTrackingRef.current.initialDist = dist;
        touchTrackingRef.current.initialZoom = zoom;
        touchTrackingRef.current.initialMidpoint = mid;
        touchTrackingRef.current.initialPan = { ...panOffset };
        touchTrackingRef.current.isPinching = true;
        setIsGesturing(true);
      } else if (e.touches.length === 1 && !isAnnotating) {
        // Check for double tap to toggle zoom when not in active drawing mode
        const now = Date.now();
        const timeDiff = now - touchTrackingRef.current.lastTapTime;
        const touch = e.touches[0];

        if (timeDiff < 320 && timeDiff > 40) {
          // Double Tap detected!
          e.preventDefault();
          if (zoom > 105) {
            handleReset();
          } else {
            onZoomChange(140);
          }
          touchTrackingRef.current.lastTapTime = 0;
          return;
        }

        touchTrackingRef.current.lastTapTime = now;
        touchTrackingRef.current.singleTouchStart = {
          x: touch.clientX,
          y: touch.clientY,
        };

        // If zoomed in (> 100%), single touch can initiate canvas pan when dragging from canvas backdrop
        if (
          zoom > 100 &&
          (e.target as HTMLElement).closest(".a4-studio-backdrop")
        ) {
          touchTrackingRef.current.isPanning = true;
          touchTrackingRef.current.initialPan = { ...panOffset };
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchTrackingRef.current.isPinching) {
        e.preventDefault(); // Stop native viewport zooming
        const currentDist = calcDistance(e.touches[0], e.touches[1]);
        const currentMid = calcMidpoint(e.touches[0], e.touches[1]);

        if (touchTrackingRef.current.initialDist > 0) {
          const scaleRatio = currentDist / touchTrackingRef.current.initialDist;
          const newZoom = Math.min(
            220,
            Math.max(
              50,
              Math.round(touchTrackingRef.current.initialZoom * scaleRatio)
            )
          );
          onZoomChange(newZoom);

          // Update pan with midpoint delta
          const deltaX =
            currentMid.x - touchTrackingRef.current.initialMidpoint.x;
          const deltaY =
            currentMid.y - touchTrackingRef.current.initialMidpoint.y;

          setPanOffset({
            x: touchTrackingRef.current.initialPan.x + deltaX * 0.9,
            y: touchTrackingRef.current.initialPan.y + deltaY * 0.9,
          });
        }
      } else if (
        e.touches.length === 1 &&
        !isAnnotating &&
        touchTrackingRef.current.isPanning &&
        zoom > 100
      ) {
        const touch = e.touches[0];
        const dx = touch.clientX - touchTrackingRef.current.singleTouchStart.x;
        const dy = touch.clientY - touchTrackingRef.current.singleTouchStart.y;

        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          e.preventDefault();
          setIsGesturing(true);
          setPanOffset({
            x: touchTrackingRef.current.initialPan.x + dx,
            y: touchTrackingRef.current.initialPan.y + dy,
          });
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchTrackingRef.current.isPinching = false;
      }
      if (e.touches.length === 0) {
        touchTrackingRef.current.isPanning = false;
        setIsGesturing(false);
      }
    };

    const onTouchCancel = () => {
      touchTrackingRef.current.isPinching = false;
      touchTrackingRef.current.isPanning = false;
      setIsGesturing(false);
    };

    // Wheel zoom on Ctrl+Wheel (Trackpad pinch & Desktop mouse wheel)
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY;
        const step = delta > 0 ? -5 : 5;
        const newZoom = Math.min(220, Math.max(50, zoom + step));
        onZoomChange(newZoom);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
      el.removeEventListener("wheel", onWheel);
    };
  }, [zoom, panOffset, onZoomChange, handleReset, isAnnotating]);

  // Pointer Events for Stylus (Apple Pencil / S-Pen / Surface Pen), Touch & Mouse Annotation
  const getRelativePoint = (
    e: React.PointerEvent<SVGSVGElement>
  ): StrokePoint => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = svg.clientWidth > 0 ? rect.width / svg.clientWidth : 1;
    const scaleY = svg.clientHeight > 0 ? rect.height / svg.clientHeight : 1;
    return {
      x: (e.clientX - rect.left) / (scaleX || 1),
      y: (e.clientY - rect.top) / (scaleY || 1),
      pressure: e.pointerType === "pen" && e.pressure > 0 ? e.pressure : 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "pen") {
      setStylusDetected(true);
    }
    if (!isAnnotating) return;
    // If palm rejection is enabled, ignore finger touch so finger can scroll while stylus draws
    if (palmRejection && e.pointerType === "touch") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getRelativePoint(e);

    if (activeTool === "ERASER") {
      setStrokes((prev) =>
        prev.filter(
          (st) =>
            !st.points.some(
              (p) => Math.hypot(p.x - pt.x, p.y - pt.y) < 24
            )
        )
      );
      return;
    }

    if (activeTool === "LASER") {
      if (laserTimeoutRef.current) window.clearTimeout(laserTimeoutRef.current);
      setLaserTrail([{ x: pt.x, y: pt.y }]);
      return;
    }

    const newStroke: AnnotationStroke = {
      id: `st_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      tool: activeTool,
      color: strokeColor,
      baseWidth: activeTool === "HIGHLIGHTER" ? strokeWidth * 5.5 : strokeWidth,
      points: [pt],
    };
    setCurrentStroke(newStroke);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "pen" && !stylusDetected) {
      setStylusDetected(true);
    }
    if (!isAnnotating || !isDrawingRef.current) return;
    if (palmRejection && e.pointerType === "touch") return;

    e.preventDefault();
    const pt = getRelativePoint(e);

    if (activeTool === "ERASER") {
      setStrokes((prev) =>
        prev.filter(
          (st) =>
            !st.points.some(
              (p) => Math.hypot(p.x - pt.x, p.y - pt.y) < 24
            )
        )
      );
      return;
    }

    if (activeTool === "LASER") {
      setLaserTrail((prev) => [...prev.slice(-28), { x: pt.x, y: pt.y }]);
      return;
    }

    setCurrentStroke((prev) =>
      prev ? { ...prev, points: [...prev.points, pt] } : null
    );
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (activeTool === "LASER") {
      laserTimeoutRef.current = window.setTimeout(() => {
        setLaserTrail([]);
      }, 900);
      return;
    }

    if (currentStroke && currentStroke.points.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
  };

  const renderSvgPath = (points: StrokePoint[]) => {
    if (points.length === 0) return "";
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x} ${p.y} L ${p.x + 0.5} ${p.y + 0.5}`;
    }
    return points
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
  };

  const hasCustomTransform =
    zoom !== 100 || panOffset.x !== 0 || panOffset.y !== 0;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={`relative a4-studio-backdrop border border-slate-300/90 rounded-2xl p-3 sm:p-5 md:p-8 overflow-x-auto shadow-inner select-none touch-manipulation ${
        isFullscreenPresentation
          ? "fixed inset-0 z-50 rounded-none h-screen overflow-y-auto"
          : viewMode === "SPLIT"
          ? "xl:col-span-7 max-h-[860px] overflow-y-auto"
          : syncScrollEnabled
          ? "max-h-[920px] overflow-y-auto"
          : ""
      } ${className}`}
    >
      {/* Visual Gesture Status & Floating Quick-Controls Overlay (Desktop, Tablet & Stylus) */}
      <div className="no-print sticky top-2 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none mb-2">
        {/* Subtle Gesture Info Pill */}
        {showGestureHint && !isAnnotating && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-slate-100 border border-cyan-500/30 px-3 py-1.5 rounded-full text-[10.5px] font-bold shadow-lg flex items-center gap-2 animate-fadeIn transition-opacity">
            <span className="text-cyan-400">🤏</span>
            <span>قرص بأصبعين للتكبير</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-teal-300">✍️</span>
            <span>قلم الشرح والتعليق (Stylus / لوح إلكتروني)</span>
            <button
              type="button"
              onClick={() => setShowGestureHint(false)}
              className="text-slate-400 hover:text-white mr-1 text-xs cursor-pointer font-black"
              title="إخفاء التلميح"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stylus Active Tools Bar when annotation mode is ON */}
        {isAnnotating && (
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-slate-950/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-teal-400/50 shadow-2xl text-slate-100 text-[11px]">
            <span className="font-black text-teal-300 flex items-center gap-1 px-1">
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">قلم اللوح والشرح:</span>
            </span>

            {/* Tool Buttons */}
            <button
              type="button"
              onClick={() => setActiveTool("PEN")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTool === "PEN"
                  ? "bg-teal-500 text-slate-950 font-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title="قلم حبر رياضي حساس لضغط القلم الإلكتروني"
            >
              <PenTool className="w-3 h-3" />
              <span>قلم</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("HIGHLIGHTER")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTool === "HIGHLIGHTER"
                  ? "bg-amber-400 text-slate-950 font-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title="قلم تظليل فسفوري للمعادلات"
            >
              <Highlighter className="w-3 h-3" />
              <span>تظليل</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("LASER")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTool === "LASER"
                  ? "bg-rose-500 text-white font-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title="مؤشر ليزر يتلاشى تلقائياً للشرح على اللوح والسبورة"
            >
              <Radio className="w-3 h-3" />
              <span>ليزر</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("ERASER")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTool === "ERASER"
                  ? "bg-slate-200 text-slate-950 font-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title="ممحاة الخطوط"
            >
              <Eraser className="w-3 h-3" />
              <span>ممحاة</span>
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Color Swatches */}
            <div className="flex items-center gap-1">
              {ANNOTATION_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setStrokeColor(c.hex)}
                  title={c.label}
                  className={`w-4 h-4 rounded-full cursor-pointer transition ${
                    strokeColor === c.hex
                      ? "ring-2 ring-white scale-110"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Palm Rejection toggle */}
            <button
              type="button"
              onClick={() => setPalmRejection((v) => !v)}
              title="رفض راحة اليد (Palm Rejection): الرسم بالقلم الإلكتروني فقط والتمرير بالأصبع"
              className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                palmRejection
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {palmRejection ? "✓ رفض راحة اليد" : "قلم + لمس"}
            </button>

            {/* Include in Print toggle */}
            <button
              type="button"
              onClick={() => setIncludeAnnotationsInPrint((v) => !v)}
              title="إظهار أو إخفاء الشرح اليدوي عند طباعة الورقة A4"
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                includeAnnotationsInPrint
                  ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Printer className="w-3 h-3" />
              <span className="hidden md:inline">
                {includeAnnotationsInPrint ? "يطبع مع الورقة" : "لا يطبع"}
              </span>
            </button>

            {/* Undo & Clear */}
            <button
              type="button"
              onClick={() => setStrokes((prev) => prev.slice(0, -1))}
              disabled={strokes.length === 0}
              title="التراجع عن آخر خط"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setStrokes([])}
              disabled={strokes.length === 0}
              title="مسح جميع التعليقات اليدوية"
              className="p-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Floating Touch & Stylus Controls Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-cyan-500/30 shadow-xl text-slate-200">
          {/* Toggle Stylus Annotation Button */}
          <button
            type="button"
            onClick={() => setIsAnnotating((v) => !v)}
            title="تفعيل قلم الشرح والتعليق المباشر فوق ورقة الفرض (Apple Pencil / S-Pen / Surface / Mouse)"
            className={`h-7 px-2.5 rounded-xl flex items-center gap-1.5 text-[10.5px] font-black transition cursor-pointer ${
              isAnnotating
                ? "bg-teal-400 text-slate-950 shadow-sm"
                : "bg-slate-800/90 text-teal-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>{isAnnotating ? "إغلاق القلم" : "قلم اللوح"}</span>
            {strokes.length > 0 && (
              <span className="px-1 rounded bg-slate-950/30 text-[9.5px] font-mono">
                {strokes.length}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-slate-800 mx-0.5" />

          <button
            type="button"
            onClick={handleZoomOut}
            title="تصغير المعاينة (Zoom Out)"
            className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="إعادة ضبط المقياس والموضع (100%)"
            className="px-2 h-7 rounded-xl flex items-center gap-1 font-mono text-[11px] font-black text-cyan-300 hover:bg-slate-800 transition active:scale-95 cursor-pointer tabular-nums"
          >
            <span>{zoom}%</span>
            {hasCustomTransform && (
              <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            title="تكبير المعاينة (Zoom In)"
            className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-0.5" />

          <button
            type="button"
            onClick={handleFitToWidth}
            title="ملاءمة عرض الورقة مع شاشة اللوح أو الحاسوب (Fit Width)"
            className="h-7 px-2 rounded-xl flex items-center gap-1 text-[10.5px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">ملاءمة العرض</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="وضع العرض بملء الشاشة للسبورة التفاعلية والألواح الإلكترونية (Fullscreen)"
            className="h-7 px-2 rounded-xl flex items-center gap-1 text-[10.5px] font-bold text-amber-300 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            {isFullscreenPresentation ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
            <span className="hidden md:inline">
              {isFullscreenPresentation ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            </span>
          </button>
        </div>
      </div>

      {/* Floating active gesture indicator */}
      {isGesturing && (
        <div className="no-print pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-cyan-300 border border-cyan-400/40 px-3.5 py-1.5 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 animate-pulse">
          <Move className="w-3.5 h-3.5" />
          <span>مقياس المعاينة: {zoom}%</span>
          {panOffset.x !== 0 && (
            <span className="font-mono text-[10px] text-slate-400">
              (X: {Math.round(panOffset.x)}, Y: {Math.round(panOffset.y)})
            </span>
          )}
        </div>
      )}

      {/* Printable Sheet Canvas Wrapper with Hardware-Accelerated 3D Transform + Stylus SVG Layer */}
      <div
        ref={contentWrapperRef}
        className="print-zoom-wrapper relative"
        style={{
          transform: hasCustomTransform
            ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoom / 100})`
            : undefined,
          transformOrigin: "top center",
          transition: isGesturing
            ? "none"
            : "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
          willChange: hasCustomTransform ? "transform" : "auto",
        }}
      >
        {children}

        {/* Live Stylus & Touch SVG Annotation Layer over the A4 Paper */}
        {(isAnnotating || strokes.length > 0 || laserTrail.length > 0) && (
          <svg
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
            className={`absolute inset-0 w-full h-full z-20 ${
              includeAnnotationsInPrint ? "" : "no-print"
            } ${
              isAnnotating
                ? activeTool === "ERASER"
                  ? "cursor-cell pointer-events-auto"
                  : "cursor-crosshair pointer-events-auto"
                : "pointer-events-none"
            }`}
            style={{
              touchAction:
                isAnnotating && !palmRejection ? "none" : "pan-x pan-y",
            }}
          >
            {strokes.map((st) => (
              <path
                key={st.id}
                d={renderSvgPath(st.points)}
                fill="none"
                stroke={st.color}
                strokeWidth={st.baseWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={st.tool === "HIGHLIGHTER" ? 0.36 : 0.92}
              />
            ))}

            {currentStroke && (
              <path
                d={renderSvgPath(currentStroke.points)}
                fill="none"
                stroke={currentStroke.color}
                strokeWidth={currentStroke.baseWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={
                  currentStroke.tool === "HIGHLIGHTER" ? 0.36 : 0.92
                }
              />
            )}

            {laserTrail.length > 1 && (
              <polyline
                points={laserTrail.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#f43f5e"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.85}
              />
            )}
            {laserTrail.length > 0 && (
              <circle
                cx={laserTrail[laserTrail.length - 1].x}
                cy={laserTrail[laserTrail.length - 1].y}
                r={6}
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
});
