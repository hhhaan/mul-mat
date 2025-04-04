import { useCallback, useEffect, useState } from 'react';
import { CSV_FILE_PATH } from '@/src/shared/config';
import { loadAddressData, getSuggestions, findMatchingAddress } from '../lib';
import { Address } from '../types';

export const useAddressData = () => {
    const [addresses, setAddresses] = useState<string[]>([]);
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadAddress = useCallback(async () => {
        if (!CSV_FILE_PATH) return;
        setLoading(true);
        setError(null);
        try {
            const response = await loadAddressData();
            setAddressList(response);
            const validAddress = response.map((item: Address) => item.full_addr).filter(Boolean);
            setAddresses(validAddress);
        } catch (error) {
            console.error('주소 데이터를 불러오는 중 오류가 발생했습니다:', error);
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadAddress();
    }, [loadAddress]);

    const getSuggestion = useCallback((query: string) => getSuggestions(addressList, query), [addressList]);

    //특정 주소와 일치하는 데이터 검색
    const getMatchingAddress = useCallback(
        (address: string) => findMatchingAddress(addressList, address),
        [addressList]
    );

    return {
        addresses,
        addressList,
        getSuggestion,
        getMatchingAddress,
        loading,
        error,
        refreshData: loadAddressData,
    };
};
