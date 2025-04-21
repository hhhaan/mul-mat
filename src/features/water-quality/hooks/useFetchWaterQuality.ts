import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';
import { formatMonth, formatYear, getPreviousMonth } from '@/src/features/water-quality/utils';
import { useDateStore } from '@/src/features/water-quality/model/date-store';

export const useFetchWaterQuality = (selectedId: string | undefined) => {
    const { year, month, setLatestDate, isInitial, retryCount, handlePrevMonth, resetDate } = useDateStore();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, selectedId, year, month, handlePrevMonth]);

    // 데이터 성공 시 최신 날짜 업데이트
    useEffect(() => {
        if (isSuccess && waterQuality) {
            if (isInitial.current) {
                setLatestDate(`${year}-${month}`);
                isInitial.current = false;
            } else {
                console.log(waterQuality);
            }
        }
    }, [isSuccess, waterQuality, year, month, setLatestDate, isInitial]);

    // 선택된 ID가 변경될 때 날짜 초기화
    useEffect(() => {
        resetDate();
    }, [selectedId, resetDate]);

    return {
        waterQuality,
        isLoading,
        isError,
        isSuccess,
    };
};
