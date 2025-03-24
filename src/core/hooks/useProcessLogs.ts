import { useState, useEffect } from 'react'
import { RouteData } from '@/core/hooks/useRouteData.ts'
import { DriverActivity } from '@/features/HoursOfServiceGraph/types.ts'

export interface TruckerLog {
    date: string
    total_miles_driving: number
    from: [number, number]
    to: [number, number]
    log: DriverActivity[]
}

export interface ProcessLogsError {
    message: string
    code?: string
}

export interface Response {
    data: TruckerLog[]
}

export const useProcessLogs = (route_data: RouteData[], isLoading: boolean) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<TruckerLog[] | null>(null)
    const [error, setError] = useState<ProcessLogsError | null>(null)

    useEffect(() => {
        const processLogs = async () => {
            if (!route_data || route_data.length === 0) {
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    'http://localhost:8000/planner/api/process-logs/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ route_data }),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(
                        errorData.message || 'Failed to process logs'
                    )
                }

                const responseData: Response = await response.json()
                setData(responseData.data)
            } catch (err) {
                setError({
                    message:
                        err instanceof Error
                            ? err.message
                            : 'An unknown error occurred',
                })
            } finally {
                setLoading(false)
            }
        }

        processLogs()
    }, [isLoading])

    return { loading, data, error }
}
