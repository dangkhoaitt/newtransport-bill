import React, { useState } from 'react'
import { BILL_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useGetRequest } from '../../share/hooks'
import { Bill } from '../../share/interface/Bill'
import { Spinner } from '../../ui/molecules/loading'
import BillEditTeamplate from '../../ui/templates/bill/bill-edit'

const BillEdit = (): JSX.Element => {
    const [billDetail, setBillDetail] = useState<Bill>()

    useGetRequest({
        url: BILL_URL + '/' + location.pathname.split('/').pop(),
        ignore: !!billDetail,
        callback: (response) => {
            setBillDetail(response.data)
        }
    })

    if (billDetail) return <BillEditTeamplate bill={billDetail} />
    return <Spinner />
}

export default withErrorBoundary(BillEdit)
