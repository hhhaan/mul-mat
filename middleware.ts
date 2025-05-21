import { NextResponse } from 'next/server';
// import { updateSession } from '@/src/shared/utils/supabase/middleware';

export async function middleware() {
    // export async function middleware(request: NextRequest) {
    // 인증 기능 임시 비활성화
    return NextResponse.next();

    /*
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
    */
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
