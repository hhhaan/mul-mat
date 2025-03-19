'use client';
import { Layout } from '@/src/widgets/Layout';
import { Droplets, Search } from 'lucide-react';
import { useState } from 'react';

export const HomeScreen = () => {
    return (
        <Layout>
            <Header />
            <SearchArea />
            <div></div>
        </Layout>
    );
};

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 shadow-lg">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Droplets className="text-white" />
                    </div>
                    우리 카페 물맛
                </h1>
                <p className="text-sm mt-1 opacity-90">커피 맛을 좌우하는 수질 정보를 무료로 확인해보세요</p>
            </div>
        </header>
    );
};

const SearchArea = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="px-4 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center">
                    <div className="flex-1">
                        <div
                            className={`flex border ${
                                isSearchFocused ? 'border-blue-500 ring-1 ring-blue-100' : 'border-gray-300'
                            } rounded-lg overflow-hidden transition-all duration-200`}
                            // onClick={}
                        >
                            <input
                                type="text"
                                className="flex-1 p-2 text-sm focus:outline-none text-gray-700"
                                placeholder="지역명 입력 (예: 서울시 강남구)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <button className="bg-blue-500 text-white px-3 hover:bg-blue-600 transition-colors duration-200">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
