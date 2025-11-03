'use client';

import { useQuery } from '@tanstack/react-query';

export const useLatestDate = () => {
    return useQuery({
        queryKey: ['latestDate'],
        queryFn: async () => {
            const res = await fetch('/api/water-quality/latest-date');
            console.log(res);
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        staleTime: 1000 * 60 * 60, // 1시간 캐싱
        gcTime: 1000 * 60 * 60 * 24, // 24시간 보관
    });
};
