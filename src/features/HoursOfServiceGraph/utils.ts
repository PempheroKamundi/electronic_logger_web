import {
    DriverActivity,
    StatusTransition,
    TotalHours,
    STATUS_TO_ROW_INDEX,
} from './types'

/**
 * Calculate status transitions - points where the driver changes status
 */
export function calculateTransitions(
    activities: DriverActivity[]
): StatusTransition[] {
    return activities.slice(0, -1).map((activity, index) => {
        const nextActivity = activities[index + 1]

        return {
            time: [activity.endHour, activity.endMinute],
            fromStatus: activity.status,
            toStatus: nextActivity.status,
            fromRow: STATUS_TO_ROW_INDEX[activity.status],
            toRow: STATUS_TO_ROW_INDEX[nextActivity.status],
            location: nextActivity.location,
        }
    })
}

/**
 * Calculate duration for each status type
 */
export function calculateTotalHours(activities: DriverActivity[]): TotalHours {
    const totals: TotalHours = {
        offDuty: 0,
        sleeperBerth: 0,
        driving: 0,
        onDuty: 0,
    }

    activities.forEach((activity) => {
        const startTimeInHours = activity.startHour + activity.startMinute / 60
        const endTimeInHours = activity.endHour + activity.endMinute / 60
        const duration = endTimeInHours - startTimeInHours

        totals[activity.status] += duration
    })

    return totals
}

/**
 * Group activities by status
 */
export function groupActivitiesByStatus(
    activities: DriverActivity[]
): Record<DriverActivity['status'], number[][]> {
    const statusGroups: Record<DriverActivity['status'], number[][]> = {
        offDuty: [],
        sleeperBerth: [],
        driving: [],
        onDuty: [],
    }

    activities.forEach((activity) => {
        statusGroups[activity.status].push([
            activity.startHour,
            activity.startMinute,
            activity.endHour,
            activity.endMinute,
        ])
    })

    return statusGroups
}
