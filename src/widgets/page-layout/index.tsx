'use client';

import '@/src/shared/lib/logo-logger';
import { NavBar } from './nav-bar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen pb-16">
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto bg-gray-50 shadow-lg overflow-hidden">
                {/* <div className="flex flex-col flex-1 w-full max-w-md mx-auto bg-blue-50 shadow-lg overflow-hidden"> */}
                <main className="flex flex-col w-full">{children}</main>
                <NavBar />
            </div>
        </div>
    );
};
