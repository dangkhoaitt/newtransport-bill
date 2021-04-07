import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Any } from '../interface/Unknown'

dayjs.extend(customParseFormat)

export type SDayJS = Dayjs

export function defaulValueFormat(value: string, format: string): Any {
    return value && dayjs(value, format)
}

export function formatDateFormTime(time: string | number, format: string): Any {
    return dayjs(time).format(format)
}

export function getCurrentDay(): SDayJS {
    return dayjs()
}

export function convertTimeToDate(time?: number): Date {
    return dayjs(time).toDate()
}
