'use client';

import '@/src/shared/lib/logo-logger';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <main>{children}</main>
        </div>
    );
}
