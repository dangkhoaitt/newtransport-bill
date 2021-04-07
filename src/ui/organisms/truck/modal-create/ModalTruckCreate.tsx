import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { TRUCK_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Truck } from '../../../../share/interface/Truck'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { TRUCK_CREATE } from '../../../../store/actions/truck.action'
import { useModal } from '../../../molecules/modal'
import TruckForm from '../truck-form/TruckForm'

export default function ModalTruckCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const onFinish = useCallback((truck: Truck) => {
        submitRequest({
            url: TRUCK_URL,
            params: truck,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: TRUCK_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }, [])

    return <TruckForm onFinish={onFinish} />
}
