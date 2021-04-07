import React from 'react'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { PROVINCE_DELETE } from '../../../../store/actions/province.action'
import CardHeader from '../../../molecules/bill-info/CardHeader'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalProvinceEdit from '../modal-province/ModalProvinceEdit'

interface ProvinceProps {
    data: Province
}

const assets = {
    code: 'Mã tỉnh thành',
    district: 'Quận/Huyện',
    unit: 'Đơn vị'
}

const ProvinceCard = ({ data }: ProvinceProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const componentValue = {
        code: <span className='card-item-province'>{data?.code}</span>,
        district: (
            <div className='district-item-mobile'>
                {data.district?.map((item, index) => (
                    <label key={index}>{item.name}</label>
                ))}
            </div>
        ),
        unit: <span>{data.unit?.name}</span>
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-province',
            title: 'Sửa ',
            content: <ModalProvinceEdit data={data} />
        })
    }
    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: PROVINCE_URL + '/' + id,
            params: { id },
            actionType: PROVINCE_DELETE
        })
    }

    return (
        <Card
            header={
                <CardHeader
                    title={data.name}
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

export default ProvinceCard
