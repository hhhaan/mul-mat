'use client';

import '@/src/shared/lib/logo-logger';
import { NavBar } from './nav-bar';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen pb-16">
            <main>{children}</main>
            <NavBar />
        </div>
    );
}
