import React from 'react'
import { FINANCE_URL } from '../../../../share/common/api-constants'
import DateView from '../../../atoms/date/DateView'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Finance } from '../../../../share/interface/Finance'
import { FINANCE_DELETE } from '../../../../store/actions/finance.action'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalFinanceEdit from '../modal-edit/ModalFinanceEdit'
import CardHeader from '../../../molecules/bill-info/CardHeader'
interface FinanceProps {
    data: Finance
}

const assets = {
    name: 'Tên trạng thái',
    order: 'Số thứ tự',
    insertTime: 'Ngày tạo'
}

const FinanceCard = ({ data }: FinanceProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: FINANCE_URL + '/' + id,
            actionType: FINANCE_DELETE
        })
    }
    const componentValue = {
        name: <span className='card-item-finance'>{data?.name}</span>,
        description: <span className='card-item-finance item-description'>{data?.description}</span>,
        order: <span className='card-item-address'>{data?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={data.insertTime}></DateView>
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-finance',
            title: 'Sửa ',
            content: <ModalFinanceEdit data={data} />
        })
    }
    return (
        <Card
            header={
                <CardHeader
                    title={data.code}
                    onOpenEdit={onOpenEdit}
                    onClickDelete={(): void => onClickDelete(data.id)}
                />
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

export default FinanceCard
