import { useRouter, usePathname } from 'next/navigation';
import { Search, Calculator, Droplets, Coffee } from 'lucide-react';

export const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();

    // URL 경로에 따라 활성 탭 결정
    const getActiveTab = (path: string) => {
        if (path === '/') return 'search';
        if (path === '/calculator') return 'calculator';
        if (path === '/bottled-water') return 'quality';
        if (path === '/my-page') return 'cafe';
        return 'search';
    };

    const activeTab = getActiveTab(pathname);

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-transparent pointer-events-none">
            <nav className="w-full max-w-md bg-white border-t border-gray-200 px-2 pt-2 py-4 pointer-events-auto">
                <div className="flex justify-around">
                    <button
                        className={`flex flex-col items-center p-2 ${
                            activeTab === 'search' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => {
                            router.push('/');
                        }}
                    >
                        <Search size={20} />
                        <span className="text-xs mt-1">검색</span>
                    </button>

                    <button
                        className={`flex flex-col items-center p-2 ${
                            activeTab === 'calculator' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => {
                            router.push('/calculator');
                        }}
                    >
                        <Calculator size={20} />
                        <span className="text-xs mt-1">수율 측정기</span>
                    </button>

                    <button
                        className={`flex flex-col items-center p-2 ${
                            activeTab === 'quality' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => {
                            router.push('/bottled-water');
                        }}
                    >
                        <Droplets size={20} />
                        <span className="text-xs mt-1">수질정보</span>
                    </button>

                    <button
                        className={`flex flex-col items-center p-2 ${
                            activeTab === 'cafe' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => {
                            router.push('/my-page');
                        }}
                    >
                        <Coffee size={20} />
                        <span className="text-xs mt-1">마이페이지</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
