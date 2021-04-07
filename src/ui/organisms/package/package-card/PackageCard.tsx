import React from 'react'
import { PACKAGE_URL } from '../../../../share/common/api-constants'
import DateView from '../../../atoms/date/DateView'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Package } from '../../../../share/interface/Package'
import { PACKAGE_DELETE } from '../../../../store/actions/package.action'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import ModalPackageEdit from '../modal-edit/ModalPackageEdit'
import CardHeader from '../../../molecules/bill-info/CardHeader'
interface PackageProps {
    data: Package
}

const assets = {
    name: 'Tên trạng thái',
    order: 'Số thứ tự',
    insertTime: 'Ngày tạo'
}

const PackageCard = ({ data }: PackageProps): JSX.Element => {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: PACKAGE_URL + '/' + id,
            params: { id },
            actionType: PACKAGE_DELETE
        })
    }

    const componentValue = {
        name: <span className='card-item-package'>{data?.name}</span>,
        order: <span className='card-item-address'>{data?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={data.insertTime}></DateView>
    }

    const onOpenEdit = (): void => {
        openModal({
            className: 'modal-create-package',
            title: 'Sửa ',
            content: <ModalPackageEdit data={data} />
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

export default PackageCard
