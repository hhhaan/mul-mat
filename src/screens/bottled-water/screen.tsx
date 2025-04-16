'use client';

import { useState, useEffect } from 'react';
import { Droplet, TrendingUp, Activity, Info, ChevronLeft, BarChart, Waves } from 'lucide-react';

import { Layout } from '@/src/widgets/page-layout';

export const BottledWaterScreen = () => {
    return (
        <Layout>
            <WaterQualityApp />
        </Layout>
    );
};

// 미네랄 값 범위를 평균값으로 변환하는 함수
const getAverageFromRange = (rangeStr) => {
    if (!rangeStr || typeof rangeStr !== 'string') return rangeStr;

    // 범위 형식인지 확인 (예: "2.2~3.6")
    if (rangeStr.includes('~')) {
        const [min, max] = rangeStr.split('~').map((v) => parseFloat(v));
        if (!isNaN(min) && !isNaN(max)) {
            return ((min + max) / 2).toFixed(1);
        }
    }

    return rangeStr;
};

// 새로운 상단 헤더 컴포넌트
const AppHeader = () => {
    return (
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                <button className="mr-2 text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">생수 수질 정보</h1>
            </div>
            <div className="flex items-center">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">분석 데이터</span>
            </div>
        </div>
    );
};

// 애니메이션 적용된 심플 지표 컴포넌트
const SimpleIndicator = ({ title, value, unit, min, max, icon, color }) => {
    const [width, setWidth] = useState(0);

    // min과 max 사이에서 현재 값의 위치를 백분율로 계산
    const calculatePercentage = () => {
        let val = value;
        // 범위 값인 경우 (예: "7.2~7.4") 평균을 사용
        if (typeof val === 'string' && val.includes('~')) {
            val = getAverageFromRange(val);
        }

        val = parseFloat(val);
        if (isNaN(val)) return 50; // 값이 숫자가 아니면 중간값 반환
        return Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    };

    const percentage = calculatePercentage();

    // 마운트 후 애니메이션 시작
    useEffect(() => {
        setTimeout(() => {
            setWidth(percentage);
        }, 100);
    }, [percentage]);

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <span className="pr-1.5 pl-0">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{title}</span>
                </div>
            </div>
            <div className="flex items-baseline mb-2">
                <span className="text-xl font-bold text-gray-800 mr-1">{value}</span>
                <span className="text-xs text-gray-500">{unit}</span>
            </div>

            {/* 프로그레스 바 추가 - 애니메이션 효과 적용 */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>

            {/* 최소/최대 값 표시 */}
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{min}</span>
                <span className="text-xs text-gray-400">{max}</span>
            </div>
        </div>
    );
};

// 애니메이션 슬라이드 지표 컴포넌트
const AnimatedIndicator = ({ label, value, maxValue, textColor, bgColor, unit }) => {
    const [width, setWidth] = useState(0);
    const parsedValue = parseFloat(value);
    const percentage = Math.min((parsedValue / maxValue) * 100, 100);

    useEffect(() => {
        // 마운트 후 애니메이션 시작
        setTimeout(() => {
            setWidth(percentage);
        }, 100);
    }, [percentage]);

    return (
        <div className="mb-4 relative">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className={`text-xs font-semibold ${textColor}`}>
                    {value} {unit}
                </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out absolute top-0 left-0 ${bgColor}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    );
};

// 미네랄 방사형 차트 (시각적 표현)
const MineralsRadarChart = ({ water }) => {
    // 미네랄 값들을 평균으로 변환
    const calciumAvg = getAverageFromRange(water.calcium);
    const magnesiumAvg = getAverageFromRange(water.magnesium);
    const sodiumAvg = getAverageFromRange(water.sodium);
    const potassiumAvg = getAverageFromRange(water.potassium);

    return (
        <div className={`rounded-xl ${water.lightBg} p-4 mx-4 mb-4 relative`}>
            <h3 className={`text-sm font-medium mb-3 ${water.textColor}`}>미네랄 프로필</h3>

            <div className="grid grid-cols-2 gap-3 relative">
                <AnimatedIndicator
                    label="칼슘"
                    value={calciumAvg}
                    maxValue={10}
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="마그네슘"
                    value={magnesiumAvg}
                    maxValue={5}
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="나트륨"
                    value={sodiumAvg}
                    maxValue={10}
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="칼륨"
                    value={potassiumAvg}
                    maxValue={5}
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
            </div>
        </div>
    );
};

