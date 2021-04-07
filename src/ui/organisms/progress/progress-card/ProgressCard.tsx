import React from 'react'
import { PROGRESS_URL } from '../../../../share/common/api-constants'
import DateView from '../../../atoms/date/DateView'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Progress } from '../../../../share/interface/Progress'
import { PROGRESS_DELETE } from '../../../../store/actions/progress.action'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalProgressEdit from '../modal-edit/ModalProgressEdit'
import CardHeader from '../../../molecules/bill-info/CardHeader'
interface ProgressProps {
    data: Progress
}

const assets = {
    name: 'Tên hành trình',
    order: 'Số thứ tự',
    insertTime: 'Ngày tạo'
}

const ProgressCard = ({ data }: ProgressProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const componentValue = {
        name: <span className='card-item-progress'>{data?.name}</span>,
        order: <span className='card-item-address'>{data?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={data.insertTime}></DateView>
    }

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: PROGRESS_URL + '/' + id,
            params: { id },
            actionType: PROGRESS_DELETE
        })
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-progress',
            title: 'Sửa ',
            content: <ModalProgressEdit data={data} />
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

export default ProgressCard
