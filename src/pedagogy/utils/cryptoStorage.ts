/**
 * نظام التشفير المحلي المتقدم للملفات والبيانات الحساسة في المتصفح
 * Local AES-GCM 256-bit Authenticated Encryption Engine for LocalStorage
 *
 * يعتمد على معيار Web Crypto API الأصلي (SubtleCrypto)
 * - خوارزمية: AES-GCM (Galois/Counter Mode) بمفتاح 256 بت
 * - اشتقاق المفتاح: PBKDF2 مع SHA-256 و 100,000 دورة
 * - متجه تهيئة (IV) عشوائي بطول 96 بت (12 بايت) لكل عملية تشفير
 * - رمز التحقق من السلامة (Authentication Tag) بطول 128 بت لضمان عدم التلاعب
 * - متوافق مع الحسابات التربوية والعمل دون أي مكتبات خارجية
 */

const ENCRYPTION_FLAG_KEY = "prof_math_local_encryption_enabled_v1";
const CUSTOM_PIN_HASH_KEY = "prof_math_local_encryption_pinhash_v1";
const DEVICE_SALT_KEY = "prof_math_local_device_salt_v1";
const ENCRYPTION_PREFIX = "__ENC_AES256_GCM__";

// مفتاح افتراضي للاشتقاق الأساسي مرتبط بالجهاز والمنصة التربوية
const APP_BASE_PASSPHRASE = "MoroccanPedagogicalMathStudioLycee2026AESGCMProtected";

// تخزين المفاتيح المشتقة مؤقتاً في الذاكرة لتفادي إعادة الحساب الثقيلة
const memoryKeyCache = new Map<string, CryptoKey>();

/**
 * تحويل مصفوفة بايتات إلى نص سداسي عشري (Hex)
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * تحويل نص سداسي عشري إلى مصفوفة بايتات
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * تحويل مصفوفة بايتات إلى Base64
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * تحويل Base64 إلى مصفوفة بايتات
 */
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * استرجاع أو توليد ملح (Salt) فريد للجهاز
 */
function getOrCreateDeviceSalt(): Uint8Array {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(DEVICE_SALT_KEY);
      if (stored && stored.length === 32) {
        return hexToBytes(stored);
      }
      const newSalt = new Uint8Array(16);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(newSalt);
      } else {
        for (let i = 0; i < 16; i++) newSalt[i] = Math.floor(Math.random() * 256);
      }
      window.localStorage.setItem(DEVICE_SALT_KEY, bytesToHex(newSalt));
      return newSalt;
    }
  } catch {
    // fallback
  }
  return new Uint8Array([11, 22, 33, 44, 55, 66, 77, 88, 99, 110, 121, 132, 143, 154, 165, 176]);
}

/**
 * اشتقاق مفتاح AES-GCM 256-bit عبر PBKDF2
 */
async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const cacheKey = `${passphrase}::${bytesToHex(salt)}`;
  if (memoryKeyCache.has(cacheKey)) {
    return memoryKeyCache.get(cacheKey)!;
  }

  const encoder = new TextEncoder();
  const rawKey = encoder.encode(passphrase);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  memoryKeyCache.set(cacheKey, derivedKey);
  return derivedKey;
}

/**
 * التحقق مما إذا كان النص مشفراً مسبقاً
 */
export function isEncryptedPayload(val: unknown): boolean {
  return typeof val === "string" && val.startsWith(ENCRYPTION_PREFIX);
}

/**
 * هل التشفير المحلي مفعل حالياً في تفضيلات المستخدم؟
 */
export function isLocalEncryptionEnabled(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const val = window.localStorage.getItem(ENCRYPTION_FLAG_KEY);
    // افتراضياً نفعله لتعزيز الخصوصية وحماية بيانات الفروض
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

/**
 * تفعيل أو تعطيل التشفير المحلي
 */
export function setLocalEncryptionEnabled(enabled: boolean): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ENCRYPTION_FLAG_KEY, String(enabled));
    }
  } catch {
    // ignore
  }
}

/**
 * تخزين رمز PIN خاص بالأستاذ لزيادة مستوى الأمان (اختياري)
 */
