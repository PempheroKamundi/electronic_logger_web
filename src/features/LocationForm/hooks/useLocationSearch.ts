import { useState, useRef, useCallback } from 'react'
import {
    LoadingState,
    LocationField,
    SuggestionsState,
} from '@/features/LocationForm/types.ts'

export const useLocationSearch = () => {
    const [suggestions, setSuggestions] = useState<SuggestionsState>({
        currentLocation: [],
        pickupLocation: [],
        dropoffLocation: [],
    })

    const [loading, setLoading] = useState<LoadingState>({
        currentLocation: false,
        pickupLocation: false,
        dropoffLocation: false,
    })

    const fetchSuggestions = async (query: string, field: LocationField) => {
        if (!query || query.length < 3) {
            setSuggestions((prev) => ({ ...prev, [field]: [] }))
            return
        }

        setLoading((prev) => ({ ...prev, [field]: true }))

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(query)}` +
                    `&countrycodes=us` +
                    `&format=json` +
                    `&addressdetails=1` +
                    `&limit=5`
            )

            const data = await response.json()
            setSuggestions((prev) => ({
                ...prev,
                [field]: data.map((item: any) => ({
                    display_name: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                })),
            }))
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        } finally {
            setLoading((prev) => ({ ...prev, [field]: false }))
        }
    }

    const debounce = <T extends (...args: any[]) => void>(
        func: T,
        delay: number
    ) => {
        let timeoutId: NodeJS.Timeout
        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
                func(...args)
            }, delay)
        }
    }

    const debouncedFetchCurrentLocation = useRef(
        debounce(
            (query: string) => fetchSuggestions(query, 'currentLocation'),
            500
        )
    ).current

    const debouncedFetchPickupLocation = useRef(
        debounce(
            (query: string) => fetchSuggestions(query, 'pickupLocation'),
            500
        )
    ).current

    const debouncedFetchDropoffLocation = useRef(
        debounce(
            (query: string) => fetchSuggestions(query, 'dropoffLocation'),
            500
        )
    ).current

    const clearSuggestions = useCallback((field: LocationField) => {
        setSuggestions((prev) => ({ ...prev, [field]: [] }))
    }, [])

    return {
        suggestions,
        loading,
        debouncedFetchCurrentLocation,
        debouncedFetchPickupLocation,
        debouncedFetchDropoffLocation,
        clearSuggestions,
    }
}
