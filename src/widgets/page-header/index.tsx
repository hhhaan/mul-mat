'use client';

import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onBackClick: () => void;
}

export const PageHeader = ({ title, onBackClick }: PageHeaderProps) => {
    return (
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                <button className="mr-2 text-gray-500 hover:text-gray-700" onClick={onBackClick} aria-label="뒤로 가기">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </div>
        </div>
    );
};
