import { Unit } from './Unit'
import { Unknown } from './Unknown'

export interface Province extends Unknown {
    id?: string
    code?: number
    name?: string
    district?: { code?: number; name?: string; unit?: Unit; unitCode?: string }[]
    unit?: Unit
    unitCode?: string
}
