import { useState } from 'react'

export const MapLegend = () => {
    const [isOpen, setIsOpen] = useState(false)

    const togglePanel = () => {
        setIsOpen(!isOpen)
    }

    const legendItems = [
        {
            icon: '🚩',
            color: '#2ecc71',
            type: 'Starting Point',
            description: 'Origin of the shipment',
        },
        {
            icon: '🏁',
            color: '#8e44ad',
            type: 'Destination',
            description: 'Final delivery location',
        },
        {
            icon: '📦',
            color: '#27ae60',
            type: 'Pickup',
            description: 'Cargo pickup location',
        },
        {
            icon: '😴',
            color: '#2980b9',
            type: 'Mandatory Rest',
            description: 'Required 10-hour rest period',
        },
        {
            icon: '☕',
            color: '#f39c12',
            type: 'Break',
            description: '30-minute driver break',
        },
        {
            icon: '⛽☕',
            color: '#e67e22',
            type: 'Refueling & Break',
            description: 'Vehicle refueling which also satisfies 30 min break',
        },
        {
            icon: '🏙️',
            color: '#3498db',
            type: 'City',
            description: 'Major city on route',
        },
    ]

    return (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white bg-opacity-95 rounded-lg shadow-md max-w-xs overflow-hidden">
            <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                onClick={togglePanel}
            >
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="font-medium text-gray-800">Map Legend</p>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: item.color }}
                            >
                                <span className="text-lg">{item.icon}</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {item.type}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="h-1 w-10 bg-red-500 rounded"></div>
                            <p className="text-sm text-gray-700">Route Path</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
