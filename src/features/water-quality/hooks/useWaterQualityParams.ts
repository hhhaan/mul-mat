'use client';

import { addMonths, subMonths } from 'date-fns';

import { useQueryStates, parseAsString } from 'nuqs';
import { useLatestDate } from '@/src/features/water-quality/hooks';

/**
 * 전역 최신 날짜를 조회하고,
 * URL 쿼리 파라미터(id, year, month)를 관리하며,
 * 날짜 탐색(이전/다음 달) 기능을 제공하는 훅.
 */
export const useWaterQualityParams = () => {
    const { data, isLoading: isLatestDateLoading } = useLatestDate();
    const { latestYear, latestMonth } = data || {};

    const [{ id, year, month }, setParams] = useQueryStates({
        id: parseAsString,
        year: parseAsString,
        month: parseAsString,
    });

    const handlePrevMonth = () => {
        if (!year || !month) return; // 현재 날짜가 없으면 중단
        const curDate = new Date(parseInt(year), parseInt(month) - 1, 1); // JS Date 월은 0-index
        const prevDate = subMonths(curDate, 1);

        setParams({
            year: prevDate.getFullYear().toString(),
            month: (prevDate.getMonth() + 1).toString(), // URL 월은 1-index
        });
    };

    const handleNextMonth = () => {
        if (!year || !month) return;
        const curDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const nextDate = addMonths(curDate, 1);

        setParams({
            year: nextDate.getFullYear().toString(),
            month: (nextDate.getMonth() + 1).toString(),
        });
    };

    const latestDate = `${latestYear}-${latestMonth}`;

    return {
        currentId: id,
        currentYear: year,
        currentMonth: month,
        latestDate,
        latestYear, // SearchContainer에 전달
        latestMonth,
        isDateLoading: isLatestDateLoading || (!year && !month),
        handlePrevMonth,
        handleNextMonth,
        setParams,
    };
};
