// features/water-quality-view/model/calendar-modal.model.ts
import { useState } from 'react';
import { useQueryStates, parseAsInteger } from 'nuqs';
import { getLatestAvailableDate, formatDateKey, isFutureDate } from '@/src/shared/lib';

export const useCalendarModal = () => {
    const { year: latestYear, month: latestMonth } = getLatestAvailableDate();
    const latestDate = formatDateKey(latestYear, latestMonth);

    // nuqs로 URL 상태 관리
    const [{ year, month }, setParams] = useQueryStates({
        year: parseAsInteger,
        month: parseAsInteger,
    });

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 모달 내 선택 상태 (0-based, monthNames 인덱스)
    const [selectedYear, setSelectedYear] = useState(year ?? latestYear);
    const [selectedMonth, setSelectedMonth] = useState(month ? month - 1 : latestMonth - 1);

    const handlePrevYear = () => {
        setSelectedYear((prev) => prev - 1);
    };

    const handleNextYear = () => {
        setSelectedYear((prevYear) => {
            const newYear = prevYear + 1;
            // 연도 이동 후 미래 월이면 강제로 조정
            if (isFutureDate(newYear, selectedMonth + 1)) {
                setSelectedMonth(latestMonth - 1);
            }
            return newYear;
        });
    };

    // 확인 버튼: URL 업데이트
    const applySelectedDate = () => {
        setParams({
            year: selectedYear,
            month: selectedMonth + 1,
        });
    };

    return {
        selectedYear,
        selectedMonth,
        latestYear,
        latestMonth,
        latestDate,
        monthNames,
        isFutureDate,
        setSelectedMonth,
        handlePrevYear,
        handleNextYear,
        applySelectedDate,
    };
};