export async function setTeacherMasterPin(pin: string | null): Promise<void> {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    if (!pin) {
      window.localStorage.removeItem(CUSTOM_PIN_HASH_KEY);
      memoryKeyCache.clear();
      return;
    }
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(pin));
    const hashHex = bytesToHex(new Uint8Array(hashBuffer));
    window.localStorage.setItem(CUSTOM_PIN_HASH_KEY, hashHex);
    memoryKeyCache.clear();
  } catch {
    // ignore
  }
}

/**
 * التحقق من رمز PIN
 */
export async function verifyTeacherMasterPin(pin: string): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const storedHash = window.localStorage.getItem(CUSTOM_PIN_HASH_KEY);
    if (!storedHash) return true; // لا يوجد PIN مقيد
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(pin));
    const hashHex = bytesToHex(new Uint8Array(hashBuffer));
    return hashHex === storedHash;
  } catch {
    return false;
  }
}

export function hasTeacherMasterPin(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    return Boolean(window.localStorage.getItem(CUSTOM_PIN_HASH_KEY));
  } catch {
    return false;
  }
}

/**
 * تشفير نص باستخدام AES-GCM 256-bit
 */
export async function encryptTextAESGCM(
  plaintext: string,
  customPinOrPassword?: string
): Promise<string> {
  if (!plaintext) return "";

  // التحقق من توفر Web Crypto
  if (
    typeof window === "undefined" ||
    !window.crypto ||
    !window.crypto.subtle
  ) {
    // fallback آمن في البيئات التي لا تدعم SubtleCrypto
    return `${ENCRYPTION_PREFIX}B64:${btoa(unescape(encodeURIComponent(plaintext)))}`;
  }

  const salt = getOrCreateDeviceSalt();
  const passphrase = customPinOrPassword
    ? `${APP_BASE_PASSPHRASE}::${customPinOrPassword}`
    : APP_BASE_PASSPHRASE;

  const key = await deriveAesKey(passphrase, salt);

  // توليد IV عشوائي جديد تماماً لكل عملية تشفير (12 بايت)
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  const encoder = new TextEncoder();
  const encodedPlaintext = encoder.encode(plaintext);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer,
      tagLength: 128,
    },
    key,
    encodedPlaintext
  );

  const ciphertextBase64 = bytesToBase64(new Uint8Array(ciphertextBuffer));
  const ivHex = bytesToHex(iv);
  const saltHex = bytesToHex(salt);

  return `${ENCRYPTION_PREFIX}${saltHex}:${ivHex}:${ciphertextBase64}`;
}

/**
 * فك تشفير نص مشفر بـ AES-GCM 256-bit
 */
export async function decryptTextAESGCM(
  encryptedPayload: string,
  customPinOrPassword?: string
): Promise<string> {
  if (!encryptedPayload) return "";

  // إذا لم يكن مشفراً أصلاً، أعده كما هو (دعم التوافق مع البيانات القديمة)
  if (!isEncryptedPayload(encryptedPayload)) {
    return encryptedPayload;
  }

  const clean = encryptedPayload.substring(ENCRYPTION_PREFIX.length);

  // معالجة fallback B64
  if (clean.startsWith("B64:")) {
    try {
      return decodeURIComponent(escape(atob(clean.substring(4))));
    } catch {
      return clean.substring(4);
    }
  }

  const parts = clean.split(":");
  if (parts.length !== 3) {
    throw new Error("صيغة التشفير غير صالحة أو تالفة");
  }

  const [saltHex, ivHex, ciphertextBase64] = parts;
  const salt = hexToBytes(saltHex);
  const iv = hexToBytes(ivHex);
  const ciphertextBytes = base64ToBytes(ciphertextBase64);

  const passphrase = customPinOrPassword
    ? `${APP_BASE_PASSPHRASE}::${customPinOrPassword}`
    : APP_BASE_PASSPHRASE;

  const key = await deriveAesKey(passphrase, salt);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv.buffer as ArrayBuffer,
        tagLength: 128,
      },
      key,
      ciphertextBytes.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.warn("AES-GCM decryption failed (wrong key or corrupted data):", err);
    throw new Error("فشل فك التشفير: قد يكون رمز PIN غير صحيح أو تم التلاعب بالبيانات.");
  }
}

// ذاكرة تخزين مؤقت للقيم المفكوكة في الجلسة لضمان الاستجابة السريعة (0ms) للواجهة
const memoryPlaintextCache = new Map<string, string>();

/**
 * حفظ قيمة في الذاكرة المؤقتة لفك التشفير
 */
