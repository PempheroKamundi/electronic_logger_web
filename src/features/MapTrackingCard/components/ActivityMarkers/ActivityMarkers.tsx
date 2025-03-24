import { Marker, Popup } from 'react-leaflet'
import {
    createActivityIcon,
    formatDate,
} from '@/features/MapTrackingCard/utils.ts'
import { ActivityMarkersProps } from '@/features/MapTrackingCard/types.ts'

export const ActivityMarkers: React.FC<ActivityMarkersProps> = ({
    markers,
    startPoint,
    endPoint,
}) => {
    return (
        <>
            {/* Start Marker */}
            <Marker
                position={startPoint.position}
                icon={createActivityIcon('start')}
            >
                <Popup>
                    <div className="font-semibold">Starting Point</div>
                    <div>{startPoint.location}</div>
                    <div>{formatDate(startPoint.time)}</div>
                </Popup>
            </Marker>

            {/* End Marker */}
            <Marker
                position={endPoint.position}
                icon={createActivityIcon('drop_off')}
            >
                <Popup>
                    <div className="font-semibold">Destination</div>
                    <div>{endPoint.location}</div>
                    <div>{formatDate(endPoint.time)}</div>
                </Popup>
            </Marker>

            {/* Activity Markers */}
            {markers.map((marker) => (
                <Marker
                    key={`activity-${marker.id}`}
                    position={marker.position}
                    icon={createActivityIcon(marker.type)}
                >
                    <Popup>
                        <div className="font-semibold capitalize">
                            {marker.type.replace(/_/g, ' ')}
                        </div>
                        {/*<div>Near: {marker.location} ({marker.distanceToCity.toFixed(1)} miles)</div>*/}
                        <div>Status: {marker.status}</div>
                        <div>Start: {formatDate(marker.startTime)}</div>
                        <div>End: {formatDate(marker.endTime)}</div>
                        <div>Duration: {marker.duration.toFixed(1)} hours</div>
                        {marker?.nearestCities && (
                            <div className="mt-2">
                                <div className="font-semibold">
                                    Nearby cities:
                                </div>
                                <ul className="text-sm">
                                    {marker.nearestCities.map((city, idx) => (
                                        <li key={idx}>
                                            {city.city}:{' '}
                                            {city.distance_miles.toFixed(1)}{' '}
                                            miles
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Popup>
                </Marker>
            ))}
        </>
    )
}
