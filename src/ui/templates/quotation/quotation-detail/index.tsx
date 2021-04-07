import React from 'react'
import { Quotation } from '../../../../share/interface/Quotation'
import DateView from '../../../atoms/date/DateView'
import { EditIcon } from '../../../atoms/icons'
import Tag from '../../../atoms/tag'
import { ButtonIconOnly } from '../../../molecules/buttons'
import './style/index.scss'

interface Props {
    data: Quotation
    onHandleQuoted: (id?: string | undefined) => void
}

const infoQuotation = {
    name: 'Họ tên',
    tel: 'Số điện thoại',
    email: 'Email',
    insertTime: 'Thời gian',
    status: 'Trạng thái',
    content: 'Nội dung'
}

const QuotationDetailTemplate = ({ data, onHandleQuoted }: Props): JSX.Element => {
    const componentValue = {
        name: data?.name,
        tel: data?.tel,
        email: <a href={`mailto:${data?.email}`}>{data?.email}</a>,
        title: data?.content,
        insertTime: <DateView time={data.insertTime} format={'DD/MM/YYYY hh:mma'} />,
        status:
            data.status === 1 ? (
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
            ),
        content: <span className='card-item-content'>{data?.content}</span>
    }

    return (
        <div id='quotation-detail'>
            <div className='info'>
                {Object.keys(infoQuotation).map((key, index) => {
                    return (
                        <div key={index} className='input-item'>
                            <label className={`label-item ${key}`}>{infoQuotation[key]}</label>
                            {componentValue[key]}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default QuotationDetailTemplate
