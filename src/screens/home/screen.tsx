'use client';
import { useEffect, useState } from 'react';
import { Layout } from '@/src/widgets/page-layout';
import { Droplet, Droplets, ChevronLeft, ChevronRight, Calendar, MapPin, X, AlertCircle } from 'lucide-react';
import { SearchContainer } from '@/src/widgets/search-container';
import { Header } from '@/src/widgets/header';
import { evaluateWaterQualityStatus, formatMonth, formatYear } from '@/src/features/water-quality/utils';
import { WaterQualityCard } from '@/src/features/water-quality/ui';
import { getPreviousMonth } from '@/src/features/water-quality/utils';
import { ContactUs } from '@/src/widgets/contact-us';
import { Disclaimer } from '@/src/widgets/disclaimer';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';
import { MineralCard } from '@/src/features/water-quality/ui';
import { Spinner } from '@/src/shared/ui';
import { FilterManagementAlert } from '@/src/features/recommned-filter/ui';
import { useDateStore } from '@/src/features/water-quality/model/date-store';

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
                            <div className="bg-sky-50 rounded-xl p-4 mb-4 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-sm text-sky-500 flex items-center">
                                        <Droplets size={18} className="mr-2 text-sky-500" />
                                        미네랄 성분 분석
                                    </h4>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <MineralCard
                                        title="칼슘(추정)"
                                        value={waterQuality.CA}
                                        description="바디감과 단맛에 영향"
                                    />
                                    <MineralCard
                                        title="마그네슘(추정)"
                                        value={waterQuality.MG}
                                        description="복합성에 영향"
                                    />
                                    <MineralCard
                                        title="황산염"
                                        value={waterQuality.SO}
                                        description="쓴맛 완화, 밸런스"
                                    />
                                    <MineralCard
                                        title="염소이온"
                                        value={waterQuality.CL}
                                        description="부식 가능성, 쓴맛 강조"
                                    />
                                </div>
                            </div>

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

const CalendarModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { latestDate, setYear, setMonth } = useDateStore();

    const [latestYear, latestMonth] = latestDate.split('-').map(Number);

    // 0-인덱스 기반으로 정의된 monthNames
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 모달 내 선택 상태 즉, monthNames 인덱스
    const [selectedYear, setSelectedYear] = useState(latestYear);
    const [selectedMonth, setSelectedMonth] = useState(latestMonth - 1);

    // console.log('selectedYear, selectedMonth', selectedYear, selectedMonth);
    console.log('selectedMonth', monthNames[selectedMonth]);

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handlePrevYear = () => {
        setSelectedYear((prev: number) => prev - 1);
    };

    const handleNextYear = () => {
        setSelectedYear((prevYear) => {
            const newYear = prevYear + 1;
            // 연도 이동 후 미래 월이면 강제로 조정
            if (newYear === latestYear && selectedMonth > latestMonth - 1) {
                setSelectedMonth(latestMonth - 1);
            }
            return newYear;
        });
    };

    const isFutureDate = (month: number) => {
        if (selectedYear === latestYear && month > latestMonth - 1) return true;
        if (selectedYear && latestYear && selectedYear === latestYear && month > latestMonth) return true;
        return false;
    };

    // latestDate가 null이면 아무것도 렌더링하지 않음
    if (!latestDate || !isOpen || !latestYear || !latestMonth) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden transform transition-all">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Calendar size={18} className="mr-2 text-sky-600" />
                        날짜 선택
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-200"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 연도 선택 헤더 */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <button
                        className="p-1 rounded-full text-sky-600 hover:bg-sky-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                        onClick={() => {
                            handlePrevYear();
                        }}
                        disabled={selectedYear === latestYear - 3}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-medium text-gray-800">{selectedYear}년</span>
                    <button
                        className="p-1 rounded-full text-sky-600 hover:bg-sky-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                        disabled={selectedYear === latestYear}
                        onClick={() => {
                            handleNextYear();
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* 알림 메시지 */}
                <div className="bg-amber-50 text-amber-800 text-xs p-2 flex items-center justify-center">
                    <AlertCircle size={14} className="mr-1 text-amber-600" />
                    {selectedYear === latestYear - 3
                        ? '최대 3년까지 조회 가능합니다.'
                        : `${latestDate} 이후의 데이터는 아직 없습니다`}
                </div>

                {/* 월 그리드 */}
                <div className="grid grid-cols-3 gap-2 p-4">
                    {monthNames.map((name, idx) => {
                        const isSelected = idx === selectedMonth;
                        const isFuture = isFutureDate(idx);

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (!isFuture) {
                                        setSelectedMonth(idx);
                                    }
                                }}
                                className={`
                    flex items-center justify-center p-3 rounded-lg transition-colors
                    ${isSelected ? 'bg-sky-600 text-white' : ''}
                    ${!isSelected && !isFuture ? 'text-black bg-gray-100' : ''}
                    ${
                        isFuture
                            ? 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed filter blur-[0.5px]'
                            : 'cursor-pointer hover:bg-sky-50'
                    }
                  `}
                            >
                                {name}
                            </div>
                        );
                    })}
                </div>

                {/* 푸터 */}
                <div className="border-t border-gray-200 px-4 py-3 flex justify-end space-x-2 bg-gray-50">
                    <button className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                        onClick={() => {
                            console.log('selectedYear', selectedYear, 'selectedMonth', selectedMonth);
                            setYear(selectedYear);
                            setMonth(selectedMonth + 1);
                            onClose();
                        }}
                    >
                        현재 선택: {selectedYear}년 {selectedMonth + 1}월
                    </button>
                </div>
            </div>
        </div>
    );
};
