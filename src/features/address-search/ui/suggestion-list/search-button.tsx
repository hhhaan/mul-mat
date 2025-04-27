import { Search } from 'lucide-react';
import { useUserStore } from '@/src/entities/user/model/store';

export const SearchButton = ({ isLoading, onClick }: { isLoading: boolean; onClick?: () => void }) => {
    const { requireAuth } = useUserStore();
    const handleOnClick = async () => {
        requireAuth(() => {
            if (onClick) onClick();
        });
    };
    return (
        <button
            className="bg-sky-400 text-white px-3 hover:bg-sky-500 transition-colors duration-200 disabled:opacity-50"
            onClick={handleOnClick}
            disabled={isLoading}
        >
            <Search size={18} />
        </button>
    );
};
