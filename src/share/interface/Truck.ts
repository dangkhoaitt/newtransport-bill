import { Unknown } from './Unknown'

export interface Truck extends Unknown {
    id?: string
    order?: number
    code?: string
    name?: string
    weight?: number
    note?: string
}
