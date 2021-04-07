import { UserInfo } from './User'

export interface Service {
    id?: string
    code?: string
    name?: string
    isExtra?: boolean
    order?: number
    insertBy?: UserInfo
    price?: number //if type = fixed
    priceByUser?: number
    weightUnit?: number
    isFix?: boolean
    isDistance?: boolean
    isTruck?: boolean
    isWeight?: boolean
    distanceArr?: Distance[]
    insertTime?: number
    // used for edit
    distance?: Distance[]
    distanceWeight?: Distance[]
    distanceTruck?: Distance[]
    fix?: Distance[]
    weight?: Distance[]
    truck?: Distance[]
}

export interface Distance {
    positionFrom?: string
    positionFromName?: string
    positionTo?: string
    positionToName?: string
    priceArr?: Price[]
}

export interface Price {
    truckCode?: string
    price?: number
    weightTo?: number
    priceType?: number
    truckId?: string
}
