import React from 'react'
import { Progress } from '../../../share/interface/Progress'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import ModalProgressCreate from '../../organisms/progress/modal-create/ModalProgressCreate'
import ProgressList from '../../organisms/progress/progress-list/ProgressList'
import './../../../share/style/setting-bill.scss'

interface Props {
    data: Progress[]
}

const ProgressListTemplate = ({ data }: Props): JSX.Element => {
    const { openModal } = useModal()

    const modal: ModalProps = {
        className: 'modal-create-progress',
        title: 'Thêm loại hành trình',
        content: <ModalProgressCreate />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }

    return (
        <div id='progress-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <ProgressList data={data} />
        </div>
    )
}
export default ProgressListTemplate
