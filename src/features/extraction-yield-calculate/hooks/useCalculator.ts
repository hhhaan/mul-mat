import { useState } from 'react';
import { InputValues, CalculationResult } from '../types';
import { calculateExtractionYield, getResultStatus } from '../utils/calculations';

const initialInputValues: InputValues = {
    coffeeWeight: '',
    waterAmount: '',
    tdsValue: '',
};

const initialResult: CalculationResult = {
    yield: '0',
    status: 'calculating',
    description: '',
    recommendation: '',
};

export const useCalculator = () => {
    const [inputValues, setInputValues] = useState<InputValues>(initialInputValues);
    const [result, setResult] = useState<CalculationResult>(initialResult);
    const [calculated, setCalculated] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues((prev: InputValues) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculate = () => {
        // 입력값이 없으면 계산하지 않음
        if (!inputValues.coffeeWeight || !inputValues.waterAmount || !inputValues.tdsValue) {
            return;
        }

        // 입력값 숫자로 변환
        const coffeeWeight = parseFloat(inputValues.coffeeWeight);
        const waterAmount = parseFloat(inputValues.waterAmount);
        const tdsValue = parseFloat(inputValues.tdsValue);

        // 수율 계산
        const extractionYield = calculateExtractionYield(coffeeWeight, waterAmount, tdsValue);

        // 결과 상태 설정
        const calculationResult = getResultStatus(extractionYield);

        setResult(calculationResult);
        setCalculated(true);
    };

    return {
        inputValues,
        result,
        calculated,
        handleInputChange,
        calculate,
    };
};
