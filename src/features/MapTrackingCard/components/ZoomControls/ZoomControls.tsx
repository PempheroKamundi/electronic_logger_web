import React from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { ZoomControlsProps } from '@/features/MapTrackingCard/types.ts'

export const ZoomControls: React.FC<ZoomControlsProps> = ({
    onZoomIn,
    onZoomOut,
}) => {
    return (
        <div className="absolute top-4 left-4 z-[1000] flex flex-row space-x-2">
            <button
                className="p-2 rounded-full bg-white text-red-500 border border-red-500 shadow-sm hover:bg-red-50 transition-colors duration-200"
                onClick={onZoomIn}
                aria-label="Zoom in"
                title="Zoom in"
            >
                <ZoomIn size={20} />
            </button>
            <button
                className="p-2 rounded-full bg-white text-red-500 border border-red-500 shadow-sm hover:bg-red-50 transition-colors duration-200"
                onClick={onZoomOut}
                aria-label="Zoom out"
                title="Zoom out"
            >
                <ZoomOut size={20} />
            </button>
        </div>
    )
}

export default ZoomControls
