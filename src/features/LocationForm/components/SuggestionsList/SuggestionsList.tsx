import React from 'react'
import { LocationSuggestion } from '@/features/LocationForm/types.ts'

interface SuggestionsListProps {
    suggestions: LocationSuggestion[]
    onSelect: (suggestion: LocationSuggestion) => void
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
    suggestions,
    onSelect,
}) => {
    if (suggestions.length === 0) return null

    return (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
                <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => onSelect(suggestion)}
                >
                    {suggestion.display_name}
                </li>
            ))}
        </ul>
    )
}

export default SuggestionsList
