import React, { useState } from 'react'
import { SERVICE_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useGetRequest } from '../../share/hooks'
import { Service } from '../../share/interface/Service'
import { Spinner } from '../../ui/molecules/loading'
import ServiceDetailTemplate from '../../ui/templates/service/ServiceDetailTemplate'

const ServiceDetail = (): JSX.Element => {
    const [serviceDetail, setServiceDetail] = useState<Service>()

    useGetRequest({
        url: SERVICE_URL + '/' + location.pathname.split('/').pop(),
        ignore: !!serviceDetail,
        callback: (response) => {
            setServiceDetail(response.data)
        }
    })

    if (serviceDetail) {
        serviceDetail?.distanceArr?.forEach((p) => {
            p.priceArr?.forEach((w) => {
                p[`${w.weightTo}`] = w.price
            })
            p.priceArr
        })
        return <ServiceDetailTemplate service={serviceDetail} />
    }
    return <Spinner />
}

export default withErrorBoundary(ServiceDetail)
