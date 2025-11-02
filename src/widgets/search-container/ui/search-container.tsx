import { SuggestionList, SearchInput, SearchButton } from '@/src/features/address-search';
import { useAddressSearch } from '@/src/features/address-search/hooks/useAddressSearch';
import { useRouter } from 'next/navigation';
import { getLatestAvailableDate } from '@/src/shared/lib';

export const SearchContainer = () => {
    const router = useRouter();

    const {
        query,
        suggestions,
        showSuggestions,
        isSearchFocused,
        isLoading,
        suggestionsRef,
        selectedAddress,
        handleQueryChange,
        handleSuggestionClick,
        handleFocus,
        handleBlur,
    } = useAddressSearch();

    const handleSearch = async () => {
        if (!selectedAddress?.idx) return;
        const { year, month } = getLatestAvailableDate();

        router.replace(`?id=${selectedAddress?.idx}&year=${year}&month=${month}`);
    };

    return (
        <div className="px-4 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center">
                    <div className="flex-1 relative">
                        <div
                            className={`flex border ${
                                isSearchFocused ? 'border-sky-400 ring-1 ring-sky-100' : 'border-gray-300'
                            } rounded-lg overflow-hidden transition-all duration-200`}
                        >
                            <SearchInput
                                value={query}
                                onChange={handleQueryChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            <SearchButton isLoading={isLoading} onClick={handleSearch} />
                        </div>

                        {showSuggestions && (
                            <SuggestionList
                                ref={suggestionsRef}
                                suggestions={suggestions}
                                handleSuggestionClick={handleSuggestionClick}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
