import React, { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'redux'
import { BILL_EXPORT_URL, BILL_URL } from '../../../../share/common/api-constants'
import { DATE_TIME_AM_FORMAT, MenuPaths, Roles } from '../../../../share/common/app-constants'
import { HttpMethod, useGetRequest, useSearchRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { User } from '../../../../share/interface/User'
import { buildQuerySearchFromObject, updateURLSearch } from '../../../../share/utils/app-util'
import { ACCESS_TOKEN, getCookies } from '../../../../share/utils/cookie-util'
import { formatDateFormTime } from '../../../../share/utils/date-util'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { DO_SEARCH_BILL, FETCH_BILL_RESOURCES } from '../../../../store/actions/bill.action'
import { AppState, BillSearchParams } from '../../../../store/types'
import { Spinner } from '../../../molecules/loading'
import Pagination from '../../../molecules/pagination'
import BillList from '../../../organisms/bill/bill-list'
import BillSearch from '../../../organisms/bill/bill-search'
import './style/index.scss'

const BillListTeamplate = (): JSX.Element => {
    const history = useHistory()
    const billList = useSelector<AppState, Bill[] | undefined>((state) => state.bill.list)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.bill.totalRecords)
    const storeQuerySearch = useSelector<AppState, string | undefined>((state) => state.bill.querySearch)
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    let querySearchCurrent = location.search || storeQuerySearch || ''
    const searchRequest = useSearchRequest()

    if (!billList && userLogin?.role !== Roles.admin) querySearchCurrent = `?unit=${userLogin?.unit?.code}`

    useGetRequest({ url: BILL_URL + querySearchCurrent, ignore: !!billList, actionType: FETCH_BILL_RESOURCES })

    useEffect(() => {
        if (!billList && userLogin?.role !== Roles.admin) {
            updateURLSearch(history, MenuPaths.shipping_bill, querySearchCurrent || `?unit=${userLogin?.unit?.code}`)
        } else history.action === 'PUSH' && updateURLSearch(history, MenuPaths.shipping_bill, querySearchCurrent)
    }, [])

    function defaultCurrent(): number {
        const pageNumber = new URLSearchParams(querySearchCurrent || window.location.search).get('page')
        if (isNullOrUndefined(pageNumber)) return 1
        return Number(pageNumber)
    }

    function currentSearch(page: number): BillSearchParams {
        const searchParams: BillSearchParams = {}
        const params = new URLSearchParams(window.location.search)
        params.forEach((value, key) => (searchParams[key] = value))
        return Object.assign(searchParams, { page })
    }

    function onHandleChangePage(page: number): void {
        searchRequest({
            url: BILL_URL + '?' + buildQuerySearchFromObject(currentSearch(page)),
            actionType: DO_SEARCH_BILL
        })
        updateURLSearch(history, MenuPaths.shipping_bill, `page=${page}`)
    }

    if (!billList) return <Spinner />

    return (
        <div id='bill-list-all'>
            <BillSearch querySearch={querySearchCurrent} />
            <BillList data={billList} />
            {totalRecords === 0 ? (
                <div className='empty-table-data'>Không có vận đơn nào</div>
            ) : (
                <Pagination
                    showPrevNextJumpers={true}
                    defaultPageSize={10}
                    onChange={onHandleChangePage}
                    total={totalRecords}
                    current={defaultCurrent()}
                    showTotal={(total: number, range: [number, number]): ReactNode => (
                        <div>{`${range[0]}-${range[1]}/${total} Vận đơn`}</div>
                    )}
                />
            )}
        </div>
    )
}

export default BillListTeamplate

export function doExportBill(dispatch: Dispatch, querySearch?: string): void {
    const exportUrl = new URL(`${BILL_EXPORT_URL}${querySearch}`)

    fetch(exportUrl.href, {
        method: HttpMethod.GET,
        headers: new Headers({ Authorization: 'Bearer ' + getCookies(ACCESS_TOKEN) })
    })
        .then((res) => {
            if (res.status !== 200) throw new Error()
            return res.blob()
        })
        .then((blob) => {
            const a = document.createElement('a')
            a.href = window.URL.createObjectURL(blob)
            a.download = 'bill_' + formatDateFormTime(new Date().getTime(), DATE_TIME_AM_FORMAT) + '.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
            dispatch({
                type: SHOW_NOTIFICATION,
                payload: { status: 'success', title: 'Xuất file thành công!' }
            })
        })
        .catch(() => {
            dispatch({
                type: SHOW_NOTIFICATION,
                payload: { status: 'error', title: 'Xuất file thất bại, vui lòng thử lại sau!' }
            })
        })
}
