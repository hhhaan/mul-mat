import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'mulmat',
        short_name: 'mulmat',
        description: 'mulmat',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/logo.png',
                sizes: '24x24',
                type: 'image/png',
            },
        ],
    };
}
