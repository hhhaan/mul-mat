// features/water-quality-view/model/calendar-modal.model.ts
import { useState } from 'react';
import { useDateStore } from './date-store';

export const useCalendarModal = () => {
    const { year, month, setYear, setMonth, latestDate } = useDateStore();
    const [latestYear, latestMonth] = latestDate.split('-').map(Number);

    // 모달 내 선택 상태 즉, monthNames 인덱스
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectedMonth, setSelectedMonth] = useState(month - 1);

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

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

    const applySelectedDate = () => {
        setYear(selectedYear);
        setMonth(selectedMonth + 1);
    };

    return {
        year,
        month,
        selectedYear,
        selectedMonth,
        latestYear,
        latestMonth,
        latestDate,
        monthNames,
        setSelectedMonth,
        handlePrevYear,
        handleNextYear,
        isFutureDate,
        applySelectedDate,
    };
};
