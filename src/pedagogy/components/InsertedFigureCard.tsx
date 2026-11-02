import React, { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  MoreVertical,
  Trash2,
  ZoomIn,
  Move,
  Settings2,
  Check,
} from "lucide-react";
import { InsertedFigure } from "../data/curriculum";

interface InsertedFigureCardProps {
  figure: InsertedFigure;
  isInlineEditable?: boolean;
  isFr?: boolean;
  onUpdateFigure?: (updated: InsertedFigure) => void;
  onDeleteFigure?: (id: string) => void;
}

export const InsertedFigureCard: React.FC<InsertedFigureCardProps> = ({
  figure,
  isInlineEditable = false,
  isFr = false,
  onUpdateFigure,
  onDeleteFigure,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const alignClass =
    figure.alignment === "left"
      ? "mr-auto text-left"
      : figure.alignment === "right"
      ? "ml-auto text-right"
      : "mx-auto text-center";

  const widthStyle = {
    width: `${figure.widthPercent}%`,
    maxWidth: "100%",
  };

  const handleWidthChange = (w: number) => {
    onUpdateFigure?.({
      ...figure,
      widthPercent: w,
    });
  };

  const handleAlignChange = (a: "left" | "center" | "right") => {
    onUpdateFigure?.({
      ...figure,
      alignment: a,
    });
    setShowContextMenu(false);
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdateFigure?.({
      ...figure,
      titleAr: newTitle,
      titleFr: newTitle,
    });
  };

  const handleCaptionChange = (newCaption: string) => {
    onUpdateFigure?.({
      ...figure,
      caption: newCaption,
      showCaption: true,
    });
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowContextMenu(false);
    if (onDeleteFigure) {
      onDeleteFigure(figure.id);
    }
  };

  // فتح القائمة السياقية عند النقر بالزر الأيمن على بطاقة الشكل التوضيحي
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = Math.max(10, Math.min(rect.width - 200, e.clientX - rect.left));
      const offsetY = Math.max(10, Math.min(rect.height - 180, e.clientY - rect.top));
      setContextMenuPos({ x: offsetX, y: offsetY });
    } else {
      setContextMenuPos({ x: 16, y: 16 });
    }
    setShowContextMenu(true);
  };

  // إغلاق القائمة السياقية عند النقر في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !cardRef.current?.contains(e.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };
    if (showContextMenu) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContextMenu]);

  return (
    <div
      ref={cardRef}
      onContextMenu={handleContextMenu}
      className={`inserted-figure-card avoid-break my-3 ${alignClass} group relative select-none`}
      style={widthStyle}
    >
      {/* شريط أدوات ضبط الصورة يظهر عند تفعيل التعديل المباشر */}
      {isInlineEditable && (
        <div className="no-print mb-1.5 flex flex-wrap items-center justify-between gap-1.5 bg-slate-900/90 text-white px-2 py-1 rounded-lg text-[11px] shadow-sm backdrop-blur-xs">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[10px] text-slate-300">
              {isFr ? "Alignement :" : "المحاذاة:"}
            </span>
            <button
              type="button"
              onClick={() => handleAlignChange("right")}
              title="محاذاة لليمين"
              className={`p-1 rounded hover:bg-slate-700 transition cursor-pointer ${
                figure.alignment === "right" ? "bg-indigo-600 text-white" : "text-slate-300"
              }`}
            >
              <AlignRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignChange("center")}
              title="توسيط"
              className={`p-1 rounded hover:bg-slate-700 transition cursor-pointer ${
                figure.alignment === "center" ? "bg-indigo-600 text-white" : "text-slate-300"
              }`}
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignChange("left")}
              title="محاذاة لليسار"
              className={`p-1 rounded hover:bg-slate-700 transition cursor-pointer ${
                figure.alignment === "left" ? "bg-indigo-600 text-white" : "text-slate-300"
              }`}
            >
              <AlignLeft className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-[10px] text-slate-300">
              {isFr ? "Taille :" : "الحجم:"}
            </span>
            {[35, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleWidthChange(pct)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                  figure.widthPercent === pct
                    ? "bg-indigo-600 text-white font-bold"
                    : "hover:bg-slate-700 text-slate-300"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsZoomed((v) => !v)}
              title={isZoomed ? "تصغير" : "تكبير المعاينة"}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              {isZoomed ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title={isFr ? "Supprimer l'illustration" : "حذف الشكل التوضيحي"}
              className="p-1 rounded hover:bg-rose-700 text-rose-300 hover:text-white transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* زر الحذف السريع المباشر في الزاوية العلوية اليمنى يظهر عند التمرير */}
      <div className="no-print absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleDelete}
          title={isFr ? "Supprimer l'illustration" : "حذف الشكل التوضيحي"}
          className="bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded-md shadow-md backdrop-blur-xs flex items-center justify-center cursor-pointer transition active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* زر القائمة السياقية السريع (Trigger Button) في ركن البطاقة يظهر دائماً عند التمرير أو النقر */}
      <div className="no-print absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowContextMenu((prev) => !prev);
            setContextMenuPos({ x: 8, y: 32 });
          }}
          title="القائمة السياقية لخيارات الشكل (يمين/وسط/يسار/حذف)"
          className="bg-slate-900/80 hover:bg-slate-900 text-white p-1 rounded-md shadow-md backdrop-blur-xs flex items-center justify-center cursor-pointer transition active:scale-95"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* القائمة السياقية (Context Menu) المنبثقة لكل بطاقة شكل توضيحي */}
      {showContextMenu && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          style={
            contextMenuPos
              ? { top: `${contextMenuPos.y}px`, right: `${contextMenuPos.x}px` }
              : { top: "8px", right: "8px" }
          }
          className="no-print absolute z-50 min-w-[210px] bg-slate-900/95 border border-slate-700/80 text-white rounded-xl shadow-2xl p-2 text-xs space-y-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10.5px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-3 h-3 text-indigo-400" />
              <span>{isFr ? "Options de l'illustration" : "خيارات الشكل التوضيحي"}</span>
            </span>
            <span className="font-mono text-indigo-300 font-extrabold">{figure.widthPercent}%</span>
          </div>

          {/* خيارات تغيير مكان الشكل (المحاذاة: يمين / وسط / يسار) */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 px-1">
              <Move className="w-2.5 h-2.5 inline ml-1" />
              {isFr ? "Position & Alignement :" : "مكان ومحاذاة الشكل:"}
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleAlignChange("right")}
                className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 font-bold text-[10.5px] transition cursor-pointer ${
                  figure.alignment === "right"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
                }`}
                title="محاذاة لليمين"
              >
                <AlignRight className="w-3 h-3" />
                <span>يمين</span>
              </button>
              <button
                type="button"
                onClick={() => handleAlignChange("center")}
                className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 font-bold text-[10.5px] transition cursor-pointer ${
                  figure.alignment === "center"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
                }`}
                title="توسيط"
              >
                <AlignCenter className="w-3 h-3" />
                <span>وسط</span>
              </button>
              <button
                type="button"
                onClick={() => handleAlignChange("left")}
                className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 font-bold text-[10.5px] transition cursor-pointer ${
                  figure.alignment === "left"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
                }`}
                title="محاذاة لليسار"
              >
                <AlignLeft className="w-3 h-3" />
                <span>يسار</span>
              </button>
            </div>
          </div>

          {/* خيارات تغيير حجم العرض */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <span className="block text-[10px] font-bold text-slate-400 px-1">
              {isFr ? "Largeur sur la page :" : "عرض الشكل على الصفحة:"}
            </span>
            <div className="grid grid-cols-4 gap-1">
              {[35, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    handleWidthChange(pct);
                    setShowContextMenu(false);
                  }}
                  className={`py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer ${
                    figure.widthPercent === pct
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* خيار تكبير / تصغير المعاينة */}
          <button
            type="button"
            onClick={() => {
              setIsZoomed((v) => !v);
              setShowContextMenu(false);
            }}
            className="w-full text-right px-2 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between transition cursor-pointer text-[11px]"
          >
            <span className="flex items-center gap-1.5">
              <ZoomIn className="w-3 h-3 text-indigo-400" />
              <span>{isZoomed ? "استعادة الحجم الطبيعي" : "تكبير المعاينة"}</span>
            </span>
            {isZoomed && <Check className="w-3 h-3 text-emerald-400" />}
          </button>

          {/* خيار 'حذف الشكل' المطلوب في القائمة السياقية وربطه بدالة handleDeleteFigure */}
          <div className="pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-right px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white font-bold flex items-center justify-between transition cursor-pointer text-[11px]"
              title={isFr ? "Supprimer définitivement l'illustration" : "حذف الشكل التوضيحي نهائياً"}
            >
              <span className="flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isFr ? "Supprimer l'illustration" : "حذف الشكل"}</span>
              </span>
              <span className="text-[10px] opacity-75 font-mono">Del</span>
            </button>
          </div>
        </div>
      )}

      {/* إطار الصورة الأكاديمي */}
      <div
        className={`inserted-figure-frame rounded-xl overflow-hidden border border-slate-300/90 bg-white p-2 shadow-xs group-hover:shadow-xl group-hover:border-indigo-400/70 transition-all duration-200 ease-out ${
          isZoomed ? "scale-105 shadow-2xl z-20 ring-2 ring-indigo-500/40" : ""
        }`}
      >
        <div className="relative group/img overflow-hidden rounded-lg bg-slate-50 flex items-center justify-center min-h-[120px]">
          <img
            src={figure.dataUrl}
            alt={isFr ? figure.titleFr : figure.titleAr}
            className="w-full h-auto object-contain max-h-[360px] mx-auto select-none"
            loading="lazy"
          />

          <button
            type="button"
            onClick={() => setIsZoomed((v) => !v)}
            className="no-print absolute bottom-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1 rounded-md opacity-0 group-hover/img:opacity-100 transition cursor-pointer"
            title="تكبير / تصغير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* تسمية توضيحية وشرح وصفي للشكل أسفل الرسم */}
        <div className="pt-2 px-1 text-center space-y-1">
          {isInlineEditable ? (
            <input
              type="text"
              value={isFr ? figure.titleFr : figure.titleAr}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={isFr ? "Titre de la figure..." : "عنوان الشكل التوضيحي..."}
              className="w-full text-center text-xs font-black text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-600 focus:outline-none py-0.5"
            />
          ) : (
            <div className="text-[11.5px] font-bold text-slate-800 tracking-tight">
              {isFr ? figure.titleFr : figure.titleAr}
            </div>
          )}

          {/* حقل إدخال وتحرير الشرح الوصفي للشكل (Descriptive Caption) */}
          <div className="w-full max-w-md mx-auto">
            <input
              type="text"
              value={figure.caption || ""}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder={
                isFr
                  ? "Ajouter une légende descriptive sous la figure..."
                  : "إضافة شرح أو تعليق وصفي تحت الشكل..."
              }
              className="w-full text-center text-[10.5px] font-medium text-slate-600 placeholder:text-slate-400/80 bg-slate-50/50 hover:bg-slate-100/80 focus:bg-white rounded-md border border-dashed border-slate-200 focus:border-indigo-500 focus:outline-none px-2 py-1 transition-colors no-print"
            />
            {/* عرض التعليق الوصفي المعتمد أثناء الطباعة والتصدير */}
            {figure.caption && (
              <p className="print-only text-[10.5px] text-slate-600 italic mt-0.5 text-center leading-normal">
                {figure.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
