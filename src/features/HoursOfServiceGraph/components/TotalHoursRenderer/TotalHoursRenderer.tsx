import {
    Config,
    TotalHours as TotalHoursType,
} from '@/features/HoursOfServiceGraph/types.ts'

export class TotalHoursRenderer {
    private ctx: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement
    private config: Config
    private totalHours: TotalHoursType

    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        config: Config,
        totalHours: TotalHoursType
    ) {
        this.ctx = ctx
        this.canvas = canvas
        this.config = config
        this.totalHours = totalHours
    }

    draw(): void {
        const { topMargin, rowHeight, totalHoursWidth, textColor } = this.config

        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillStyle = textColor

        const displayHours = [
            this.totalHours.offDuty.toFixed(2),
            this.totalHours.sleeperBerth.toFixed(2),
            this.totalHours.driving.toFixed(2),
            this.totalHours.onDuty.toFixed(2),
        ]

        displayHours.forEach((hours, i) => {
            const y = topMargin + i * rowHeight + rowHeight / 2 + 5
            this.ctx.fillText(hours, this.canvas.width - totalHoursWidth / 2, y)
        })
    }
}
