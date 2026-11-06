/**
 * authMiddleware.ts
 * ------------------------------------------------------------------
 * مصادقة اختيارية/إلزامية لواجهات API الحساسة باستخدام Firebase ID Token.
 *
 * السلوك:
 *  - إن ضُبطت بيانات خدمة Firebase (FIREBASE_SERVICE_ACCOUNT_JSON) أو كانت
 *    Application Default Credentials متاحة، تُفعَّل المصادقة تلقائياً ويصبح
 *    كل طلب إلى مسارات AI ومسارات المشاركة ملزماً بـ:
 *        Authorization: Bearer <Firebase ID Token>
 *  - إن لم تُضبط، يبقى الخادم في "وضع التطوير" (حماية بتحديد المعدل فقط)
 *    مع تحذير واضح في السجل. ويمكن فرض الرفض الكامل عبر REQUIRE_AI_AUTH=true.
 *
 * ملاحظة: لا تُستورد أي مفاتيح خاصة داخل الكود؛ كل شيء من متغيرات البيئة.
 */
import type { NextFunction, Request, Response } from "express";

type FirebaseAuth = {
  verifyIdToken(token: string, checkRevoked?: boolean): Promise<Record<string, unknown>>;
};

let adminAuth: FirebaseAuth | null = null;
let initAttempted = false;
let initErrorMessage: string | null = null;

function describeError(err: unknown): string {
  if (!err) return "unknown error";
  if (typeof err === "string") return err;
  const anyErr = err as { message?: string; code?: string };
  return [anyErr.code, anyErr.message].filter(Boolean).join(": ") || String(err);
}

/** يقرأ حساب الخدمة من متغير البيئة إن وُجد. */
function readServiceAccount(): Record<string, unknown> | null {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.project_id && parsed.private_key) {
      // دعم الأسطر الجديدة عند تمرير المفتاح داخل JSON في متغير بيئة واحد.
      parsed.private_key = String(parsed.private_key).replace(/\\n/g, "\n");
      return parsed as Record<string, unknown>;
    }
    throw new Error("missing project_id/private_key fields");
  } catch (err) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid: " + describeError(err));
  }
}

/**
 * تهيئة Firebase Admin مرة واحدة عند بدء الخادم.
 * لا تُفشل تشغيل الخادم عند غياب البيانات: تسجّل تحذيراً وتتابع بوضع التطوير.
 */
export async function initApiAuth(): Promise<void> {
  if (initAttempted) return;
  initAttempted = true;

  let serviceAccount: Record<string, unknown> | null = null;
  try {
    serviceAccount = readServiceAccount();
  } catch (err) {
    initErrorMessage = describeError(err);
    console.error("[auth] " + initErrorMessage);
    return;
  }

  try {
    const { initializeApp, getApps, getApp, cert, applicationDefault } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    if (getApps().length === 0) {
      initializeApp(
        serviceAccount
          ? { credential: cert(serviceAccount as Parameters<typeof cert>[0]) }
          : { credential: applicationDefault() }
      );
    }

    // ------------------------------------------------------------------
    // IMPORTANT: applicationDefault() resolves even when no credentials
    // exist (it falls back to a lazy Compute/metadata credential). Without
    // this sanity check the guard would activate and reject every request
    // with 401 on machines that have no Firebase Admin credentials at all.
    // We therefore require a real, fetchable access token before enabling.
    // ------------------------------------------------------------------
    if (!serviceAccount) {
      const app = getApp();
      const projectId = app.options.projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
      if (!projectId) {
        throw new Error("no Firebase project id (set GOOGLE_CLOUD_PROJECT or FIREBASE_SERVICE_ACCOUNT_JSON)");
      }

      const credential = app.options.credential as
        | { getAccessToken?: () => Promise<{ access_token?: string } | null> }
        | undefined;

      if (credential && typeof credential.getAccessToken === "function") {
        const token = await Promise.race([
          credential.getAccessToken(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        if (!token || !token.access_token) {
          throw new Error("application default credentials could not obtain an access token");
        }
      }
    }

    adminAuth = getAuth() as unknown as FirebaseAuth;
    console.log("[auth] Firebase ID-token verification is ENABLED for protected API routes.");
  } catch (err) {
    initErrorMessage = describeError(err);
    console.warn(
      "[auth] Firebase Admin is not configured (" + initErrorMessage + "). " +
      "AI and sharing APIs stay protected by rate limiting only. " +
      "Set FIREBASE_SERVICE_ACCOUNT_JSON (and optionally REQUIRE_AI_AUTH=true) in production."
    );
  }
}

export function isApiAuthEnforced(): boolean {
  return adminAuth !== null;
}

/**
 * حارس المسارات الحساسة.
 * - عند تفعيل المصادقة: يرفض الطلب بدون توكن صالح (401).
 * - عند التعطيل: يسمح بالمرور إلا إذا كان REQUIRE_AI_AUTH=true (503).
 */
export function aiAuthGuard(req: Request, res: Response, next: NextFunction): void {
  const requireExplicitly = process.env.REQUIRE_AI_AUTH === "true";

  if (!adminAuth) {
    if (requireExplicitly) {
      res.status(503).json({
        error: "خدمة المصادقة غير مهيأة على الخادم. يرجى ضبط بيانات خدمة Firebase أولاً.",
        code: "AUTH_NOT_CONFIGURED",
      });
      return;
    }
    next();
    return;
  }

  const header = String(req.headers.authorization || "");
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    res.status(401).json({
      error: "يجب تسجيل الدخول بحساب Google للوصول إلى هذه الخدمة.",
      code: "AUTH_REQUIRED",
    });
    return;
  }

  adminAuth
    .verifyIdToken(token, false)
    .then((decoded) => {
      (req as Request & { authUser?: Record<string, unknown> }).authUser = decoded;
      next();
    })
    .catch(() => {
      res.status(401).json({
        error: "انتهت صلاحية الجلسة أو أن التوكن غير صالح. يرجى إعادة تسجيل الدخول.",
        code: "INVALID_TOKEN",
      });
    });
}
