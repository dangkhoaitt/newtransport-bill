import React from 'react'
import { CUSTOMER_URL } from '../../../../share/common/api-constants'
import { useSubmitRequest } from '../../../../share/hooks'
import { Customer } from '../../../../share/interface/Customer'
import { CREATE_CUSTOMER_ACTION } from '../../../../store/actions/customer.action'
import CustomerForm from '../customer-form'

export default function ModalCustomerCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()

    const onFinish = (values: Customer): void => {
        submitRequest({ url: CUSTOMER_URL, params: values, actionType: CREATE_CUSTOMER_ACTION })
    }

    return <CustomerForm onFinish={onFinish} />
}
