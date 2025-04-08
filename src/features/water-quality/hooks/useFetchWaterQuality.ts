// useFetchWaterQuality.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Address } from '@/src/features/address-search/types';
import { getWaterQualityData } from '../api';

/**
 * 수질 데이터를 가져오는 React Query 커스텀 훅
 * @param addressData 선택된 주소 정보
 */
export const useFetchWaterQuality = (selectedAddress: Address | null) => {
    const queryClient = useQueryClient();

    // // 주소가 선택된 경우에만 API 요청을 활성화
    // const enabled = !!selectedAddress;

    const query = useQuery({
        queryKey: ['waterQualityData', selectedAddress?.idx],
        queryFn: () => getWaterQualityData(selectedAddress?.idx || ''),
        enabled: false,
        staleTime: 5 * 60 * 1000, // 5분 동안 신선
        retry: 1,
    });

    // useEffect를 사용하여 데이터 변경 시 작업 수행
    useEffect(() => {
        if (query.data) {
            // if (query.data || enabled) {
            queryClient.setQueryData(['waterQualityResult'], {
                data: query.data,
                address: selectedAddress,
            });
        }
    }, [query.data, queryClient, selectedAddress]);

    return query;
};
