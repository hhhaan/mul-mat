import axios from 'axios';
import { WaterQualityDataResponse } from '@/src/features/water-quality/types';

export const getWaterQualityData = async (idx: string) => {
    if (!idx) return null;
    const response = await axios.get<WaterQualityDataResponse>(`/api/water-quality?idx=${idx}`);
    return response.data.data;
};
