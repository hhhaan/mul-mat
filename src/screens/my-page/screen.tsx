'use client';
import { useState } from 'react';
import { Layout } from '@/src/widgets/layout';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/shared/utils/supabase/client';

export const MyPageScreen = () => {
    const [user, setUser] = useState({
        name: '홍길동',
        email: 'user@example.com',
        joinDate: '2023년 8월 15일',
        preferences: {
            favoriteBrewMethod: '핸드드립',
            favoriteBean: '에티오피아 예가체프',
        },
    });
    const supabase = createClient();

    const router = useRouter();

    // 로그아웃 처리 함수
    const handleLogout = () => {
        // 실제 구현에서는 세션/쿠키 삭제, 서버에 로그아웃 요청 등
        supabase.auth.signOut();
        alert('로그아웃되었습니다.');
        router.push('/');
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">마이페이지</h1>

                {/* 사용자 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
                    <div className="p-6">
                        <div className="flex items-center ">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                                {user.name[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500">가입일: {user.joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                    로그아웃
                </button>
            </div>
        </Layout>
    );
};
