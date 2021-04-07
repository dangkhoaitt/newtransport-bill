import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { DATE_TIME_AM_FORMAT, MenuPaths, typeService } from '../../../../share/common/app-constants'
import { formatPrice } from '../../../atoms/currency/CurrencyView'
import DateView from '../../../atoms/date/DateView'
import { Service } from '../../../../share/interface/Service'
import Anchor from '../../../atoms/link'
import { ColumnSpec, Table } from '../../../molecules/table'
import { getPrice } from '../../../templates/service/util-service'
import ServiceCard from '../service-card'
import { isArrayEmpty } from '../../../../share/utils/empty-util'

interface Props {
    data: Service[]
}

export default function ServiceList({ data }: Props): JSX.Element {
    const tableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center',
            render: (record: Service): ReactNode => <span>{record.order}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Service): ReactNode => (
                <Anchor linkType='text-primary' href={`/${MenuPaths.serviceDetail}/${record.id}`}>
                    {record.code}
                </Anchor>
            )
        },
        {
            key: 'name',
            title: 'Tên dịch vụ',
            render: (record: Service): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'isExtra',
            title: ' Loại dịch vụ',
            width: '15%',
            render: (record: Service): ReactNode => <span>{record.isExtra ? typeService.extra : typeService.main}</span>
        },
        {
            key: 'price',
            title: 'Giá',
            width: '15%',
            render: (record: Service): ReactNode =>
                record.isFix === true ? (
                    <span>{!isArrayEmpty(record.distanceArr) ? formatPrice(getPrice(record)) : ''}</span>
                ) : (
                    <span>Phụ thuộc vào loại dịch vụ</span>
                )
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'time-width',
            render: (record: Service): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <Table dataSource={data} columns={tableColumns} />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                {data?.map((item, index) => (
                    <ServiceCard
                        key={index}
                        header={
                            <Anchor href={`${MenuPaths.serviceDetail}/${item.id}`} linkType='text-primary'>
                                {item.code}
                            </Anchor>
                        }
                        data={item}
                    />
                ))}
            </MediaQuery>
        </Fragment>
    )
}
