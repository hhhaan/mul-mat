import { forwardRef } from 'react';

interface AddressSuggestion {
    data: {
        idx: string;
        full_address: string;
    };
}

interface SuggestionListProps {
    suggestions: AddressSuggestion[];
    handleSuggestionClick: (suggestion: AddressSuggestion) => void;
}

export const SuggestionList = forwardRef<HTMLDivElement, SuggestionListProps>(
    ({ suggestions, handleSuggestionClick }, ref) => {
        if (suggestions.length === 0) return null;
        return (
            <div
                ref={ref}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto z-50"
            >
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.data.idx || index}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.data.full_address}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
);

SuggestionList.displayName = 'SuggestionList';
