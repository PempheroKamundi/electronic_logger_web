import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import {
    FitBoundsProps,
    MapControllerProps,
} from '@/features/MapTrackingCard/types.ts'

export const FitBounds: React.FC<FitBoundsProps> = ({ coordinates }) => {
    const map = useMap()

    useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            const bounds = L.latLngBounds(
                coordinates.map((coord) => [coord[0], coord[1]])
            )
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [map, coordinates])

    return null
}

export const MapController: React.FC<MapControllerProps> = ({
    zoomIn,
    zoomOut,
}) => {
    const map = useMap()

    useEffect(() => {
        if (zoomIn) {
            map.zoomIn()
        }
    }, [zoomIn, map])

    useEffect(() => {
        if (zoomOut) {
            map.zoomOut()
        }
    }, [zoomOut, map])

    return null
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const createActivityIcon = (type: string) => {
    let bgColor = '#e74c3c' // Default red
    let icon = '🚚' // Default truck icon

    // Customize based on activity type
    switch (type) {
        case 'pickup':
            bgColor = '#27ae60' // Green
            icon = '📦'
            break
        case 'drop_off':
            bgColor = '#8e44ad' // Purple
            icon = '🏁'
            break
        case 'mandatory_rest_period':
            bgColor = '#2980b9' // Blue
            icon = '😴'
            break
        case 'mandatory_driving_break':
            bgColor = '#f39c12' // Orange
            icon = '☕'
            break
        case 'refueling':
            bgColor = '#16a085' // Teal
            icon = '⛽'
            break

        case 'refueling_and_break':
            bgColor = '#e67e22'
            icon = '⛽☕'
            break

        case 'start':
            bgColor = '#2ecc71' // Light Green
            icon = '🚩'
            break
        case 'city':
            bgColor = '#3498db' // Blue
            icon = '🏙️'
            break
    }

    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; box-shadow: 0 0 0 2px white, 0 0 10px rgba(0,0,0,0.35);">${icon}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    })
}
