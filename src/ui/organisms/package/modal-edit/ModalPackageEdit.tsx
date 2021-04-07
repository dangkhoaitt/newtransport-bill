import React, { useCallback, useEffect, useRef } from 'react'
import { PACKAGE_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Package } from '../../../../share/interface/Package'
import { Unknown } from '../../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { PACKAGE_UPDATE } from '../../../../store/actions/package.action'
import PackageForm from '../package-form/PackageForm'

interface ModalEdit {
    data: Package
}
export default function ModalPackageEdit({ data }: ModalEdit): JSX.Element {
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
            url: PACKAGE_URL + '/' + data.id,
            params: formValues,
            actionType: PACKAGE_UPDATE
        })
    }, [])

    return <PackageForm ref={buttonRef} data={data} onFieldChange={onFieldChange} onFinish={onFinish} />
}
