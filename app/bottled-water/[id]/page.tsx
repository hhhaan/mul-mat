import { BottledWaterView } from '@/src/views/bottled-water';
import { bottledWaterData } from '@/src/views/bottled-water/model/water-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const water = bottledWaterData.find((w) => w.id === Number(id));

    if (!water) {
        return {
            title: '물맛 - 생수 수질 정보',
        };
    }

    return {
        title: `물맛 - ${water.name} 수질 정보`,
        description: `${water.name}의 pH, 경도, 미네랄 성분 정보를 확인해보세요. ${water.description2}`,
    };
}

export async function generateStaticParams() {
    return bottledWaterData.map((water) => ({
        id: water.id.toString(),
    }));
}

export default async function BottledWaterDetailPage({ params }: Props) {
    const { id } = await params;
    const water = bottledWaterData.find((w) => w.id === Number(id));

    if (!water) {
        notFound();
    }

    return <BottledWaterView selectedWater={water} allWaterData={bottledWaterData} />;
}
