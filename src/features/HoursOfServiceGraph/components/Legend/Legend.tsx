// Legend.ts

import { Config } from '@/features/HoursOfServiceGraph/types.ts'

export class Legend {
    private ctx: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement
    private config: Config

    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        config: Config
    ) {
        this.ctx = ctx
        this.canvas = canvas
        this.config = config
    }

    draw(): void {
        const {
            topMargin,
            rowHeight,
            remarksHeight,
            statusColor,
            locationHeight,
        } = this.config
        const legendY =
            topMargin + 4 * rowHeight + remarksHeight + locationHeight + 20

        this.ctx.fillStyle = statusColor
        this.ctx.font = 'bold 12px Arial'
        this.ctx.textAlign = 'center'

        const legends = [
            '1: OFF DUTY',
            '2: SLEEPER BERTH',
            '3: DRIVING',
            '4: ON DUTY (NOT DRIVING)',
        ]

        let currentX = this.canvas.width / 2 - 250

        legends.forEach((legend) => {
            this.ctx.fillText(legend, currentX, legendY)
            currentX += 175
        })
    }
}
