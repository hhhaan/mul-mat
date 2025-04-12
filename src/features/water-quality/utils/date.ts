'use client';

import { useEffect, useState } from 'react';

// 현재 날짜 정보를 제공하는 커스텀 훅
export const useCurrentDate = () => {
    // 초기값은 null로 설정
    const [currentDate, setCurrentDate] = useState<{
        year: number | null;
        month: number | null;
    }>({
        year: null,
        month: null,
    });

    // 클라이언트 사이드에서만 실행
    useEffect(() => {
        const today = new Date();
        setCurrentDate({
            year: today.getFullYear(),
            month: today.getMonth() + 1, // JavaScript는 0부터 시작하므로 +1
        });
    }, []);

    return currentDate;
};

// 날짜 포맷 유틸리티 함수들
export const formatYear = (year: number | null): string => year?.toString() || '';

export const formatMonth = (month: number | null): string => (month ? month.toString().padStart(2, '0') : '');

export const formatDay = (day: number | null): string => (day ? day.toString().padStart(2, '0') : '');

export const getNextMonth = (year: number, month: number) => {
    if (month === 12) {
        return { year: year + 1, month: 1 };
    }

    return { year, month: month + 1 };
};

export const getPreviousMonth = (year: number, month: number) => {
    // if (year === null || month === null) {
    //     return { year: null, month: null };
    // }
    // 1월인 경우 이전 해 12월로 변경
    if (month === 1) {
        return { year: year - 1, month: 12 };
    }

    // 그 외의 경우는 같은 해의 이전 달
    return { year, month: month - 1 };
};
