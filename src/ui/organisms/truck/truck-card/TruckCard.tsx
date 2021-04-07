import React from 'react'
import { TRUCK_URL } from '../../../../share/common/api-constants'
import DateView from '../../../atoms/date/DateView'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Truck } from '../../../../share/interface/Truck'
import { TRUCK_DELETE } from '../../../../store/actions/truck.action'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalTruckEdit from '../modal-edit/ModalTruckEdit'
import CardHeader from '../../../molecules/bill-info/CardHeader'
interface TruckProps {
    data: Truck
}

const assets = {
    name: 'Tên loại xe',
    weight: 'Trọng lượng',
    order: 'Số thứ tự',
    insertTime: 'Ngày tạo'
}

const TruckCard = ({ data }: TruckProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: TRUCK_URL + '/' + id,
            params: { id },
            actionType: TRUCK_DELETE
        })
    }

    const componentValue = {
        name: <span className='card-item-address'>{data?.name}</span>,
        weight: <span className='card-item-address'>{data?.weight}</span>,
        order: <span className='card-item-address'>{data?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={data.insertTime}></DateView>
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-truck',
            title: 'Sửa ',
            content: <ModalTruckEdit data={data} />
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

export default TruckCard
