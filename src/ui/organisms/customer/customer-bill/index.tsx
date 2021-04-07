import React, { Fragment, memo, ReactNode, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BILL_URL } from '../../../../share/common/api-constants'
import { useSearchRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { DO_SEARCH_BILL } from '../../../../store/actions/bill.action'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import Pagination from '../../../molecules/pagination'
import { doExportBill } from '../../../templates/bill/bill-list'
import BillList from '../../bill/bill-list'

interface CustomerBillProps {
    code: string
    customerBill?: CustomerBillState
}

export type CustomerBillState = {
    bill?: Bill[]
    totalRecords?: number
}

const CustomerBill = memo(
    ({ code, customerBill }: CustomerBillProps): JSX.Element => {
        const [data, setData] = useState<CustomerBillState | undefined>(customerBill)
        const pageRef = useRef<number>(1)
        const searchRequest = useSearchRequest()
        const { confirm } = useModal()
        const dispatch = useDispatch()

        function onHandleChangePage(page: number): void {
            pageRef.current = page
            searchRequest({
                url: BILL_URL + `?customerCode=${code}` + `&page=${page}`,
                actionType: DO_SEARCH_BILL,
                callback: (response) =>
                    setData({ bill: response.response.data, totalRecords: response.response.totalRecords })
            })
        }

        function exportToExcel(): void {
            confirm({
                title: 'Bạn có chắc chắn muốn xuất dữ liệu sang excel?',
                okText: 'Đồng ý',
                cancelText: 'Hủy',
                onConfirm: () => doExportBill(dispatch, `?customerCode=${code}`)
            })
        }

        if (!data) return <Fragment />
        return (
            <Fragment>
                <Card
                    header={
                        <div className='header-customer-bill'>
                            <label> Thông tin vận đơn</label>
                            <ButtonPrimary onClick={exportToExcel}>Xuất excel</ButtonPrimary>
                        </div>
                    }
                    className='customer-bill'
                    children={
                        data.totalRecords === 0 ? (
                            <div className='empty-table-data'>Không có vận đơn nào</div>
                        ) : (
                            <Fragment>
                                <BillList data={data.bill || []} />
                                <Pagination
                                    showPrevNextJumpers={true}
                                    defaultPageSize={10}
                                    onChange={onHandleChangePage}
                                    total={data.totalRecords}
                                    current={pageRef.current}
                                    showTotal={(total: number, range: [number, number]): ReactNode => (
                                        <div>{`${range[0]}-${range[1]}/${total} Vận đơn`}</div>
                                    )}></Pagination>
                            </Fragment>
                        )
                    }
                />
            </Fragment>
        )
    },
    () => true
)

export default CustomerBill
