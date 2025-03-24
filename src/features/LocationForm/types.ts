export interface Coordinates {
    lat: number | string
    lng: number | string
}

export interface LocationSuggestion {
    display_name: string
    lat: number
    lon: number
}

export interface FormDataType {
    currentLocation: string
    currentLocationCoords: Coordinates | null
    pickupLocation: string
    pickupLocationCoords: Coordinates | null
    dropoffLocation: string
    dropoffLocationCoords: Coordinates | null
    currentCycleUsed: string
}

export interface SuggestionsState {
    currentLocation: LocationSuggestion[]
    pickupLocation: LocationSuggestion[]
    dropoffLocation: LocationSuggestion[]
}

export interface LoadingState {
    currentLocation: boolean
    pickupLocation: boolean
    dropoffLocation: boolean
}

export interface InputModeState {
    currentLocation: 'address' | 'coordinates'
    pickupLocation: 'address' | 'coordinates'
    dropoffLocation: 'address' | 'coordinates'
}

export type LocationField =
    | 'currentLocation'
    | 'pickupLocation'
    | 'dropoffLocation'
