export const LoadingIndicator = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-full">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading route data...</p>
            </div>
        </div>
    )
}
