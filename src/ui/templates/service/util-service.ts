import { Service } from '../../../share/interface/Service'

export const objectPriceType = {
    distance: { positionFrom: '', positionTo: '', priceArr: [{ price: 0 }] },
    distanceWeight: { positionFrom: '', positionTo: '', priceArr: [{ weightTo: 0, price: 0 }] },
    distanceTruck: { positionFrom: '', positionTo: '', priceArr: [{ truckCode: '', price: 0 }] },
    truck: { priceArr: [{ truckCode: '', price: 0 }] },
    weight: { priceArr: [{ weightTo: 0, price: 0 }] }
}
export function getPriceType(isDistance?: boolean, isWeight?: boolean, isTruck?: boolean): string {
    if (isDistance && !isWeight && !isTruck) return 'distance'
    if (isDistance && isWeight && !isTruck) return 'distanceWeight'
    if (!isDistance && !isWeight && isTruck) return 'truck'
    if (!isDistance && isWeight && !isTruck) return 'weight'
    if (isDistance && !isWeight && isTruck) return 'distanceTruck'
    return 'null'
}
export function getPrice(service: Service): number {
    if (service && service.distanceArr && service.distanceArr[0].priceArr)
        return service.distanceArr[0].priceArr[0].price || 0
    return 0
}
