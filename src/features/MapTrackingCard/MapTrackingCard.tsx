import React, { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FitBounds, MapController } from './utils'
import { RoutePolyline } from '@/features/MapTrackingCard/components/RoutePolyline/RoutePolyline'
import { CityMarkers } from '@/features/MapTrackingCard/components/CityMarkers/CityMarkers'
import { ZoomControls } from '@/features/MapTrackingCard/components/ZoomControls/ZoomControls'
import { DistancePanel } from '@/features/MapTrackingCard/components/DistancePanel/DistancePanel'
import { ActivityMarkers } from '@/features/MapTrackingCard/components/ActivityMarkers/ActivityMarkers'
import { LoadingIndicator } from '@/features/MapTrackingCard/components/LoadingIndicator/LoadingIndicator'
import { ErrorDisplay } from '@/features/MapTrackingCard/components/ErrorDisplay/ErrorDisplay'
import { MapLegend } from '@/features/MapTrackingCard/components/MapLegend/MapLegend'
import { ActivityMarker, CityMarker, Point, RouteData } from './types'
import { Map } from 'lucide-react'

interface CityData {
    [cityName: string]: [number, number] // lon, lat coordinates
}

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapTrackingCardProps {
    routeData?: RouteData
    isLoading?: boolean
    error?: Error | null
    onRetry?: () => void
}

export const MapTrackingCard: React.FC<MapTrackingCardProps> = ({
    routeData,
    isLoading = false,
    error = null,
}) => {
    const [zoomInTrigger, setZoomInTrigger] = useState<number>(0)
    const [zoomOutTrigger, setZoomOutTrigger] = useState<number>(0)
    const [cityData, setCityData] = useState<CityData | null>(null)
    const [cityDataLoading, setCityDataLoading] = useState<boolean>(false)
    const [cityDataError, setCityDataError] = useState<Error | null>(null)

    const fetchCityData = async () => {
        if (!routeData) return

        setCityDataLoading(true)
        setCityDataError(null)

        try {
            const response = await fetch(
                'http://localhost:8000/planner/api/cities/'
            )

            if (!response.ok) {
                throw new Error(`Failed to fetch city data: ${response.status}`)
            }

            const data: CityData = await response.json()
            setCityData(data)
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err
                    : new Error('Unknown error loading city data')
            console.error('Error loading city data:', errorMessage)
            setCityDataError(errorMessage)
        } finally {
            setCityDataLoading(false)
        }
    }

    const handleZoomIn = (): void => {
        setZoomInTrigger((prev) => prev + 1)
    }

    const handleZoomOut = (): void => {
        setZoomOutTrigger((prev) => prev + 1)
    }

    const handleRetryCityData = (): void => {
        fetchCityData()
    }

    if (isLoading) {
        return <LoadingIndicator />
    }

    if (error) {
        return <ErrorDisplay error={error} />
    }

    if (!routeData) {
        return (
            <div
                className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center"
                style={{ height: '100%' }}
            >
                <Map size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Route Visualization
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                    Your journey will be visualized here once route data is
                    available.
                </p>
            </div>
        )
    }

    const routeCoordinates = routeData.route_geometry.coordinates.map(
        (coord) => [coord[0], coord[1]] as [number, number]
    )

    const cityMarkers: CityMarker[] = cityData
        ? Object.entries(cityData).map(([cityName, coordinates]) => ({
              name: cityName,
              position: [coordinates[1], coordinates[0]] as [number, number], // Swap lat/long for Leaflet
          }))
        : []

    const activityMarkers: ActivityMarker[] = routeData.segments
        .filter(
            (segment) =>
                segment.type !== 'drive to pickup' &&
                segment.type !== 'drive to drop off'
        )
        .map((segment, index) => ({
            id: index,
            position: [
                segment.start_coordinates[0],
                segment.start_coordinates[1],
            ] as [number, number],
            type: segment.type,
            startTime: segment.start_time,
            endTime: segment.end_time,
            duration: segment.duration_hours,
            status: segment.status,
            location: segment.location || 'Unknown Location',
            distanceToCity: (segment as any).start_distance_to_city,
            nearestCities: (segment as any).start_nearest_cities,
        }))

    const startPoint: Point = {
        position: routeCoordinates[0],
        time: routeData.start_time,
        location: 'Starting Point',
    }

    const endPoint: Point = {
        position: routeCoordinates[routeCoordinates.length - 1],
        time: routeData.end_time,
        location: 'Destination',
    }

    return (
        <div className="bg-transparent overflow-hidden">
            <div className="relative" style={{ height: '100vh' }}>
                <MapContainer
                    center={[41, -98]}
                    zoom={4}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <RoutePolyline coordinates={routeCoordinates} />

                    {!cityDataLoading && cityData && (
                        <CityMarkers markers={cityMarkers} />
                    )}

                    <ActivityMarkers
                        markers={activityMarkers}
                        startPoint={startPoint}
                        endPoint={endPoint}
                    />

                    <FitBounds coordinates={routeCoordinates} />

                    <MapController
                        zoomIn={zoomInTrigger}
                        zoomOut={zoomOutTrigger}
                    />
                </MapContainer>

                <ZoomControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                />

                <DistancePanel
                    distanceMiles={Math.round(routeData.total_distance_miles)}
                    durationHours={Math.floor(routeData.total_duration_hours)}
                    durationMinutes={Math.round(
                        (routeData.total_duration_hours -
                            Math.floor(routeData.total_duration_hours)) *
                            60
                    )}
                />

                {cityDataLoading && (
                    <div className="absolute top-2 right-2 bg-white p-2 rounded shadow z-10">
                        <span className="text-sm">Loading city data...</span>
                    </div>
                )}

                {cityDataError && (
                    <div className="absolute top-2 right-2 bg-white p-2 rounded shadow z-10">
                        <span className="text-sm text-red-500">
                            City data error
                        </span>
                        <button
                            onClick={handleRetryCityData}
                            className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <MapLegend />
            </div>
        </div>
    )
}

export default MapTrackingCard
