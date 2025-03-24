// GridBackground.ts

import { Config } from '@/features/HoursOfServiceGraph/types.ts'

export class GridBackground {
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
            leftMargin,
            topMargin,
            cellWidth,
            rowHeight,
            totalHoursWidth,
            gridColor,
            lightGridColor,
            textColor,
            statusColor,
            headerBgColor,
        } = this.config

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw header background
        this.ctx.fillStyle = headerBgColor
        this.ctx.fillRect(0, 0, this.canvas.width, topMargin)
        this.ctx.fillRect(
            0,
            topMargin,
            leftMargin,
            this.canvas.height - topMargin
        )

        // Draw outer border
        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(0, 0, this.canvas.width, rowHeight * 4 + topMargin)

        // Draw "DUTY STATUS" header
        this.ctx.fillStyle = textColor
        this.ctx.font = 'bold 12px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('DUTY STATUS', leftMargin / 2, 30)

        // Draw the "MID NIGHT" and "NOON" labels
        this.ctx.fillText('MID', leftMargin + cellWidth / 2, 20)
        this.ctx.fillText('NIGHT', leftMargin + cellWidth / 2, 35)
        this.ctx.fillText(
            'NOON',
            leftMargin + 12 * cellWidth + cellWidth / 2,
            30
        )

        // Draw "TOTAL HOURS" header
        this.ctx.fillText('TOTAL', this.canvas.width - totalHoursWidth / 2, 20)
        this.ctx.fillText('HOURS', this.canvas.width - totalHoursWidth / 2, 35)

        // Draw time labels (hours)
        for (let i = 1; i <= 11; i++) {
            this.ctx.fillText(
                i.toString(),
                leftMargin + i * cellWidth + cellWidth / 2,
                30
            )
            this.ctx.fillText(
                i.toString(),
                leftMargin + (i + 12) * cellWidth + cellWidth / 2,
                30
            )
        }

        // Draw hour separators (thicker lines)
        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 1.5
        for (let i = 0; i <= 24; i++) {
            const x = leftMargin + i * cellWidth
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, rowHeight * 4 + topMargin)
            this.ctx.stroke()
        }

        // Draw rows and status labels
        const statusLabels = [
            '1: OFF DUTY',
            '2: SLEEPER\nBERTH',
            '3: DRIVING',
            '4: ON DUTY\n(NOT DRIVING)',
        ]

        for (let i = 0; i <= 4; i++) {
            const y = topMargin + i * rowHeight

            // Draw horizontal grid lines
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(this.canvas.width, y)
            this.ctx.stroke()

            // Draw status labels
            if (i < 4) {
                this.ctx.fillStyle = statusColor
                this.ctx.font = 'bold 12px Arial'
                this.ctx.textAlign = 'left'

                const label = statusLabels[i]
                if (label.includes('\n')) {
                    const lines = label.split('\n')
                    this.ctx.fillText(lines[0], 10, y + 20)
                    this.ctx.fillText(lines[1], 10, y + 35)
                } else {
                    this.ctx.fillText(label, 10, y + rowHeight / 2 + 5)
                }
            }
        }

        // Draw minute interval markers (every 5 minutes)
        this.ctx.strokeStyle = lightGridColor
        this.ctx.lineWidth = 0.5
        for (let i = 0; i < 24; i++) {
            for (let j = 5; j < 60; j += 5) {
                if (j % 15 === 0) continue

                const x = leftMargin + i * cellWidth + (cellWidth * j) / 60

                for (let row = 0; row < 4; row++) {
                    const y = topMargin + row * rowHeight

                    this.ctx.beginPath()
                    this.ctx.moveTo(x, y)
                    this.ctx.lineTo(x, y + rowHeight)
                    this.ctx.stroke()
                }
            }
        }

        // Draw 15-minute markers
        this.ctx.strokeStyle = gridColor
        this.ctx.lineWidth = 0.8
        for (let i = 0; i < 24; i++) {
            for (let j = 1; j <= 3; j++) {
                const x = leftMargin + i * cellWidth + (cellWidth * j) / 4

                for (let row = 0; row < 4; row++) {
                    const y = topMargin + row * rowHeight

                    this.ctx.beginPath()
                    this.ctx.moveTo(x, y)
                    this.ctx.lineTo(x, y + rowHeight)
                    this.ctx.stroke()
                }
            }
        }
    }
}
