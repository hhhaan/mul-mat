import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Address } from '@/app/api/_types';

let addresses: Address[];

function loadAddressData() {
    if (addresses) return addresses;

    const filePath = path.join(process.cwd(), 'public', 'address.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    addresses = JSON.parse(fileContent);
    return addresses;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query')?.toLowerCase() || '';

        if (query.length < 1) {
            return NextResponse.json([]);
        }

        const addresses = loadAddressData();

        const suggestions = addresses
            .filter((address) => address.full_address.toLowerCase().includes(query))
            .map((address) => ({
                // idx: address.idx, // idx를 value로 사용
                // addr: address.full_address, // 화면에 표시할 레이블
                data: {
                    idx: address.idx,
                    full_address: address.full_address,
                },
            }))
            .slice(0, 10); // 최대 10개만 반환

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('자동완성 오류:', error);
        return NextResponse.json({ error: '검색 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
