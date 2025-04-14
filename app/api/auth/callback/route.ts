import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/src/shared/utils/supabase/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    // const next = searchParams.get('next') ?? '/';

    // 테스트용
    const next = '/';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // 세션이 설정된 후 리다이렉트
            const response = NextResponse.redirect(new URL(next, origin));

            // 쿠키를 새로운 응답에 복사
            const cookieStore = await cookies();
            const allCookies = cookieStore.getAll();
            allCookies.forEach((cookie: ResponseCookie) => {
                response.cookies.set(cookie.name, cookie.value, {
                    domain: cookie.domain,
                    expires: cookie.expires,
                    httpOnly: cookie.httpOnly,
                    maxAge: cookie.maxAge,
                    path: cookie.path,
                    sameSite: cookie.sameSite,
                    secure: cookie.secure,
                });
            });

            return response;
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
