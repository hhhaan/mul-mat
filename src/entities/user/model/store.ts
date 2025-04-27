'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createClient } from '@/src/shared/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserInfo {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    phone: string;
}

interface UserState {
    user: User | null;
    userInfo: UserInfo | null;
    error: Error | null;
    loading: boolean;
    signInWithKakao: (redirectUrl: string) => Promise<string | null>;
    setUser: (user: User | null) => void;
    signOut: () => Promise<void>;
    getUser: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    redirectToLogin: (redirectPath?: string) => void;
    requireAuth: (callback: () => void) => Promise<void>;
}

const extractUserInfo = (user: User | null): UserInfo | null => {
    if (!user) return null;
    return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.user_metadata?.full_name || '사용자',
        avatarUrl: user.user_metadata?.avatar_url || '',
        phone: user.user_metadata?.phone || '',
    };
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            userInfo: null,
            error: null,
            loading: false,
            signInWithKakao: async (redirectUrl: string) => {
                set({ loading: true });
                try {
                    const supabase = createClient(); // 함수 내부에서 초기화
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'kakao',
                        options: {
                            redirectTo: redirectUrl,
                        },
                    });
                    if (error) throw error;
                    return data.url;
                } catch (error) {
                    console.error('Kakao login error:', error);
                    set({ error: error as Error });
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            // 로그아웃 처리
            signOut: async () => {
                try {
                    set({ loading: true, error: null });
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    set({ user: null, userInfo: null, loading: false });
                    window.location.href = '/'; // 홈페이지로 리다이렉트
                } catch (error) {
                    console.error('로그아웃 오류:', error);
                    set({ error: error as Error, loading: false });
                }
            },

            getUser: async () => {
                try {
                    set({ loading: true });
                    const supabase = createClient(); // 함수 내부에서 초기화
                    const { data, error } = await supabase.auth.getUser();

                    if (error) throw error;
                    const userInfo = extractUserInfo(data.user);
                    set({ user: data.user, userInfo, loading: false, error: null });
                } catch (error) {
                    set({ user: null, userInfo: null, loading: false, error: error as Error });
                }
            },

            // 사용자 정보 설정 (로그인 성공 시 호출)
            setUser: (user: User | null) => {
                const userInfo = extractUserInfo(user);
                set({ user, userInfo, loading: false, error: null });
            },
            // 추가된 메서드: 인증 확인
            checkAuth: async () => {
                if (get().user) {
                    return true;
                }

                try {
                    set({ loading: true, error: null });
                    const supabase = createClient();
                    const { data, error } = await supabase.auth.getSession();

                    if (error) throw error;

                    const isAuthenticated = !!data.session;

                    if (isAuthenticated && data.session?.user) {
                        const userInfo = extractUserInfo(data.session.user);
                        set({ user: data.session.user, userInfo });
                    }

                    set({ loading: false });
                    return isAuthenticated;
                } catch (error) {
                    console.error('인증 확인 오류:', error);
                    set({
                        user: null,
                        userInfo: null,
                        error: error as Error,
                        loading: false,
                    });
                    return false;
                }
            },

            // 추가된 메서드: 로그인 페이지로 리다이렉트
            redirectToLogin: (redirectPath?: string) => {
                const path = '/login';
                const query = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : '';
                window.location.href = `${path}${query}`;
            },

            // 추가된 메서드: 인증 필요 액션 실행
            requireAuth: async (callback: () => void) => {
                const isAuthenticated = await get().checkAuth();

                if (isAuthenticated) {
                    callback();
                } else {
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
                    const confirmed =
                        typeof window !== 'undefined'
                            ? window.confirm(
                                  '이 기능을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?'
                              )
                            : false;

                    if (confirmed) {
                        get().redirectToLogin(currentPath);
                    }
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') {
                    return localStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                };
            }),
            partialize: (state) => ({
                userInfo: state.userInfo,
            }),
        }
    )
);
