'use client';

// 날짜 포맷 유틸리티 함수들
export const formatYear = (year: number | null): string => year?.toString() || '';

export const formatMonth = (month: number | null): string => (month ? month.toString().padStart(2, '0') : '');

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
