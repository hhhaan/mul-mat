'use client';

import { Coffee } from 'lucide-react';

export const MainBanner = () => {
    return (
        <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400  mt-4 p-5 mb-6 overflow-hidden shadow-md rounded-xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                </svg>
            </div>

            <div className="relative flex justify-between items-center">
                <div className="text-white z-10">
                    <h2 className="text-2xl font-bold mb-1">추출 수율 계산기</h2>
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full mt-2">
                        직관보다 데이터로 확인하고 개선하기
                    </div>
                </div>
                <div className="w-16 h-20 relative flex items-center justify-center z-10">
                    <Coffee size={36} className="text-white/80" />
                </div>
            </div>
        </div>
    );
};
