import { fetchWaterQualityData } from '../_lib';
import { Address, WaterQualityItem } from '../_types';

export async function getWaterQualityForAddress(
    address: Address,
    year?: string | null,
    month?: string | null
): Promise<WaterQualityItem | null> {
    try {
        return await fetchWaterQualityData(address.fclt_addr, address.fclt_nm, address.fclt_type, year, month);
    } catch (error) {
        console.error('수질 데이터 조회 오류:', error);
        throw error;
    }
}
