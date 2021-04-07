import React, { useCallback, useEffect, useRef } from 'react'
import { UNIT_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Unit } from '../../../../share/interface/Unit'
import { Unknown } from '../../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { UNIT_UPDATE } from '../../../../store/actions/unit.action'
import UnitForm from '../unit-form/UnitForm'

interface ModalEdit {
    data: Unit
    order?: number
}
export default function ModalUnitEdit({ data, order }: ModalEdit): JSX.Element {
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
            url: UNIT_URL + '/' + data.id,
            params: formValues,
            actionType: UNIT_UPDATE
        })
    }, [])

    return <UnitForm ref={buttonRef} unit={data} onFieldChange={onFieldChange} onFinish={onFinish} order={order} />
}
