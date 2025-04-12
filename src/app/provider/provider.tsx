'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './auth-provider';

const queryClient = new QueryClient();

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
        </AuthProvider>
    );
};
