import axios, { isAxiosError } from 'axios';
import { WaterQualityDataResponse } from '@/src/features/water-quality/types';

export const fetchWaterQualityData = async (params: {
    id: string | undefined;
    year?: string | null;
    month?: string | null;
}) => {
    if (!params.id) return null;

    const url = `/api/water-quality?id=${params.id}&year=${params.year}&month=${params.month}`;

    try {
        const response = await axios.get<WaterQualityDataResponse>(url);

        // API가 200 OK와 함께 성공 데이터를 보냈는지 확인
        if (response.data && response.data.data) {
            return response.data.data;
        }

        // 200 OK 응답이지만 데이터가 없는 경우 (있을 수 없는 시나리오지만 안전장치)
        throw new Error('API 응답이 유효하지 않습니다.');
    } catch (error) {
        // axios 에러인지 확인
        if (isAxiosError(error)) {
            // 404 Not Found 에러인 경우, 백엔드가 보낸 메시지로 에러 생성
            if (error.response?.status === 404) {
                const errorMessage = error.response.data?.message || '수질 데이터를 찾을 수 없습니다.';
                throw new Error(errorMessage);
            }
        }
        // 그 외 모든 서버/네트워크 에러
        throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
    }
};
