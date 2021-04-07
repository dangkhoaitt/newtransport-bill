import { Unknown } from './Unknown'

export interface Package extends Unknown {
    id?: string
    order?: number
    code?: string
    name?: string
    description?: string
}
