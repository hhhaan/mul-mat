import { forwardRef } from 'react';

interface SuggestionListProps {
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
}

export const SuggestionList = forwardRef<HTMLDivElement, SuggestionListProps>(
    ({ suggestions, handleSuggestionClick }, ref) => {
        if (suggestions.length === 0) return null;
        return (
            <div
                ref={ref}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            >
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
);

SuggestionList.displayName = 'SuggestionList';
