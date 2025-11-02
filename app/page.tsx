import { HomeScreen } from '@/src/views';
import { Suspense } from 'react';

export default function Home() {
    return (<Suspense><HomeScreen /></Suspense>);
}
