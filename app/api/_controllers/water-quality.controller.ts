// app/api/_controllers/waterQualityController.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAddressById, getWaterQualityForAddress } from '@/app/api/_services';
import { estimateSOCL } from '@/app/api/_utils';

export async function getWaterQualityByAddressIdx(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const idx = searchParams.get('id');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        if (!idx) {
            return NextResponse.json({ message: 'idx가 없습니다.' }, { status: 400 });
        }

        const address = await getAddressById(idx);
        if (!address) {
            return NextResponse.json({ message: '주소 데이터를 찾을 수 없습니다.' }, { status: 404 });
        }

        const waterQualityData = await getWaterQualityForAddress(address, year, month);
        if (!waterQualityData) {
            return NextResponse.json({ message: '수질 데이터를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 기본값 설정
        let estimatedCalcium: string | null = null;
        let estimatedMagnesium: string | null = null;

        // 경도 값이 유효한 경우에만 계산 실행
        const hardness = waterQualityData.HR;
        if (hardness !== null && hardness !== undefined && !isNaN(Number(hardness))) {
            const result = estimateSOCL(Number(hardness));
            estimatedCalcium = result.estimatedCalcium;
            estimatedMagnesium = result.estimatedMagnesium;
        }
        return NextResponse.json(
            {
                message: '조회 성공',
                data: {
                    // 정수장명
                    FCLT_NAM: waterQualityData.FCLT_NAM,
                    // 데이터기준일자
                    UPDATE_DAT: waterQualityData.UPDATE_DAT,
                    // 경도
                    HR: waterQualityData.HR,
                    // 수소이온농도
                    PH: waterQualityData.PH,
                    // 증발잔류물(tds)
                    TDS: waterQualityData.RE,
                    // 칼슘(추정)
                    CA: estimatedCalcium,
                    // 마그네슘(추정)
                    MG: estimatedMagnesium,
                    // 황산이온
                    SO: waterQualityData.SO,
                    // 염소이온
                    CL: waterQualityData.CL,
                    // 잔류염소
                    RC: waterQualityData.RC,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('API 오류:', error);
        return NextResponse.json({ error: '데이터 조회에 실패했습니다.' }, { status: 500 });
    }
}
