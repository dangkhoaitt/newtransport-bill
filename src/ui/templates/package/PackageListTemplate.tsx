import React from 'react'
import { Package } from '../../../share/interface/Package'
import { PackageSearchParams } from '../../../store/types'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import ModalPackageCreate from '../../organisms/package/modal-create/ModalPackageCreate'
import PackageList from '../../organisms/package/package-list/PackageList'
import './../../../share/style/setting-bill.scss'

interface Props {
    data: Package[]
}

const PackageListTemplate = ({ data }: Props): JSX.Element => {
    const searchParams: PackageSearchParams = {}
    const params = new URLSearchParams(window.location.search)
    const { openModal } = useModal()

    params.forEach((value, key) => {
        searchParams[key] = value
    })

    const modal: ModalProps = {
        className: 'modal-create-package',
        title: 'Thêm kiện hàng',
        content: <ModalPackageCreate />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }

    return (
        <div id='package-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <PackageList data={data} />
        </div>
    )
}
export default PackageListTemplate
