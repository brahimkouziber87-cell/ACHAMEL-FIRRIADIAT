import { useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [hasTouchOrStylus, setHasTouchOrStylus] = useState<boolean>(false);

  useEffect(() => {
    // التحقق من تشغيل التطبيق في وضع التطبيق المستقل (Standalone PWA / WebAPK / Desktop App)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      Boolean((window as unknown as { kouziberDesktopBridge?: unknown }).kouziberDesktopBridge);
    setIsInstalled(isStandalone);

    // التحقق الدقيق من نوع الجهاز (سطح مكتب، لوح إلكتروني iPad / Android Tablet / Surface، أو هاتف)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const maxTouch = window.navigator.maxTouchPoints || 0;
    const isIPadOS =
      /ipad/.test(userAgent) ||
      (/macintosh/.test(userAgent) && maxTouch > 1);
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || isIPadOS;
    const isAndroidDevice = /android/.test(userAgent);
    const isAndroidTablet = isAndroidDevice && !/mobile/.test(userAgent);
    const screenShortSide = Math.min(window.screen.width, window.screen.height);
    const screenLongSide = Math.max(window.screen.width, window.screen.height);
    const isTouchTabletScreen =
      maxTouch > 0 && screenShortSide >= 600 && screenLongSide <= 1600;

    const detectedTablet = Boolean(isIPadOS || isAndroidTablet || isTouchTabletScreen);
    const detectedDesktop = !isIOSDevice && !isAndroidDevice && !detectedTablet;

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsTablet(detectedTablet);
    setIsDesktop(detectedDesktop);
    setHasTouchOrStylus(maxTouch > 0 || "ontouchstart" in window);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isTablet,
    isDesktop,
    hasTouchOrStylus,
    install,
    deferredPrompt,
  };
}
