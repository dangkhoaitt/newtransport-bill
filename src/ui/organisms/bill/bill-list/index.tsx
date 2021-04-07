import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { Link } from 'react-router-dom'
import { DATE_TIME_AM_FORMAT, MenuPaths } from '../../../../share/common/app-constants'
import { Bill } from '../../../../share/interface/Bill'
import CurrencyView from '../../../atoms/currency/CurrencyView'
import DateView from '../../../atoms/date/DateView'
import Anchor from '../../../atoms/link'
import { ColumnSpec, Table } from '../../../molecules/table'
import BillCard from '../bill-card'
import './style/index.scss'
interface Props {
    data: Bill[]
}

const TableColumns: ColumnSpec[] = [
    {
        key: 'code',
        title: 'Mã vận đơn',
        width: '8%',
        render: (record: Bill): ReactNode => (
            <Anchor linkType='text-default' href={`/${MenuPaths.billDetail}/${record.id}`}>
                {record.code}
            </Anchor>
        )
    },
    {
        key: 'senderCode',
        title: 'Mã khách hàng',
        width: '8%',
        render: (record: Bill): ReactNode => (
            <Anchor
                linkType='text-primary'
                href={`/${MenuPaths.customerDetail}/${record.senderInfo?.code}?isCode=true`}>
                {record.senderInfo?.code}
            </Anchor>
        )
    },
    {
        key: 'senderName',
        title: 'Tên khách hàng',
        width: '14%',
        render: (record: Bill): ReactNode => record.senderInfo?.name
    },
    {
        key: 'mainService',
        title: 'Dịch vụ',
        width: '14%',
        render: (record: Bill): ReactNode => (
            <Anchor linkType='text-primary' href={`/${MenuPaths.serviceDetail}/${record.mainService?.id}`}>
                {record.mainService?.name}
            </Anchor>
        )
    },
    {
        key: 'progress',
        title: 'Trạng thái hành trình',
        width: '10%',
        render: (record: Bill): ReactNode => <div>{record.progress?.name}</div>
    },
    {
        key: 'finance',
        title: 'Thông tin kế toán',
        width: '10%',
        render: (record: Bill): ReactNode => <div>{record.finance?.name}</div>
    },
    {
        key: 'price',
        title: 'Tổng tiền',
        width: '8%',
        className: 'total-price text-right',
        render: (record: Bill): ReactNode => (
            <div className='bill-price'>{CurrencyView({ value: record.total || 0 })}</div>
        )
    },
    {
        key: 'unit',
        title: 'Đơn vị',
        width: '8%',
        render: (record: Bill): ReactNode => <div>{record.sendUnit?.name}</div>
    },
    {
        key: 'insertBy',
        title: 'Người tạo',
        width: '8%',
        render: (record: Bill): ReactNode => (
            <Anchor linkType='text-primary' href={`/${MenuPaths.userDetail}/${record.insertBy?.userId}`}>
                {record.insertBy?.name}
            </Anchor>
        )
    },
    {
        key: 'insertTime',
        title: 'Thời gian tạo',
        width: '10%',
        render: (record: Bill): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
    }
]

export default function BillList({ data }: Props): JSX.Element {
    return (
        <Fragment>
            <MediaQuery minDeviceWidth={1024}>
                <div id='bill-table'>
                    <Table dataSource={data} columns={TableColumns} />
                </div>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1023}>
                <div className='list-mobile-bill'>
                    {data?.map((item, index) => (
                        <BillCard
                            id={`${index}-${item.code}`}
                            key={index}
                            header={
                                <Fragment>
                                    <Link to={`${MenuPaths.billDetail}/${item.id}`}>{item.code}</Link>
                                    <DateView format='DD/MM/YYYY hh:mm' time={item.insertTime} />
                                </Fragment>
                            }
                            bill={item}
                        />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
