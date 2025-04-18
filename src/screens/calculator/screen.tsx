'use client';

import { Coffee, Ratio, Droplet, ChevronLeft, ChevronRight, Activity, Info } from 'lucide-react';
import { Layout } from '@/src/widgets/page-layout';
import { useCalculator } from '@/src/features/extraction-yield-calculate/hooks/useCalculator';

export const EYCalculatorScreen = () => {
    const { inputValues, result, calculated, handleInputChange, calculate } = useCalculator();

    return (
        <Layout>
            <div className="w-full bg-blue-50">
                <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center">
                        <button className="mr-2 text-gray-500 hover:text-gray-700" aria-label="뒤로 가기">
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">커피 수율 계산기</h1>
                    </div>
                </div>

                {/* 메인 배너 */}
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 mx-4 mt-4 p-5 mb-6 overflow-hidden shadow-md rounded-xl">
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
                {/* 브루잉 || 에스프레소 탭 */}
                {/* <div></div> */}

                <div className="px-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">추출 정보 입력</h3>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                        {/* 원두 투입량 */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center mb-2">
                                <Coffee size={16} className="text-blue-600 mr-2" />
                                <label className="text-gray-700 font-medium">원두 투입량</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="coffeeWeight"
                                    value={inputValues.coffeeWeight}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="원두 무게를 입력하세요"
                                />
                                <span className="text-sm text-gray-500 ml-2 min-w-8">g</span>
                            </div>
                        </div>
                        {/* 물의 양 */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center mb-2">
                                <Droplet size={16} className="text-blue-500 mr-2" />
                                <label className="text-gray-700 font-medium">사용한 물의 양</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="waterAmount"
                                    value={inputValues.waterAmount}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="사용한 물의 양을 입력하세요"
                                />
                                <span className="text-sm text-gray-500 ml-2 min-w-8">ml</span>
                            </div>
                        </div>
                        {/* TDS 값 */}
                        <div className="p-4">
                            <div className="flex items-center mb-2">
                                <Ratio size={16} className="text-cyan-500 mr-2" />
                                <label className="text-gray-700 font-medium">TDS 값</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="tdsValue"
                                    value={inputValues.tdsValue}
                                    className="w-full p-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="TDS 값을 입력하세요 (예: 1.35)"
                                    onChange={handleInputChange}
                                />
                                <span className="text-sm text-gray-500 ml-2 min-w-8">%</span>
                            </div>
                        </div>
                    </div>
                    {/* 계산 버튼 */}
                    <button
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow transition-colors flex items-center justify-center mb-6"
                        onClick={calculate}
                    >
                        <span className="font-medium">수율 계산하기</span>
                        <ChevronRight size={18} className="ml-1" />
                    </button>
                </div>
                {/* 결과 섹션 */}

                {calculated && (
                    <>
                        <div className="px-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <Activity size={20} className="text-blue-600 mr-2" />
                                계산 결과
                            </h3>
                            <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
                                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent opacity-70"></div>

                                <div className="relative z-10">
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
                                            style={{ width: '65%' }}
                                            role="progressbar"
                                            aria-valuenow={65}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
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
                )}

                {/* 도움말 섹션 */}
                <div className="px-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-medium mb-3 flex items-center text-blue-700">
                            <Info size={16} className="mr-1.5" />
                            도움말
                        </h3>
                        <div className="text-xs text-gray-600 p-3 rounded-lg bg-white">
                            <p className="mb-2">* 수율 계산 공식: (TDS × 물의 양) ÷ 원두 무게</p>
                            <p>* TDS(Total Dissolved Solids)는 추출된 커피에 녹아있는 고형분의 비율입니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
