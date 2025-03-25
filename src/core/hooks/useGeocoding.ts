import { useState, useCallback } from 'react'

interface GeocodeResult {
    location: string
    isLoading: boolean
    error: Error | null
}

interface GeocodeCache {
    [key: string]: string
}

/**
 * React hook for reverse geocoding coordinates to location names using OpenStreetMap's Nominatim API
 */
export const useGeocoding = () => {
    const [cache, setCache] = useState<GeocodeCache>({})
    const [results, setResults] = useState<Record<string, GeocodeResult>>({})

    // Nominatim has a usage policy of max 1 request per second
    // This helper ensures we respect that limit
    const delayBetweenRequests = () =>
        new Promise((resolve) => setTimeout(resolve, 1100))

    /**
     * Get location name from coordinates
     * @param coords [latitude, longitude] tuple
     * @param cacheKey Optional custom cache key
     * @returns The geocoding result (location name, loading state, and any errors)
     */
    const getLocationName = useCallback(
        async (
            coords: [number, number] | undefined,
            cacheKey?: string
        ): Promise<GeocodeResult> => {
            if (!coords || coords.length < 2) {
                return { location: 'Unknown', isLoading: false, error: null }
            }

            const [lat, lng] = coords
            const key = cacheKey || `${lat.toFixed(4)},${lng.toFixed(4)}`

            if (cache[key]) {
                return { location: cache[key], isLoading: false, error: null }
            }

            setResults((prev) => ({
                ...prev,
                [key]: { location: '', isLoading: true, error: null },
            }))

            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'User-Agent': 'KondwaniAPP',
                    },
                })

                if (!response.ok) {
                    throw new Error(
                        `Geocoding failed with status: ${response.status}`
                    )
                }

                const data = await response.json()

                let locationName = 'Unknown'

                if (data.display_name) {
                    const parts = data.display_name.split(', ')

                    if (data.address) {
                        const city =
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            data.address.hamlet
                        const state = data.address.state || data.address.region

                        if (city && state) {
                            locationName = `${city}, ${state}`
                        } else if (city) {
                            locationName = city
                        } else if (parts.length >= 2) {
                            locationName = `${parts[0]}, ${parts[1]}`
                        } else {
                            locationName = parts[0] || 'Unknown'
                        }
                    } else if (parts.length >= 2) {
                        locationName = `${parts[0]}, ${parts[1]}`
                    } else {
                        locationName = parts[0] || 'Unknown'
                    }
                }

                setCache((prev) => ({ ...prev, [key]: locationName }))

                const result = {
                    location: locationName,
                    isLoading: false,
                    error: null,
                }
                setResults((prev) => ({ ...prev, [key]: result }))

                await delayBetweenRequests()

                return result
            } catch (error) {
                console.error('Geocoding error:', error)
                const result = {
                    location: `${lat.toFixed(2)}°N, ${Math.abs(lng).toFixed(2)}°W`,
                    isLoading: false,
                    error:
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                }

                setResults((prev) => ({ ...prev, [key]: result }))
                return result
            }
        },
        [cache]
    )

    /**
     * Batch process multiple coordinates to location names
     * @param coordsList Array of coordinate tuples
     * @returns Promise that resolves when all geocoding requests are complete
     */
    const getLocationNames = useCallback(
        async (
            coordsList: ([number, number] | undefined)[]
        ): Promise<Record<string, string>> => {
            const results: Record<string, string> = {}

            // Process coordinates sequentially to respect rate limits
            for (const coords of coordsList) {
                if (!coords) continue

                const key = `${coords[0].toFixed(4)},${coords[1].toFixed(4)}`
                const result = await getLocationName(coords)
                results[key] = result.location
            }

            return results
        },
        [getLocationName]
    )

    return {
        getLocationName,
        getLocationNames,
        geocodeResults: results,
        geocodeCache: cache,
    }
}
