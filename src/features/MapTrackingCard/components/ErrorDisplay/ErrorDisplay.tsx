import React from 'react'
import { Clock, MapPin, Server, AlertCircle } from 'lucide-react'

export interface ErrorDisplayProps {
    error: {
        name: string
        message: string
        statusCode?: number
    }
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    const errorConfig = {
        InvalidOSRMResponseError: {
            title: 'Server Error',
            description: 'The routing server returned an invalid response.',
            icon: <Server className="h-8 w-8 text-amber-500" />,
            color: 'amber',
            solution:
                'Please try again later or contact support if the issue persists.',
        },
        NoOSRMRouteFoundError: {
            title: 'No Route Found',
            description:
                "We couldn't find a route between the selected locations.",
            icon: <MapPin className="h-8 w-8 text-blue-500" />,
            color: 'blue',
            solution:
                'Try selecting different locations or adjusting your route preferences.',
        },
        NetworkTimeOutError: {
            title: 'Network Timeout',
            description: 'The request to the routing server timed out.',
            icon: <Clock className="h-8 w-8 text-orange-500" />,
            color: 'orange',
            solution: 'Please check your internet connection and try again.',
        },
        // Generic fallback error
        GenericError: {
            title: 'Something Went Wrong',
            description: 'An unexpected error occurred.',
            icon: <AlertCircle className="h-8 w-8 text-red-500" />,
            color: 'red',
            solution:
                'Please try again or contact support if the issue persists.',
        },
    }

    // Get the appropriate error configuration or fall back to generic
    const errorType = error.name in errorConfig ? error.name : 'GenericError'
    const config = errorConfig[errorType as keyof typeof errorConfig]

    // Determine background color based on error type
    const getBgColor = () => {
        switch (config.color) {
            case 'amber':
                return 'bg-amber-50'
            case 'blue':
                return 'bg-blue-50'
            case 'orange':
                return 'bg-orange-50'
            case 'red':
            default:
                return 'bg-red-50'
        }
    }

    // Determine border color based on error type
    const getBorderColor = () => {
        switch (config.color) {
            case 'amber':
                return 'border-amber-200'
            case 'blue':
                return 'border-blue-200'
            case 'orange':
                return 'border-orange-200'
            case 'red':
            default:
                return 'border-red-200'
        }
    }

    return (
        <div className="flex justify-center w-full my-4">
            <div
                className={`rounded-lg shadow-sm p-6 ${getBgColor()} border ${getBorderColor()} max-w-xl w-full`}
            >
                <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">{config.icon}</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                            {config.title}
                        </h3>
                        <div className="mt-2 text-sm text-gray-700">
                            <p>{config.description}</p>
                            {error.message &&
                                error.message !== config.description && (
                                    <p className="mt-1 font-mono text-sm text-gray-600">
                                        {error.message}
                                    </p>
                                )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    <p>{config.solution}</p>
                </div>

                {error.statusCode && (
                    <div className="mt-3 text-xs text-gray-500 text-right">
                        Status code: {error.statusCode}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ErrorDisplay
