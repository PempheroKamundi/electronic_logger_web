import { useState, useEffect } from 'react'
import {
    Printer,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader,
} from 'lucide-react'
import HoursOfServiceGraph from '@/features/HoursOfServiceGraph/HoursOfServiceGraph.tsx'
import { RouteData } from '@/core/hooks/useRouteData.ts'
import { TruckerLog, useProcessLogs } from '@/core/hooks/useProcessLogs.ts'

interface HoursOfServiceContainerProps {
    routeData?: RouteData
    isLoadingRoute?: boolean
}

const HoursOfServiceContainer = ({
    routeData,
    isLoadingRoute = false,
}: HoursOfServiceContainerProps) => {
    const [activeGraphIndex, setActiveGraphIndex] = useState(0)

    const {
        loading: processingLogs,
        data: truckerLogs,
        error: processLogsError,
    } = useProcessLogs(routeData ? [routeData] : [], isLoadingRoute)

    useEffect(() => {
        setActiveGraphIndex(0)
    }, [truckerLogs])

    const printCurrentGraph = () => {
        window.print()
        console.log(`Printing graph ${activeGraphIndex + 1}`)
    }

    const printAllGraphs = () => {
        window.print()
        console.log('Printing all graphs')
    }

    const nextGraph = () => {
        if (truckerLogs && activeGraphIndex < truckerLogs.length - 1) {
            setActiveGraphIndex(activeGraphIndex + 1)
        }
    }

    const prevGraph = () => {
        if (activeGraphIndex > 0) {
            setActiveGraphIndex(activeGraphIndex - 1)
        }
    }

    const getLocationFromCoords = (coords: [number, number] | undefined) => {
        if (!coords || coords.length < 2) return 'Unknown'

        // In a real implementation, you would use reverse geocoding
        // For now, just show coordinates in a friendly format
        return `${coords[0].toFixed(2)}°N, ${Math.abs(coords[1]).toFixed(2)}°W`
    }

    if (isLoadingRoute || processingLogs) {
        return (
            <div className="w-full mx-auto bg-white rounded-lg shadow-lg border border-red-200 mt-10 p-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="h-10 w-10 text-red-600 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                        {isLoadingRoute
                            ? 'Loading route data...'
                            : 'Processing driver logs...'}
                    </h3>
                </div>
            </div>
        )
    }

    if (processLogsError) {
        return (
            <div className="w-full mx-auto bg-white rounded-lg shadow-lg border border-red-200 mt-10 p-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-10 w-10 text-red-600 mb-4" />
                    <h3 className="text-lg font-medium text-red-700 mb-2">
                        Error Processing Logs
                    </h3>
                    <p className="text-gray-600 text-center">
                        {processLogsError.message}
                    </p>
                </div>
            </div>
        )
    }

    if (!truckerLogs || truckerLogs.length === 0) {
        return (
            <div className="w-full mx-auto bg-white rounded-lg shadow-lg border border-red-200 mt-10 p-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <h2 className="text-xl font-bold text-red-800 mb-4">
                        Truck Driver Hours of Service Log
                    </h2>
                    <p className="text-gray-600 text-center">
                        No driver log data available. Please submit a valid
                        route to view hours of service.
                    </p>
                </div>
            </div>
        )
    }

    const activeLog = truckerLogs[activeGraphIndex]
    const startLocation = getLocationFromCoords(activeLog.from)
    const endLocation = getLocationFromCoords(activeLog.to)

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg border border-red-200 mt-10">
            <div className="p-4 border-b border-red-200 bg-red-50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-800">
                        Truck Driver Hours of Service Log
                    </h2>
                    <button
                        onClick={printAllGraphs}
                        className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700"
                    >
                        <Printer size={18} className="mr-2" /> Print All Logs
                    </button>
                </div>

                {truckerLogs.length > 1 && (
                    <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-red-200">
                        <button
                            onClick={prevGraph}
                            disabled={activeGraphIndex === 0}
                            className={`p-2 rounded ${activeGraphIndex === 0 ? 'text-gray-400' : 'text-red-600 hover:bg-red-50'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex space-x-2">
                            {truckerLogs.map((log: TruckerLog, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveGraphIndex(index)}
                                    className={`px-4 py-2 rounded ${activeGraphIndex === index ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-red-100 text-red-800'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={nextGraph}
                            disabled={
                                activeGraphIndex === truckerLogs.length - 1
                            }
                            className={`p-2 rounded ${activeGraphIndex === truckerLogs.length - 1 ? 'text-gray-400' : 'text-red-600 hover:bg-red-50'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}

                <div className="bg-white p-3 rounded flex justify-between items-center mb-4 border border-red-200">
                    <div>
                        <span className="font-medium text-red-800">Date: </span>
                        <span className="text-gray-800">{activeLog.date}</span>
                        <span className="mx-4 text-red-300">|</span>
                        <span className="font-medium text-red-800">
                            Route:{' '}
                        </span>
                        <span className="text-gray-800">
                            {startLocation} to {endLocation}
                        </span>
                        <span className="mx-4 text-red-300">|</span>
                        <span className="font-medium text-red-800">
                            Miles:{' '}
                        </span>
                        <span className="text-gray-800">
                            {activeLog.total_miles_driving.toFixed(1)}
                        </span>
                    </div>

                    <button
                        onClick={printCurrentGraph}
                        className="bg-red-600 text-white px-3 py-1 rounded flex items-center hover:bg-red-700"
                    >
                        <Printer size={16} className="mr-1" /> Print This Log
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-4 text-center">
                    <p className="font-semibold text-red-800">
                        Standard HOS Pattern: 14-hour duty window, 11 hours
                        driving, 10 hours rest
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <HoursOfServiceGraph
                        driverActivities={activeLog.log}
                        title={`Truck Driver Hours of Service Log - ${activeLog.date}`}
                        subtitle={`Route: ${startLocation} to ${endLocation} (${activeLog.total_miles_driving.toFixed(1)} miles)`}
                    />
                </div>
            </div>
        </div>
    )
}

export default HoursOfServiceContainer
