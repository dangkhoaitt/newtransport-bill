import { Finance } from './Finance'
import { Progress } from './Progress'
import { Service } from './Service'
import { Truck } from './Truck'
import { Unit } from './Unit'
import { Unknown } from './Unknown'
import { UserInfo } from './User'

export interface Bill extends Unknown {
    id?: string
    code?: string
    userCode?: string
    senderInfo?: Customer
    receiverInfo?: Customer
    weight?: number
    weightUnit?: number
    truck?: Truck
    mainService?: Service
    extraService?: Service[]
    finance?: Finance
    progress?: Progress
    goodsInfo?: Goods[]
    discount?: number
    total?: number
    mainPrice?: number
    extraPrice?: number
    insertTime?: number
    insertBy?: UserInfo
    deliverMember?: UserInfo
    sendUnit?: Unit
    receiveUnit?: Unit
}

export interface Goods {
    quantity?: number
    package?: string
    packageName?: string
    content?: string
}

export type WeightUnit = { code?: number; name?: string }

export interface Customer {
    id?: string
    code?: string
    name?: string
    tel?: string
    provinceCode?: number
    districtCode?: number
    provinceName?: string
    districtName?: string
    address?: string
    unit?: Unit
}
