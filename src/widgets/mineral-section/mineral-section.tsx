import { Droplets } from 'lucide-react';
import { MineralCard } from '@/src/features/water-quality/ui';
import { WaterQualityData } from '@/src/features/water-quality/types';

export const MineralSection = ({ waterQuality }: { waterQuality: WaterQualityData }) => {
    return (
        <>
            {/* 미네랄 성분 분석 */}
            <div className="bg-sky-50 rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-sm text-sky-500 flex items-center">
                        <Droplets size={18} className="mr-2 text-sky-500" />
                        미네랄 성분 분석
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <MineralCard title="칼슘(추정)" value={waterQuality.CA} description="바디감과 단맛에 영향" />
                    <MineralCard title="마그네슘(추정)" value={waterQuality.MG} description="복합성에 영향" />
                    <MineralCard title="황산염" value={waterQuality.SO} description="쓴맛 완화, 밸런스" />
                    <MineralCard title="염소이온" value={waterQuality.CL} description="부식 가능성, 쓴맛 강조" />
                </div>
            </div>
        </>
    );
};
