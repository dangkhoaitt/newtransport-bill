import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { UNIT_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Unit } from '../../../../share/interface/Unit'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { UNIT_CREATE } from '../../../../store/actions/unit.action'
import { useModal } from '../../../molecules/modal'
import UnitForm from '../unit-form/UnitForm'
interface ModalCreate {
    order: number
}
export default function ModalUnitCreate({ order }: ModalCreate): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const onFinish = useCallback((unit: Unit) => {
        submitRequest({
            url: UNIT_URL,
            params: unit,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: UNIT_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }, [])

    return <UnitForm order={order} onFinish={onFinish} />
}
