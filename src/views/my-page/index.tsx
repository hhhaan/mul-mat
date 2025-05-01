'use client';
import { Layout } from '@/src/widgets/page-layout';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/entities/user/model/store';
import { PageHeader } from '@/src/widgets/page-header';

export const MyPageView = () => {
    const { userInfo, signOut } = useUserStore();

    const router = useRouter();

    // 로그아웃 처리 함수
    const handleLogout = () => {
        // 실제 구현에서는 세션/쿠키 삭제, 서버에 로그아웃 요청 등
        signOut();
        alert('로그아웃되었습니다.');
        router.push('/');
    };

    return (
        <Layout>
            <PageHeader title="마이페이지" onBackClick={() => router.replace('/')} />

            <div className="px-4 py-3">
                {/* 사용자 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
                    <div className="p-6">
                        <div className="flex items-center ">
                            {/* <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl mr-4">
                                {userInfo?.name[0]}
                            </div> */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{userInfo?.name}</h2>
                                <p className="text-gray-600">{userInfo?.email}</p>
                                {/* <p className="text-sm text-gray-500">가입일: {userInfo?.createdAt}</p> */}
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
