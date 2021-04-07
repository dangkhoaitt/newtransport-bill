import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { QUOTATION_URL } from '../../../../share/common/api-constants'
import { MenuPaths } from '../../../../share/common/app-constants'
import { contentNotification, HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Quotation } from '../../../../share/interface/Quotation'
import '../../../../share/style/setting-bill.scss'
import { updateURLSearch } from '../../../../share/utils/app-util'
import { isNullOrUndefined, isObjectEmpty } from '../../../../share/utils/empty-util'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { QUOTATION_ACTION } from '../../../../store/actions/quotation.action'
import { QuotationSearchParams } from '../../../../store/types'
import Switch from '../../../atoms/switch'
import { useModal } from '../../../molecules/modal'
import Pagination from '../../../molecules/pagination'
import QuotationList from '../../../organisms/quotation/quotation-list'

interface Props {
    quotation: Quotation[]
}

const QuotationTemplate = ({ quotation }: Props): JSX.Element => {
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const { closeAllModal } = useModal()
    const history = useHistory()
    const quotationBySearch = useRef(quotation.filter((q) => q.status === 1))
    const searchParams: QuotationSearchParams = {}
    const params = new URLSearchParams(location.search)
    const [quotationByPage, setQuotationByPage] = useState(quotationBySearch.current.slice(0, 10))

    params.forEach((value, key) => {
        searchParams[key] = value
    })

    useEffect(() => {
        !isObjectEmpty(searchParams) && onSearchStatus(!!searchParams.status, Number(searchParams.page))
    }, [])

    function onSearchStatus(value: boolean, page?: number): void {
        const newquotationListBySearch = !value ? quotation.filter((q) => q.status === 1) : quotation
        quotationBySearch.current = newquotationListBySearch
        !page && updateURLSearch(history, MenuPaths.quotation, `status=${value ? 'all' : ''}`)

        setQuotationByPage(newquotationListBySearch.slice((page ? page - 1 : 0) * 10, page ? page * 10 : 10))
    }

    function pageCurrent(): number {
        const pageNumber = new URLSearchParams(window.location.search).get('page')
        if (isNullOrUndefined(pageNumber)) return 1
        return Number(pageNumber)
    }

    function onChangePage(page: number): void {
        const newQuotationByPage = quotationBySearch.current.slice((page - 1) * 10, page * 10)
        updateURLSearch(history, MenuPaths.quotation, `page=${page}`)

        setQuotationByPage(newQuotationByPage)
    }

    const onHandleQuoted = (id?: string): void => {
        submitRequest({
            method: HttpMethod.PATCH,
            url: QUOTATION_URL + '/' + id,
            params: { status: 2 },
            textConfirm: 'Bạn có chắc chắn muốn thay đổi trạng thái thành đã gửi?',
            callback: (response) => {
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(response.request.method ?? '', true)
                })
                dispatch({ type: QUOTATION_ACTION, payload: response })

                const newQuotationByPage = quotationByPage.map((q) => (q.id === id ? response.response.data : q)) || []
                setQuotationByPage(newQuotationByPage)

                closeAllModal()
            }
        })
    }

    return (
        <div id='quotation-list'>
            <div id='search-quotation'>
                <label>Hiển thị tất cả</label>
                <Switch value={!isNullOrUndefined(searchParams.status)} onClick={onSearchStatus} />
            </div>
            <QuotationList data={quotationByPage} onHandleQuoted={onHandleQuoted} />

            {quotationBySearch.current.length === 0 ? (
                <div className='empty-table-data'>Không có yêu cầu báo giá nào</div>
            ) : (
                <Pagination
                    showPrevNextJumpers={true}
                    defaultPageSize={10}
                    total={quotationBySearch.current.length}
                    current={pageCurrent()}
                    onChange={onChangePage}
                    showTotal={(total: number, range: [number, number]): ReactNode => (
                        <div>{`${range[0]}-${range[1]}/${total} yêu cầu báo giá`}</div>
                    )}></Pagination>
            )}
        </div>
    )
}
export default QuotationTemplate
