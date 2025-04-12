import { CalculationResult } from '../types';
import { YIELD_THRESHOLDS, STATUS_MESSAGES } from '../constants';

export const calculateExtractionYield = (coffeeWeight: number, waterAmount: number, tdsValue: number): number => {
    return (tdsValue * waterAmount) / coffeeWeight;
};

export const getResultStatus = (extractionYield: number): CalculationResult => {
    if (extractionYield < YIELD_THRESHOLDS.LOW) {
        return {
            yield: extractionYield.toFixed(1),
            ...STATUS_MESSAGES.LOW,
        };
    } else if (extractionYield > YIELD_THRESHOLDS.HIGH) {
        return {
            yield: extractionYield.toFixed(1),
            ...STATUS_MESSAGES.HIGH,
        };
    } else {
        return {
            yield: extractionYield.toFixed(1),
            ...STATUS_MESSAGES.OPTIMAL,
        };
    }
};
