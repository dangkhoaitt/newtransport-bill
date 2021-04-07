import { Bill } from './Bill'
import { Province } from './Province'
import { Unit } from './Unit'
import { Unknown } from './Unknown'
import { UserInfo } from './User'

export interface Customer extends Unknown {
    id?: string
    code?: string
    name?: string
    tel?: string
    province?: Province
    district?: Province
    address?: string
    customerBill?: Bill[]
    insertBy?: UserInfo
    insertTime?: number
    unit?: Unit
}
