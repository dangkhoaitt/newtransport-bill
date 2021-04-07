import React from 'react'
import { UNIT_URL } from '../../../../share/common/api-constants'
import DateView from '../../../atoms/date/DateView'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Unit } from '../../../../share/interface/Unit'
import { UNIT_DELETE } from '../../../../store/actions/unit.action'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalUnitEdit from '../modal-edit/ModalUnitEdit'
import CardHeader from '../../../molecules/bill-info/CardHeader'
interface UnitProps {
    unit: Unit
}

const assets = {
    name: 'Tên loại xe',
    order: 'Số thứ tự',
    insertTime: 'Ngày tạo'
}

const UnitCard = ({ unit }: UnitProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: UNIT_URL + '/' + id,
            params: { id },
            actionType: UNIT_DELETE
        })
    }

    const componentValue = {
        name: <span className='card-item-address'>{unit?.name}</span>,
        order: <span className='card-item-address'>{unit?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={unit.insertTime}></DateView>
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-unit',
            title: 'Sửa ',
            content: <ModalUnitEdit data={unit} />
        })
    }

    return (
        <Card
            header={
                <CardHeader
                    title={unit.code}
                    onOpenEdit={onOpenEdit}
                    onClickDelete={(): void => onClickDelete(unit.id)}
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

export default UnitCard
