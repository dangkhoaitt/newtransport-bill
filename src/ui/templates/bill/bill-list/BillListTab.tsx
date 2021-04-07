import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import { BILL_URL } from '../../../../share/common/api-constants'
import { BILL_TAB_QUERY, INVENTORY_VALUES } from '../../../../share/common/app-constants'
import { useGetRequest, useSearchRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { isArrayEmpty } from '../../../../share/utils/empty-util'
import { INVENTORY } from '../../../../share/utils/inventory'
import { CheckboxInput } from '../../../atoms/inputs'
import Pagination from '../../../molecules/pagination'
import BillList from '../../../organisms/bill/bill-list'

interface BillData {
    billList: Bill[]
    totalRecords?: number
}
interface Props {
    query: string
    changeQuerySearch?: (query: string) => void
}

const BillListTab = ({ query = '', changeQuerySearch }: Props): JSX.Element => {
    const searchRequest = useSearchRequest()
    const [data, setData] = useState<BillData>()
    const querySearchCurrent = useRef<string>(changeQuerySearch ? BILL_TAB_QUERY.inventory + query : query)
    const listInventory = useRef<string[]>(BILL_TAB_QUERY.inventory.split('=')[1].split(','))

    useGetRequest({
        url: BILL_URL + querySearchCurrent.current,
        ignore: !!data,
        callback: (res) => setData({ billList: res.data, totalRecords: res.totalRecords })
    })

    useEffect(() => {
        changeQuerySearch && changeQuerySearch(querySearchCurrent.current)
    }, [])

    function onHandleChangePage(page: number): void {
        searchRequest({
            url: BILL_URL + `${querySearchCurrent.current}&page=${page}`,
            callback: ({ response }) => setData({ billList: response.data, totalRecords: response.totalRecords })
        })
    }

    function searchChange(value: string): void {
        const index = listInventory.current.indexOf(value)
        index >= 0 ? listInventory.current.splice(index, 1) : listInventory.current.push(value)

        querySearchCurrent.current = isArrayEmpty(listInventory.current)
            ? `?${query}`
            : `?inventory=${listInventory.current.toString()}` + query

        searchRequest({
            url: BILL_URL + `${querySearchCurrent.current}&page=${1}`,
            callback: ({ response }) => setData({ billList: response.data, totalRecords: response.totalRecords })
        })

        changeQuerySearch && changeQuerySearch(querySearchCurrent.current)
    }

    const inventorySearch: JSX.Element[] = []
    Object.keys(INVENTORY_VALUES).filter((key) => {
        Number(key) < INVENTORY.INVENTORY_END &&
            inventorySearch.push(
                <span key={key}>
                    <CheckboxInput
                        defaultChecked={true}
                        name={key}
                        onChange={(e): void => searchChange(e?.target.name || '1')}
                    />
                    <label>{INVENTORY_VALUES[key]}</label>
                </span>
            )
    })

    if (!data?.billList) return <Fragment />
    return (
        <Fragment>
            {changeQuerySearch && <div id='search-inventory-bill'>{inventorySearch}</div>}
            <BillList data={data?.billList} />
            {data?.totalRecords === 0 ? (
                <div className='empty-table-data'>Không có vận đơn nào</div>
            ) : (
                <Pagination
                    showPrevNextJumpers={true}
                    defaultPageSize={10}
                    onChange={onHandleChangePage}
                    total={data?.totalRecords}
                    defaultCurrent={1}
                    showTotal={(total: number, range: [number, number]): ReactNode => (
                        <div>{`${range[0]}-${range[1]}/${total} Vận đơn`}</div>
                    )}
                />
            )}
        </Fragment>
    )
}

export default BillListTab
