import type { NextConfig } from 'next';
import path from 'path';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/src': path.resolve(__dirname, 'src'),
        };
        return config;
    },
};

const nextPwa = withPWA({
    dest: 'public',
    // register: true,
    // skipWaiting: true,
});

// 최신 문법
export default nextPwa(nextConfig as any);
