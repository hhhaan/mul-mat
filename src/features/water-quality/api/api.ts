import axios from 'axios';
import { WaterQualityDataResponse } from '@/src/features/water-quality/types';

export const fetchWaterQualityData = async (params: {
    id: string | undefined;
    year?: string | null;
    month?: string | null;
}) => {
    if (!params.id) return null;

    const url = `/api/water-quality?id=${params.id}&year=${params.year}&month=${params.month}`;

    const response = await axios.get<WaterQualityDataResponse>(url);
    return response.data.data;
};
