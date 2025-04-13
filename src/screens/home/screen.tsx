'use client';
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@/src/widgets/layout';
import { Droplet, Droplets, AlertTriangle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { SearchContainer } from '@/src/widgets/search-container';
import { Header } from '@/src/widgets/header';
import { estimateSOCL } from '@/src/features/water-quality/lib/estimate-SO-CL';
import { evaluateWaterQualityStatus, formatMonth, formatYear, getNextMonth } from '@/src/features/water-quality/utils';
import { WaterQualityCard } from '@/src/features/water-quality/ui';
import { getPreviousMonth } from '@/src/features/water-quality/utils';
import { ContactUs } from '@/src/widgets/contact-us';
import { Disclaimer } from '@/src/widgets/disclaimer';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';

export const HomeScreen = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const [selectedId, setSelectedId] = useState<string | undefined>();
    const retryCountRef = useRef(0);
    const latestDateRef = useRef<string | null>(null);

    const isInitial = useRef(true);

    const {
        data: waterQuality,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ['waterQuality', selectedId, formatYear(year), formatMonth(month)],
        queryFn: () => fetchWaterQualityData({ id: selectedId, year: formatYear(year), month: formatMonth(month) }),
        enabled: !!selectedId,
        retry: 1,
    });

    useEffect(() => {
        if (isError) {
            if (selectedId && isInitial.current) {
                const MAX_RETRIES = 2;
                let searchYear = year;
                let searchMonth = month;

                const tryPreviousMonths = () => {
                    if (retryCountRef.current < MAX_RETRIES) {
                        const prevDate = getPreviousMonth(searchYear, searchMonth);
                        searchYear = prevDate.year;
                        searchMonth = prevDate.month;

                        retryCountRef.current++;

                        setYear(searchYear);
                        setMonth(searchMonth);

                        console.log(
                            `${retryCountRef.current}번째 시도: ${searchYear}년 ${searchMonth}월로 이동합니다.`
                        );
                    } else {
                        console.log(`최대 시도 횟수(${MAX_RETRIES})에 도달했습니다.`);
                    }
                };

                tryPreviousMonths();
            } else {
                console.log('isError', isError);
            }
        }
    }, [isError, selectedId, year, month]);

    const handlePrevMonth = () => {
        const prevDate = getPreviousMonth(year, month);
        setYear(prevDate.year);
        setMonth(prevDate.month);
    };

    const handleNextMonth = () => {
        const nextDate = getNextMonth(year, month);
        setYear(nextDate.year);
        setMonth(nextDate.month);
    };

    useEffect(() => {
        if (isSuccess && waterQuality) {
            if (isInitial.current) {
                // console.log(waterQuality);
                latestDateRef.current = `${year}-${month}`;
                isInitial.current = false;
            } else {
                console.log(waterQuality);
            }
        }
    }, [isSuccess, waterQuality]);

    // 선택된 ID가 변경될 때 현재 년월로 초기화
    useEffect(() => {
        if (selectedId) {
            setYear(today.getFullYear());
            setMonth(today.getMonth());
            retryCountRef.current = 0;
            latestDateRef.current = null;
            isInitial.current = true;
        }
    }, [selectedId]);

    if (isLoading) {
        return (
            <Layout>
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header />
            <SearchContainer setSelectedId={setSelectedId} />

            <div className="px-4 pb-4 flex-1">
                {/* 수질 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">수질 정보</h2>
                        </div>
                        {waterQuality?.FCLT_NAM && (
                            <div className="bg-blue-50 text-blue-700 py-1 px-2 rounded-full text-xs font-medium">
                                {waterQuality.FCLT_NAM}
                            </div>
                        )}
                    </div>
                    {waterQuality?.UPDATE_DAT && (
                        <div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-4">
                                <button
                                    className={`p-2 rounded-full ${
                                        true ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronLeft
                                        size={20}
                                        onClick={() => {
                                            handlePrevMonth();
                                        }}
                                    />
                                </button>
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <Calendar size={16} className="mr-1 text-blue-600" />
                                    {year}년 {month}월
                                </div>
                                <button
                                    className={`p-2 rounded-full ${
                                        latestDateRef.current !== `${year}-${month}`
                                            ? 'text-blue-600 hover:bg-blue-100'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                    disabled={latestDateRef.current === `${year}-${month}`}
                                >
                                    <ChevronRight
                                        size={20}
                                        onClick={() => {
                                            if (latestDateRef.current !== `${year}-${month}`) {
                                                // handleNextMonth();
                                            }
                                        }}
                                    />
                                </button>{' '}
                            </div>
                        </div>
                    )}
                    {!waterQuality?.HR ? (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-gray-500">주소를 검색하고 수질 데이터를 조회해 보세요.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {/* 경도 */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-blue-500 mr-1" />}
                                    title="경도 (Hardness)"
                                    value={waterQuality?.HR}
                                    unit="mg/L"
                                    statusInfo={evaluateWaterQualityStatus(
                                        waterQuality?.HR ? Number(waterQuality.HR) : undefined,
                                        17,
                                        85
                                    )}
                                    scaTarget="68 mg/L"
                                    scaRange="17-85 mg/L"
                                />

                                {/* pH */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-purple-500 mr-1" />}
                                    title="pH (수소이온농도)"
                                    value={waterQuality?.PH}
                                    unit=""
                                    statusInfo={evaluateWaterQualityStatus(
                                        waterQuality?.PH ? Number(waterQuality.PH) : undefined,
                                        6.5,
                                        7.5
                                    )}
                                    scaTarget="7.0"
                                    scaRange="6.5-7.5"
                                />

                                {/* TDS */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-green-500 mr-1" />}
                                    title="TDS (증발잔류물)"
                                    value={waterQuality?.TDS}
                                    unit="mg/L"
                                    statusInfo={evaluateWaterQualityStatus(
                                        waterQuality?.TDS ? Number(waterQuality.TDS) : undefined,
                                        75,
                                        250
                                    )}
                                    scaTarget="150 mg/L"
                                    scaRange="75-250 mg/L"
                                />

                                {/* 잔류 염소 */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-red-500 mr-1" />}
                                    title="잔류 염소 (Residual Chlorine)"
                                    value={waterQuality?.RC}
                                    unit="mg/L"
                                    statusInfo={evaluateWaterQualityStatus(
                                        waterQuality?.RC
                                            ? Number(waterQuality.RC) === 0
                                                ? 1
                                                : Number(waterQuality.RC)
                                            : undefined,
                                        0,
                                        0
                                    )}
                                    scaTarget="0 mg/L"
                                    scaRange="0 mg/L"
                                />
                            </div>

                            {/* 미네랄 성분 */}
                            <MineralsSection HR={waterQuality?.HR} SO={waterQuality?.SO} CL={waterQuality?.CL} />

                            {/* <p className="text-xs text-right text-gray-500 ">
                                {waterQuality?.data?.UPDATE_DAT ? `업데이트 일자: ${waterQuality.data.UPDATE_DAT}` : ''}
                            </p> */}

                            {/* 카페 필터 정보 */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                                <div className="border-b border-gray-100 pb-2 mb-3">
                                    <h2 className="text-lg font-bold text-gray-800">카페 필터 시스템 관리</h2>
                                </div>

                                <FilterManagementAlert HR={waterQuality?.HR} />
                                <Disclaimer />
                            </div>
                        </>
                    )}
                </div>
                <ContactUs />
            </div>
        </Layout>
    );
};

const MineralCard = ({
    title,
    value,
    description,
}: {
    title: string;
    value: string | undefined;
    description: string;
}) => {
    return (
        <div className="bg-white/70 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-indigo-700 font-medium mb-1">{title}</div>
            <div className="text-lg font-bold text-gray-800">
                {value || '-'} <span className="text-xs font-normal text-gray-500">mg/L</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
        </div>
    );
};

const MineralsSection = ({
    HR,
    SO,
    CL,
}: {
    HR: string | undefined;
    SO: string | undefined;
    CL: string | undefined;
}) => {
    const { estimatedCalcium, estimatedMagnesium } = estimateSOCL(HR ? Number(HR) : 0);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-indigo-700 flex items-center">
                    <Droplets size={16} className="mr-1" />
                    미네랄 성분 분석
                </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <MineralCard title="칼슘(추정)" value={`${estimatedCalcium}`} description="바디감과 단맛에 영향" />
                <MineralCard
                    title="마그네슘(추정)"
                    value={`${estimatedMagnesium}`}
                    description="산미와 추출 효율에 영향"
                />
                <MineralCard title="황산염" value={SO} description="쓴맛 완화, 밸런스" />
                <MineralCard title="염소이온" value={CL} description="부식 가능성, 쓴맛 강조" />
            </div>
        </div>
    );
};

// 필터 관리 알림 컴포넌트
export const FilterManagementAlert = ({ HR }: { HR: string | undefined }) => {
    const hardnessLevel = HR ? Number(HR) : 0;
    const filterRecommendation =
        hardnessLevel > 150
            ? '이 지역의 경도가 높아 필터 사용을 권장하며, 3개월마다 교체를 고려해주세요.'
            : '이 지역의 경도는 적절한 수준입니다.';
    const roRecommendation =
        hardnessLevel > 100 ? '정수 시스템을 사용 중이라면 역삼투압(RO) 시스템에 미네랄 재첨가 기능이 권장됩니다.' : '';

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-lg mb-3">
            <h4 className="font-medium flex items-center mb-1 text-sm text-amber-800">
                <AlertTriangle size={16} className="mr-1 text-amber-600" />
                필터 관리 알림
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
                {filterRecommendation} {roRecommendation}
            </p>
        </div>
    );
};
