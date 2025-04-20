import { create } from 'zustand';
import { getPreviousMonth, getNextMonth } from '@/src/features/water-quality/utils';

type DateStore = {
    year: number;
    month: number;
    latestDate: string;
    isInitial: { current: boolean };
    retryCount: { current: number };
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setLatestDate: (date: string) => void;
    setInitial: (value: boolean) => void;
    incrementRetryCount: () => void;
    resetRetryCount: () => void;
    resetDate: () => void;
};

export const useDateStore = create<DateStore>((set) => ({
    year: new Date().getFullYear(),
    // 공공데이터 포털에 어차피 현재 달은 데이터가 없음
    month: new Date().getMonth(),

    latestDate: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString(),
    isInitial: { current: true },
    retryCount: { current: 0 },

    setYear: (year: number) => set({ year }),
    setMonth: (month: number) => set({ month }),

    handlePrevMonth: () =>
        set((state) => {
            const prevDate = getPreviousMonth(state.year, state.month);
            return { year: prevDate.year, month: prevDate.month };
        }),

    handleNextMonth: () =>
        set((state) => {
            const nextDate = getNextMonth(state.year, state.month);
            return { year: nextDate.year, month: nextDate.month };
        }),

    resetDate: () => {
        const today = new Date();
        set({
            year: today.getFullYear(),
            month: today.getMonth(),
            latestDate: today.getFullYear().toString() + '-' + today.getMonth().toString(),
            isInitial: { current: true },
            retryCount: { current: 0 },
        });
    },

    setLatestDate: (date: string) => set({ latestDate: date }),
    setInitial: (value: boolean) => set({ isInitial: { current: value } }),

    incrementRetryCount: () => set((state) => ({ retryCount: { current: state.retryCount.current + 1 } })),
    resetRetryCount: () => set({ retryCount: { current: 0 } }),
}));
