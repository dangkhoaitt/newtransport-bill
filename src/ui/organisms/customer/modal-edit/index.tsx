import React, { memo, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { isNullOrUndefined } from 'util'
import { CUSTOMER_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Customer } from '../../../../share/interface/Customer'
import { isObjectEmpty, isStringEmpty } from '../../../../share/utils/empty-util'
import { UPDATE_CUSTOMER_ACTION } from '../../../../store/actions/customer.action'
import { useModal } from '../../../molecules/modal'
import CustomerForm from '../customer-form'

type Props = { detail: Customer; setCustomer: (value: Customer) => void }

const ModalCustomerEdit = memo(
    ({ detail, setCustomer }: Props): JSX.Element => {
        const { closeModal } = useModal()
        const dispatch = useDispatch()
        const submitRequest = useSubmitRequest()
        const formValues = useRef<Customer>({})
        const btnRef = useRef<HTMLButtonElement>(null)

        const onFinish = useCallback(() => {
            submitRequest({
                url: CUSTOMER_URL + `/${window.location.pathname.split('/').pop()}`,
                params: formValues.current,
                method: HttpMethod.PATCH,
                callback: (response) => {
                    dispatch({ type: UPDATE_CUSTOMER_ACTION, payload: response.response.data })
                    setCustomer(response.response.data)
                    closeModal()
                }
            })
        }, [])

        const onFieldChange = (name: string, value: unknown): void => {
            if (
                detail &&
                ((isNullOrUndefined(detail[name]) && isStringEmpty(value as string)) ||
                    (typeof detail[name] === 'object' && detail[name].code === value))
            ) {
                delete formValues.current[name]
            } else {
                if (typeof value === 'boolean') formValues.current[name] = value[name]
                else formValues.current[name] = value
            }

            if (isObjectEmpty(formValues.current)) {
                btnRef.current?.setAttribute('disabled', 'true')
            } else btnRef.current?.removeAttribute('disabled')
        }

        return <CustomerForm ref={btnRef} detail={detail} onFieldChange={onFieldChange} onFinish={onFinish} />
    }
)

export default ModalCustomerEdit
