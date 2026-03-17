import { BottledWaterView } from '@/src/views/bottled-water';
import { bottledWaterData } from '@/src/views/bottled-water/model/water-data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '물맛 - 생수 브랜드별 수질 정보',
    description: '다양한 생수 브랜드의 수질 지표와 미네랄 프로필을 비교해보세요.',
};

export default function BottledWaterPage() {
    const defaultWater = bottledWaterData[0];

    return <BottledWaterView selectedWater={defaultWater} allWaterData={bottledWaterData} />;
}
