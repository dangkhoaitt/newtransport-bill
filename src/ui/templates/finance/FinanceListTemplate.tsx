import React from 'react'
import { Finance } from '../../../share/interface/Finance'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import FinanceList from '../../organisms/finance/finance-list/FinanceList'
import ModalFinanceCreate from '../../organisms/finance/modal-create/ModalFinanceCreate'
import './../../../share/style/setting-bill.scss'

interface Props {
    data: Finance[]
}

const FinanceListTemplate = ({ data }: Props): JSX.Element => {
    const { openModal } = useModal()

    const modal: ModalProps = {
        className: 'modal-create-finance',
        title: 'Thêm thông tin kế toán',
        content: <ModalFinanceCreate />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }

    return (
        <div id='finance-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <FinanceList data={data} />
        </div>
    )
}
export default FinanceListTemplate