// 물 선택 탭 컴포넌트
const WaterSelectionTabs = ({ bottledWaterData, selectedWaterId, setSelectedWaterId }) => {
    const styles = {
        hideScrollbar: {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
        },
    };

    return (
        <div className="px-4 pt-4 pb-2">
            <div className="flex overflow-x-auto gap-2 pb-1" style={styles.hideScrollbar}>
                {bottledWaterData.map((water) => (
                    <button
                        key={water.id}
                        onClick={() => setSelectedWaterId(water.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedWaterId === water.id
                                ? `${water.bgColor} text-white shadow-md`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {water.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 앱 컴포넌트 (프리뷰용)
const WaterQualityApp = () => {
    // 생수 데이터
    const bottledWaterData = [
        {
            id: 1,
            name: '제주 삼다수',
            source: '제주시 조천읍 교래리',
            description: '화산암반수로 미네랄 밸런스가 뛰어나며 부드러운 목넘김이 특징',
            pH: '7.8',
            hardness: '22',
            tds: 2,
            alkalinity: 25.3,
            calcium: '2.2~3.6',
            magnesium: '1.0~2.8',
            potassium: '1.5~3.4',
            sodium: '4.0~7.2',
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-600',
            lightBg: 'bg-blue-50',
            darkBg: 'bg-blue-500',
            borderColor: 'border-blue-200',
        },
        {
            id: 2,
            name: '평창수',
            source: '강원도 평창군',
            description: '황토층과 화강암반을 통과한 미네랄워터로 깔끔한 맛이 특징',
            description2: '커피의 풍부한 바디감과 단맛을 원한다면',
            pH: '7.8',
            hardness: '19.5~78',
            tds: 90,
            alkalinity: 42.6,
            calcium: '5.8~9.3',
            magnesium: '1.0~1.9',
            potassium: '0.3~1.4',
            sodium: '3.5~7.5',
            gradient: 'bg-gradient-to-br from-emerald-500 to-green-400',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-600',
            lightBg: 'bg-emerald-50',
            darkBg: 'bg-emerald-500',
            borderColor: 'border-emerald-200',
        },
        {
            id: 3,
            name: '아이시스 8.0',
            source: '경북 청도',
            description: '맑고 깨끗한 청정 지하수로 산소가 풍부하고 가벼운 맛',
            description2: '커피의 화사함을 느끼고 싶다면',
            pH: '7.7~8.3',
            hardness: '64',
            tds: 83,
            alkalinity: 31.5,
            calcium: '5~20.0',
            magnesium: '0.3~3.6',
            potassium: '0.3~1.5',
            sodium: '2.0~4.0',
            gradient: 'bg-gradient-to-br from-purple-500 to-violet-400',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-600',
            lightBg: 'bg-purple-50',
            darkBg: 'bg-purple-500',
            borderColor: 'border-purple-200',
        },
        {
            id: 4,
            name: '백산수',
            source: '백두산 내두천',
            description: '단단한 화강암반을 뚫고 올라온 천연 암반수로 미네랄이 풍부',
            pH: '7.2~7.4',
            hardness: '30',
            tds: 102,
            alkalinity: 38.9,
            calcium: '3.0~5.8',
            magnesium: '2.1~5.4',
            potassium: '1.4~5.3',
            sodium: '4.0~12.0',
            gradient: 'bg-gradient-to-br from-amber-500 to-yellow-400',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-600',
            lightBg: 'bg-amber-50',
            darkBg: 'bg-amber-500',
            borderColor: 'border-amber-200',
        },
    ];

    // 선택된 생수 상태 관리
    const [selectedWaterId, setSelectedWaterId] = useState(1);

    // 선택된 생수 찾기
    const selectedWater = bottledWaterData.find((w) => w.id === selectedWaterId) || bottledWaterData[0];

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 앱 헤더 */}
            <AppHeader />

            {/* 생수 선택 탭 */}
            <WaterSelectionTabs
                bottledWaterData={bottledWaterData}
                selectedWaterId={selectedWaterId}
                setSelectedWaterId={setSelectedWaterId}
            />

            {/* 생수 헤더 배경 (수정됨) */}
            <div className={`relative ${selectedWater.gradient} mx-4 p-5 mb-6 overflow-hidden shadow-md rounded-xl`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative flex justify-between items-center">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold mb-1">{selectedWater.name}</h1>
                        <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full mt-2">
                            {selectedWater.source}
                        </div>
                    </div>
                    <div className="w-16 h-20 relative flex items-center justify-center">
                        <Droplet size={32} className="text-white/80" />
                    </div>
                </div>
            </div>

            {/* 생수 설명 */}
            <div className="px-4 mb-6 relative">
                <p className="text-sm text-gray-600 leading-relaxed">{selectedWater.description}</p>
            </div>

            {/* 주요 지표 - 이제 애니메이션 효과 추가됨 */}
            <div className="px-4 mb-6 relative">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">주요 수질 지표</h2>
                <div className="grid grid-cols-2 gap-3">
                    <SimpleIndicator
                        title="pH"
                        value={selectedWater.pH}
                        unit=""
                        min={6.5}
                        max={8.5}
                        icon={<Droplet size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    />
                    <SimpleIndicator
                        title="경도"
                        value={selectedWater.hardness}
                        unit="mg/L"
                        min={10}
                        max={100}
                        icon={<TrendingUp size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    />
                    {/* <SimpleIndicator
                        title="TDS"
                        value={selectedWater.tds}
                        unit="mg/L"
                        min={50}
                        max={300}
                        icon={<BarChart size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    /> */}
                    {/* <SimpleIndicator
                        title="알칼리니티"
                        value={selectedWater.alkalinity}
                        unit="mg/L"
                        min={20}
                        max={120}
                        icon={<Waves size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    /> */}
                </div>
            </div>

            {/* 미네랄 분석 */}
            <MineralsRadarChart water={selectedWater} />

            {/* 생수 특성 요약 */}
            <div
                className={`mx-4 p-4 rounded-xl ${selectedWater.lightBg} border ${selectedWater.borderColor} relative`}
            >
                <h3 className={`text-sm font-medium mb-2 flex items-center ${selectedWater.textColor}`}>
                    <Activity size={16} className="mr-1" />
                    수질 특성 요약
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedWater.name}는 {selectedWater.hardness < 30 ? '연수' : '경수'} 타입의 물로,
                    {selectedWater.alkalinity > 40
                        ? ' 높은 알칼리성을 가져 산 중화 능력이 뛰어나며,'
                        : ' 적절한 알칼리성을 가지고,'}
                    {selectedWater.tds < 85
                        ? ' 가볍고 부드러운 목넘김을 느낄 수 있습니다.'
                        : ' 풍부한 미네랄로 인한 깊은 맛을 느낄 수 있습니다.'}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="bg-white/60 rounded-lg p-2 text-center">
                        <span className={`text-xs font-medium ${selectedWater.textColor}`}>맛 특성</span>
                        <p className="text-sm font-semibold text-gray-800">
                            {selectedWater.tds < 85 ? '가벼움' : '풍부함'}
                        </p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 text-center">
                        <span className={`text-xs font-medium ${selectedWater.textColor}`}>물 타입</span>
                        <p className="text-sm font-semibold text-gray-800">
                            {selectedWater.hardness < 30 ? '연수' : '경수'}
                        </p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 text-center">
                        <span className={`text-xs font-medium ${selectedWater.textColor}`}>산도</span>
                        <p className="text-sm font-semibold text-gray-800">
                            {selectedWater.pH >= 7.5 ? '알칼리성' : '중성'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 border-t border-gray-100 rounded-b-xl relative mt-4">
                <p className="flex items-center">
                    <Info size={12} className="mr-1" />이 데이터는 참고용으로만 사용해주세요. 실제 제품과 차이가 있을 수
                    있습니다.
                </p>
            </div>
        </div>
    );
};
