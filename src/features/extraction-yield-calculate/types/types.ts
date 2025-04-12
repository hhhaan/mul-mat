export interface InputValues {
    coffeeWeight: string;
    waterAmount: string;
    tdsValue: string;
}

export interface CalculationResult {
    yield: string;
    status: 'optimal' | 'high' | 'low' | 'calculating';
    description: string;
    recommendation: string;
}

export interface InputFieldProps {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    unit: string;
}

export interface ResultCardProps {
    title: string;
    value: string;
    description: string;
    status: 'optimal' | 'high' | 'low' | 'calculating';
    icon: React.ReactNode;
}

export interface RecommendationCardProps {
    recommendation: string;
}
