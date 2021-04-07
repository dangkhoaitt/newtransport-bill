import React from 'react'
import { useSelector } from 'react-redux'
import { SERVICE_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useGetRequest } from '../../share/hooks'
import { Service } from '../../share/interface/Service'
import { FETCH_SERVICES } from '../../store/actions/service.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import ServiceListTeamplate from '../../ui/templates/service/ServiceListTemplate'

const ServiceList = (): JSX.Element => {
    const serviceList = useSelector<AppState, Service[] | undefined>((state) => state.service.list)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.service.totalRecords)

    useGetRequest({ url: SERVICE_URL + location.search, ignore: !!serviceList, actionType: FETCH_SERVICES })

    if (serviceList) return <ServiceListTeamplate serviceList={serviceList} totalRecords={totalRecords} />
    return <Spinner />
}

export default withErrorBoundary(ServiceList)
