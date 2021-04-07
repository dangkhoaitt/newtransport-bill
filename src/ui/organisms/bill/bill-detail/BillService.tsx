import React from 'react'
import { MenuPaths } from '../../../../share/common/app-constants'
import CurrencyView from '../../../atoms/currency/CurrencyView'
import { Service } from '../../../../share/interface/Service'
import Anchor from '../../../atoms/link'
import { FieldSpec } from '../../../molecules/table/type'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetsService: FieldSpec = {
    mainService: 'Dịch vụ chính:',
    extraService: 'Dịch vụ cộng thêm:'
}

export type BillServiceProps = {
    mainService?: Service
    extraService?: Service[]
    disableItem?: boolean
}
export default function BillDetailService({ mainService = {}, extraService = [] }: BillServiceProps): JSX.Element {
    const serviceValue: CardValue = {
        mainService: (
            <Anchor href={`/${MenuPaths.serviceDetail}/${mainService.id}`} linkType='text-primary'>
                {mainService.name}
            </Anchor>
        ),
        extraService: (
            <div className='service-value'>
                {extraService.map((item) => (
                    <div key={item.code} className='service-extra-value'>
                        <Anchor href={`/${MenuPaths.serviceDetail}/${item.id}`} linkType='text-primary'>
                            {item.name}:
                        </Anchor>
                        {CurrencyView({ value: item.priceByUser || item.price || 0 })}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <CardDetailItem
            className='bill-service-item'
            header='Thông tin dịch vụ'
            dataValue={serviceValue}
            assets={assetsService}
        />
    )
}
