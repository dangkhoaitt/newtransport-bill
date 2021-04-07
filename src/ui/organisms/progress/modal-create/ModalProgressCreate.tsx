import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { PROGRESS_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Progress } from '../../../../share/interface/Progress'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { PROGRESS_CREATE } from '../../../../store/actions/progress.action'
import { useModal } from '../../../molecules/modal'
import ProgressForm from '../progress-form/ProgressForm'

export default function ModalProgressCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const onFinish = useCallback((progress: Progress) => {
        submitRequest({
            url: PROGRESS_URL,
            params: progress,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: PROGRESS_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }, [])

    return <ProgressForm onFinish={onFinish} />
}
