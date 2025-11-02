export type PlatformType = 'ios' | 'android' | 'desktop' | 'other';
export type BrowserType =
    | 'chrome'
    | 'firefox'
    | 'edge'
    | 'safari'
    | 'chrome-ios'
    | 'firefox-ios'
    | 'edge-ios'
    | 'samsung'
    | 'other';

export const detectEnvironment = (): { platform: PlatformType; browser: BrowserType } => {
    const userAgent = navigator.userAgent || navigator.vendor || window.navigator.userAgent;

    // 플랫폼 감지
    let platform: PlatformType = 'other';
    if (/iPad|iPhone|iPod/.test(userAgent)) {
        platform = 'ios';
    } else if (/android/i.test(userAgent)) {
        platform = 'android';
    } else {
        platform = 'desktop';
    }

    // 브라우저 감지
    let browser: BrowserType = 'other';
    if (/CriOS/i.test(userAgent)) {
        browser = 'chrome-ios'; // iOS의 Chrome
    } else if (/FxiOS/i.test(userAgent)) {
        browser = 'firefox-ios'; // iOS의 Firefox
    } else if (/EdgiOS/i.test(userAgent)) {
        browser = 'edge-ios'; // iOS의 Edge
    } else if (/SamsungBrowser/i.test(userAgent)) {
        browser = 'samsung'; // 삼성 브라우저
    } else if (/Edg/i.test(userAgent)) {
        browser = 'edge'; // 엣지
    } else if (/Firefox/i.test(userAgent)) {
        browser = 'firefox'; // 파이어폭스
    } else if (/Chrome/i.test(userAgent)) {
        browser = 'chrome'; // 크롬
    } else if (/Safari/i.test(userAgent)) {
        browser = 'safari'; // 사파리
    }

    return { platform, browser };
};

export const isStandalone = () => {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        document.referrer.includes('android-app://') ||
        (window.navigator as any)?.standalone === true
    );
};

export const storageUtils = {
    get: (key: string): boolean => {
        try {
            return localStorage.getItem(key) === 'true';
        } catch (error) {
            console.error('로컬 스토리지 읽기 중 오류:', error);
            return false;
        }
    },

    set: (key: string, value: boolean): boolean => {
        try {
            localStorage.setItem(key, value.toString());
            return true;
        } catch (error) {
            console.error('로컬 스토리지 저장 중 오류:', error);
            return false;
        }
    },
};
