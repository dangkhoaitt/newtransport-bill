import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { Quotation } from '../../../../share/interface/Quotation'
import DateView from '../../../atoms/date/DateView'
import { EditIcon } from '../../../atoms/icons'
import Tag from '../../../atoms/tag'
import { ButtonIconOnly } from '../../../molecules/buttons'
import { useModal } from '../../../molecules/modal'
import { ColumnSpec, Table } from '../../../molecules/table'
import QuotationDetailTemplate from '../../../templates/quotation/quotation-detail'
import QuotationCard from '../quotation-card'
interface Props {
    data: Quotation[]
    onHandleQuoted: (id?: string) => void
}

export default function QuotationList({ data, onHandleQuoted }: Props): JSX.Element {
    const { openModal } = useModal()

    const openModalDetail = (record: Quotation): void => {
        openModal({
            className: 'modal-create-quote',
            title: 'Chi tiết báo giá',
            content: <QuotationDetailTemplate onHandleQuoted={onHandleQuoted} data={record} />,
            closeOnClickOutside: true
        })
    }

    const TableColumns: ColumnSpec[] = [
        {
            key: 'name',
            title: 'Họ tên',
            width: '15%',
            render: (record: Quotation): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'tel',
            title: 'Số điện thoại',
            width: '10%',
            render: (record: Quotation): ReactNode => <span>{record.tel}</span>
        },
        {
            key: 'mail',
            title: 'Email',
            width: '15%',
            render: (record: Quotation): ReactNode => <span>{record.email}</span>
        },
        {
            key: 'content',
            title: 'Nội dung ',
            render: (record: Quotation): ReactNode => (
                <span className='name-quote' onClick={(): void => openModalDetail(record)}>
                    {record.content}
                </span>
            )
        },
        {
            key: 'insertTime',
            title: 'Thời gian',
            width: '12%',
            className: 'border-column text-center',
            render: (record: Quotation): ReactNode => <DateView format={'DD/MM/YYYY hh:mma'} time={record.insertTime} />
        },
        {
            key: 'status',
            title: 'Trạng thái',
            width: '130px',
            className: 'border-column text-center',
            render: (record: Quotation): ReactNode =>
                record?.status === 1 ? (
                    <Tag
                        onClick={(): void => onHandleQuoted(record?.id)}
                        tagType='primary'
                        text={
                            <div className='tag-status'>
                                <p>Chưa gửi</p>
                                <ButtonIconOnly icon={<EditIcon />} iconType='primary' />
                            </div>
                        }
                    />
                ) : (
                    <Tag tagType='default' text='Đã gửi' />
                )
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <div id='quote-table'>
                    <Table dataSource={data} columns={TableColumns} />
                </div>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <QuotationCard
                            openModalDetail={openModalDetail}
                            onHandleQuoted={onHandleQuoted}
                            key={index}
                            data={item}
                        />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
