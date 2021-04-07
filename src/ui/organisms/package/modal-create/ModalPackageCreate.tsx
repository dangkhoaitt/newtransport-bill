import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { PACKAGE_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Package } from '../../../../share/interface/Package'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { PACKAGE_CREATE } from '../../../../store/actions/package.action'
import { useModal } from '../../../molecules/modal'
import PackageForm from '../package-form/PackageForm'

export default function ModalPackageCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const onFinish = useCallback((values: Package) => {
        submitRequest({
            url: PACKAGE_URL,
            params: values,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: PACKAGE_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }, [])

    return <PackageForm onFinish={onFinish} />
}
