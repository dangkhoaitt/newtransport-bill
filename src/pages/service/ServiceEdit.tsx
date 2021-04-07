import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { PROVINCE_URL, SERVICE_URL, TRUCK_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { contentNotification, HttpMethod, useMultiGetRequest, useSubmitRequest } from '../../share/hooks'
import { Service } from '../../share/interface/Service'
import { isObjectEmpty } from '../../share/utils/empty-util'
import { EMPTY_DISTANCE_ARR, REMOVE_DISTANCE, getServiceType } from '../../share/utils/service-util'
import { redirectDetailAction, SHOW_NOTIFICATION } from '../../store/actions/app.action'
import { EDIT_SERVICE_ACTION, SAVE_PROVINCE_LIST, SAVE_TRUCK_LIST } from '../../store/actions/service.action'
import ServiceFormTemplate from '../../ui/templates/service/ServiceFormTemplate'

const ServiceEdit = (): JSX.Element => {
    const [serviceDetail, setServiceDetail] = useState<Service>({})
    const [service, setService] = useState<Service>({})
    const dispatch = useDispatch()
    const submitRequest = useSubmitRequest()

    useMultiGetRequest({
        urls: [SERVICE_URL + '/' + location.pathname.split('/').pop(), PROVINCE_URL, TRUCK_URL],
        ignore: !isObjectEmpty(serviceDetail),
        callback: (responses) => {
            responses.forEach((res) => {
                if (res.request.url?.includes('service')) {
                    const service = { ...res.response.data }
                    setServiceDetail(JSON.parse(JSON.stringify(res.response.data)))
                    const serviceType = getServiceType(service)
                    setService({
                        ...service,
                        EMPTY_DISTANCE_ARR,
                        [serviceType]: service.distanceArr,
                        distanceArr: undefined
                    })
                } else if (res.request.url?.includes('province'))
                    dispatch({ type: SAVE_PROVINCE_LIST, payload: res.response })
                else dispatch({ type: SAVE_TRUCK_LIST, payload: res.response })
            })
        }
    })

    const onFinish = (): void => {
        const serviceType = getServiceType(service)
        const submitService = { ...service, distanceArr: [...service[serviceType]], ...REMOVE_DISTANCE }
        for (const key in submitService) {
            if (JSON.stringify(submitService[key]) == JSON.stringify(serviceDetail[key])) delete submitService[key]
        }
        submitService.distanceArr = submitService.distanceArr?.map(({ positionFrom, positionTo, priceArr }) => {
            return { positionFrom: parseInt(positionFrom), positionTo: parseInt(positionTo), priceArr }
        })
        submitRequest({
            url: SERVICE_URL + `/${window.location.pathname.split('/').pop()}`,
            params: submitService,
            method: HttpMethod.PATCH,
            callback: (ajaxResponse) => {
                dispatch({ type: EDIT_SERVICE_ACTION, payload: undefined })
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(ajaxResponse.request.method ?? '', true)
                })
                dispatch(redirectDetailAction(`${window.location.pathname.split('/').pop()}`))
            }
        })
    }

    const changePosition = (name: string, value: unknown, positionName?: string): void => {
        const serviceType = getServiceType(service)
        const row = parseInt(name.split('.')[1])
        const fromOrTo = name.split('.')[0]
        if (service[serviceType][row][fromOrTo] != value) {
            service[serviceType].splice(row, 1, {
                ...service[serviceType][row],
                [fromOrTo]: value,
                [`${fromOrTo}Name`]: positionName
            })
            setService({ ...service })
        }
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
            case 'name':
            case 'order':
                setService({ ...service, [name]: value })
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
            service.priceArr?.push({ [item]: null, price: 0, priceType: 1 })
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
            isEdit={true}
        />
    )
}

export default withErrorBoundary(ServiceEdit)
