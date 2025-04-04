import { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({
    value,
    onChange,
    placeholder,
    onFocus,
    onBlur,
    onSearch,
    isLoading,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onSearch?: () => void;
    isLoading?: boolean;
}) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <div
            className={`flex border ${
                isSearchFocused ? 'border-blue-500 ring-1 ring-blue-100' : 'border-gray-300'
            } rounded-lg overflow-hidden transition-all duration-200`}
        >
            <input
                type="text"
                className="flex-1 p-2 text-sm focus:outline-none text-gray-700"
                placeholder={placeholder || '지역명 입력 (예: 서울시 강남구)'}
                value={value}
                onChange={onChange}
                onFocus={() => {
                    setIsSearchFocused(true);
                    onFocus?.();
                }}
                onBlur={() => {
                    setIsSearchFocused(false);
                    onBlur?.();
                }}
            />
            <button
                className="bg-blue-500 text-white px-3 hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                onClick={onSearch}
                disabled={isLoading}
            >
                <Search size={18} />
            </button>
        </div>
    );
};
