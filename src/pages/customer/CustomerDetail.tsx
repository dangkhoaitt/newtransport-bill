import React, { useState } from 'react'
import { CUSTOMER_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Customer } from '../../share/interface/Customer'
import { Spinner } from '../../ui/molecules/loading'
import CustomerDetailTemplate from '../../ui/templates/customer/customer-detail'

const CustomerDetailPage = (): JSX.Element => {
    const [customer, setCustomer] = useState<Customer>()

    useGetRequest({
        url: CUSTOMER_URL + '/' + location.href.split('/').pop(),
        ignore: !!customer,
        callback: (response) => {
            setCustomer(response.data)
        }
    })

    if (customer) return <CustomerDetailTemplate detail={customer} />
    return <Spinner />
}

export default CustomerDetailPage
