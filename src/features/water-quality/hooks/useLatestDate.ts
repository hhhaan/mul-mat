'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchLatestDate = async () => {
    const { data } = await axios.get('/api/water-quality/latest-date');
    return data;
};

export const useLatestDate = () => {
    return useQuery({
        queryKey: ['latestDate'],
        queryFn: fetchLatestDate,
        // 5분 동안은 신선한 데이터로 간주 (캐시 사용)
        staleTime: 5 * 60 * 1000,
        // 언마운트 후 10분 동안 메모리에 유지
        gcTime: 10 * 60 * 1000,
    });
};
