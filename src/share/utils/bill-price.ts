import { DISCOUNT_UNIT, PRICE_TYPE } from '../common/app-constants'
import { Bill } from '../interface/Bill'
import { Distance, Price, Service } from '../interface/Service'

export type BillPrice = { mainPrice: number; extraPrice: number; total: number; returnExtraService?: Service[] }
export type BillPriceProps = {
    mainService?: Service
    extraService?: Service[]
    weight?: number
    weightUnit?: number //1.kg 2.khối  TODO handle mainPrice
    truck?: string
    position?: Position
    discount?: number
    discountUnit?: number
}

export type Position = { provinceFrom: number; districtFrom: number; provinceTo: number; districtTo: number }

export function getPriceByService(service: Service, weight?: number, truck?: string, position?: Position): number {
    const { isFix, isDistance, distanceArr, isTruck, isWeight } = service
    let distanceObj: Distance = distanceArr ? distanceArr[0] : {}
    const priceArr = distanceObj?.priceArr

    if (service.priceByUser && service.priceByUser > 0) return service.priceByUser
    if (isFix) return getFixPrice(service?.distanceArr || [])
    if (isDistance) {
        distanceObj =
            distanceArr?.find(
                (p) =>
                    (p.positionFrom == `${position?.districtFrom}` || p.positionFrom == `${position?.provinceFrom}`) &&
                    (p.positionTo == `${position?.districtTo}` || p.positionTo == `${position?.provinceTo}`)
            ) || {}
        if (!isTruck && !isWeight && distanceObj?.priceArr) return distanceObj?.priceArr[0]?.price as number
    }

    if (isTruck) {
        if (!isDistance && distanceArr)
            return distanceArr[0]?.priceArr?.find((p) => p.truckCode === truck)?.price as number
        else return distanceObj?.priceArr?.find((p) => p.truckCode === truck)?.price as number
    }

    if (!isWeight) return priceArr ? priceArr[0]?.price || 0 : 0
    let sortedPriceArr: Price[] =
        (distanceArr && distanceArr[0]?.priceArr?.sort((a, b) => (a.weightTo || 0) - (b.weightTo || 0))) || []
    if (isDistance) sortedPriceArr = distanceObj.priceArr?.sort((a, b) => (a.weightTo || 0) - (b.weightTo || 0)) || []
    let remainWeight = weight || 0,
        i = 0,
        oldWt = 0,
        price = 0
    while (remainWeight > 0 && sortedPriceArr[i]) {
        const pr = sortedPriceArr[i]?.price || 0
        const wt = (sortedPriceArr[i]?.weightTo || 0) - oldWt
        if (sortedPriceArr[i]?.priceType == PRICE_TYPE.LO) {
            price += pr
        } else {
            price += (remainWeight > wt ? wt : remainWeight) * pr
        }
        i++
        oldWt = wt + oldWt
        remainWeight = (weight as number) - oldWt
    }
    // console.log('price=', price)
    return price
}

export function getBillPrice(option: BillPriceProps): BillPrice {
    // console.log('inputoption=', option)
    const { mainService = {}, truck, position, extraService, weight, discountUnit, discount = 0 } = option
    const mainPrice = getPriceByService(mainService, weight, truck, position) || 0
    let extraPrice = 0
    const returnExtraService = extraService?.map((e) => {
        e.price = getPriceByService(e, weight, truck, position)
        if (e.price && e.price !== -1) extraPrice += e.price
        return e
    })

    const total = Math.round(
        discountUnit === DISCOUNT_UNIT[1].code
            ? (mainPrice + extraPrice - discount) * 1.1
            : ((mainPrice + extraPrice) * 1.1 * (100 - discount)) / 100
    )

    return { mainPrice, extraPrice, returnExtraService, total }
}

export function handleDataBill(data: Bill): Bill {
    const newBill: Bill = { extraService: [], goodsInfo: [] }
    Object.keys(data).forEach((key) => {
        if (data[key] || data[key] === 0) {
            if (key.includes('extraService-')) return
            if (key.includes('goodsInfo')) {
                const { quantity, package: packageId, content } = data[key]
                if (!quantity && !packageId && !content) return
                data[key].check && newBill.goodsInfo?.push({ quantity, package: packageId, content })
                return
            }
            if (key == 'extraService') {
                newBill.extraService = data.extraService?.map((ex) => ({ code: ex.code, price: ex.price }))
                return
            }
            newBill[key] = data[key]
        }
    })
    return newBill
}

export function getFixPrice(distances: Distance[] | undefined): number {
    if (!distances || !distances[0]?.priceArr) {
        return 0
    } else return distances[0]?.priceArr[0].price || 0
}

export function getServiceError(params: BillPriceProps): string[] {
    const { mainService = {}, extraService = [], position, truck, weight } = params
    const err: string[] = []
    if (
        !mainService?.isTruck &&
        !mainService?.isWeight &&
        extraService.some((e) => e.isTruck === true) &&
        extraService.some((e) => e.isWeight === true)
    ) {
        err.push('Không hỗ trợ cùng lúc các dịch vụ theo xe và theo khối lượng')
    }
    const service = [mainService, ...extraService]
    service.forEach((s) => {
        const { isDistance, isTruck, isWeight } = s || {}
        if (s.distanceArr) {
            const distanceObj = s?.distanceArr[0] || {}
            if (isDistance && position?.provinceFrom && position.provinceTo) {
                s.distanceArr.every((p) => !checkDistance(position, p.positionFrom, p.positionTo)) &&
                    err.push(`Dịch vụ ${s.name} không hỗ trợ tuyến đường này.`)
            }
            if (isWeight && weight) {
                distanceObj?.priceArr?.every((priceItem) => !priceItem.weightTo || weight > priceItem.weightTo) &&
                    err.push(`Dịch vụ ${s.name} không hỗ trợ khối lượng này.`)
            }
            if (isTruck && truck && distanceObj?.priceArr?.every((p) => p.truckCode !== truck))
                err.push(`Dịch vụ ${s.name} không hỗ trợ loại xe này.`)
        }
    })
    return err
}

function checkDistance(position: Position, positionFrom?: string, positionTo?: string): boolean {
    return (
        (position.provinceFrom === Number(positionFrom) || position.districtFrom === Number(positionFrom)) &&
        (position.provinceTo === Number(positionTo) || position.districtTo === Number(positionTo))
    )
}
