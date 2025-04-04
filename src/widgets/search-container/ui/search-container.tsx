import { SearchInput, SuggestionList } from '@/src/features/address-search';
import { useAddressSearch } from '@/src/features/address-search/hooks';

export const SearchContainer = () => {
    const {
        query,
        suggestions,
        showSuggestions,
        suggestionsRef,

        // 로딩 상태
        isLoading: dataLoading,

        // 이벤트 핸들러
        handleSearchChange,
        handleSuggestionClick,
        handleSearch,
        handleFocus,
        handleBlur,
    } = useAddressSearch();

    return (
        <div className="px-4 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center">
                    <div className="flex-1 relative">
                        <SearchInput
                            value={query}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onSearch={handleSearch}
                            isLoading={dataLoading}
                            placeholder="지역명 입력 (예: 서울시 강남구)"
                        />
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
