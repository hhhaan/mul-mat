import { Info } from 'lucide-react';

export const HelpSection = () => {
    return (
        <div className="px-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-sky-100">
                <h3 className="text-sm font-medium mb-3 flex items-center text-sky-700">
                    <Info size={16} className="mr-1.5" />
                    도움말
                </h3>
                <div className="text-xs text-gray-600 p-3 rounded-lg bg-white">
                    <p className="mb-2">* 수율 계산 공식: (TDS × 물의 양) ÷ 원두 무게</p>
                    <p>* TDS(Total Dissolved Solids)는 추출된 커피에 녹아있는 고형분의 비율입니다.</p>
                </div>
            </div>
        </div>
    );
};
