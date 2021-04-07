import { Service } from '../interface/Service'

export const EMPTY_DISTANCE_ARR = {
    distance: [{ positionFrom: '', positionTo: '', priceArr: [{ weightTo: 0, price: 0, priceType: 0 }] }],
    truck: [{ priceArr: [{ truckCode: '', price: 0 }] }],
    weight: [{ priceArr: [{ weightTo: 0, price: 0, priceType: 0 }] }],
    distanceTruck: [{ positionFrom: '', positionTo: '', priceArr: [{ truckCode: '', price: 0, priceType: 0 }] }],
    distanceWeight: [{ positionFrom: '', positionTo: '', priceArr: [{ weightTo: 0, price: 0, priceType: 0 }] }],
    fix: [{ priceArr: [{ price: 0 }] }]
}

export const REMOVE_DISTANCE = {
    distanceWeight: undefined,
    distanceTruck: undefined,
    distance: undefined,
    truck: undefined,
    weight: undefined,
    fix: undefined,
    positionFrom: undefined,
    positionTo: undefined,
    price: undefined,
    priceType: undefined
}
export const EMPTY_SERVICE: Service = {
    code: '',
    name: '',
    isExtra: false,
    isFix: false,
    isDistance: true,
    isWeight: false,
    isTruck: false,
    weightUnit: undefined,
    distance: [{ positionFrom: '', positionTo: '', priceArr: [{ weightTo: 0, price: 0 }] }],
    truck: [{ priceArr: [{ truckCode: '', price: 0 }] }],
    weight: [{ priceArr: [{ weightTo: 0, price: 0, priceType: 1 }] }],
    distanceTruck: [{ positionFrom: '', positionTo: '', priceArr: [{ truckCode: '', price: 0 }] }],
    distanceWeight: [{ positionFrom: '', positionTo: '', priceArr: [{ weightTo: 0, price: 0, priceType: 1 }] }],
    fix: [{ priceArr: [{ price: 0 }] }]
}

export const WEIGHT_UNIT = [
    { code: 1, name: 'Kg' },
    { code: 2, name: 'Lô' }
]

export const getServiceType = (service: Service | undefined): string => {
    if (!service) return ''
    switch (true) {
        case service.isDistance && !service.isTruck && !service.isWeight:
            return 'distance'
        case service.isDistance && service.isWeight:
            return 'distanceWeight'
        case service.isDistance && service.isTruck:
            return 'distanceTruck'
        case !service.isDistance && service.isTruck:
            return 'truck'
        case !service.isDistance && service.isWeight:
            return 'weight'
        default:
            return 'fix'
    }
}
