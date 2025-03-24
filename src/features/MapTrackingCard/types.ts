export interface Coordinates {
    lat: number
    lng: number
}

export interface City {
    city: string
    distance_miles: number
}

export interface Segment {
    type: string
    start_time: string
    end_time: string
    duration_hours: number
    distance_miles: number
    location: string
    status: string
    start_coordinates: [number, number]
    start_nearest_city: string
    start_distance_to_city: number
    start_nearest_cities: City[]
    end_coordinates: [number, number]
    end_nearest_city: string
    end_distance_to_city: number
    end_nearest_cities: City[]
}

export interface RouteGeometry {
    type: string
    coordinates: [number, number][]
}

export interface RouteData {
    segments: Segment[]
    total_distance_miles: number
    total_duration_hours: number
    start_time: string
    end_time: string
    route_geometry: RouteGeometry
    driving_time: number
    resting_time: number
    cities: {
        [cityName: string]: [number, number]
    }
}

export interface CityMarker {
    name: string
    position: [number, number]
}

export interface ActivityMarker {
    id: number
    position: [number, number]
    type: string
    startTime: string
    endTime: string
    duration: number
    status: string
    location: string
    distanceToCity: number
    nearestCities: City[]
}

export interface Point {
    position: [number, number]
    time: string
    location: string
}

// Component Props Types
export interface RoutePolylineProps {
    coordinates: [number, number][]
}

export interface CityMarkersProps {
    markers: CityMarker[]
}

export interface ActivityMarkersProps {
    markers: ActivityMarker[]
    startPoint: Point
    endPoint: Point
}

export interface ZoomControlsProps {
    onZoomIn: () => void
    onZoomOut: () => void
}

export interface DistancePanelProps {
    distanceMiles: number
    durationHours: number
    durationMinutes: number
}

export interface FitBoundsProps {
    coordinates: [number, number][]
}

export interface MapControllerProps {
    zoomIn: number
    zoomOut: number
}

export interface ErrorDisplayProps {
    error: Error
}
