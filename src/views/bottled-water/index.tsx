'use client';

import { useState, useEffect } from 'react';
import { Droplet, TrendingUp, Info, Activity } from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/src/widgets/page-layout';
import { parseAndAverage } from './utils';
import { BottledWater } from './model/types';

interface BottledWaterViewProps {
    selectedWater: BottledWater;
    allWaterData: BottledWater[];
}

export const BottledWaterView = ({ selectedWater, allWaterData }: BottledWaterViewProps) => {
    return (
        <Layout>
            <div className="w-full">
                {/* 물 선택 탭 */}
                <div className="px-4 pt-4 pb-2">
                    <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
                        {allWaterData.map((water) => (
                            <Link
                                key={water.id}
                                href={`/bottled-water/${water.id}`}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                    selectedWater.id === water.id
                                        ? `${water.bgColor} text-white shadow-md`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {water.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 헤더 섹션 */}
                <div
                    className={`relative ${selectedWater.gradient} mx-4 p-5 mb-6 overflow-hidden shadow-md rounded-xl`}
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                        </svg>
                    </div>
                    <div className="relative flex justify-between items-center">
                        <div className="text-white z-10">
                            <h2 className="text-2xl font-bold mb-1">{selectedWater.name}</h2>
                            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full mt-2">
                                {selectedWater.source}
                            </div>
                        </div>
                        <div className="w-16 h-20 relative flex items-center justify-center z-10">
                            <Droplet size={36} className="text-white/80" />
                        </div>
                    </div>
                </div>

                {/* 설명 섹션 */}
                <div className="px-4 mb-6 relative">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedWater.description2}</p>
                </div>

                {/* 주요 수질 지표 */}
                <div className="px-4 mb-6 relative">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">주요 수질 지표</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <QualityIndicator
                            title="pH (산도)"
                            value={selectedWater.pH}
                            unit=""
                            min={6.0}
                            max={9.0}
                            icon={<Droplet size={16} className={selectedWater.textColor} />}
                            color={selectedWater.bgColor}
                        />
                        <QualityIndicator
                            title="경도 (Hardness)"
                            value={selectedWater.hardness}
                            unit="mg/L"
                            min={0}
                            max={100}
                            icon={<TrendingUp size={16} className={selectedWater.textColor} />}
                            color={selectedWater.bgColor}
                        />
                    </div>
                </div>

                {/* 미네랄 프로필 */}
                <div
                    className={`rounded-xl ${selectedWater.lightBg} p-4 mx-4 mb-4 relative border ${selectedWater.borderColor}`}
                >
                    <h3 className={`text-sm font-medium mb-3 ${selectedWater.textColor}`}>미네랄 프로필</h3>
                    <div className="grid grid-cols-2 gap-3 relative">
                        {[
                            { label: '칼슘', value: parseAndAverage(selectedWater.calcium), maxValue: 25 },
                            { label: '마그네슘', value: parseAndAverage(selectedWater.magnesium), maxValue: 8 },
                            { label: '나트륨', value: parseAndAverage(selectedWater.sodium), maxValue: 10 },
                            { label: '칼륨', value: parseAndAverage(selectedWater.potassium), maxValue: 5 },
                        ].map((mineral) => (
                            <MineralBar key={mineral.label} {...mineral} water={selectedWater} />
                        ))}
                    </div>
                </div>

                {/* 수질 특성 요약 */}
                <div
                    className={`mx-4 p-4 rounded-xl ${selectedWater.lightBg} border ${selectedWater.borderColor} relative`}
                >
                    <h3 className={`text-sm font-medium mb-3 flex items-center ${selectedWater.textColor}`}>
                        <Activity size={16} className="mr-1.5" />
                        수질 특성 요약
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { title: '물 타입', value: selectedWater.waterType },
                            { title: '경도', value: selectedWater.hardnessClass },
                            { title: '산도', value: selectedWater.pHClass },
                        ].map((tag, index) => (
                            <div key={index} className="bg-white/60 rounded-lg p-2 text-center text-xs">
                                <span className={`block font-medium mb-2 ${selectedWater.textColor}`}>{tag.title}</span>
                                <p className="font-semibold text-gray-800">{tag.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 푸터 안내 */}
                <div className="bg-gray-100 px-4 py-3 text-xs text-gray-500 border-t border-gray-200 relative mt-4">
                    <p className="flex items-center">
                        <Info size={12} className="mr-1 flex-shrink-0" />
                        <span>
                            이 데이터는 공시된 수질 검사 결과 등을 참고하여 작성되었으며, 실제 제품 및 시점에 따라
                            차이가 있을 수 있습니다. 참고용으로만 활용해주세요.
                        </span>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

// 애니메이션 유지된 수질 지표 컴포넌트
const QualityIndicator = ({
    title,
    value,
    unit,
    min,
    max,
    icon,
    color,
}: {
    title: string;
    value: string;
    unit: string;
    min: number;
    max: number;
    icon: React.ReactNode;
    color: string;
}) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const numericValue = parseAndAverage(value) || 0;
        const percentage = Math.min(Math.max(((numericValue - min) / (max - min)) * 100, 0), 100);

        const timer = setTimeout(() => setWidth(percentage), 100);
        return () => clearTimeout(timer);
    }, [value, min, max]);

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center mb-2">
                <span className="pr-1.5">{icon}</span>
                <span className="text-sm font-medium text-gray-700">{title}</span>
            </div>
            <div className="flex items-baseline mb-2">
                <span className="text-xl font-bold text-gray-800 mr-1">{value}</span>
                <span className="text-xs text-gray-500">{unit}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${width}%` }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{min}</span>
                <span className="text-xs text-gray-400">{max}</span>
            </div>
        </div>
    );
};

// 애니메이션 유지된 미네랄 바 컴포넌트
const MineralBar = ({
    label,
    value,
    maxValue,
    water,
}: {
    label: string;
    value: number | null;
    maxValue: number;
    water: BottledWater;
}) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const percentage = Math.min(((value || 0) / maxValue) * 100, 100);
        const timer = setTimeout(() => setWidth(percentage), 100);
        return () => clearTimeout(timer);
    }, [value, maxValue]);

    const displayValue = value?.toFixed(1) || 'N/A';

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className={`text-xs font-semibold ${water.textColor}`}>{displayValue} mg/L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${water.bgColor}`}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
};
