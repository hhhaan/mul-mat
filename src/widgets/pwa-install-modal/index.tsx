'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Share, X, Box, MoreVertical, Download, MonitorDown } from 'lucide-react';

import { storageUtils } from '@/src/features/pwa-install/utils';
import { detectEnvironment, isStandalone } from '@/src/features/pwa-install/utils';

// 컴포넌트 외부로 인터페이스 이동
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [platform, setPlatform] = useState('other');
    const [browser, setBrowser] = useState('other');
    const [canInstall, setCanInstall] = useState(false);

    const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    // PWA 설치 함수
    const installApp = async () => {
        if (deferredPrompt.current) {
            // 설치 프롬프트 표시
            deferredPrompt.current.prompt();

            // 사용자의 응답을 기다림
            const { outcome } = await deferredPrompt.current.userChoice;

            // 결과 처리
            if (outcome === 'accepted') {
                console.log('사용자가 PWA 설치를 수락했습니다');
                setShowModal(false);
            } else {
                console.log('사용자가 PWA 설치를 거부했습니다');
            }

            // 프롬프트 참조 정리
            deferredPrompt.current = null;
            setCanInstall(false);
        }
    };

    // 모달 표시 여부 결정 함수
    const determineModalVisibility = useCallback(() => {
        // 이미 설치된 PWA인 경우
        if (isStandalone()) {
            setShowModal(false);
            return;
        }

        // 사용자가 '다시 보지 않기' 선택한 경우
        if (storageUtils.get('homeScreenAddDontShowAgain')) {
            setShowModal(false);
            return;
        }

        // 마지막으로 '나중에 다시 알림 받기'를 선택한 시간 확인
        if (storageUtils.get('homeScreenAddPostponed')) {
            const lastPostponedTimeStr = localStorage.getItem('homeScreenAddLastPostponedTime');
            if (lastPostponedTimeStr) {
                const now = new Date().getTime();
                const postponedTime = Number(lastPostponedTimeStr);
                // 24시간(86400000ms) 경과 확인
                if (now - postponedTime < 86400000) {
                    setShowModal(false);
                    return;
                }
            }
        }

        // 설치 가능 여부와 관계없이 먼저 모달 표시
        setShowModal(true);
    }, []);

    useEffect(() => {
        // 플랫폼 및 브라우저 감지
        const { platform, browser } = detectEnvironment();
        setPlatform(platform);
        setBrowser(browser);

        // beforeinstallprompt 이벤트 리스너 등록
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            // 기본 브라우저 설치 프롬프트 방지
            e.preventDefault();

            // 이벤트 저장
            deferredPrompt.current = e;

            // 설치 가능 상태로 설정
            setCanInstall(true);

            // 이미 다시 보지 않기를 선택했거나 이미 설치된 경우는 제외
            if (!storageUtils.get('homeScreenAddDontShowAgain') && !isStandalone()) {
                // 마지막으로 '나중에 다시 알림 받기'를 선택한 시간 확인
                if (storageUtils.get('homeScreenAddPostponed')) {
                    const lastPostponedTimeStr = localStorage.getItem('homeScreenAddLastPostponedTime');
                    if (lastPostponedTimeStr) {
                        const now = new Date().getTime();
                        const postponedTime = Number(lastPostponedTimeStr);
                        // 24시간(86400000ms) 경과했거나 값이 없는 경우에만 표시
                        if (now - postponedTime >= 86400000) {
                            setShowModal(true);
                        }
                    } else {
                        setShowModal(true);
                    }
                } else {
                    setShowModal(true);
                }
            }
        };

        const handleAppInstalled = () => {
            console.log('PWA가 성공적으로 설치되었습니다');
            setShowModal(false);
            setCanInstall(false);
            deferredPrompt.current = null;
        };

        // 이벤트 리스너 등록
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // 컴포넌트 마운트 후 모달 표시 여부 결정
        const timer = setTimeout(() => {
            determineModalVisibility();
        }, 100);

        // 클린업
        return () => {
            clearTimeout(timer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [determineModalVisibility]);

    const handleClose = () => {
        try {
            // 나중에 다시 알림 받기 - 불리언 값 저장 및 현재 시간을 로컬 스토리지에 저장
            storageUtils.set('homeScreenAddPostponed', true);
            // 타임스탬프는 일반 localStorage에 직접 저장 (storageUtils가 불리언만 지원하는 경우)
            localStorage.setItem('homeScreenAddLastPostponedTime', new Date().getTime().toString());
            console.log('다음 알림은 24시간 후에 표시됩니다.');
            setShowModal(false);
        } catch (error) {
            console.error('로컬 스토리지 저장 중 오류:', error);
            setShowModal(false);
        }
    };

    const handleDontShowAgain = () => {
        try {
            storageUtils.set('homeScreenAddDontShowAgain', true);
            console.log('다시 보지 않기 설정이 저장되었습니다.');

            const saved = storageUtils.get('homeScreenAddDontShowAgain') === true;
            console.log('설정 저장 확인:', saved);

            setShowModal(false);
        } catch (error) {
            console.error('로컬 스토리지 저장 중 오류:', error);
            setShowModal(false);
        }
    };

    if (!showModal) return null;

    // 플랫폼 및 브라우저별 설치 안내
    const getInstructions = () => {
        if (platform === 'ios') {
            if (browser === 'safari') {
                return (
                    <div className="space-y-4 ">
                        <p className="font-medium text-gray-800">Safari에서 홈 화면에 추가하려면:</p>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                1
                            </div>
                            <div>
                                <p className="text-gray-800">하단의 공유 버튼을 탭하세요</p>
                                <div className="mt-1 bg-gray-100 rounded-lg p-2 inline-block">
                                    <Share className="text-gray-600" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                2
                            </div>
                            <p className="text-gray-800">
                                아래로 스크롤하여 <span className="font-medium">&quot;홈 화면에 추가&quot;</span> 버튼을
                                탭하세요
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                3
                            </div>
                            <p className="text-gray-800">
                                오른쪽 상단의 <span className="font-medium">&quot;추가&quot;</span> 버튼을 탭하세요
                            </p>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">iOS에서 최상의 경험을 위해:</p>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <p className="text-gray-700">
                                Safari 브라우저에서 이 웹사이트를 열어주세요. 다른 브라우저에서는 홈 화면 추가 기능이
                                제한될 수 있습니다.
                            </p>
                        </div>
                    </div>
                );
            }
        } else if (platform === 'android') {
            if ((browser === 'chrome' || browser === 'samsung') && canInstall) {
                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">앱을 홈 화면에 설치하세요:</p>
                        <button
                            onClick={installApp}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            <Download className="mr-2" size={20} />앱 설치하기
                        </button>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            설치 후 홈 화면에서 빠르게 접근할 수 있습니다.
                        </p>
                    </div>
                );
            } else if (browser === 'chrome' || browser === 'samsung') {
                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">
                            {browser === 'chrome' ? 'Chrome' : '삼성 브라우저'}에서 홈 화면에 추가하려면:
                        </p>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                1
                            </div>
                            <div>
                                <p className="text-gray-800">메뉴 버튼을 탭하세요</p>
                                <div className="mt-1 bg-gray-100 rounded-lg p-2 inline-block">
                                    <MoreVertical className="text-gray-600" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                2
                            </div>
                            <p className="text-gray-800">
                                <span className="font-medium">&quot;홈 화면에 추가&quot;</span> 또는{' '}
                                <span className="font-medium">&quot;앱 설치&quot;</span> 옵션을 선택하세요
                            </p>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">Android에서 최상의 경험을 위해:</p>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <p className="text-gray-700">
                                Chrome 또는 삼성 브라우저에서 이 웹사이트를 열어주세요. 다른 브라우저에서는 홈 화면 추가
                                기능이 제한될 수 있습니다.
                            </p>
                        </div>
                    </div>
                );
            }
        } else {
            // 데스크톱
            if (canInstall) {
                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">데스크톱에서 앱 설치하기:</p>
                        <button
                            onClick={installApp}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            <Download className="mr-2" size={20} />앱 설치하기
                        </button>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            설치 후 바탕화면에서 앱을 실행할 수 있습니다.
                        </p>
                    </div>
                );
            } else {
                // 데스크톱에 맞는 자세한 안내
                const getBrowserSpecificInstructions = () => {
                    if (browser === 'chrome') {
                        return (
                            <>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                        1
                                    </div>
                                    <div>
                                        <p className="text-gray-800">
                                            Chrome 주소 표시줄 오른쪽의 설치 아이콘을 클릭하세요
                                        </p>
                                        <div className="mt-1 bg-gray-100 rounded-lg p-2 inline-block">
                                            <MonitorDown className="text-gray-600" size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                        2
                                    </div>
                                    <p className="text-gray-800">
                                        <span className="font-medium">&quot;설치&quot;</span> 버튼을 클릭하세요
                                    </p>
                                </div>
                            </>
                        );
                    } else if (browser === 'edge') {
                        return (
                            <>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                        1
                                    </div>
                                    <div>
                                        <p className="text-gray-800">Edge 메뉴(...)를 클릭하세요</p>
                                        <div className="mt-1 bg-gray-100 rounded-lg p-2 inline-block">
                                            <MoreVertical className="text-gray-600" size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 text-sky-600 font-medium">
                                        2
                                    </div>
                                    <p className="text-gray-800">
                                        <span className="font-medium">&quot;앱 설치&quot;</span> 메뉴를 선택하세요
                                    </p>
                                </div>
                            </>
                        );
                    } else if (browser === 'firefox') {
                        return (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <p className="text-gray-700">
                                    Firefox에서는 주소 표시줄에 + 아이콘이 표시되면 클릭하여 앱을 설치할 수 있습니다.
                                    아이콘이 보이지 않는 경우, Chrome이나 Edge 브라우저에서 접속해 보세요.
                                </p>
                            </div>
                        );
                    } else {
                        return (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <p className="text-gray-700">
                                    Chrome, Edge 또는 Safari 브라우저에서 접속하면 앱을 설치할 수 있습니다.
                                </p>
                            </div>
                        );
                    }
                };

                return (
                    <div className="space-y-4">
                        <p className="font-medium text-gray-800">데스크톱에서 앱 설치하기:</p>
                        {getBrowserSpecificInstructions()}
                        <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-gray-700 text-sm">
                                💡 앱을 설치하면 바탕화면에 아이콘이 생성되어 빠르게 접근할 수 있고, 브라우저 탭 없이
                                독립 창으로 실행되어 더 편리하게 사용할 수 있습니다.
                            </p>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <div className="bg-sky-100 p-2 rounded-full mr-3">
                            <Box className="text-sky-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">홈 화면에 추가하기 </h2>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="mb-4 text-gray-700">우리 앱을 홈 화면에 추가하여 더 빠르고 편리하게 이용하세요!</p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">{getInstructions()}</div>
                </div>

                <div className="flex flex-col space-y-3">
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleDontShowAgain}
                            className="text-sm text-gray-500 hover:text-gray-700 py-1 px-2"
                        >
                            다시 보지 않기
                        </button>
                    </div>
                    <button
                        onClick={handleClose}
                        className="bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                        하루 뒤에 다시 알림 받기
                    </button>
                </div>
            </div>
        </div>
    );
};
