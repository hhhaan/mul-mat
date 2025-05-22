'use client';

import { Droplets } from 'lucide-react';

import { KakaoLoginButton } from '@/src/features/auth/ui/kakao-login-button';

export const LoginForm = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
            {/* Logo and App Name */}
            <div className="flex flex-col items-center mb-12">
                <div className="bg-blue-500 rounded-full p-4 shadow-md mb-3">
                    <Droplets size={48} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-blue-800">물맛</h1>
                <p className="text-gray-600 mt-2 text-center">우리 카페 물맛을 알아보자</p>
            </div>

            {/* Login Container */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">로그인</h2>

                <p className="text-center text-gray-600 mb-6">카카오 계정으로 간편하게 시작하세요</p>

                {/* Login Button */}
                <div className="mb-4">
                    <KakaoLoginButton />
                </div>

                <div className="relative my-6">
                    {/* <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div> */}
                    {/* <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">또는</span>
                    </div> */}
                </div>

                {/* Other Login Options (Placeholder) */}
                {/* <div className="space-y-3">
                    <button
                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={() => {
                            alert('없음 ㅋ');
                        }}
                    >
                        다른 방법으로 로그인
                    </button>
                </div> */}
            </div>

            {/* 푸터 */}
            <div className="text-center text-gray-500 text-xs">
                <p>
                    로그인하면 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                    {/* 로그인하면{' '}
                    <a href="#" className="text-blue-600">
                        이용약관
                    </a>{' '}
                    및{' '}
                    <a href="#" className="text-blue-600">
                        개인정보처리방침
                    </a>
                    에 동의하게 됩니다. */}
                </p>
                <p className="mt-2">&copy; 2025 mulmat. All rights reserved.</p>
            </div>
        </div>
    );
};
