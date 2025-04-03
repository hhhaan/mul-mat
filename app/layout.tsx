import { App } from '@/src/app/App';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <App>{children}</App>;
}
