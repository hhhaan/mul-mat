import { findAddressByIdx } from '../_lib';
import { Address } from '../_types';

export async function getAddressById(idx: string): Promise<Address | null> {
    try {
        const address = await findAddressByIdx(idx);
        return address || null;
    } catch (error) {
        console.error('주소 조회 오류:', error);
        throw error;
    }
}
