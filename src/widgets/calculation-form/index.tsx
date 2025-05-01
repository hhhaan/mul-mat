'use client';

import { Coffee, Droplet, Ratio, ChevronRight } from 'lucide-react';
import { MainBanner } from './main-banner';
import { InputField } from '@/src/shared/ui/input-field';

interface CalculationFormProps {
    inputValues: {
        coffeeWeight: string | undefined;
        waterAmount: string | undefined;
        tdsValue: string | undefined;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalculate: () => void;
}

export const CalculationForm = ({ inputValues, handleInputChange, onCalculate }: CalculationFormProps) => {
    return (
        <div className="px-4 mb-4">
            {/* 메인 배너 */}
            <MainBanner />

            <h3 className="text-lg font-semibold text-gray-800 mb-3">추출 정보 입력</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                {/* 원두 투입량 */}
                <InputField
                    icon={<Coffee size={16} className="text-sky-600 mr-2" />}
                    label="원두 투입량"
                    name="coffeeWeight"
                    value={inputValues.coffeeWeight}
                    onChange={handleInputChange}
                    placeholder="원두 무게를 입력하세요"
                    unit="g"
                    className="border-b border-gray-100"
                />

                {/* 물의 양 */}
                <InputField
                    icon={<Droplet size={16} className="text-sky-500 mr-2" />}
                    label="사용한 물의 양"
                    name="waterAmount"
                    value={inputValues.waterAmount}
                    onChange={handleInputChange}
                    placeholder="사용한 물의 양을 입력하세요"
                    unit="ml"
                    className="border-b border-gray-100"
                />

                {/* TDS 값 */}
                <InputField
                    icon={<Ratio size={16} className="text-cyan-500 mr-2" />}
                    label="TDS 값"
                    name="tdsValue"
                    value={inputValues.tdsValue}
                    onChange={handleInputChange}
                    placeholder="TDS 값을 입력하세요 (예: 1.35)"
                    unit="%"
                />
            </div>

            {/* 계산 버튼 */}
            <button
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow transition-colors flex items-center justify-center mb-6"
                onClick={onCalculate}
            >
                <span className="font-medium">수율 계산하기</span>
                <ChevronRight size={18} className="ml-1" />
            </button>
        </div>
    );
};
