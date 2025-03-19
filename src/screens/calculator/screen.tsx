'use client';
import { Coffee, Calculator, Ratio, Droplet, ArrowLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/src/widgets/layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 인풋 필드 컴포넌트
const InputField = ({
    label,
    icon,
    placeholder,
    value,
    onChange,
    name,
    unit,
}: {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    unit: string;
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
                {icon}
                <label className="text-gray-700 text-sm font-medium ml-1">{label}</label>
            </div>
            <div className="flex items-center justify-between">
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                    placeholder={placeholder}
                />
                {unit && <span className="text-xs text-gray-500 ml-2 ">{unit}</span>}
            </div>
        </div>
    );
};

// 결과 카드 컴포넌트
const ResultCard = ({ title, value, description, status, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    {icon}
                    <span className="text-gray-700 text-sm font-medium ml-1">{title}</span>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'optimal'
                            ? 'bg-green-100 text-green-800'
                            : status === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'low'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {status === 'optimal' ? '최적' : status === 'high' ? '높음' : status === 'low' ? '낮음' : '계산 중'}
                </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
                {value} <span className="text-xs font-normal text-gray-500">%</span>
            </div>
            <div className="mt-1 text-xs text-gray-600">{description}</div>
        </div>
    );
};

// 추천 컴포넌트
const RecommendationCard = ({ recommendation }) => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium flex items-center mb-2 text-sm">
                <Coffee size={16} className="mr-2" />
                추출 조정 추천
            </h4>
            <p className="text-xs text-blue-50 leading-relaxed">{recommendation}</p>
        </div>
    );
};

export const CalculatorScreen = () => {
    const [inputValues, setInputValues] = useState({
        coffeeWeight: '',
        waterAmount: '',
        tdsValue: '',
    });

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Layout>
            <div className="flex flex-col bg-gray-50 w-full">
                {/* 헤더 */}
                <div className="fixed top-0 left-0 right-0 z-10">
                    <div className="bg-white shadow-sm p-3">
                        <div className="flex justify-between items-center">
                            <button
                                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                <ArrowLeft size={20} className="mr-1" />
                                <span className="text-sm font-medium"></span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* 헤더 */}
                <div className="px-4 py-3 mt-10">
                    <div className="bg-white rounded-lg shadow-sm p-3">
                        <h1 className="text-lg font-bold text-gray-800 flex items-center">
                            <Calculator size={20} className="text-blue-500 mr-2" />
                            커피 수율 계산기
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            완벽한 추출을 위한 커피 수율과 추출 속도를 계산해 보세요.
                        </p>
                    </div>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="px-4 pb-4 flex-1">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                        <div className="border-b border-gray-100 pb-2 mb-3">
                            <h2 className="text-md font-bold text-gray-800">추출 정보 입력</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-4">
                            <InputField
                                label="원두 투입량"
                                placeholder="원두 무게를 입력하세요"
                                icon={<Coffee size={16} className="text-amber-600" />}
                                name="coffeeWeight"
                                value={inputValues.coffeeWeight}
                                onChange={handleInputChange}
                                unit=" g"
                            />

                            <InputField
                                label="사용한 물의 양"
                                placeholder="사용한 물의 양을 입력하세요"
                                icon={<Droplet size={16} className="text-blue-500" />}
                                name="waterAmount"
                                value={inputValues.waterAmount}
                                onChange={handleInputChange}
                                unit="ml"
                            />

                            <InputField
                                label="TDS 값"
                                placeholder="TDS 값을 입력하세요 (예: 1.35)"
                                icon={<Ratio size={16} className="text-purple-500" />}
                                name="tdsValue"
                                value={inputValues.tdsValue}
                                onChange={handleInputChange}
                                unit=" %"
                            />

                            <div className="pt-2">
                                <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors flex items-center justify-center">
                                    <span className="font-medium">수율 계산하기</span>
                                    <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 결과 섹션 */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                        <div className="border-b border-gray-100 pb-2 mb-3">
                            <h2 className="text-md font-bold text-gray-800">분석 결과</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-4">
                            <ResultCard
                                title="수율 (Extraction Yield)"
                                value="20.5"
                                description="최적의 수율 범위 내에 있습니다."
                                status="optimal"
                                icon={<Calculator size={16} className="text-blue-500" />}
                            />
                        </div>

                        {/* 추천 섹션 */}
                        <RecommendationCard recommendation="현재 추출 방식이 좋은 결과를 내고 있습니다. 미세한 조정을 원한다면, 취향에 따라 풍미 변화를 위해 추출 온도를 1-2°C 조절해 보세요." />
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-4 mb-3 flex items-center justify-between cursor-pointer">
                        <div>
                            <h3 className="text-md font-semibold text-indigo-800">추출 컨트롤 차트 보기</h3>
                            <p className="text-xs text-indigo-600 mt-1">
                                커피 추출의 이상적인 영역과 현재 위치를 확인해 보세요.
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-indigo-500" />
                    </div>

                    {/* 도움말 섹션 */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="border-b border-gray-100 pb-2 mb-3">
                            <h2 className="text-md font-bold text-gray-800">도움말</h2>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-lg mb-3">
                            <h4 className="font-medium flex items-center mb-1 text-sm text-amber-800">
                                <Coffee size={16} className="mr-1 text-amber-600" />
                                수율 가이드
                            </h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                일반적으로 18-22% 사이의 수율이 가장 균형 잡힌 맛을 제공합니다. 낮은 수율(18% 미만)은
                                신맛이 강조되고, 높은 수율(22% 초과)은 쓴맛이 강해질 수 있습니다.
                            </p>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <p className="mb-1">* 수율 계산은 원두 무게와 추출된 커피 무게를 기반으로 합니다.</p>
                            <p>* 더 정확한 추출 분석을 위해서는 TDS 측정기를 사용하는 것이 좋습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