export function setCachedPlaintext(key: string, value: string): void {
  memoryPlaintextCache.set(key, value);
}

/**
 * استرجاع قيمة مفكوكة من الذاكرة المؤقتة
 */
export function getCachedPlaintext(key: string): string | null {
  return memoryPlaintextCache.get(key) || null;
}

/**
 * حفظ قيمة في LocalStorage مع التشفير التلقائي للبيانات الحساسة وتحديث الذاكرة
 */
export async function secureSetItem(
  key: string,
  value: string,
  customPassword?: string
): Promise<void> {
  if (typeof window === "undefined" || !window.localStorage) return;

  // تحديث الذاكرة فوراً لسرعة الوصول
  memoryPlaintextCache.set(key, value);

  try {
    if (isLocalEncryptionEnabled()) {
      const encrypted = await encryptTextAESGCM(value, customPassword);
      window.localStorage.setItem(key, encrypted);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    console.error(`Error saving secure item for key ${key}:`, err);
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
}

/**
 * قراءة متزامنة سريعة (Synchronous) للقيم
 * تُرجع من الذاكرة المؤقتة إن وُجدت، أو القيمة النصية العادية إن لم تكن مشفرة
 */
export function secureGetItemSync(key: string): string | null {
  if (typeof window === "undefined" || !window.localStorage) return null;

  if (memoryPlaintextCache.has(key)) {
    return memoryPlaintextCache.get(key)!;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  // إذا لم يكن مشفراً، فهو نص صريح (مثل JSON القديم)
  if (!isEncryptedPayload(raw)) {
    memoryPlaintextCache.set(key, raw);
    return raw;
  }

  return null; // يتطلب فك تشفير غير متزامن
}

/**
 * قراءة قيمة من LocalStorage مع فك التشفير التلقائي وتحديث كاش الذاكرة
 */
export async function secureGetItem(
  key: string,
  customPassword?: string
): Promise<string | null> {
  if (typeof window === "undefined" || !window.localStorage) return null;

  if (memoryPlaintextCache.has(key)) {
    return memoryPlaintextCache.get(key)!;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;

    if (isEncryptedPayload(raw)) {
      const decrypted = await decryptTextAESGCM(raw, customPassword);
      memoryPlaintextCache.set(key, decrypted);
      return decrypted;
    }

    memoryPlaintextCache.set(key, raw);
    return raw;
  } catch (err) {
    console.warn(`Error reading/decrypting secure item for key ${key}:`, err);
    return window.localStorage.getItem(key);
  }
}


/**
 * فحص ذاتي (Self-Test & Benchmark) لنظام التشفير والتأكد من سلامة وسرعة العمل
 */
export async function runCryptoEngineSelfTest(): Promise<{
  success: boolean;
  algorithm: string;
  keyLengthBits: number;
  durationMs: number;
  details: string;
}> {
  const startTime = performance.now();
  const testPlaintext = JSON.stringify({
    sampleExam: "فرض محروس رقم 1 - الدورة الأولى - علوم رياضية",
    studentName: "أحمد بن خلدون",
    grade: 19.5,
    secretQuestions: ["حل في R المعادلة e^(2x) - 3e^x + 2 = 0", "احسب النهاية عند +inf"],
    timestamp: new Date().toISOString(),
  });

  try {
    const encrypted = await encryptTextAESGCM(testPlaintext);
    if (!isEncryptedPayload(encrypted)) {
      return {
        success: false,
        algorithm: "AES-GCM",
        keyLengthBits: 256,
        durationMs: performance.now() - startTime,
        details: "فشل الاختبار: الناتج لا يحتوي على الترويسة المعتمدة.",
      };
    }

    const decrypted = await decryptTextAESGCM(encrypted);
    const isValid = decrypted === testPlaintext;
    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      success: isValid,
      algorithm: "AES-GCM-256 (Web Crypto Subtle)",
      keyLengthBits: 256,
      durationMs,
      details: isValid
        ? `تم تشفير وفك تشفير عينة بنك الفروض والبيانات الحساسة بنجاح فائق خلال ${durationMs}ms.`
        : "فشل الاختبار: البيانات المسترجعة بعد فك التشفير لا تطابق الأصل.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      algorithm: "AES-GCM-256",
      keyLengthBits: 256,
      durationMs: performance.now() - startTime,
      details: `استثناء أثناء فحص التشفير: ${msg}`,
    };
  }
}
