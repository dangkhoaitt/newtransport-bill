import React from 'react'
import { MenuPaths, weightUnitList } from '../../../../share/common/app-constants'
import CurrencyView from '../../../atoms/currency/CurrencyView'
import { Bill } from '../../../../share/interface/Bill'
import Anchor from '../../../atoms/link'
import Card from '../../../molecules/card'

interface BillCardProps {
    id?: string
    header?: React.ReactNode
    bill?: Bill
    className?: string
}

const assets = {
    senderCode: 'Người gửi:',
    receiveCode: 'Người nhận:',
    mainService: 'Dịch vụ chính:',
    weight: 'Trọng lượng:',
    progress: 'Trạng thái đơn hàng',
    finance: 'Thông tin kế toán',
    price: 'Tổng tiền:'
}

const BillCard = ({ id, header, bill, className }: BillCardProps): JSX.Element => {
    const { senderInfo, receiverInfo, mainService, weight, truck, weightUnit, finance, progress, total } = bill || {}
    const componentValue = {
        senderCode: (
            <Anchor href={`/${MenuPaths.customerDetail}/${senderInfo?.id}`} linkType='text-primary'>
                {senderInfo?.name}
            </Anchor>
        ),
        receiveCode: <div>{receiverInfo?.name}</div>,
        mainService: <div>{mainService?.name}</div>,
        weight: `${weight ? `${weight} ${weightUnitList.find((w) => w?.code === weightUnit)?.name}` : truck?.name}`,
        finance: <div>{finance?.name}</div>,
        progress: <div>{progress?.name}</div>,
        price: <div className='bill-price'>{CurrencyView({ value: total || 0 })}</div>
    }

    return (
        <Card className={className} id={id} header={header}>
            {Object.keys(assets).map((key, index) => {
                return (
                    <div key={index} className='input-validate col-sm-12 input-item'>
                        <label className='label-item'>{assets[key]}</label>
                        {componentValue[key]}
                    </div>
                )
            })}
        </Card>
    )
}

export default BillCard
