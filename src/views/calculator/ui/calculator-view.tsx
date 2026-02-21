'use client';

import { CalculationForm } from '@/src/widgets/calculation-form';
import { CalculationResult } from '@/src/widgets/calculation-result';
import { useCalculator } from '@/src/features/extraction-yield-calculate/hooks/useCalculator';

export const CalculatorView = () => {
    const { inputValues, result, calculated, handleInputChange, calculate } = useCalculator();

    return (
        <>
            <CalculationForm inputValues={inputValues} handleInputChange={handleInputChange} onCalculate={calculate} />
            {calculated && <CalculationResult result={result} calculated={calculated} />}
        </>
    );
};
