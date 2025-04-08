import axios from 'axios';
import { AddressSuggestion } from '../types';

export const fetchAddressSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
    try {
        const response = await axios.get(`/api/address?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('주소 검색 오류:', error);
        return [];
    }
};
