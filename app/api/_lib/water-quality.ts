import axios from 'axios';
import { WaterQualityItem } from '../_types';

export async function fetchWaterQualityData(
    fclt_addr: string,
    fclt_nm: string,
    fclt_type: string,
    year?: string | null,
    month?: string | null
): Promise<WaterQualityItem | null> {
    if (!fclt_addr || !fclt_nm || !fclt_type) {
        throw new Error('주소, 이름, 타입이 필요합니다.');
    }

    let apiUrl = '';
    if (fclt_type === '광역') {
        apiUrl = `https://apis.data.go.kr/B500001/qltWtrSvc/MonPurification?serviceKey=${process.env.NEXT_PUBLIC_WATER_QUALITY_API_KEY}&pageNo=1&viewType=json&year=${year}&month=${month}&BSI=한국수자원공사`;
    } else {
        const bsi = fclt_addr.split(' ')[0];
        const sigun = '';
        apiUrl = `https://apis.data.go.kr/B500001/qltWtrSvc/MonPurification?serviceKey=${
            process.env.NEXT_PUBLIC_WATER_QUALITY_API_KEY
        }&pageNo=1&viewType=json&year=${year}&month=${month}&BSI=${encodeURIComponent(bsi)}&SIGUN=${sigun}`;
    }

    try {
        const response = await axios.get(apiUrl, { timeout: 3000 });
        // const response = await axios.get(apiUrl);
        const items = response.data.response.body.items;

        if (!items || !Array.isArray(items)) {
            return null;
        }

        return items.find((item: WaterQualityItem) => item.FCLT_NAM === fclt_nm) || null;
    } catch (error) {
        console.error('수질 데이터 로드 중 오류:', error);
        throw error;
    }
}
