'use client';

// import { useRouter } from 'next/navigation';
import { Layout } from '@/src/widgets/page-layout';
// import { PageHeader } from '@/src/widgets/page-header';
import { CalculationForm } from '@/src/widgets/calculation-form';
import { CalculationResult } from '@/src/widgets/calculation-result';
import { useCalculator } from '@/src/features/extraction-yield-calculate/hooks/useCalculator';
import { HelpSection } from './ui/help-section';

export const CalculatorPage = () => {
    // const router = useRouter();

    const { inputValues, result, calculated, handleInputChange, calculate } = useCalculator();

    return (
        <Layout>
            {/* <PageHeader title="커피 수율 계산기" onBackClick={() => router.replace('/')} /> */}
            <CalculationForm inputValues={inputValues} handleInputChange={handleInputChange} onCalculate={calculate} />

            {/* 결과 섹션 */}
            {calculated && <CalculationResult result={result} calculated={calculated} />}

            {/* 도움말 섹션 */}
            <HelpSection />
        </Layout>
    );
};
