import { Droplets } from 'lucide-react';

export const Header = () => {
    return (
        <header className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-5  overflow-hidden shadow-md">
            {/* 배경 장식용 SVG */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                </svg>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="relative z-10 flex items-center justify-between">
                {/* 왼쪽 텍스트 */}
                <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">우리 카페 물맛</h2>
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-xs py-1 px-2 rounded-full mt-2">
                        공공데이터 기반 정수장 수질 정보 제공
                    </div>
                </div>

                {/* 오른쪽 아이콘 */}
                <div className="w-16 h-20 flex items-center justify-center">
                    <Droplets size={36} className="text-white/80" />
                </div>
            </div>
        </header>
    );
};
