'use client';

import { Activity, Coffee } from 'lucide-react';

// 결과 데이터를 위한 인터페이스 정의
interface CalculationResult {
    yield: string;
    description: string;
    recommendation: string;
}

interface CalculationResultProps {
    result: CalculationResult;
    calculated: boolean;
}

export const CalculationResult = ({ result, calculated }: CalculationResultProps) => {
    if (!calculated) {
        return null;
    }

    return (
        <>
            {/* 결과 섹션 */}
            <div className="px-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Activity size={20} className="text-sky-600 mr-2" />
                    계산 결과
                </h3>
                <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent opacity-70"></div>

                    <div className="relative">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-gray-700 font-medium">수율 (Extraction Yield)</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                최적
                            </span>
                        </div>

                        <div className="text-3xl font-bold text-gray-800 mb-2">
                            {result.yield}
                            <span className="text-sm font-normal text-gray-500 ml-1">%</span>
                        </div>

                        <div className="mb-3 text-sm text-gray-600">{result.description}</div>

                        {/* 프로그레스 바 */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, ((parseFloat(result.yield) - 18) / (22 - 18)) * 100)
                                    )}%`,
                                }}
                                role="progressbar"
                                aria-valuenow={parseFloat(result.yield)}
                                aria-valuemin={18}
                                aria-valuemax={22}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>18%</span>
                            <span>20%</span>
                            <span>22%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 추천 섹션 */}
            <div className="px-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="40" fill="white" />
                        </svg>
                    </div>

                    <h4 className="font-medium flex items-center mb-2">
                        <Coffee size={18} className="mr-2" />
                        추출 조정 추천
                    </h4>
                    <p className="text-sm text-blue-50 leading-relaxed">{result.recommendation}</p>
                </div>
            </div>
        </>
    );
};
