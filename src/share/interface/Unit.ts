import { Bill } from './Bill'
import { Unknown } from './Unknown'
import { UserInfo, User } from './User'

export interface Unit extends Unknown {
    id?: string
    order?: number
    code?: string
    name?: string
    insertBy?: UserInfo
    insertTime?: number
    users?: User[]
    bills?: Bill[]
}
