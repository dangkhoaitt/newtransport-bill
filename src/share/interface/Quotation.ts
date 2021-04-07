import { Unknown } from './Unknown'

export interface Quotation extends Unknown {
    id?: string
    name?: string
    address?: string
    tel?: string
    email?: string
    title?: string
    content?: string
    status?: number
    insertTime?: number
    updateTime?: number
}
