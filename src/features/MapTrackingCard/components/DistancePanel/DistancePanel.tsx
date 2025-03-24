import { useState } from 'react'
import { DistancePanelProps } from '@/features/MapTrackingCard/types.ts'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const DistancePanel: React.FC<DistancePanelProps> = ({
    distanceMiles,
    durationHours,
    durationMinutes,
}) => {
    const [showAssumptions, setShowAssumptions] = useState(false)

    const toggleAssumptions = () => {
        setShowAssumptions(!showAssumptions)
    }

    return (
        <div className="absolute top-20 left-4 z-[1000] bg-white bg-opacity-90 p-4 rounded-lg shadow-md max-w-xs">
            <div className="mb-2">
                <p className="text-gray-600 text-sm">Distance to arrival:</p>
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-red-500">
                        {distanceMiles}
                    </span>
                    <span className="text-red-500 mx-1">MI</span>
                    <span className="text-red-500 mx-1">/</span>
                    <span className="text-xl font-bold text-red-500">
                        {durationHours}h
                    </span>
                    <span className="text-xl font-bold text-red-500">
                        {durationMinutes}
                    </span>
                    <span className="text-red-500 mx-1">min.</span>
                </div>
            </div>

            <button
                onClick={toggleAssumptions}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200 w-full justify-between"
            >
                <span className="font-medium">Assumptions</span>
                {showAssumptions ? (
                    <ChevronUp size={16} className="ml-1" />
                ) : (
                    <ChevronDown size={16} className="ml-1" />
                )}
            </button>

            {showAssumptions && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-700 space-y-1">
                    <p>• 1 Hour Pickup & Delivery</p>
                    <p>• 1 hour fueling every 1,000 Miles</p>
                    <p>
                        • Property-carrying driver, 70hrs/8days, no adverse
                        driving conditions
                    </p>
                </div>
            )}
        </div>
    )
}
