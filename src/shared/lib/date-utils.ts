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
 * 서비스에서 사용 가능한 최신 날짜
 * 정부 서버 특성상 전월 데이터만 제공
 */
export const getLatestAvailableDate = () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return {
        year: prevMonth.getFullYear(),
        month: prevMonth.getMonth() + 1, // 1-12로 통일
    };
};

/**
 * 선택한 날짜가 사용 가능한 범위를 벗어났는지 체크
 */
export const isFutureDate = (year: number, month: number) => {
    const { year: latestYear, month: latestMonth } = getLatestAvailableDate();

    if (year > latestYear) return true;
    if (year === latestYear && month > latestMonth) return true;
    return false;
};

export const formatDateKey = (year: number, month: number) => {
    return `${year}-${month}`;
};
