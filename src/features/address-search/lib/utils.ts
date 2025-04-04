import { CSV_FILE_PATH } from '@/src/shared/config';
import { Address } from '../types';
import Papa from 'papaparse';

export const loadAddressData = async (): Promise<Address[]> => {
    const response = await fetch(CSV_FILE_PATH);
    const csvText = await response.text();

    const results = Papa.parse<Address>(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, field: string) => {
            if (field === 'is_wide') {
                return value.toLowerCase() === 'true';
            }
            return value;
        },
    });

    if (results.data?.length > 0) {
        return results.data;
    }
    return [];
};

export const getSuggestions = (addressList: Address[], query: string): string[] => {
    if (!query || query.trim() === '') return [];
    const normalizedQuery = query.toLowerCase().trim();
    return addressList
        .map((item) => item.full_addr)
        .filter((address) => address.toLowerCase().includes(normalizedQuery));
};

export const findMatchingAddress = (addressList: Address[], address: string): Address | null => {
    if (!address || !addressList.length) return null;
    const matches = addressList.filter((row) => row.full_addr === address);
    return matches.length > 0 ? matches[0] : null;
};
