import { Marker, Popup } from 'react-leaflet'
import { createActivityIcon } from '@/features/MapTrackingCard/utils.ts'
import { CityMarkersProps } from '@/features/MapTrackingCard/types.ts'

export const CityMarkers: React.FC<CityMarkersProps> = ({ markers }) => {
    return (
        <>
            {markers.map((city, index) => (
                <Marker
                    key={`city-${index}`}
                    position={city.position}
                    icon={createActivityIcon('city')}
                >
                    <Popup>
                        <div className="font-semibold">{city.name}</div>
                        <div>Major city on route</div>
                    </Popup>
                </Marker>
            ))}
        </>
    )
}
