'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWaterQualityData } from '@/src/features/water-quality/api';
import { useEffect } from 'react';

export const useWaterQuality = (selectedId: string, year: string, month: string) => {
    const {
        data: waterQuality,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['waterQuality', selectedId, year, month],
        queryFn: () => fetchWaterQualityData({ id: selectedId, year, month }),
        enabled: !!selectedId && !!year && !!month,
        retry: (failureCount, error) => {
            // '데이터 없음' 에러의 경우 재시도하지 않음
            if (error.message.includes('수질 데이터를 찾을 수 없습니다')) {
                return false;
            }
            // 그 외 다른 에러는 2번까지 재시도
            return failureCount < 2;
        },
    });

    useEffect(() => {
        if (error && error.message.includes('수질 데이터를 찾을 수 없습니다')) {
            alert('수질 데이터를 찾을 수 없습니다.');
        }
    }, [error]);

    return {
        isLoading,
        waterQuality,
    };
};
