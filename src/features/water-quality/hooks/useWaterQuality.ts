'use client';

// import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';
// import { formatMonth, formatYear, getPreviousMonth } from '@/src/features/water-quality/utils';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQueryState } from 'nuqs';

export const useWaterQuality = (selectedId: string, year: string, month: string) => {
    const { data: waterQuality, isLoading } = useQuery({
        queryKey: ['waterQuality', selectedId, year, month], // 쿼리 키에 최종 결정된 'selectedId'를 사용
        queryFn: () => fetchWaterQualityData({ id: selectedId, year, month }),
        enabled: !!selectedId, // 'selectedId'가 존재할 때만 쿼리 실행 (selectedselectedId 또는 URL 파라미터)
    });

    return {
        isLoading,
        waterQuality,
    };
};
