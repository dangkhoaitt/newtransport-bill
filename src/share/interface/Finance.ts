import { Unknown } from './Unknown'

export interface Finance extends Unknown {
    id?: string
    order?: number
    code?: string
    name?: string
    description?: string
}
