import { Bill } from './Bill'
import { Unit } from './Unit'
import { Unknown } from './Unknown'

export interface User extends Unknown {
    id?: string
    name?: string
    code?: string
    tel?: string
    birthday?: string
    email?: string
    username?: string
    address?: string
    role?: string
    updateTime?: string
    unit?: Unit
    bills?: Bill[]
}

export type UserInfo = { userId?: string; code?: string; name?: string }
