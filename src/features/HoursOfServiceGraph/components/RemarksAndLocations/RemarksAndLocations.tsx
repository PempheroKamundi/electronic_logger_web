import {
    Config,
    StatusTransition,
} from '@/features/HoursOfServiceGraph/types.ts'

export class RemarksAndLocations {
    private ctx: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement
    private config: Config
    private statusTransitions: StatusTransition[]

    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        config: Config,
        statusTransitions: StatusTransition[]
    ) {
        this.ctx = ctx
        this.canvas = canvas
        this.config = config
        this.statusTransitions = statusTransitions
    }

    draw(): void {
        const {
            leftMargin,
            topMargin,
            cellWidth,
            rowHeight,
            remarksHeight,
            locationHeight,
            gridColor,
            lightGridColor,
            textColor,
            statusColor,
            headerBgColor,
        } = this.config
        const remarksTop = topMargin + 4 * rowHeight + 20

        // Draw remarks header
        this.ctx.fillStyle = headerBgColor
        this.ctx.fillRect(0, remarksTop, leftMargin, remarksHeight)

        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(0, remarksTop, this.canvas.width, remarksHeight)

        this.ctx.fillStyle = statusColor
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText('REMARKS', 10, remarksTop + remarksHeight / 2 + 5)

        // Draw vertical line separating remarks header
        this.ctx.beginPath()
        this.ctx.moveTo(leftMargin, remarksTop)
        this.ctx.lineTo(leftMargin, remarksTop + remarksHeight)
        this.ctx.stroke()

        // Draw hour marks in remarks section
        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 1
        for (let i = 0; i <= 24; i++) {
            const x = leftMargin + i * cellWidth
            this.ctx.beginPath()
            this.ctx.moveTo(x, remarksTop)
            this.ctx.lineTo(x, remarksTop + remarksHeight)
            this.ctx.stroke()
        }

        // Draw minute marks in remarks section (every 5 minutes)
        this.ctx.strokeStyle = lightGridColor
        this.ctx.lineWidth = 0.5
        for (let i = 0; i < 24; i++) {
            for (let j = 5; j < 60; j += 5) {
                if (j % 15 === 0) continue
                const x = leftMargin + i * cellWidth + (cellWidth * j) / 60
                this.ctx.beginPath()
                this.ctx.moveTo(x, remarksTop)
                this.ctx.lineTo(x, remarksTop + remarksHeight)
                this.ctx.stroke()
            }
        }

        // Draw 15-minute marks in remarks section
        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 0.8
        for (let i = 0; i < 24; i++) {
            for (let j = 1; j <= 3; j++) {
                const x = leftMargin + i * cellWidth + (cellWidth * j) / 4
                this.ctx.beginPath()
                this.ctx.moveTo(x, remarksTop)
                this.ctx.lineTo(x, remarksTop + remarksHeight)
                this.ctx.stroke()
            }
        }

        // Draw location remarks with connecting lines
        const locationsTop = remarksTop + remarksHeight

        // Filter transitions with location information
        const locationsWithTransitions = this.statusTransitions.filter(
            (t) => t.location
        )

        // Draw diagonal lines connecting status changes to location text
        this.ctx.strokeStyle = '#333'
        this.ctx.lineWidth = 1

        locationsWithTransitions.forEach((transition, index) => {
            const [hour, minute] = transition.time

            // Calculate starting point (on the grid)
            const startX =
                leftMargin + hour * cellWidth + (minute / 60) * cellWidth
            const startY =
                topMargin + transition.fromRow * rowHeight + rowHeight

            // Calculate endpoint in remarks section
            const endX = startX
            const endY = remarksTop + remarksHeight

            // Draw connecting line from grid to remarks section
            this.ctx.beginPath()
            this.ctx.moveTo(startX, startY)
            this.ctx.lineTo(endX, endY)
            this.ctx.stroke()

            // Add location text at angle
            const textX = endX + 5
            const textY = locationsTop + 30 + index * 25

            // Draw diagonal line from remarks to location text
            this.ctx.beginPath()
            this.ctx.moveTo(endX, endY)
            this.ctx.lineTo(textX + 5, textY - 5)
            this.ctx.stroke()

            // Add location text
            this.ctx.fillStyle = textColor
            this.ctx.font = '12px Arial'
            this.ctx.textAlign = 'left'
            this.ctx.fillText(transition.location || '', textX + 10, textY)
        })
        console.log(locationHeight)

        // Draw day total (24 hours)
        const dayTotal = '24'
        const totalY = remarksTop + remarksHeight / 2
        const totalX = this.canvas.width - 30

        this.ctx.fillStyle = textColor
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(dayTotal, totalX, totalY + 5)
    }
}
