import React from 'react'
import {
    Coordinates,
    LocationField,
    LocationSuggestion,
} from '@/features/LocationForm/types.ts'
import SuggestionsList from '@/features/LocationForm/components/SuggestionsList/SuggestionsList.tsx'

interface LocationInputFieldProps {
    field: LocationField
    label: string
    value: string
    coordinates: Coordinates | null
    inputMode: 'coordinates' | 'address'
    suggestions: LocationSuggestion[]
    loading: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onCoordinateChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        field: LocationField
    ) => void
    onSuggestionSelect: (
        suggestion: LocationSuggestion,
        field: LocationField
    ) => void
    onToggleMode: (field: LocationField) => void
}

const LocationInputField: React.FC<LocationInputFieldProps> = ({
    field,
    label,
    value,
    coordinates,
    inputMode,
    suggestions,
    loading,
    onChange,
    onCoordinateChange,
    onSuggestionSelect,
    onToggleMode,
}) => {
    return (
        <div className="relative mb-6">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => onToggleMode(field)}
                    className="text-xs text-blue-500 hover:text-blue-700"
                >
                    Switch to{' '}
                    {inputMode === 'address' ? 'Coordinates' : 'Address'}
                </button>
            </div>

            {inputMode === 'address' ? (
                <div className="relative">
                    <input
                        type="text"
                        id={field}
                        name={field}
                        value={value}
                        onChange={onChange}
                        placeholder={`Enter ${label.toLowerCase()} (US only)`}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        autoComplete="off"
                    />
                    {loading && (
                        <div className="absolute right-3 top-2">
                            <svg
                                className="animate-spin h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                    )}
                    <SuggestionsList
                        suggestions={suggestions}
                        onSelect={(suggestion) =>
                            onSuggestionSelect(suggestion, field)
                        }
                    />
                    {coordinates &&
                        typeof coordinates.lat === 'number' &&
                        typeof coordinates.lng === 'number' && (
                            <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-md mt-2 border border-green-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="font-medium">
                                        Location Found
                                    </p>
                                    <p className="text-xs">
                                        {coordinates.lat.toFixed(6)},{' '}
                                        {coordinates.lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label
                            htmlFor={`${field}-lat`}
                            className="block text-xs text-gray-500 mb-1"
                        >
                            Latitude
                        </label>
                        <input
                            type="number"
                            id={`${field}-lat`}
                            name={`${field}-lat`}
                            value={coordinates?.lat || ''}
                            onChange={(e) => onCoordinateChange(e, field)}
                            placeholder="e.g. 40.7128"
                            step="0.000001"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`${field}-lng`}
                            className="block text-xs text-gray-500 mb-1"
                        >
                            Longitude
                        </label>
                        <input
                            type="number"
                            id={`${field}-lng`}
                            name={`${field}-lng`}
                            value={coordinates?.lng || ''}
                            onChange={(e) => onCoordinateChange(e, field)}
                            placeholder="e.g. -74.0060"
                            step="0.000001"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default LocationInputField
