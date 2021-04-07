import React, { Fragment } from 'react'
import { Quotation } from '../../../../share/interface/Quotation'
import DateView from '../../../atoms/date/DateView'
import { EditIcon } from '../../../atoms/icons'
import Tag from '../../../atoms/tag'
import { ButtonIconOnly } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
interface QuotationProps {
    id?: string
    data: Quotation
    openModalDetail: (data: Quotation) => void
    onHandleQuoted: (id?: string) => void
}

const assets = {
    insertTime: 'Thời gian',
    tel: 'Số điện thoại',
    email: 'Email',
    content: 'Nội dung'
}

const QuotationCard = ({ id, data, onHandleQuoted, openModalDetail }: QuotationProps): JSX.Element => {
    const componentValue = {
        insertTime: <DateView format={'DD/MM/YYYY hh:mma'} time={data?.insertTime} />,
        tel: data?.tel,
        email: data.email,
        content: <span onClick={(): void => openModalDetail(data)}>{data.content}</span>
    }

    return (
        <Card
            id={id}
            header={
                <Fragment>
                    <span>{data.name}</span>
                    {data.status === 1 ? (
                        <Tag
                            onClick={(): void => onHandleQuoted(data?.id)}
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
                    )}
                </Fragment>
            }>
            {Object.keys(assets).map((key, index) => {
                return (
                    <div key={index} className='input-item'>
                        <label className={`label-item ${key}`}>{assets[key]}</label>
                        {componentValue[key]}
                    </div>
                )
            })}
        </Card>
    )
}

export default QuotationCard
