'use client';

import { useQuery } from '@tanstack/react-query';
import { formatYear, formatMonth } from '../utils';
import { fetchWaterQualityData } from '../api';

export const useFetchWaterQuality = (selectedId: string | undefined, year: number, month: number) => {
    // const queryClient = useQueryClient();

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['waterQuality', selectedId, formatYear(year), formatMonth(month)],
        queryFn: () => fetchWaterQualityData({ id: selectedId, year: formatYear(year), month: formatMonth(month) }),
        enabled: !!selectedId && !!year && !!month,
        retry: false,
    });

    return {
        data,
        isLoading,
        isError,
        isSuccess,
    };
};
