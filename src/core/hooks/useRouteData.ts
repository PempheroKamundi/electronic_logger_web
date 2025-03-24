import { useState, useCallback } from 'react'

export interface Coordinates {
    type: string
    coordinates: [number, number][]
}

export interface RouteSegment {
    type: string
    start_time: string
    end_time: string
    duration_hours: number
    distance_miles: number
    location: string
    status: string
    start_coordinates: [number, number]
    end_coordinates: [number, number]
}

export interface RouteData {
    segments: RouteSegment[]
    total_distance_miles: number
    total_duration_hours: number
    start_time: string
    end_time: string
    route_geometry: Coordinates
    driving_time: number
    resting_time: number
}

export interface Location {
    longitude: number
    latitude: number
}

export interface RouteRequest {
    current_location: Location
    pickup_location: Location
    drop_off_location: Location
    current_cycle_used: number
}

export class RouteError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'RouteError'
        this.status = status
    }
}

export class InvalidOSRMResponseError extends RouteError {
    constructor() {
        super(
            'Unable to process routing request due to invalid response from routing service.',
            502
        )
        this.name = 'InvalidOSRMResponseError'
    }
}

export class NoOSRMRouteFoundError extends RouteError {
    constructor() {
        super('No viable route could be found for the requested journey.', 404)
        this.name = 'NoOSRMRouteFoundError'
    }
}

export class NetworkTimeOutError extends RouteError {
    constructor() {
        super('Routing service timed out. Please try again later.', 504)
        this.name = 'NetworkTimeOutError'
    }
}

interface UseRouteDataReturn {
    routeData: RouteData | null
    isLoading: boolean
    error: Error | null
    fetchRoute: (requestData: RouteRequest) => Promise<void>
    currentRequest: RouteRequest | null
}

export const useRouteData = (): UseRouteDataReturn => {
    const [routeData, setRouteData] = useState<RouteData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)
    const [currentRequest, setCurrentRequest] = useState<RouteRequest | null>(
        null
    )

    const fetchRoute = useCallback(
        async (requestData: RouteRequest): Promise<void> => {
            setIsLoading(true)
            setError(null)
            setCurrentRequest(requestData)

            try {
                const response = await fetch(
                    'http://localhost:8000/planner/api/trips/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null)
                    const errorMessage =
                        errorData?.error ||
                        `API request failed with status ${response.status}`

                    switch (response.status) {
                        case 502:
                            throw new InvalidOSRMResponseError()
                        case 404:
                            throw new NoOSRMRouteFoundError()
                        case 504:
                            throw new NetworkTimeOutError()
                        default:
                            throw new RouteError(errorMessage, response.status)
                    }
                }

                const data: RouteData = await response.json()
                setRouteData(data)
            } catch (err) {
                if (err instanceof RouteError) {
                    console.error(`Route error (${err.name}):`, err.message)
                    setError(err)
                } else {
                    const errorMessage =
                        err instanceof Error
                            ? err
                            : new Error(
                                  'Unknown error occurred while fetching route data'
                              )
                    console.error('Error loading route data:', errorMessage)
                    setError(errorMessage)
                }
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    return {
        routeData,
        isLoading,
        error,
        fetchRoute,
        currentRequest,
    }
}
