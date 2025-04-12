import { SuggestionList, SearchInput, SearchButton } from '@/src/features/address-search';
import { useAddressSearch } from '@/src/features/address-search/hooks/useAddressSearch';

export const SearchContainer = ({ setSelectedId }: { setSelectedId: (id: string) => void }) => {
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
        try {
            setSelectedId(selectedAddress?.idx ?? '');
        } catch (error) {
            console.error('Error fetching water quality:', error);
        }
    };

    return (
        <div className="px-4 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center">
                    <div className="flex-1 relative">
                        <div
                            className={`flex border ${
                                isSearchFocused ? 'border-blue-500 ring-1 ring-blue-100' : 'border-gray-300'
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
