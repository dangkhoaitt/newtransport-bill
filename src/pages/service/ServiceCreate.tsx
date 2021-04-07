import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PROVINCE_URL, SERVICE_URL, TRUCK_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { contentNotification, HttpMethod, useMultiGetRequest, useSubmitRequest } from '../../share/hooks'
import { Province } from '../../share/interface/Province'
import { Service } from '../../share/interface/Service'
import { isObjectEmpty } from '../../share/utils/empty-util'
import { EMPTY_SERVICE, REMOVE_DISTANCE, getServiceType } from '../../share/utils/service-util'
import { redirectDetailAction, SHOW_NOTIFICATION } from '../../store/actions/app.action'
import { SAVE_PROVINCE_LIST, SAVE_TRUCK_LIST } from '../../store/actions/service.action'
import { AppState } from '../../store/types'
import ServiceFormTemplate from '../../ui/templates/service/ServiceFormTemplate'

const ServiceCreate = (): JSX.Element => {
    const [service, setService] = useState<Service>(JSON.parse(JSON.stringify(EMPTY_SERVICE)))
    const provinceDropdown = useSelector<AppState, Province[] | undefined>((state) => state.service?.provinceList)
    const dispatch = useDispatch()
    const submitRequest = useSubmitRequest()

    useMultiGetRequest({
        urls: [PROVINCE_URL, TRUCK_URL],
        ignore: !isObjectEmpty(provinceDropdown),
        callback: (responses) => {
            responses.forEach((res) => {
                if (res.request.url?.includes('province')) dispatch({ type: SAVE_PROVINCE_LIST, payload: res.response })
                else dispatch({ type: SAVE_TRUCK_LIST, payload: res.response })
            })
        }
    })
    const onFinish = (): void => {
        const serviceType = getServiceType(service)
        const submitService = {
            ...service,
            distanceArr: [...service[serviceType]],
            ...REMOVE_DISTANCE
        }
        submitService.distanceArr = submitService.distanceArr?.map(({ positionFrom, positionTo, priceArr }) => {
            return { positionFrom: parseInt(positionFrom), positionTo: parseInt(positionTo), priceArr }
        })
        submitRequest({
            url: SERVICE_URL,
            params: submitService,
            method: HttpMethod.POST,
            callback: (ajaxResponse) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch(redirectDetailAction(ajaxResponse.response.data.id))
            }
        })
    }

    const changePosition = (name: string, value: unknown, positionName?: string): void => {
        const serviceType = getServiceType(service)
        const row = parseInt(name.split('.')[1])
        const fromOrTo = name.split('.')[0]
        service[serviceType].splice(row, 1, {
            ...service[serviceType][row],
            [fromOrTo]: value,
            [`${fromOrTo}Name`]: positionName
        })
        setService({ ...service })
    }

    const changePrice = (name: string, value: unknown): void => {
        const serviceType = getServiceType(service)
        const row = parseInt(name.split('.')[1])
        const column = parseInt(name.split('.')[2])
        service[serviceType][row].priceArr[column].price = value
        setService({ ...service })
    }

    const changePriceType = (name: string, value: unknown): void => {
        const serviceType = getServiceType(service)
        const column = parseInt(name.split('.')[1])
        service[serviceType].forEach((d) => {
            d.priceArr[column].priceType = value
        })
        setService({ ...service })
    }

    const changeWeightOrTruck = (name: string, value: unknown): void => {
        const serviceType = getServiceType(service)
        const item = name.split('.')[0]
        const column = name.split('.')[1]
        service[serviceType].forEach((d) => {
            d.priceArr[column][item] = value
        })
        setService({ ...service })
    }

    const onFieldChange = (name: string, value: unknown, positionName?: string): void => {
        const fieldChange = name.split('.')[0]
        switch (fieldChange) {
            case 'fixPrice':
                setService({ ...service, fix: [{ priceArr: [{ price: value as number }] }] })
                break
            case 'isExtra':
                setService({ ...service, isExtra: value == 1 ? false : true })
                break
            case 'isFix':
                setService({ ...service, isFix: value == 1 ? true : false })
                break
            case 'isDistance':
            case 'weightUnit':
            case 'order':
            case 'code':
            case 'name':
                setService({ ...service, [name]: value })
                break
            case 'isWeight':
                setService({
                    ...service,
                    isWeight: value as boolean,
                    isTruck: value ? (!value as boolean) : service?.isTruck,
                    weightUnit: value ? service.weightUnit : undefined
                })
                break
            case 'isTruck':
                setService({
                    ...service,
                    isTruck: value as boolean,
                    isWeight: value ? (!value as boolean) : service?.isWeight
                })
                break
            case 'positionFrom':
            case 'positionTo':
                changePosition(name, value, positionName)
                break
            case 'price':
                changePrice(name, value)
                break
            case 'priceType':
                changePriceType(name, value)
                break
            case 'weightTo':
            case 'truckCode':
                changeWeightOrTruck(name, value)
                break
            default:
                break
        }
    }

    const addRow = (): void => {
        const serviceType = getServiceType(service)
        const distance = JSON.parse(JSON.stringify(service[serviceType][0]))
        distance.positionFrom = ''
        distance.positionTo = ''
        distance.priceArr.forEach((p) => (p.price = 0))
        service[serviceType].push(distance)
        setService({ ...service })
    }

    const deleteRow = (index: number): void => {
        const serviceType = getServiceType(service)
        if (service[serviceType].length > 1) {
            service[serviceType].splice(index, 1)
            setService({ ...service })
        }
    }

    const addColumn = (): void => {
        const serviceType = getServiceType(service)
        const item = service.isWeight ? 'weightTo' : 'truckCode'
        service[serviceType].forEach((service) => {
            service.priceArr?.push({ [item]: null, price: 0, priceType: item === 'weightTo' ? 1 : undefined })
        })
        setService({ ...service })
    }

    const deleteColumn = (index: number | string): void => {
        const serviceType = getServiceType(service)
        service[serviceType].forEach((d) => {
            d.priceArr.splice(index, 1)
        })
        setService({ ...service })
    }

    return (
        <ServiceFormTemplate
            onFinish={onFinish}
            onFieldChange={onFieldChange}
            addRow={addRow}
            deleteRow={deleteRow}
            addColumn={addColumn}
            deleteColumn={deleteColumn}
            service={service}
            isEdit={false}
        />
    )
}

export default withErrorBoundary(ServiceCreate)
