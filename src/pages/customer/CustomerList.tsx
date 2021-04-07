import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CUSTOMER_URL } from '../../share/common/api-constants'
import { MenuPaths } from '../../share/common/app-constants'
import { useGetRequest } from '../../share/hooks'
import { Customer } from '../../share/interface/Customer'
import { updateURLSearch } from '../../share/utils/app-util'
import { FETCH_CUSTOMER_RESOURCES, SAVE_CUSTOMER_QUERY_SEARCH } from '../../store/actions/customer.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import CustomerListTemplate from '../../ui/templates/customer/customer-list'

const CustomerListPage = (): JSX.Element => {
    const history = useHistory()
    const dispatch = useDispatch()
    const customerList = useSelector<AppState, Customer[] | undefined>((state) => state.customer.list)
    const storeQuerySearch = useSelector<AppState, string | undefined>((state) => state.customer.querySearch)
    const querySearchCurrent = location.search || storeQuerySearch || ''

    useGetRequest({ url: CUSTOMER_URL, ignore: !!customerList, actionType: FETCH_CUSTOMER_RESOURCES })
    useEffect(() => {
        history.action === 'PUSH' && customerList && updateURLSearch(history, MenuPaths.customer, querySearchCurrent)
    }, [])

    useEffect(() => {
        customerList && dispatch({ type: SAVE_CUSTOMER_QUERY_SEARCH })
    }, [window.location.search])

    if (customerList) return <CustomerListTemplate customerList={customerList} querySearch={querySearchCurrent} />
    return <Spinner />
}

export default CustomerListPage
