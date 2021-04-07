import React, { Fragment, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { MenuPaths } from '../../../../share/common/app-constants'
import { Customer } from '../../../../share/interface/Customer'
import { updateURLSearch } from '../../../../share/utils/app-util'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import { convertCharactor } from '../../../../share/utils/string-util'
import { CustomerSearchParams } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import { useModal } from '../../../molecules/modal'
import { ModalProps } from '../../../molecules/modal/type'
import Pagination from '../../../molecules/pagination'
import CustomerList from '../../../organisms/customer/customer-list'
import SearchCustomerOptions from '../../../organisms/customer/customer-search'
import ModalCustomerCreate from '../../../organisms/customer/modal-create'
import './style/index.scss'
interface CustomerListTemplateProps {
    customerList: Customer[]
    querySearch?: string
}

const CustomerListTemplate = ({ customerList, querySearch }: CustomerListTemplateProps): JSX.Element => {
    const history = useHistory()
    const search: CustomerSearchParams = {}
    const params = new URLSearchParams(window.location.search)
    params.forEach((value, key) => (search[key] = value))
    const { openModal } = useModal()

    function getListByPage(): Customer[] {
        return getListCustomerBySearch(customerList, search).slice((defaultCurrent() - 1) * 10, 10 * defaultCurrent())
    }

    const onPageChange = (page: number): void => {
        updateURLSearch(history, MenuPaths.customer, `page=${page}`)
        search.page = page
    }

    function defaultCurrent(): number {
        const pageNumber = new URLSearchParams(window.location.search).get('page')
        if (isNullOrUndefined(pageNumber)) return 1
        return Number(pageNumber)
    }

    const modalCreateCustomer: ModalProps = {
        className: 'customer-add',
        title: 'Thêm khách hàng mới',
        content: <ModalCustomerCreate />
    }
    function openCreateCustomer(): void {
        openModal(modalCreateCustomer)
    }
    const totalRecords = getListCustomerBySearch(customerList, search).length
    return (
        <Fragment>
            <div id='customer'>
                <ButtonPrimary onClick={openCreateCustomer}>Thêm khách hàng</ButtonPrimary>
                <SearchCustomerOptions querySearch={querySearch} />
                <CustomerList customerList={getListByPage()} />
                {totalRecords === 0 ? (
                    <div className='empty-table-data'>Không có khách hàng nào</div>
                ) : (
                    <Pagination
                        showPrevNextJumpers={true}
                        defaultPageSize={10}
                        total={totalRecords}
                        onChange={onPageChange}
                        current={defaultCurrent()}
                        showTotal={(total: number, range: [number, number]): ReactNode => (
                            <div>{`${range[0]}-${range[1]}/${total} Khách hàng`}</div>
                        )}></Pagination>
                )}
            </div>
        </Fragment>
    )
}

export default CustomerListTemplate

export function getListCustomerBySearch(customerList: Customer[], search: CustomerSearchParams): Customer[] {
    const check = (a: string, b: string): boolean => {
        return convertCharactor(a).includes(convertCharactor(b))
    }

    const list = customerList.filter((i) => {
        const code = search.code ? i.code && check(i.code, search.code) : true
        const name = search.name ? i.name && check(i.name, search.name) : true
        const tel = search.tel ? i.tel && check(i.tel, search.tel) : true
        const inserName = search.insertName ? i.insertBy?.name && check(i.insertBy.name, search.insertName) : true
        const pv = search.province ? i.province?.code && i.province?.code === Number(search.province) : true

        return code && inserName && name && pv && tel
    })
    return list
}
