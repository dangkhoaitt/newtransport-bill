import React from 'react'
import { Truck } from '../../../share/interface/Truck'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import ModalTruckCreate from '../../organisms/truck/modal-create/ModalTruckCreate'
import TruckList from '../../organisms/truck/truck-list/TruckList'
import './../../../share/style/setting-bill.scss'

interface Props {
    data: Truck[]
}

const TruckListTemplate = ({ data }: Props): JSX.Element => {
    const { openModal } = useModal()
    const modal: ModalProps = {
        className: 'modal-create-truck',
        title: 'Thêm loại xe',
        content: <ModalTruckCreate />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }

    return (
        <div id='truck-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <TruckList data={data} />
        </div>
    )
}
export default TruckListTemplate
