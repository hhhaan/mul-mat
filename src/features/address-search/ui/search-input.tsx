export const SearchInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    placeholder?: string;
}) => {
    return (
        <input
            type="text"
            className="flex-1 p-2 text-sm focus:outline-none text-gray-700"
            placeholder={placeholder || '지역명 입력 (예: 서울특별시 강남구 개포동)'}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
};
