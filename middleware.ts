import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/src/shared/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    }

    const publicPath = ['/', '/login', '/bottled-water', '/calculator'];

    const url = new URL(request.url);
    const isPublicPath = publicPath.includes(url.pathname);

    // 공개 페이지일 경우 인증 없이 통과
    if (isPublicPath) {
        return NextResponse.next();
    }

    // 인증 처리
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
