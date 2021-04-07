import React from 'react'
import { DISCOUNT_UNIT, weightUnitList } from '../../../../share/common/app-constants'
import CurrencyView from '../../../atoms/currency/CurrencyView'
import { Truck } from '../../../../share/interface/Truck'
import { fomatNumber } from '../../../atoms/inputs/NumberInput'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetsPrice = {
    truck: 'Loại xe:',
    weight: 'Trọng lượng:',
    mainPrice: 'Cước chính',
    extraPrice: 'Phụ phí thêm',
    discount: 'Chiết khấu:',
    total: 'Tổng tiền:'
}

export type BillPriceProps = {
    truck?: Truck
    weight?: number
    discount?: number
    total?: number
    mainPrice?: number
    extraPrice?: number
    weightUnit?: number
    discountUnit?: number
}

export default function BillDetailPrice(props: BillPriceProps): JSX.Element {
    const { mainPrice = 0, extraPrice = 0, discount = 0, truck, total = 0, weight, weightUnit, discountUnit } = props
    const priceValue: CardValue = {
        weight: weight && `${fomatNumber(weight)} ${weightUnitList.find((w) => w?.code === weightUnit)?.name}`,
        truck: truck?.name,
        discount: discountUnit === DISCOUNT_UNIT[0].code ? `${discount}%` : <CurrencyView value={discount} />,
        mainPrice: CurrencyView({ value: mainPrice }),
        extraPrice: CurrencyView({ value: extraPrice }),
        total: <div className='bill-price'>{CurrencyView({ value: total })}</div>
    }

    return <CardDetailItem header='Thông tin cước' dataValue={priceValue} assets={assetsPrice} />
}
