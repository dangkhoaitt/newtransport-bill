import React, { Fragment, useState } from 'react'
import { BILL_URL, CUSTOMER_URL } from '../../../../share/common/api-constants'
import { DeleteButtonWrapper, EditButtonWrapper } from '../../../../share/hoc/AddButtonWrapper'
import { HttpMethod, useGetRequest, useSubmitRequest } from '../../../../share/hooks'
import { Customer } from '../../../../share/interface/Customer'
import { DELETE_CUSTOMER_ACTION } from '../../../../store/actions/customer.action'
import { ButtonDanger, ButtonPrimary } from '../../../molecules/buttons'
import { Spinner } from '../../../molecules/loading'
import { useModal } from '../../../molecules/modal'
import { ModalProps } from '../../../molecules/modal/type'
import CustomerBill, { CustomerBillState } from '../../../organisms/customer/customer-bill'
import CustomerDetail from '../../../organisms/customer/customer-detail'
import ModalCustomerEdit from '../../../organisms/customer/modal-edit'
import './style/index.scss'

interface CustomerDetailTemplateProps {
    detail: Customer
}

const CustomerDetailTemplate = ({ detail }: CustomerDetailTemplateProps): JSX.Element => {
    const [customer, setCustomer] = useState<Customer>(detail)
    const [customerBill, setCustomerBill] = useState<CustomerBillState>()
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()

    const modalEdit: ModalProps = {
        className: 'modal-edit-customer',
        title: 'Chỉnh sửa',
        content: <ModalCustomerEdit detail={customer} setCustomer={setCustomer} />
    }

    const onOpenEdit = (): void => {
        openModal(modalEdit)
    }

    const deleteCustomer = (): void => {
        submitRequest({
            url: CUSTOMER_URL + `/${window.location.pathname.split('/').pop()}`,
            method: HttpMethod.DELETE,
            actionType: DELETE_CUSTOMER_ACTION
        })
    }

    useGetRequest({
        url: BILL_URL + `?customerCode=${customer.code}`,
        ignore: !!customerBill,
        callback: (response) => setCustomerBill({ bill: response.data, totalRecords: response.totalRecords })
    })

    if (!customerBill) return <Spinner />
    return (
        <div className='customer-detail'>
            <div className='button-delete-customer'>
                <Fragment>
                    <EditButtonWrapper unit={customer.unit?.code || null}>
                        <ButtonPrimary onClick={onOpenEdit}>Chỉnh sửa</ButtonPrimary>
                    </EditButtonWrapper>
                    <DeleteButtonWrapper unit={customer.unit?.code || null}>
                        <ButtonDanger disabled={!!customerBill.totalRecords} onClick={deleteCustomer}>
                            Xóa
                        </ButtonDanger>
                    </DeleteButtonWrapper>
                </Fragment>
            </div>
            <CustomerDetail detail={customer} />
            <CustomerBill code={customer.code as string} customerBill={customerBill} />
        </div>
    )
}

export default CustomerDetailTemplate
