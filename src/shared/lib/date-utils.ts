// shared/lib/date-utils.ts

/**
 * 실제 현재 날짜 (테스트용)
 */
export const getCurrentDate = () => {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1, // 1-12
    };
};

/**
 * 선택한 날짜가 사용 가능한 범위를 벗어났는지 체크
 */
export const isFutureDate = (
    year: number,
    month: number,
    latestYear: number,
    latestMonth: number,
) => {
    if (year > latestYear) return true;
    if (year === latestYear && month > latestMonth) return true;
    return false;
};

export const formatDateKey = (year: number, month: number) => {
    return `${year}-${month}`;
};
