import { Unknown } from './Unknown'

export interface Progress extends Unknown {
    id?: string
    code?: string
    order?: number
    name?: string
}
