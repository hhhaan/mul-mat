'use client';
import { Layout } from '@/src/widgets/Layout';
import { Droplet, Coffee, Droplets, ChevronDown, AlertTriangle, Search } from 'lucide-react';
import { useState } from 'react';

// 수질 상태 평가 함수
const getQualityStatus = (value, type) => {
    // 기존 함수 내용
    // 실제 구현은 별도로 해야 합니다
    return {
        status: '적정',
        bgColor: 'bg-green-100',
        color: 'text-green-800',
        forCoffee: '적합한 수준입니다',
    };
};

export const HomeScreen = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 실제 앱에서는 API 호출 등으로 데이터를 가져옵니다
    const sampleData = {
        location: '서울시 강남구',
        lastUpdated: '2025년 3월 19일',
        waterQuality: {
            hardness: 85,
            ph: 7.2,
            tds: 210,
            minerals: {
                calcium: 32,
                magnesium: 18,
                sodium: 12,
            },
        },
        recommendation:
            '이 지역의 물은 중간 정도의 경도를 가지고 있어 밝은 로스팅의, 다양한 풍미가 있는 싱글 오리진 커피에 적합합니다. 추출 온도는 92-94°C가 적절하며, 미디엄-핀 그라인드 설정을 권장합니다.',
    };

    return (
        <Layout>
            <Header />
            <SearchInput />

            <div className="px-4 pb-4 flex-1">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">수질 정보</h2>
                            <p className="text-xs text-gray-500">최종 업데이트: {sampleData.lastUpdated}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 py-1 px-2 rounded-full text-xs font-medium">
                            {sampleData.location}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-4">
                        {/* 경도 */}
                        <WaterQualityCard
                            icon={<Droplet size={16} className="text-blue-500 mr-1" />}
                            title="경도 (Hardness)"
                            value={sampleData.waterQuality.hardness}
                            unit="mg/L"
                            statusInfo={getQualityStatus(sampleData.waterQuality.hardness, 'hardness')}
                        />

                        {/* pH */}
                        <WaterQualityCard
                            icon={<Droplet size={16} className="text-purple-500 mr-1" />}
                            title="pH"
                            value={sampleData.waterQuality.ph}
                            unit=""
                            statusInfo={getQualityStatus(sampleData.waterQuality.ph, 'ph')}
                        />

                        {/* TDS */}
                        <WaterQualityCard
                            icon={<Droplet size={16} className="text-green-500 mr-1" />}
                            title="TDS (총 용존 고형물)"
                            value={sampleData.waterQuality.tds}
                            unit="mg/L"
                            statusInfo={getQualityStatus(sampleData.waterQuality.tds, 'tds')}
                        />
                    </div>

                    {/* 미네랄 성분 */}
                    <MineralsSection
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                        minerals={sampleData.waterQuality.minerals}
                    />

                    {/* 커피 추천 */}
                    <CoffeeRecommendation recommendation={sampleData.recommendation} />
                </div>

                {/* 카페 필터 정보 */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="border-b border-gray-100 pb-2 mb-3">
                        <h2 className="text-lg font-bold text-gray-800">카페 필터 시스템 관리</h2>
                    </div>

                    <FilterManagementAlert />
                    <Disclaimer />
                </div>
            </div>
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

const SearchInput = () => {
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

const WaterQualityCard = ({ icon, title, value, unit, status, forCoffee, statusInfo }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    {icon}
                    <span className="text-gray-700 text-sm font-medium">{title}</span>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                    {statusInfo.status}
                </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
                {value} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
            </div>
            <div className="mt-1 flex items-center">
                <Coffee size={12} className="text-gray-600 mr-1" />
                <span className="text-xs text-gray-600">{statusInfo.forCoffee}</span>
            </div>
        </div>
    );
};

const MineralCard = ({ title, value, description }) => {
    return (
        <div className="bg-white/70 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-indigo-700 font-medium mb-1">{title}</div>
            <div className="text-lg font-bold text-gray-800">
                {value} <span className="text-xs font-normal text-gray-500">mg/L</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
        </div>
    );
};

const MineralsSection = ({ isExpanded, setIsExpanded, minerals }) => {
    return (
        <div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-indigo-700 flex items-center">
                    <Droplets size={16} className="mr-1" />
                    미네랄 성분 분석
                </h4>
                <ChevronDown
                    size={16}
                    className={`text-indigo-700 transition-transform duration-300 ${
                        isExpanded ? 'transform rotate-180' : ''
                    }`}
                />
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <MineralCard title="칼슘" value={minerals.calcium} description="바디감과 단맛에 영향" />
                    <MineralCard title="마그네슘" value={minerals.magnesium} description="산미와 추출 효율에 영향" />
                    <MineralCard title="나트륨" value={minerals.sodium} description="풍미와 밸런스에 영향" />
                </div>
            )}
        </div>
    );
};

// 커피 추천 컴포넌트
export const CoffeeRecommendation = ({ recommendation }) => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-sm mb-3">
            <h4 className="font-medium flex items-center mb-2 text-sm">
                <Coffee size={16} className="mr-2" />
                커피 추출 추천
            </h4>
            <p className="text-xs text-blue-50 leading-relaxed">{recommendation}</p>
        </div>
    );
};

// 필터 관리 알림 컴포넌트
export const FilterManagementAlert = () => {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-lg mb-3">
            <h4 className="font-medium flex items-center mb-1 text-sm text-amber-800">
                <AlertTriangle size={16} className="mr-1 text-amber-600" />
                필터 관리 알림
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
                이 지역의 경도와 미네랄 함량을 고려할 때, 필터 교체 주기는 약 3개월이 적절합니다. 정수 시스템을 사용
                중이라면 역삼투압(RO) 시스템에 미네랄 재첨가 기능이 권장됩니다.
            </p>
        </div>
    );
};

// 정보 고지사항 컴포넌트
export const Disclaimer = () => {
    return (
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">
                * 해당 정보는 공공데이터 기반으로 제공되며, 정확한 수질 확인을 위해서는 현장 테스트를 권장합니다.
            </p>
            <p>* 지역별 수돗물 기준 정보이며, 건물 배관 상태에 따라 차이가 있을 수 있습니다.</p>
        </div>
    );
};
