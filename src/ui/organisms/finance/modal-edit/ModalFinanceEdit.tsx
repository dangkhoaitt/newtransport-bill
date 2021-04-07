import React, { useCallback, useEffect, useRef } from 'react'
import { FINANCE_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Finance } from '../../../../share/interface/Finance'
import { Unknown } from '../../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { FINANCE_UPDATE } from '../../../../store/actions/finance.action'
import FinanceForm from '../finance-form/FinanceForm'

interface ModalEdit {
    data: Finance
}
export default function ModalFinanceEdit({ data }: ModalEdit): JSX.Element {
    const submitRequest = useSubmitRequest()
    const formValues = useRef<Unknown>({}).current
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (buttonRef.current) buttonRef.current.setAttribute('disabled', 'true')
    }, [])

    function onFieldChange(name: string, value: unknown): void {
        if (value !== data[name] && value !== '') {
            formValues[name] = value
        } else {
            delete formValues[name]
        }

        isObjectEmpty(formValues)
            ? buttonRef.current?.setAttribute('disabled', 'true')
            : buttonRef.current?.removeAttribute('disabled')
    }

    const onFinish = useCallback(() => {
        submitRequest({
            method: HttpMethod.PATCH,
            url: FINANCE_URL + '/' + data.id,
            params: formValues,
            actionType: FINANCE_UPDATE
        })
    }, [])

    return <FinanceForm ref={buttonRef} finance={data} onFieldChange={onFieldChange} onFinish={onFinish} />
}
