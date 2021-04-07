import React from 'react'
import { Goods } from '../../../../share/interface/Bill'
import { fomatNumber } from '../../../atoms/inputs/NumberInput'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'
export type BillGoodsProps = {
    goodsInfo?: Goods[]
    disableItem?: boolean
}
export default function BillDetailGoods({ goodsInfo = [] }: BillGoodsProps): JSX.Element {
    const goodsContentValue: CardValue = {
        goodsInfo: (
            <ul className='goods-value'>
                {goodsInfo?.map((item, index) => {
                    const { quantity = '', packageName = '', content = '' } = item
                    return <li key={index}>{`${quantity && fomatNumber(quantity)} ${packageName} ${content}`}</li>
                })}
            </ul>
        )
    }

    return (
        <CardDetailItem
            className='bill-goods-item'
            header='Nội dung hàng hóa'
            dataValue={goodsContentValue}
            assets={{ goodsInfo: '' }}
        />
    )
}
