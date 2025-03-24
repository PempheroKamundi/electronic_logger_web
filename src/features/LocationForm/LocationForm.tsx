import React, { useState, useEffect } from 'react'
import {
    FormDataType,
    InputModeState,
    LocationField,
    LocationSuggestion,
    Coordinates,
} from './types'
import { RouteData } from '@/core/hooks/useRouteData.ts'
import { useLocationSearch } from '@/features/LocationForm/hooks/useLocationSearch.ts'
import CycleUsageInput from '@/features/LocationForm/components/CycleUsageInput/CycleUsageInput.tsx'
import SubmitButton from '@/features/LocationForm/components/SubmitButton/SubmitButton.tsx'
import LocationInputField from '@/features/LocationForm/components/LocationInputField/LocationInputField.tsx'

interface LocationFormProps {
    routeData?: RouteData
    isLoadingRoute: boolean
    routeError: Error | null
    onSubmitForm: (formData: FormDataType) => void
    onRetryRouteData: () => void
}

const STORAGE_KEY = 'savedLocationData'

const LocationForm: React.FC<LocationFormProps> = ({
    isLoadingRoute,
    routeError,
    onSubmitForm,
    onRetryRouteData,
}) => {
    const [formData, setFormData] = useState<FormDataType>({
        currentLocation: '',
        currentLocationCoords: null,
        pickupLocation: '',
        pickupLocationCoords: null,
        dropoffLocation: '',
        dropoffLocationCoords: null,
        currentCycleUsed: '',
    })

    const [inputMode, setInputMode] = useState<InputModeState>({
        currentLocation: 'coordinates',
        pickupLocation: 'coordinates',
        dropoffLocation: 'coordinates',
    })

    const [hasSavedData, setHasSavedData] = useState<boolean>(false)

    const {
        suggestions,
        loading,
        debouncedFetchCurrentLocation,
        debouncedFetchPickupLocation,
        debouncedFetchDropoffLocation,
        clearSuggestions,
    } = useLocationSearch()

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            try {
                JSON.parse(savedData)
                setHasSavedData(true)
            } catch (error) {
                console.error('Error parsing saved location data:', error)
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        if (
            name === 'currentLocation' &&
            inputMode.currentLocation === 'address'
        ) {
            debouncedFetchCurrentLocation(value)
            setFormData((prev) => ({ ...prev, currentLocationCoords: null }))
        } else if (
            name === 'pickupLocation' &&
            inputMode.pickupLocation === 'address'
        ) {
            debouncedFetchPickupLocation(value)
            setFormData((prev) => ({ ...prev, pickupLocationCoords: null }))
        } else if (
            name === 'dropoffLocation' &&
            inputMode.dropoffLocation === 'address'
        ) {
            debouncedFetchDropoffLocation(value)
            setFormData((prev) => ({ ...prev, dropoffLocationCoords: null }))
        }
    }

    const handleCoordChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: LocationField
    ) => {
        const { name, value } = e.target
        const coordType = name.includes('lat') ? 'lat' : 'lng'

        setFormData((prev) => ({
            ...prev,
            [`${field}Coords`]: {
                ...(prev[`${field}Coords`] || { lat: '', lng: '' }),
                [coordType]: value !== '' ? parseFloat(value) : '',
            } as Coordinates,
        }))
    }

    const handleSuggestionClick = (
        suggestion: LocationSuggestion,
        field: LocationField
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: suggestion.display_name,
            [`${field}Coords`]: { lat: suggestion.lat, lng: suggestion.lon },
        }))
        clearSuggestions(field)
    }

    const toggleInputMode = (field: LocationField) => {
        setInputMode((prev) => ({
            ...prev,
            [field]: prev[field] === 'address' ? 'coordinates' : 'address',
        }))

        if (inputMode[field] === 'address') {
            setFormData((prev) => ({
                ...prev,
                [field]: '',
                [`${field}Coords`]: { lat: '', lng: '' },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: '',
                [`${field}Coords`]: null,
            }))
        }

        clearSuggestions(field)
    }

    const isValidCoordinates = (coords: Coordinates | null): boolean => {
        if (!coords) return false

        const { lat, lng } = coords

        return (
            lat !== '' &&
            lng !== '' &&
            !isNaN(Number(lat)) &&
            !isNaN(Number(lng))
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)

        if (
            !isValidCoordinates(formData.currentLocationCoords) ||
            !isValidCoordinates(formData.pickupLocationCoords) ||
            !isValidCoordinates(formData.dropoffLocationCoords)
        ) {
            alert(
                'All location coordinates are required and must be valid numbers'
            )
            return
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        } catch (error) {
            console.error('Error saving location data to local storage:', error)
        }

        onSubmitForm(formData)
    }

    const loadSavedData = () => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY)
            if (savedData) {
                const parsedData = JSON.parse(savedData)
                setFormData(parsedData)

                // Update input modes based on the loaded data
                const newInputMode = { ...inputMode }
                if (parsedData.currentLocation) {
                    newInputMode.currentLocation = 'address'
                }
                if (parsedData.pickupLocation) {
                    newInputMode.pickupLocation = 'address'
                }
                if (parsedData.dropoffLocation) {
                    newInputMode.dropoffLocation = 'address'
                }
                setInputMode(newInputMode)
            }
        } catch (error) {
            console.error('Error loading saved location data:', error)
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-6">
                Location & Cycle Usage Form
            </h2>

            {hasSavedData && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                        You have saved location data from a previous session.
                    </p>
                    <button
                        type="button"
                        onClick={loadSavedData}
                        className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors"
                    >
                        Use Previous Location Data
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <LocationInputField
                    field="currentLocation"
                    label="Current Location"
                    value={formData.currentLocation}
                    coordinates={formData.currentLocationCoords}
                    inputMode={inputMode.currentLocation}
                    suggestions={suggestions.currentLocation}
                    loading={loading.currentLocation}
                    onChange={handleChange}
                    onCoordinateChange={handleCoordChange}
                    onSuggestionSelect={handleSuggestionClick}
                    onToggleMode={toggleInputMode}
                />

                <LocationInputField
                    field="pickupLocation"
                    label="Pickup Location"
                    value={formData.pickupLocation}
                    coordinates={formData.pickupLocationCoords}
                    inputMode={inputMode.pickupLocation}
                    suggestions={suggestions.pickupLocation}
                    loading={loading.pickupLocation}
                    onChange={handleChange}
                    onCoordinateChange={handleCoordChange}
                    onSuggestionSelect={handleSuggestionClick}
                    onToggleMode={toggleInputMode}
                />

                <LocationInputField
                    field="dropoffLocation"
                    label="Dropoff Location"
                    value={formData.dropoffLocation}
                    coordinates={formData.dropoffLocationCoords}
                    inputMode={inputMode.dropoffLocation}
                    suggestions={suggestions.dropoffLocation}
                    loading={loading.dropoffLocation}
                    onChange={handleChange}
                    onCoordinateChange={handleCoordChange}
                    onSuggestionSelect={handleSuggestionClick}
                    onToggleMode={toggleInputMode}
                />

                <CycleUsageInput
                    value={formData.currentCycleUsed}
                    onChange={handleChange}
                />

                <div className="pt-4">
                    <SubmitButton
                        label={isLoadingRoute ? 'Loading...' : 'Submit'}
                        disabled={isLoadingRoute}
                    />
                </div>
            </form>

            {routeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    <p className="text-sm">{routeError.message}</p>
                    <button
                        onClick={onRetryRouteData}
                        className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    )
}

export default LocationForm
