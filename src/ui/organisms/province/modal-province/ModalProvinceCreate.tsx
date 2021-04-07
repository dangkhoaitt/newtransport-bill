import React from 'react'
import { useDispatch } from 'react-redux'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { contentNotification, useSubmitRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { PROVINCE_CREATE } from '../../../../store/actions/province.action'
import { useModal } from '../../../molecules/modal'
import ProvinceForm from '../province-form/ProvinceForm'

interface ModalCreate {
    data: Province
}
export default function ModalProvinceCreate({ data }: ModalCreate): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const submit = (data: Province): void => {
        submitRequest({
            url: PROVINCE_URL,
            params: data,
            actionType: PROVINCE_CREATE,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: PROVINCE_CREATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }

    return <ProvinceForm submit={submit} province={data} />
}
