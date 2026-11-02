import React, { useState } from "react";
import {
  Download,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Share2,
  ExternalLink,
  X,
  Sparkles,
  FileCode,
  Terminal,
  Copy,
  Check,
  PenTool,
  Keyboard,
  Layers,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlatformTabId = "DESKTOP" | "TABLET" | "MOBILE_APK";

export const APKInstallModal: React.FC<APKInstallModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isTablet,
    isDesktop,
    hasTouchOrStylus,
    install,
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<PlatformTabId>(() =>
    isTablet ? "TABLET" : isDesktop ? "DESKTOP" : "MOBILE_APK"
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState<boolean>(false);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const bubblewrapCommand = `npx @bubblewrap/cli init --manifest=https://${window.location.host}/manifest.webmanifest\nnpx @bubblewrap/cli build`;
  const desktopBuildCommand = `# 1. تشغيل نسخة سطح المكتب عبر Electron:\nnpm run desktop:electron\n\n# 2. أو بناء مثبّت خفيف (.exe / .msi / .dmg) عبر Tauri v2:\nnpm run desktop:tauri-build`;
  const tabletCapacitorCommand = `# مزامنة وبناء حزمة اللوح الإلكتروني (Android Tablet & iPadOS):\nnpm run tablet:cap-sync\nnpx cap open android   # أو npx cap open ios`;

  const handleCopyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadMultiPlatformBundle = (target: "APK" | "DESKTOP" | "TABLET") => {
    setIsGeneratingPackage(true);
    setGenerationSuccess(null);
    setTimeout(() => {
      const bundleContent = {
        package_id: "com.kouziber.pedagogicalmath",
        app_name: "منصة الهندسة البيداغوجية والتقويم التربوي - الرياضيات",
        short_name: "رياضيات",
        version_code: 100,
        version_name: "1.0.0",
        author: "Prof Kouziber Brahim",
        target_platform: target,
        web_app_url: window.location.origin,
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "any",
        theme_color: "#090d16",
        background_color: "#090d16",
        desktop_config: {
          electron_main: "electron/main.cjs",
          tauri_config: "src-tauri/tauri.conf.json",
          window_size: { width: 1440, height: 920, minWidth: 768, minHeight: 600 },
          shortcuts: ["Ctrl+P (Print)", "Ctrl+E (Export Center)", "Ctrl+B (Toggle Deck)", "Ctrl+Z/Y (Undo/Redo)"],
        },
        tablet_config: {
          capacitor_config: "capacitor.config.json",
          supports_stylus_pointer_events: true,
          palm_rejection_mode: true,
          multi_touch_pinch_zoom: true,
          supported_devices: ["iPadOS (Apple Pencil)", "Android Tablet (S-Pen)", "Microsoft Surface Pen", "TBI Interactive Whiteboard"],
        },
        android_permissions: ["android.permission.INTERNET"],
      };

      const fileName =
        target === "DESKTOP"
          ? "Desktop_Windows_Mac_Config_Kouziber_Math.json"
          : target === "TABLET"
          ? "Tablet_iPad_Android_Stylus_Config_Kouziber_Math.json"
          : "Android_APK_Config_Bundle_Kouziber_Math.json";

      const blob = new Blob([JSON.stringify(bundleContent, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      setIsGeneratingPackage(false);
      setGenerationSuccess(fileName);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 flex items-center justify-center text-cyan-300 shadow-md">
              {activeTab === "DESKTOP" ? (
                <Monitor className="w-6 h-6" />
              ) : activeTab === "TABLET" ? (
                <Tablet className="w-6 h-6" />
              ) : (
                <Smartphone className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">
                مركز التشغيل المتعدد المنصات: سطح المكتب · الألواح الإلكترونية · الهواتف
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                تثبيت فوري بدون إنترنت (Desktop `.exe` / PWA · iPad & Android Tablet Stylus · Android APK)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط التبويبات الثلاثة */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("DESKTOP")}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "DESKTOP"
                ? "bg-slate-900 text-cyan-300 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-4 h-4 shrink-0" />
            <span>سطح المكتب (PC / Mac)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TABLET")}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "TABLET"
                ? "bg-slate-900 text-cyan-300 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tablet className="w-4 h-4 shrink-0" />
            <span>الألواح الإلكترونية والقلم</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MOBILE_APK")}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "MOBILE_APK"
                ? "bg-slate-900 text-cyan-300 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>الهواتف وحزمة APK</span>
          </button>
        </div>

        {/* شريط حالة الجهاز المكتشف حالياً */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-300 font-semibold">البيئة المكتشفة حالياً: </span>
              <span className="font-black text-cyan-300">
                {isTablet
                  ? "لوح إلكتروني بشاشة لمسية (Tablet / iPadOS / Surface)"
                  : isAndroid
                  ? "جهاز Android ذكي"
                  : isIOS
                  ? "جهاز iOS (iPhone / iPad)"
                  : "حاسوب سطح مكتب (Windows / macOS / Linux)"}
              </span>
              {hasTouchOrStylus && (
                <span className="mr-2 inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  يدعم اللمس والقلم الإلكتروني ✓
                </span>
              )}
            </div>
          </div>

          {isInstalled ? (
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-xl text-[11px] font-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مثبّت كتطبيق مستقل</span>
            </span>
          ) : (
            isInstallable && (
              <button
                type="button"
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-1.5 px-3.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت مباشر بنقرة واحدة الآن</span>
              </button>
            )
          )}
        </div>

        {/* محتوى التبويب 1: سطح المكتب */}
        {activeTab === "DESKTOP" && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-black text-slate-950">
                    1. التثبيت الفوري كتطبيق سطح مكتب مستقل (Windows / Mac Desktop App)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                  Offline Ready · 0 MB
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يعمل التطبيق على سطح المكتب بنافذة مستقلة كاملة (بدون شريط عنوان المتصفح بفضل ميزة{" "}
                <code className="bg-white px-1 rounded border border-slate-200">window-controls-overlay</code>)
                مع أيقونة مباشرة على سطح المكتب وشريط المهام (Taskbar)، ويعمل 100% بدون إنترنت لتوليد الفروض وتصدير PDF و LaTeX و Typst.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">في متصفح Chrome أو Edge:</div>
                  <p className="text-slate-600">
                    اضغط على أيقونة <strong>تثبيت التطبيق (⊕)</strong> في أقصى يسار شريط العنوان أو اضغط زر التثبيت أعلاه.
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">بناء ملف تنفيذي (.exe / .msi):</div>
                  <p className="text-slate-600">
                    تم تضمين إعدادات <strong>Electron</strong> و <strong>Tauri v2</strong> الكاملة في جذر المشروع لبناء برنامج مكتبي مستقل.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-slate-600" />
                    <span>أوامر تشغيل وبناء نسخة سطح المكتب (.exe / .dmg):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText("desktop", desktopBuildCommand)}
                    className="text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === "desktop" ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedCode === "desktop" ? "تم النسخ" : "نسخ الأوامر"}</span>
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="bg-slate-900 text-cyan-300 p-2.5 rounded-xl text-[10.5px] font-mono overflow-x-auto select-all leading-relaxed"
                >
                  {desktopBuildCommand}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadMultiPlatformBundle("DESKTOP")}
                disabled={isGeneratingPackage}
                className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل ملف تكوين سطح المكتب (Electron & Tauri Config JSON)</span>
              </button>
            </div>

            {/* اختصارات لوحة المفاتيح لسطح المكتب */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <Keyboard className="w-4 h-4 text-teal-700" />
                <span>اختصارات لوحة المفاتيح السريعة على الحاسوب:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                  <kbd className="font-mono font-black text-indigo-900 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                    Ctrl + P
                  </kbd>
                  <div className="text-slate-600 mt-1 font-bold">طباعة الورقة A4</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                  <kbd className="font-mono font-black text-indigo-900 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                    Ctrl + E
                  </kbd>
                  <div className="text-slate-600 mt-1 font-bold">مركز التصدير الشامل</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                  <kbd className="font-mono font-black text-indigo-900 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                    Ctrl + B
                  </kbd>
                  <div className="text-slate-600 mt-1 font-bold">وضع التركيز على الورقة</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                  <kbd className="font-mono font-black text-indigo-900 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                    Ctrl + Z / Y
                  </kbd>
                  <div className="text-slate-600 mt-1 font-bold">تراجع / إعادة</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* محتوى التبويب 2: الألواح الإلكترونية والقلم الإلكتروني */}
        {activeTab === "TABLET" && (
          <div className="space-y-4">
            <div className="border border-teal-200 rounded-2xl p-4 bg-teal-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-black text-slate-950">
                    مزايا الألواح الإلكترونية والقلم التفاعلي (iPad · Galaxy Tab · Surface · TBI)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                  Stylus & Multi-Touch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="bg-white p-3 rounded-xl border border-teal-200/80 space-y-1">
                  <div className="font-black text-teal-950 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-teal-700" />
                    <span>الشرح المباشر بالقلم فوق ورقة A4</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    استخدم <strong>Apple Pencil</strong> أو <strong>S-Pen</strong> للكتابة والتظليل ومؤشر الليزر مباشرة فوق التمارين مع ميزة <strong>رفض راحة اليد (Palm Rejection)</strong>.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-200/80 space-y-1">
                  <div className="font-black text-teal-950 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-700" />
                    <span>إيماءات اللمس المتعدد ووضع التركيز</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    تكبير/تصغير بإصبعين (Pinch-to-Zoom)، نقر مزدوج للتكبير الفوري إلى 140%، ودرج إعدادات لمسي سريع.
                  </p>
                </div>
              </div>

              {isIOS && (
                <div className="bg-white rounded-xl p-3 border border-teal-200 text-xs space-y-1">
                  <div className="font-black text-teal-900 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>تثبيت المنصة على شاشة iPad الرئيسية:</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    من متصفح Safari على iPad اضغط زر <strong>المشاركة (Share)</strong> أعلى الشاشة ثم اختر <strong>«إضافة إلى الصفحة الرئيسية (Add to Home Screen)»</strong> لتعمل بشاشة كاملة مع دعم Apple Pencil.
                  </p>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-slate-600" />
                    <span>بناء تطبيق أصيل للألواح عبر Capacitor (Android Tablet & iPadOS):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText("tablet", tabletCapacitorCommand)}
                    className="text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === "tablet" ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedCode === "tablet" ? "تم النسخ" : "نسخ الأمر"}</span>
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="bg-slate-900 text-teal-300 p-2.5 rounded-xl text-[10.5px] font-mono overflow-x-auto select-all leading-relaxed"
                >
                  {tabletCapacitorCommand}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadMultiPlatformBundle("TABLET")}
                disabled={isGeneratingPackage}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل حزمة تكوين الألواح الإلكترونية (Capacitor iPad/Android JSON)</span>
              </button>
            </div>
          </div>
        )}

        {/* محتوى التبويب 3: الهواتف وحزمة Android APK */}
        {activeTab === "MOBILE_APK" && (
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-700" />
                <span className="text-xs font-black text-slate-900">
                  توليد ملف APK بصيغة .apk لهواتف وألواح Android
                </span>
              </div>
              <span className="text-[10.5px] font-bold text-slate-500 font-mono">
                Google Bubblewrap / PWABuilder
              </span>
            </div>

            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              لإنشاء ملف APK قابل للتوزيع والتثبيت اليدوي المباشر (Sideloading) أو الرفع إلى Google Play Store، يمكنك استخدام خدمة <strong>PWABuilder الرسمية من Microsoft</strong> أو أداة <strong>Google Bubblewrap CLI</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`https://www.pwabuilder.com?site=${encodeURIComponent(window.location.origin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs text-center cursor-pointer"
              >
                <span>فتح PWABuilder لإنشاء APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => handleDownloadMultiPlatformBundle("APK")}
                disabled={isGeneratingPackage}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPackage ? "جاري التجهيز..." : "تحميل حزمة تكوين APK"}</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-slate-600" />
                  <span>أمر إنشاء APK بنقرة واحدة عبر Terminal:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText("apk", bubblewrapCommand)}
                  className="text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === "apk" ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedCode === "apk" ? "تم النسخ" : "نسخ الأمر"}</span>
                </button>
              </div>
              <pre
                dir="ltr"
                className="bg-slate-900 text-amber-300 p-2.5 rounded-xl text-[10.5px] font-mono overflow-x-auto select-all leading-relaxed"
              >
                {bubblewrapCommand}
              </pre>
            </div>
          </div>
        )}

        {generationSuccess && (
          <p className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 p-2.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم تحميل ملف التكوين « {generationSuccess} » بنجاح!</span>
          </p>
        )}

        {/* زر الإغلاق */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
