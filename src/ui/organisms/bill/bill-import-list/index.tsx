import React, { Fragment, ReactNode } from 'react'
import { Bill } from '../../../../share/interface/Bill'
import CurrencyView from '../../../atoms/currency/CurrencyView'
import { ColumnSpec, Table } from '../../../molecules/table'
import './style/index.scss'

interface Props {
    data: Bill[]
}

const RequireTitle = ({ title }: { title: string }): JSX.Element => {
    return (
        <Fragment>
            {title}
            <span style={{ color: 'red' }}>*</span>
        </Fragment>
    )
}

const TableColumns: ColumnSpec[] = [
    {
        key: 'status',
        title: 'Trạng thái',
        width: '120px',
        className: 'border-column text-center',
        render: (record: Bill): ReactNode =>
            record.errors.length ? (
                <span style={{ color: 'red' }} title={record.errors.join('\n')}>
                    Lỗi
                </span>
            ) : (
                <span>Hợp lệ</span>
            )
    },
    {
        key: 'price',
        title: <RequireTitle title='Tổng cước' />,
        width: '150px',
        className: 'total-price text-right',
        render: (record: Bill): ReactNode => {
            return <div className='bill-price'>{CurrencyView({ value: record.total || 0 })}</div>
        }
    },
    {
        key: 'code',
        title: 'Mã vận đơn',
        width: '150px',
        render: ({ code }: Bill): ReactNode => code
    },
    {
        key: 'receiverName',
        title: <RequireTitle title='Tên người nhận' />,
        width: '200px',
        render: ({ receiverInfo }: Bill): ReactNode => receiverInfo?.name
    },
    {
        key: 'receiverTel',
        title: <RequireTitle title='Số điện thoại' />,
        width: '150px',
        render: ({ receiverInfo }: Bill): ReactNode => receiverInfo?.tel
    },
    {
        key: 'province',
        title: <RequireTitle title='Tỉnh/Thành' />,
        width: '200px',
        render: ({ receiverInfo }: Bill): ReactNode => receiverInfo?.provinceName || ''
    },
    {
        key: 'district',
        title: <RequireTitle title='Quận/Huyện' />,
        width: '200px',
        render: ({ receiverInfo }: Bill): ReactNode =>
            receiverInfo?.districtCode ? (
                receiverInfo?.districtName
            ) : (
                <span style={{ color: 'red' }}>{receiverInfo?.districtName}</span>
            )
    },
    {
        key: 'address',
        title: <RequireTitle title='Địa chỉ' />,
        width: '400px',
        render: ({ receiverInfo }: Bill): ReactNode => receiverInfo?.address || ''
    },
    {
        key: 'goodsInfo',
        title: 'Nội dung hàng hóa',
        width: '300px',
        render: ({ goodsInfo }: Bill): ReactNode => goodsInfo?.map(({ content }) => content).join('\n')
    },
    {
        key: 'weight',
        title: <RequireTitle title='Trọng lượng(g)' />,
        width: '150px',
        className: 'border-column text-right',
        render: ({ weight }: Bill): ReactNode => weight
    },
    {
        key: 'mainService',
        title: <RequireTitle title='Dịch vụ' />,
        width: '250px',
        render: ({ mainService }: Bill): ReactNode =>
            mainService?.code ? mainService?.name : <span style={{ color: 'red' }}>{mainService?.name}</span>
    },
    {
        key: 'extraServices',
        title: 'Dịch vụ cộng thêm',
        width: '250px',
        render: ({ extraService }: Bill): ReactNode => (
            <ul>
                {extraService?.map(({ code, name }, index) =>
                    code ? (
                        <li key={index}>{name}</li>
                    ) : (
                        <li key={index} style={{ color: 'red' }}>
                            {name}
                        </li>
                    )
                )}
            </ul>
        )
    },
    {
        key: 'finance',
        title: <RequireTitle title='Người thanh toán' />,
        width: '250px',
        render: ({ finance }: Bill): ReactNode =>
            finance?.code ? finance?.name : <span style={{ color: 'red' }}>{finance?.name}</span>
    }
]

export default function BillImportList({ data }: Props): JSX.Element {
    return (
        <div id='bill-import-table'>
            <Table dataSource={data} columns={TableColumns} />
        </div>
    )
}
