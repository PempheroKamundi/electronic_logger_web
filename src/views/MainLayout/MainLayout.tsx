import { ReactElement, useEffect } from 'react'
import Header from '@/features/Header/Header.tsx'
import LocationForm from '@/features/LocationForm/LocationForm.tsx'
import MapTrackingCard from '@/features/MapTrackingCard/MapTrackingCard.tsx'
import HoursOfServiceContainer from '@/features/HoursOfServiceContainer/HoursOfServiceContainer.tsx'
import { FormDataType } from '@/features/LocationForm/types'
import {
    useRouteData,
    RouteRequest,
    InvalidOSRMResponseError,
    NoOSRMRouteFoundError,
    NetworkTimeOutError,
} from '@/core/hooks/useRouteData.ts'
import { Toaster, toast } from 'sonner'
import { AlertCircle, MapPin, Clock } from 'lucide-react'

const MainLayout = (): ReactElement => {
    const { routeData, isLoading, error, fetchRoute, currentRequest } =
        useRouteData()

    useEffect(() => {
        if (error) {
            if (error instanceof NoOSRMRouteFoundError) {
                toast.warning('No Route Found', {
                    description: error.message,
                    icon: <MapPin className="h-5 w-5" />,
                })
            } else if (error instanceof NetworkTimeOutError) {
                toast.error('Service Timeout', {
                    description: error.message,
                    icon: <Clock className="h-5 w-5" />,
                })
            } else if (error instanceof InvalidOSRMResponseError) {
                toast.error('Routing Service Error', {
                    description: error.message,
                })
            } else {
                toast.error('Error', {
                    description: error.message,
                    icon: <AlertCircle className="h-5 w-5" />,
                })
            }
        }
    }, [error])

    const handleSubmitForm = async (formData: FormDataType) => {
        const routeRequest: RouteRequest = {
            current_location: {
                latitude: formData.currentLocationCoords?.lat ?? 0,
                longitude: formData.currentLocationCoords?.lng ?? 0,
            },
            pickup_location: {
                latitude: formData.pickupLocationCoords?.lat ?? 0,
                longitude: formData.pickupLocationCoords?.lng ?? 0,
            },
            drop_off_location: {
                latitude: formData.dropoffLocationCoords?.lat ?? 0,
                longitude: formData.dropoffLocationCoords?.lng ?? 0,
            },
            current_cycle_used: parseInt(formData.currentCycleUsed || '0', 10),
            start_time: new Date().toISOString(),
            timezone_offset_minutes: -new Date().getTimezoneOffset(),
        }

        await fetchRoute(routeRequest)
    }

    const handleRetryRouteData = async () => {
        if (currentRequest) {
            await fetchRoute(currentRequest)
        } else {
            toast.info('Cannot Retry', {
                description: 'No previous route request found.',
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <Header />
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <LocationForm
                            routeData={routeData ?? undefined}
                            isLoadingRoute={isLoading}
                            routeError={error}
                            onSubmitForm={handleSubmitForm}
                            onRetryRouteData={handleRetryRouteData}
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <MapTrackingCard
                            routeData={routeData ?? undefined}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>

                <HoursOfServiceContainer
                    routeData={routeData ?? undefined}
                    isLoadingRoute={isLoading}
                />
            </div>

            <Toaster richColors position="top-right" />
        </div>
    )
}

export default MainLayout
