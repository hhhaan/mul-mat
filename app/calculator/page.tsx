import { Layout } from '@/src/widgets/page-layout';
import { CalculatorView, HelpSection } from '@/src/views';

export default function EYCalculatorPage() {
    return (
        <Layout>
            <CalculatorView />
            <HelpSection />
        </Layout>
    );
}
