'use client';

import { Coffee, Calculator, Ratio, Droplet, ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Box } from '@/src/shared/ui';
import { Layout } from '@/src/widgets/page-layout';
import { useCalculator } from '@/src/features/extraction-yield-calculate/hooks/useCalculator';
import { InputField, ResultCard, RecommendationCard } from '@/src/features/extraction-yield-calculate/components';

export const EYCalculatorScreen = () => {
    const { inputValues, result, calculated, handleInputChange, calculate } = useCalculator();
    const router = useRouter();

    return (
        <Layout>
            <div className="w-full">
                {/* 헤더 */}
                <div className="fixed top-0 left-0 right-0 z-10">
                    <div className="bg-white shadow-sm p-3">
                        <div className="flex justify-between items-center">
                            <button
                                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={20} className="mr-1" />
                                <span className="text-sm font-medium"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 타이틀 */}
                <div className="px-4 py-3 mt-10">
                    <Box>
                        <h1 className="text-lg font-bold text-gray-800 flex items-center">
                            <Calculator size={20} className="text-blue-500 mr-2" />
                            커피 수율 계산기
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            완벽한 추출을 위한 커피 수율과 추출 속도를 계산해 보세요.
                        </p>
                    </Box>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="px-4 pb-4 flex-1 mb-2">
                    <Box>
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
                                unit="g"
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
                                unit="%"
                            />

                            <div className="pt-2">
                                <button
                                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors flex items-center justify-center"
                                    onClick={calculate}
                                >
                                    <span className="font-medium">수율 계산하기</span>
                                    <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </Box>
                    <div className="h-3"></div>

                    {/* 결과 섹션 */}
                    {calculated && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                            <div className="border-b border-gray-100 pb-2 mb-3">
                                <h2 className="text-md font-bold text-gray-800">분석 결과</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <ResultCard
                                    title="수율 (Extraction Yield)"
                                    value={result.yield}
                                    description={result.description}
                                    status={result.status}
                                    icon={<Calculator size={16} className="text-blue-500" />}
                                />
                            </div>

                            {/* 추천 섹션 */}
                            <RecommendationCard recommendation={result.recommendation} />
                        </div>
                    )}

                    {/* 도움말 섹션 */}
                    <Box>
                        <div className="border-b border-gray-100 pb-2 mb-3">
                            <h2 className="text-md font-bold text-gray-800">도움말</h2>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <p className="mb-1">* 수율 계산 공식: (TDS × 물의 양) ÷ 원두 무게</p>
                            <p>* TDS(Total Dissolved Solids)는 추출된 커피에 녹아있는 고형분의 비율입니다.</p>
                        </div>
                    </Box>
                </div>
            </div>
        </Layout>
    );
};
