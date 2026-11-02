import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Cloud,
  CloudCheck,
  CloudOff,
  CloudUpload,
  Database,
  ExternalLink,
  FolderOpen,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Unlock,
  Upload,
  UserCheck,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { User } from "firebase/auth";
import {
  DriveFileItem,
  SETTINGS_FILE_NAME,
  SyncSettingsPayload,
} from "../services/googleDrive";
import {
  isLocalEncryptionEnabled,
  setLocalEncryptionEnabled,
  hasTeacherMasterPin,
  setTeacherMasterPin,
  verifyTeacherMasterPin,
  runCryptoEngineSelfTest,
} from "../utils/cryptoStorage";

export interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveUser: User | null;
  driveToken: string | null;
  isLoggingIn: boolean;
  isUploading: boolean;
  driveFiles: DriveFileItem[];
  isLoadingFiles: boolean;
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  onSignIn: () => void;
  onLogout: () => void;
  onUploadCurrentDoc: () => void;
  onSyncSettingsNow: () => void;
  onRestoreSettingsFromDrive: () => void;
  onDeleteFile: (file: DriveFileItem) => void;
  onNotify: (type: "success" | "error" | "info", msg: string) => void;
  lastSyncTime?: Date | null;
  isSyncingSettings?: boolean;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  driveUser,
  driveToken,
  isLoggingIn,
  isUploading,
  driveFiles,
  isLoadingFiles,
  autoSyncEnabled,
  onToggleAutoSync,
  onSignIn,
  onLogout,
  onUploadCurrentDoc,
  onSyncSettingsNow,
  onRestoreSettingsFromDrive,
  onDeleteFile,
  onNotify,
  lastSyncTime,
  isSyncingSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"DRIVE_SYNC" | "LOCAL_ENCRYPTION" | "DRIVE_FILES">(
    "DRIVE_SYNC"
  );

  // حالة التشفير المحلي
  const [encryptionActive, setEncryptionActive] = useState<boolean>(() =>
    isLocalEncryptionEnabled()
  );
  const [hasPin, setHasPin] = useState<boolean>(() => hasTeacherMasterPin());
  const [pinInput, setPinInput] = useState<string>("");
  const [showPinInput, setShowPinInput] = useState<boolean>(false);
  const [benchmarking, setBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    success: boolean;
    durationMs: number;
    details: string;
    algorithm: string;
  } | null>(null);

  // تأكيد الحذف من Drive وفق ضوابط Workspace الإلزامية
  const [fileToConfirmDelete, setFileToConfirmDelete] = useState<DriveFileItem | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setEncryptionActive(isLocalEncryptionEnabled());
      setHasPin(hasTeacherMasterPin());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEncryption = (enabled: boolean) => {
    setLocalEncryptionEnabled(enabled);
    setEncryptionActive(enabled);
    onNotify(
      enabled ? "success" : "info",
      enabled
        ? "تم تفعيل نظام التشفير المحلي AES-GCM (256-bit) لحماية الفروض والبيانات الحساسة في المتصفح."
        : "تم تعطيل التشفير المحلي للمتصفح. تُحفظ البيانات بصيغة عادية."
    );
  };

  const handleSavePin = async () => {
    if (!pinInput || pinInput.length < 4) {
      onNotify("error", "يجب أن يتكون رمز PIN من 4 أرقام على الأقل.");
      return;
    }
    await setTeacherMasterPin(pinInput);
    setHasPin(true);
    setShowPinInput(false);
    setPinInput("");
    onNotify("success", "تم تعيين رمز الحماية الرئيسي (Master PIN) للأستاذ بنجاح!");
  };

  const handleRemovePin = async () => {
    await setTeacherMasterPin(null);
    setHasPin(false);
    setShowPinInput(false);
    setPinInput("");
    onNotify("info", "تمت إزالة رمز PIN والحفاظ على التشفير التلقائي للجهاز.");
  };

  const handleRunBenchmark = async () => {
    setBenchmarking(true);
    setBenchmarkResult(null);
    try {
      const res = await runCryptoEngineSelfTest();
      setBenchmarkResult(res);
      if (res.success) {
        onNotify("success", `نجح فحص التشفير! زمن الاستجابة: ${res.durationMs}ms`);
      } else {
        onNotify("error", res.details);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      onNotify("error", `فشل الفحص: ${msg}`);
    } finally {
      setBenchmarking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* شريط العنوان */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 via-cyan-500/20 to-teal-500/20 border border-sky-500/40 text-sky-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  السحابة والتشفير المحلي (Google Drive & AES-256 Storage)
                </h2>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                  مزامنة تلقائية + خصوصية قصوى
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مزامنة الإعدادات المفضلة سحابياً وتشفير محلي متقدم للفروض الحساسة في المتصفح
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أشرطة التبويب الثلاثة */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("DRIVE_SYNC")}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "DRIVE_SYNC"
                ? "border-sky-400 text-sky-300 font-black"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CloudUpload className="w-4 h-4" />
            <span>مزامنة الإعدادات مع Drive</span>
            {autoSyncEnabled && driveToken && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("LOCAL_ENCRYPTION")}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "LOCAL_ENCRYPTION"
                ? "border-emerald-400 text-emerald-300 font-black"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تشفير LocalStorage (AES-256)</span>
            {encryptionActive && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                نشط
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("DRIVE_FILES")}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "DRIVE_FILES"
                ? "border-amber-400 text-amber-300 font-black"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>أرشيف الوثائق في Drive</span>
            {driveFiles.length > 0 && (
              <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded-full">
                {driveFiles.length}
              </span>
            )}
          </button>
        </div>

        {/* محتوى التبويبات */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-5">
          {/* 1. تبويب مزامنة Google Drive */}
          {activeTab === "DRIVE_SYNC" && (
            <div className="space-y-4">
              {/* بطاقة الاتصال بحساب Google Drive */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 font-black">
                      {driveUser?.photoURL ? (
                        <img
                          src={driveUser.photoURL}
                          alt="Google Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Cloud className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          {driveUser ? driveUser.displayName || driveUser.email : "حساب Google غير متصل"}
                        </span>
                        {driveUser ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>متصل بـ Drive</span>
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            غير متصل
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {driveUser
                          ? `${driveUser.email} · مجلد: منصة الهندسة البيداغوجية - الرياضيات`
                          : "قم بربط حساب Google لحفظ ومزامنة إعداداتك وفروضك تلقائياً"}
                      </p>
                    </div>
                  </div>

                  {!driveUser ? (
                    <button
                      type="button"
                      onClick={onSignIn}
                      disabled={isLoggingIn}
                      className="px-4 py-2 rounded-xl font-black text-xs bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 flex items-center gap-2 transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{isLoggingIn ? "جاري الاتصال..." : "تسجيل الدخول بحساب Google"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  )}
                </div>
              </div>

              {/* خيار التفعيل: مزامنة الإعدادات المفضلة تلقائياً عند التغيير */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300">
                      <RefreshCw className={`w-4 h-4 ${isSyncingSettings ? "animate-spin text-sky-400" : ""}`} />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white">
                        مزامنة الإعدادات المفضلة تلقائياً مع Google Drive عند التغيير
                      </div>
                      <p className="text-xs text-slate-400">
                        يتم حفظ اسم الأستاذ، المؤسسة، حزم LaTeX، الخطوط، الترويسة المغربية، وتوزيع أوزان الدروس تلقائياً في السحابة
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => onToggleAutoSync(e.target.checked)}
                      disabled={!driveToken}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 peer-disabled:opacity-50"></div>
                  </label>
                </div>

                {/* حالة المزامنة اللحظية والتفاصيل */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-300 font-bold">ملف المزامنة:</span>
                    <span className="font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                      {SETTINGS_FILE_NAME}
                    </span>
                    {isSyncingSettings ? (
                      <span className="text-amber-300 flex items-center gap-1 font-bold animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>جاري المزامنة مع Drive...</span>
                      </span>
                    ) : lastSyncTime ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          آخر مزامنة ناجحة: {lastSyncTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </span>
                    ) : (
                      <span>في انتظار أول حفظ</span>
                    )}
                  </div>

                  {driveToken && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onSyncSettingsNow}
                        disabled={isSyncingSettings}
                        className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center gap-1 transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <CloudUpload className="w-3.5 h-3.5" />
                        <span>مزامنة الآن</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRestoreConfirm(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>استرجاع من Drive</span>
                      </button>
                    </div>
                  )}
                </div>

                {!driveToken && (
                  <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      لتفعيل المزامنة التلقائية اللحظية، يرجى تسجيل الدخول بحساب Google أولاً.
                    </span>
                  </p>
                )}
              </div>

              {/* ما الذي يتم حفظه في ملف الإعدادات المتزامن */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>عناصر مساحة العمل المشمولة بالمزامنة السحابية:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>بيانات الترويسة: اسم الأستاذ، المؤسسة، الأكاديمية، والمديرية</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>قوالب وحزم LaTeX وثيمات صناديق tcolorbox وسطح الورقة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>إعدادات الخط المغربي الأندلسي والزخارف والتباعد الأفقي</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>التدرج اللوني للدروس، أيقونات التمارين، وتوزيع الأوزان الديداكتيكية</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. تبويب نظام التشفير المحلي (AES-256 GCM) */}
          {activeTab === "LOCAL_ENCRYPTION" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          نظام التشفير المحلي للبيانات الحساسة (LocalStorage AES-256)
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Web Crypto API
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        حماية قصوى لمواضيع الفروض المحروسة والمسودات ونقط التلاميذ داخل متصفحك
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={encryptionActive}
                      onChange={(e) => handleToggleEncryption(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  يستخدم هذا النظام معيار التشفير الموثوق <strong>AES-GCM بمفتاح 256 بت</strong> مع اشتقاق مفاتيح عبر <strong>PBKDF2 (100,000 دورة)</strong> ومتجه تهيئة عشوائي (IV) فريد لكل عملية حفظ، مما يمنع استخراج الفروض المحروسة أو مسودات عناصر الإجابة من حواسيب المؤسسة المشتركة أو إضافات المتصفح.
                </div>
              </div>

              {/* رمز الحماية الشخصي (Teacher Master PIN) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-black text-sm text-white">
                        رمز الحماية الإضافي (Teacher Master PIN)
                      </div>
                      <p className="text-xs text-slate-400">
                        {hasPin
                          ? "تم تفعيل رمز PIN لحماية بيانات الفروض المحلية برمز مخصص."
                          : "يمكنك إضافة رمز PIN مكون من 4 إلى 8 أرقام لمضاعفة أمان التشفير."}
                      </p>
                    </div>
                  </div>

                  {hasPin ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>PIN مفعّل</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePin}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg border border-rose-500/30 transition cursor-pointer"
                      >
                        إلغاء PIN
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPinInput((v) => !v)}
                      className="px-3 py-1.5 text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition cursor-pointer"
                    >
                      {showPinInput ? "إلغاء" : "تعيين رمز PIN"}
                    </button>
                  )}
                </div>

                {showPinInput && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={8}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="أدخل رمز PIN من 4 إلى 8 أرقام..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-center tracking-widest text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleSavePin}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      حفظ وتفعيل
                    </button>
                  </div>
                )}
              </div>

              {/* أداة فحص واختبار سرعة التشفير الذاتي (Crypto Benchmark) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-black text-sm text-white">
                        فحص واختبار سرعة محرك التشفير (Crypto Benchmark)
                      </div>
                      <p className="text-xs text-slate-400">
                        التحقق من سلامة خوارزمية AES-GCM وقياس زمن التشفير بالمللي ثانية (ms)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunBenchmark}
                    disabled={benchmarking}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${benchmarking ? "animate-spin" : ""}`} />
                    <span>{benchmarking ? "جاري الفحص..." : "بدء الفحص الذاتي"}</span>
                  </button>
                </div>

                {benchmarkResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      benchmarkResult.success
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                        : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{benchmarkResult.algorithm}</span>
                      </span>
                      <span className="font-mono text-cyan-300 font-black">
                        زمن التنفيذ: {benchmarkResult.durationMs} ms
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{benchmarkResult.details}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. تبويب أرشيف وثائق Google Drive */}
          {activeTab === "DRIVE_FILES" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-white">
                    الملفات والوثائق المحفوظة في Google Drive
                  </h3>
                  <p className="text-xs text-slate-400">
                    مجلد المنصة: «منصة الهندسة البيداغوجية - الرياضيات»
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onUploadCurrentDoc}
                  disabled={isUploading || !driveToken}
                  className="px-3 py-2 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{isUploading ? "جاري الحفظ..." : "حفظ الفرض الحالي في Drive"}</span>
                </button>
              </div>

              {isLoadingFiles ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>جاري قراءة ملفات Google Drive...</span>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-600" />
                  <div>لا توجد وثائق محفوظة بعد في مجلد Google Drive.</div>
                  {driveToken && (
                    <button
                      type="button"
                      onClick={onUploadCurrentDoc}
                      className="text-sky-400 underline font-bold cursor-pointer hover:text-sky-300"
                    >
                      احفظ الفرض المحروس الحالي الآن
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                          <Cloud className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate font-mono">
                            {file.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {file.description || "وثيقة بيداغوجية لمادة الرياضيات"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 transition"
                            title="فتح في Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setFileToConfirmDelete(file)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                          title="حذف الملف من Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* نافذة تأكيد الحذف من Google Drive (Workspace Skill Mandatory) */}
        {fileToConfirmDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-rose-500/60 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black text-white">
                  تأكيد حذف الملف من Google Drive
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف الملف التالي نهائياً من حساب Google Drive الخاص بك؟
                <br />
                <span className="font-mono font-bold text-amber-300 block mt-1.5 p-2 bg-slate-950 rounded-lg">
                  {fileToConfirmDelete.name}
                </span>
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFileToConfirmDelete(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = fileToConfirmDelete;
                    setFileToConfirmDelete(null);
                    onDeleteFile(target);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  نعم، احذف من Drive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة تأكيد استرجاع الإعدادات من Google Drive */}
        {showRestoreConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-sky-500/60 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-sky-400">
                <RotateCcw className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black text-white">
                  تأكيد استرجاع الإعدادات من Google Drive
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                سيتم استبدال تفضيلات الترويسة واسم المؤسسة والأستاذ وحزم LaTeX بالأحدث المحفوظة في ملف{" "}
                <span className="font-mono text-sky-300 font-bold">{SETTINGS_FILE_NAME}</span> على سحابة Google Drive.
                <br />
                هل تود المتابعة؟
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestoreConfirm(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRestoreConfirm(false);
                    onRestoreSettingsFromDrive();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
                >
                  استرجاع وتطبيق الإعدادات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* شريط الإغلاق السفلي */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>بيانات الفروض والأستاذ مشفرة ومحمية بـ AES-256 و Google OAuth2</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
