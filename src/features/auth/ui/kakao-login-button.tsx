'use client';

import { createClient } from '@/src/shared/utils/supabase/client';

export const KakaoLoginButton = () => {
    const supabase = createClient();

    const handleKakaoLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                // redirectTo: `${window.location.origin}/api/auth/callback`,
                redirectTo: 'http://localhost:3000/api/auth/callback',
            },
        });
        console.log(data, error);
    };

    return (
        <button
            onClick={handleKakaoLogin}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FEE500',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 16px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                height: '45px',
                transition: 'background-color 0.2s',
                gap: '8px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F1D900')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FEE500')}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 3C6.48 3 2 6.52 2 10.93C2 13.96 3.99 16.63 7 17.92V21.5L10.71 18.5C11.14 18.55 11.56 18.58 12 18.58C17.52 18.58 22 15.06 22 10.64C22 6.23 17.52 3 12 3Z"
                    fill="#000000"
                />
            </svg>
            카카오 계정으로 로그인
        </button>
    );
};
