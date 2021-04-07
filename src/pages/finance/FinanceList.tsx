import React from 'react'
import { useSelector } from 'react-redux'
import { FINANCE_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Finance } from '../../share/interface/Finance'
import { FINANCE_RESOURCE } from '../../store/actions/finance.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import FinanceListTemplate from '../../ui/templates/finance/FinanceListTemplate'

const FinanceList = (): JSX.Element => {
    const finance = useSelector<AppState, Finance[] | undefined>((state) => state.finance.list)

    useGetRequest({
        ignore: !!finance,
        url: FINANCE_URL,
        actionType: FINANCE_RESOURCE
    })

    if (finance) return <FinanceListTemplate data={finance} />
    return <Spinner />
}
export default FinanceList
