import { Search } from 'lucide-react';

export const SearchButton = ({ isLoading, onClick }: { isLoading: boolean; onClick?: () => void }) => {
    return (
        <button
            className="bg-sky-400 text-white px-3 hover:bg-sky-500 transition-colors duration-200 disabled:opacity-50"
            onClick={onClick}
            disabled={isLoading}
        >
            <Search size={18} />
        </button>
    );
};
