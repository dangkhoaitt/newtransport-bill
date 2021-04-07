import React, { useCallback, useEffect, useRef } from 'react'
import { TRUCK_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Truck } from '../../../../share/interface/Truck'
import { Unknown } from '../../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { TRUCK_UPDATE } from '../../../../store/actions/truck.action'
import TruckForm from '../truck-form/TruckForm'

interface ModalEdit {
    data: Truck
}
export default function ModalTruckEdit({ data }: ModalEdit): JSX.Element {
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
            url: TRUCK_URL + '/' + data.id,
            params: formValues,
            actionType: TRUCK_UPDATE
        })
    }, [])

    return <TruckForm ref={buttonRef} truck={data} onFieldChange={onFieldChange} onFinish={onFinish} />
}
