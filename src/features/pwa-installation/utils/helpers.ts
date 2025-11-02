import { isStandalone, storageUtils } from './utils';

export const STORAGE_KEY = 'homeScreenAddDontShowAgain';

export const shouldShowInstallModal = () => {
    // 이미 설치된 경우
    if (isStandalone()) {
        return false;
    }

    // 이미 설치하지 않기를 선택한 경우
    if (storageUtils.get(STORAGE_KEY)) {
        return false;
    }

    return true;
};
