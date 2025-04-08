import { promises as fs } from 'fs';
import path from 'path';
import { Address } from '../_types';

export async function loadAddressData(): Promise<Address[]> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'address.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('주소 데이터 로드 오류:', error);
        throw error;
    }
}

export async function findAddressByIdx(idx: string): Promise<Address | undefined> {
    const addresses = await loadAddressData();
    return addresses.find((address) => address.idx === idx);
}
