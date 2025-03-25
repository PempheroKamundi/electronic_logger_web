import React, { useEffect, useRef, useState } from 'react'
import {
    DEFAULT_CONFIG,
    DriverActivity,
} from '@/features/HoursOfServiceGraph/types.ts'
import { GraphRenderer } from '@/features/HoursOfServiceGraph/components/GraphRenderer/GraphRenderer.tsx'

interface HoursOfServiceGraphProps {
    driverActivities: DriverActivity[]
    width?: number
    height?: number
    title?: string
    subtitle?: string
}

const HoursOfServiceGraph: React.FC<HoursOfServiceGraphProps> = ({
                                                                     driverActivities,
                                                                     width = 1100,
                                                                     height = 500,
                                                                     title = 'Truck Driver Hours of Service Log',
                                                                     subtitle = 'Standard HOS Pattern: 14-hour duty window, 11 hours driving, 10 hours rest',
                                                                 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [currentTime, setCurrentTime] = useState<string>('')

    // Add a state for responsive dimensions
    const [dimensions, setDimensions] = useState({
        width: width,
        height: height
    })

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date()

            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short',
            }

            setCurrentTime(now.toLocaleTimeString(undefined, timeOptions))
        }

        // Update immediately
        updateCurrentTime()

        // Then update every minute
        const intervalId = setInterval(updateCurrentTime, 60000)

        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const activities = driverActivities
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Create and use the graph renderer
        const renderer = new GraphRenderer(
            ctx,
            canvas,
            DEFAULT_CONFIG,
            activities
        )
        renderer.render()
    }, [driverActivities, dimensions])

    return (
        <div className="bg-gray-100 p-5">
            <div className="border-2 border-dashed border-gray-700 p-4 bg-white" style={{ minWidth: width }}>
                <h2 className="text-center mt-0 mb-5 text-xl font-bold">
                    {title}
                </h2>
                <div className="flex justify-center mb-2">
                    <div className="bg-red-50 border border-red-200 px-3 py-1 rounded text-red-800 font-medium">
                        Current Time: {currentTime}
                    </div>
                </div>
                <div className="text-center mb-5 text-sm">{subtitle}</div>
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="border border-gray-400 block mx-auto"
                />
            </div>
        </div>
    )
}

export default HoursOfServiceGraph