import {
    Config,
    DriverActivity,
    StatusTransition,
} from '@/features/HoursOfServiceGraph/types.ts'
import { groupActivitiesByStatus } from '@/features/HoursOfServiceGraph/utils.ts'

export class DutyBlocks {
    private ctx: CanvasRenderingContext2D
    private config: Config
    private activities: DriverActivity[]
    private statusTransitions: StatusTransition[]

    constructor(
        ctx: CanvasRenderingContext2D,
        config: Config,
        activities: DriverActivity[],
        statusTransitions: StatusTransition[]
    ) {
        this.ctx = ctx
        this.config = config
        this.activities = activities
        this.statusTransitions = statusTransitions
    }

    draw(): void {
        // Group activities by status
        const statusGroups = groupActivitiesByStatus(this.activities)

        // Draw status block outlines by group
        Object.entries(statusGroups).forEach(([status, times]) => {
            const rowIndex =
                status === 'offDuty'
                    ? 0
                    : status === 'sleeperBerth'
                      ? 1
                      : status === 'driving'
                        ? 2
                        : 3
            this.drawStatusBlockOutlines(times, rowIndex)
        })

        // Draw vertical lines at transitions
        this.drawStatusTransitions()
    }

    private drawStatusBlockOutlines(times: number[][], rowIndex: number): void {
        const { leftMargin, topMargin, cellWidth, rowHeight } = this.config

        this.ctx.strokeStyle = '#333'
        this.ctx.lineWidth = 2

        times.forEach((time) => {
            const [startHour, startMinute, endHour, endMinute] = time

            const startX =
                leftMargin +
                startHour * cellWidth +
                (startMinute / 60) * cellWidth
            const endX =
                leftMargin + endHour * cellWidth + (endMinute / 60) * cellWidth
            const bottomY = topMargin + (rowIndex + 1) * rowHeight

            // Only draw bottom line
            this.ctx.beginPath()
            this.ctx.moveTo(startX, bottomY)
            this.ctx.lineTo(endX, bottomY)
            this.ctx.stroke()
        })
    }

    private drawStatusTransitions(): void {
        const { leftMargin, topMargin, cellWidth, rowHeight } = this.config

        this.ctx.strokeStyle = '#333'
        this.ctx.lineWidth = 1.5

        this.statusTransitions.forEach((transition) => {
            const [hour, minute] = transition.time
            const fromRowIndex = transition.fromRow
            const toRowIndex = transition.toRow

            // Calculate the x position
            const x = leftMargin + hour * cellWidth + (minute / 60) * cellWidth

            // Draw a vertical line connecting from the bottom of "from" row to the bottom of "to" row
            const fromY = topMargin + (fromRowIndex + 1) * rowHeight
            const toY = topMargin + (toRowIndex + 1) * rowHeight

            // Draw the connecting line
            this.ctx.beginPath()
            this.ctx.moveTo(x, fromY)
            this.ctx.lineTo(x, toY)
            this.ctx.stroke()
        })
    }
}
