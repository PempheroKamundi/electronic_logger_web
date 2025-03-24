import { Config, DriverActivity } from '@/features/HoursOfServiceGraph/types.ts'
import {
    calculateTotalHours,
    calculateTransitions,
} from '@/features/HoursOfServiceGraph/utils.ts'
import { GridBackground } from '@/features/HoursOfServiceGraph/components/GridBackground/GridBackground.tsx'
import { DutyBlocks } from '@/features/HoursOfServiceGraph/components/DutyBlocks/DutyBlocks.tsx'
import { RemarksAndLocations } from '@/features/HoursOfServiceGraph/components/RemarksAndLocations/RemarksAndLocations.tsx'
import { TotalHoursRenderer } from '@/features/HoursOfServiceGraph/components/TotalHoursRenderer/TotalHoursRenderer.tsx'
import { Legend } from '@/features/HoursOfServiceGraph/components/Legend/Legend.tsx'

export class GraphRenderer {
    private ctx: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement
    private config: Config
    private activities: DriverActivity[]

    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        config: Config,
        activities: DriverActivity[]
    ) {
        this.ctx = ctx
        this.canvas = canvas
        this.config = config
        this.activities = activities
    }

    render(): void {
        const statusTransitions = calculateTransitions(this.activities)
        const totalHours = calculateTotalHours(this.activities)

        const gridBackground = new GridBackground(
            this.ctx,
            this.canvas,
            this.config
        )
        const dutyBlocks = new DutyBlocks(
            this.ctx,
            this.config,
            this.activities,
            statusTransitions
        )
        const remarksAndLocations = new RemarksAndLocations(
            this.ctx,
            this.canvas,
            this.config,
            statusTransitions
        )
        const totalHoursRenderer = new TotalHoursRenderer(
            this.ctx,
            this.canvas,
            this.config,
            totalHours
        )
        const legend = new Legend(this.ctx, this.canvas, this.config)

        gridBackground.draw()
        dutyBlocks.draw()
        remarksAndLocations.draw()
        totalHoursRenderer.draw()
        legend.draw()
    }
}
