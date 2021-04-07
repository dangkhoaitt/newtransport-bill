import React, { useCallback, useEffect, useRef } from 'react'
import { PROGRESS_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Progress } from '../../../../share/interface/Progress'
import { Unknown } from '../../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { PROGRESS_UPDATE } from '../../../../store/actions/progress.action'
import ProgressForm from '../progress-form/ProgressForm'

interface ModalEdit {
    data: Progress
}
export default function ModalProgressEdit({ data }: ModalEdit): JSX.Element {
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
            url: PROGRESS_URL + '/' + data.id,
            params: formValues,
            actionType: PROGRESS_UPDATE
        })
    }, [])

    return <ProgressForm ref={buttonRef} progress={data} onFieldChange={onFieldChange} onFinish={onFinish} />
}
