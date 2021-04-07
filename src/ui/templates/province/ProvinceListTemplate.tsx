import React, { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { MenuPaths } from '../../../share/common/app-constants'
import { Province } from '../../../share/interface/Province'
import { Any } from '../../../share/interface/Unknown'
import { updateURLSearch } from '../../../share/utils/app-util'
import { isNullOrUndefined } from '../../../share/utils/empty-util'
import { ProvinceSearchParams } from '../../../store/types'
import { AddButtonWrapper } from '../../molecules/buttons'
import { useModal } from '../../molecules/modal'
import { ModalProps } from '../../molecules/modal/type'
import Pagination from '../../molecules/pagination'
import ModalProvinceCreate from '../../organisms/province/modal-province/ModalProvinceCreate'
import ProvinceList from '../../organisms/province/province-list/ProvinceList'
import ProvinceSearch from '../../organisms/province/province-list/ProvinceSearch'
import './../../../share/style/setting-bill.scss'

interface Props {
    data: Province[]
    totalRecords?: number
}

const ProvinceListTemplate = ({ data, totalRecords }: Props): JSX.Element => {
    const history = useHistory()
    const searchParams: ProvinceSearchParams = {}
    const params = new URLSearchParams(window.location.search)
    const { openModal } = useModal()

    params.forEach((value, key) => {
        searchParams[key] = value
    })

    function defaultCurrent(): number {
        const pageNumber = new URLSearchParams(window.location.search).get('page')
        if (isNullOrUndefined(pageNumber)) return 1
        return Number(pageNumber)
    }

    function paginate(array, page_size, page_number): Any {
        return array.slice((page_number - 1) * page_size, page_number * page_size)
    }

    const modal: ModalProps = {
        className: 'modal-create-province',
        title: 'Thêm tỉnh thành',
        content: <ModalProvinceCreate data={{}} />
    }

    const onOpenCreate = (): void => {
        openModal(modal)
    }

    return (
        <div id='province-list'>
            <div className='btn-add'>
                <AddButtonWrapper onClick={onOpenCreate}>Tạo mới</AddButtonWrapper>
            </div>
            <ProvinceSearch />
            <ProvinceList data={paginate(data, 10, searchParams.page ?? 1)} />
            <Pagination
                showPrevNextJumpers={true}
                defaultPageSize={10}
                total={totalRecords}
                onChange={(page): void => {
                    updateURLSearch(history, MenuPaths.province, `page=${page}`)
                    searchParams.page = page
                }}
                current={defaultCurrent()}
                showTotal={(total: number, range: [number, number]): ReactNode => (
                    <div>{range[1] === 0 ? 'Không có tỉnh nào' : `${range[0]}-${range[1]}/${total} tỉnh`}</div>
                )}></Pagination>
        </div>
    )
}
export default ProvinceListTemplate
