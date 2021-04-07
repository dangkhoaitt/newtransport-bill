import React from 'react'
import { useDispatch } from 'react-redux'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { contentNotification, HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { PROVINCE_UPDATE } from '../../../../store/actions/province.action'
import { useModal } from '../../../molecules/modal'
import ProvinceForm from '../province-form/ProvinceForm'

interface ModalEdit {
    data: Province
}
export default function ModalProvinceEdit({ data }: ModalEdit): JSX.Element {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const submit = (province: Province): void => {
        const provinceChange = {}
        Object.keys(province).forEach((key) => {
            if (province[key] !== data[key] || key === 'district') provinceChange[key] = province[key]
        })

        submitRequest({
            url: PROVINCE_URL + '/' + data.id,
            method: HttpMethod.PATCH,
            params: provinceChange,
            actionType: PROVINCE_UPDATE,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch({ type: PROVINCE_UPDATE, payload: ajaxResponse })
                closeModal()
            }
        })
    }

    return <ProvinceForm submit={submit} province={data} />
}
