import { Polyline } from 'react-leaflet'
import { RoutePolylineProps } from '@/features/MapTrackingCard/types.ts'

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
    coordinates,
}) => {
    return <Polyline positions={coordinates} color="#e74c3c" weight={3} />
}
