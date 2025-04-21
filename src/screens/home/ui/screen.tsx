'use client';
import { useEffect, useState } from 'react';
import { SearchContainer } from '@/src/widgets/search-container';
import { evaluateWaterQualityStatus, formatMonth, formatYear } from '@/src/features/water-quality/utils';
import { getPreviousMonth } from '@/src/features/water-quality/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';
import { FilterManagementAlert } from '@/src/features/recommned-filter/ui';
import { useDateStore } from '@/src/features/water-quality/model/date-store';

import { Layout } from '@/src/widgets/page-layout';
import { Header } from './header';
import { Disclaimer } from './disclaimer';
import { ContactUs } from './contact-us';
import { WaterQualityCard, CalendarModal } from '@/src/features/water-quality/ui';

import { MineralSection } from '@/src/widgets/mineral-section';
import { Spinner } from '@/src/shared/ui';

import { Droplet, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

export const HomeScreen = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const {
        year,
        month,
        latestDate,
        setLatestDate,
        // setMonth,
        isInitial,
        retryCount,
        handlePrevMonth,
        handleNextMonth,
        resetDate,
    } = useDateStore();

    const [isCalenderOpen, setIsCalenderOpen] = useState(false);

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
    // 오류 발생 시 이전 달로 이동
    useEffect(() => {
        if (isError) {
            if (selectedId && isInitial.current) {
                const MAX_RETRIES = 2;
                let searchYear = year;
                let searchMonth = month;

                const tryPreviousMonths = () => {
                    if (retryCount.current < MAX_RETRIES) {
                        const prevDate = getPreviousMonth(searchYear, searchMonth);
                        searchYear = prevDate.year;
                        searchMonth = prevDate.month;

                        retryCount.current++;

                        handlePrevMonth();

                        console.log(`${retryCount.current}번째 시도: ${searchYear}년 ${searchMonth}월로 이동합니다.`);
                    } else {
                        console.log(`최대 시도 횟수(${MAX_RETRIES})에 도달했습니다.`);
                    }
                };

                tryPreviousMonths();
            } else if (selectedId && isInitial.current == false) {
                alert('죄송해요. 해당 지역의 데이터가 없어요');
            } else {
                console.log('isError', isError);
            }
        }
    }, [isError, selectedId, year, month]);

    const handleOpenCalender = () => {
        setIsCalenderOpen(true);
    };
    const handleCloseCalender = () => {
        setIsCalenderOpen(false);
    };

    useEffect(() => {
        if (isSuccess && waterQuality) {
            if (isInitial.current) {
                setLatestDate(`${year}-${month}`);
                isInitial.current = false;
            } else {
                console.log(waterQuality);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, waterQuality]);

    useEffect(() => {
        resetDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    if (isLoading) {
        return (
            <Layout>
                <Header />
                <Spinner />
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
                            <div className="bg-sky-50 text-sky-600 py-1 px-3 rounded-full text-xs font-medium flex items-center">
                                <MapPin size={12} className="mr-1" />
                                {waterQuality.FCLT_NAM} 정수장
                            </div>
                        )}
                    </div>
                    {waterQuality?.UPDATE_DAT && (
                        <div className="flex items-center justify-between bg-sky-50 rounded-lg p-2 mb-4">
                            <button
                                className={`p-2 rounded-full ${
                                    true ? 'text-sky-600 hover:bg-sky-100' : 'text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <ChevronLeft
                                    size={20}
                                    onClick={() => {
                                        handlePrevMonth();
                                    }}
                                />
                            </button>
                            <button
                                className="flex items-center text-sm font-medium text-gray-700 px-3 py-1 rounded-md hover:bg-sky-100 relative group"
                                onClick={handleOpenCalender}
                            >
                                <span className="absolute -inset-1 bg-sky-200 opacity-0 group-hover:opacity-30 rounded-md transition-opacity duration-300 animate-pulse"></span>
                                <Calendar size={16} className="mr-1 text-sky-600 animate-bounce" />
                                <span className="relative z-10">
                                    {year}년 {month}월
                                </span>
                            </button>
                            <button
                                className={`p-2 rounded-full transition-colors duration-200 ${
                                    latestDate !== `${year}-${month}`
                                        ? 'text-sky-600 hover:bg-sky-100 active:bg-sky-200'
                                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                                disabled={latestDate === `${year}-${month}`}
                                onClick={() => {
                                    if (latestDate !== `${year}-${month}`) {
                                        handleNextMonth();
                                    }
                                }}
                                aria-label="다음 달"
                            >
                                <ChevronRight size={20} />
                            </button>
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
                            {/* 미네랄 성분 분석 */}
                            <MineralSection waterQuality={waterQuality} />
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
            <CalendarModal isOpen={isCalenderOpen} onClose={handleCloseCalender} />
        </Layout>
    );
};
