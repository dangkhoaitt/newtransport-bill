import React from 'react'
import { useSelector } from 'react-redux'
import { QUOTATION_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Quotation } from '../../share/interface/Quotation'
import { QUOTATION_RESOURCE } from '../../store/actions/quotation.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import QuotationTemplate from '../../ui/templates/quotation/quotation-list'

const QuotationList = (): JSX.Element => {
    const quotation = useSelector<AppState, Quotation[] | undefined>((state) => state.quotation.quotationList)

    useGetRequest({ ignore: !!quotation, url: QUOTATION_URL, actionType: QUOTATION_RESOURCE })

    if (quotation) return <QuotationTemplate quotation={quotation} />
    return <Spinner />
}
export default QuotationList
