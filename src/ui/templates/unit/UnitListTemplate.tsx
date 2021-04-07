import React from 'react'
import { Unit } from '../../../share/interface/Unit'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import ModalUnitCreate from '../../organisms/unit/modal-create/ModalUnitCreate'
import UnitList from '../../organisms/unit/unit-list/UnitList'
import './../../../share/style/setting-bill.scss'

interface Props {
    unitList: Unit[]
}

const UnitListTemplate = ({ unitList }: Props): JSX.Element => {
    const { openModal } = useModal()

    const modal: ModalProps = {
        className: 'modal-create-unit',
        title: 'Thêm đơn vị',
        content: <ModalUnitCreate order={unitList.length + 1} />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }
    return (
        <div id='unit-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <UnitList unitList={unitList} />
        </div>
    )
}
export default UnitListTemplate
