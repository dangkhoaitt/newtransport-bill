import React from 'react'
import { DATE_TIME_AM_FORMAT, typeService } from '../../../../share/common/app-constants'
import { formatPrice } from '../../../atoms/currency/CurrencyView'
import DateView from '../../../atoms/date/DateView'
import { Service } from '../../../../share/interface/Service'
import Card from '../../../molecules/card'

interface UserCardProps {
    id?: string
    header?: React.ReactNode
    data?: Service
}

const assets = {
    name: 'Tên dịch vụ',
    isExtra: 'Loại dịch vụ',
    price: 'Giá',
    order: 'Thứ tự',
    insertTime: 'Ngày tạo'
}

const ServiceCard = ({ id, header, data }: UserCardProps): JSX.Element => {
    const componentValue = {
        name: <span>{data?.name}</span>,
        isExtra: data?.isExtra ? <span>{typeService.extra}</span> : <span>{typeService.main}</span>,
        order: data?.isExtra ? <span>{typeService.extra}</span> : <span>{data?.order}</span>,
        price:
            data?.isFix === true ? (
                <span>{data.price && formatPrice(data.price)}</span>
            ) : (
                <span>Phụ thuộc vào loại dịch vụ</span>
            ),
        insertTime: <DateView format={DATE_TIME_AM_FORMAT} time={data?.insertTime} />
    }

    return (
        <Card id={id} header={header}>
            {Object.keys(assets).map((key, index) => {
                return (
                    <div key={index} className='service-card-item'>
                        <label className='label-item'>{assets[key]}</label>
                        {componentValue[key]}
                    </div>
                )
            })}
        </Card>
    )
}

export default ServiceCard
