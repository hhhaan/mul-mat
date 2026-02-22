import { NextResponse } from 'next/server';
import { subMonths, getYear, getMonth } from 'date-fns';

const MAX_SEARCH_MONTHS = 6;
const MAX_RETRIES = 3;

export const revalidate = 86400; // 24시간 (3600 * 24)

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

export async function GET() {
    let currentDate = new Date();

    for (let i = 0; i < MAX_SEARCH_MONTHS; i++) {
        const year = getYear(currentDate);
        // 한 달 이후에 업데이트 됨
        const month = getMonth(currentDate) + 1 - 1;
        const paddedMonth = String(month).padStart(2, '0');

        const apiUrl = `https://apis.data.go.kr/B500001/qltWtrSvc/MonPurification?serviceKey=${process.env.WATER_QUALITY_API_KEY}&pageNo=1&viewType=json&year=${year}&month=${paddedMonth}&BSI=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&SIGUN=
`;

        // console.log(apiUrl);

        try {
            const response = await fetchWithRetry(apiUrl);
            const json = await response.json();
            const items = json.response?.body?.items;

            if (items && Array.isArray(items) && items.length > 0) {
                return NextResponse.json({
                    latestYear: year,
                    latestMonth: month,
                });
            }
        } catch (error) {
            console.error(`${year}-${paddedMonth} 조회 실패:`, error);
        }

        currentDate = subMonths(currentDate, 1);
    }

    return NextResponse.json({ error: '최근 6개월 내 데이터가 없습니다.' }, { status: 404 });
}
