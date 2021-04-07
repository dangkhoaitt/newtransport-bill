import React, { Fragment, useState } from 'react'
import { BILL_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useGetRequest } from '../../share/hooks'
import { Bill } from '../../share/interface/Bill'
import BillDetailTeamplate from '../../ui/templates/bill/bill-detail'

const BillDetail = (): JSX.Element => {
    const [billDetail, setBillDetail] = useState<Bill>()

    useGetRequest({
        url: BILL_URL + '/' + location.pathname.split('/').pop(),
        ignore: !!billDetail,
        callback: (response) => {
            setBillDetail(response.data)
        }
    })

    if (billDetail) return <BillDetailTeamplate bill={billDetail} />
    return <Fragment />
}

export default withErrorBoundary(BillDetail)
