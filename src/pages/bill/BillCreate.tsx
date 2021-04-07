import React from 'react'
import { useSelector } from 'react-redux'
import {
    BILL_URL,
    FINANCE_URL,
    PACKAGE_URL,
    PROGRESS_URL,
    PROVINCE_URL,
    SERVICE_URL,
    TRUCK_URL
} from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useMultiGetRequest, useSubmitRequest } from '../../share/hooks'
import { Bill } from '../../share/interface/Bill'
import { isObjectEmpty } from '../../share/utils/empty-util'
import { CREATE_BILL_ACTION, FETCH_BILL_DROPDOWN } from '../../store/actions/bill.action'
import { AppState, BillValueDropdown } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import BillFormTeamplate from '../../ui/templates/bill/bill-form'

const BillCreate = (): JSX.Element => {
    const submitRequest = useSubmitRequest()
    const billDropdown = useSelector<AppState, BillValueDropdown | undefined>((state) => state.bill.billDropdown)

    const urls = [SERVICE_URL, PROGRESS_URL, PACKAGE_URL, FINANCE_URL, TRUCK_URL, PROVINCE_URL]

    useMultiGetRequest({ urls, ignore: !isObjectEmpty(billDropdown), actionType: FETCH_BILL_DROPDOWN })

    const onFinish = (newBill: Bill): void => {
        submitRequest({ url: BILL_URL, params: newBill, actionType: CREATE_BILL_ACTION })
    }

    if (!isObjectEmpty(billDropdown)) return <BillFormTeamplate onFinish={onFinish} />
    return <Spinner />
}

export default withErrorBoundary(BillCreate)
