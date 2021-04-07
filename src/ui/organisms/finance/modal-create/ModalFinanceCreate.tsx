import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FINANCE_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Finance } from '../../../../share/interface/Finance'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { FINANCE_CREATE } from '../../../../store/actions/finance.action'
import { useModal } from '../../../molecules/modal'
import FinanceForm from '../finance-form/FinanceForm'

export default function ModalFinanceCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const onFinish = useCallback((finance: Finance) => {
        submitRequest({
            url: FINANCE_URL,
            params: finance,
            actionType: FINANCE_CREATE,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: FINANCE_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }, [])

    return <FinanceForm onFinish={onFinish} />
}
