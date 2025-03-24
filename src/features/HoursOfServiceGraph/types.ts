export interface DriverActivity {
    status: 'offDuty' | 'sleeperBerth' | 'driving' | 'onDuty'
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    location: string | null
}

export interface StatusTransition {
    time: [number, number]
    fromStatus: DriverActivity['status']
    toStatus: DriverActivity['status']
    fromRow: number
    toRow: number
    location: string | null
}

export interface TotalHours {
    offDuty: number
    sleeperBerth: number
    driving: number
    onDuty: number
}

export interface Config {
    leftMargin: number
    topMargin: number
    cellWidth: number
    rowHeight: number
    totalHoursWidth: number
    remarksHeight: number
    locationHeight: number
    gridColor: string
    lightGridColor: string
    textColor: string
    statusColor: string
    headerBgColor: string
}

export const DEFAULT_CONFIG: Config = {
    leftMargin: 140,
    topMargin: 60,
    cellWidth: 38,
    rowHeight: 50,
    totalHoursWidth: 60,
    remarksHeight: 40,
    locationHeight: 120,
    gridColor: '#999',
    lightGridColor: '#ddd',
    textColor: '#333',
    statusColor: '#800000',
    headerBgColor: '#f2f2f2',
}

export const STATUS_TO_ROW_INDEX: Record<DriverActivity['status'], number> = {
    offDuty: 0,
    sleeperBerth: 1,
    driving: 2,
    onDuty: 3,
}
