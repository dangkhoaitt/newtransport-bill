import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { MenuPaths } from '../../../../share/common/app-constants'
import { useGetRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { updateURLSearch } from '../../../../share/utils/app-util'
import { isNullOrUndefined, isStringEmpty } from '../../../../share/utils/empty-util'
import { FETCH_PROVINCE_DROPDOWN } from '../../../../store/actions/customer.action'
import { AppState, CustomerSearchParams } from '../../../../store/types'
import { ButtonDanger } from '../../../molecules/buttons'
import Collapse from '../../../molecules/collapse'
import CustomerSearchForm from './CustomerSearchForm'

type Props = { querySearch?: string }
const SearchCustomerOptions = memo(
    ({ querySearch }: Props): JSX.Element => {
        const history = useHistory()
        const searchParams: CustomerSearchParams = {}
        const params = new URLSearchParams(querySearch)
        const provinceList = useSelector<AppState, Province[] | undefined>((state) => state.customer.provinceList)
        params.forEach((value, key) => (searchParams[key] = value))

        useGetRequest({ url: PROVINCE_URL, ignore: !!provinceList, actionType: FETCH_PROVINCE_DROPDOWN })

        const clearSearch = (): void => {
            if (isStringEmpty(location.search)) return
            updateURLSearch(history, MenuPaths.customer, '')
        }

        function onFinishChange(name: string, value: string | number | undefined): void {
            if (isStringEmpty(value) && isNullOrUndefined(searchParams[name])) return
            if (value !== searchParams[name]) {
                updateURLSearch(history, MenuPaths.customer, `${name}=${value}`)
                searchParams[name] = value
            }
        }

        return (
            <Collapse id='search-customer' label='Tìm kiếm khách hàng'>
                <CustomerSearchForm
                    provinceList={provinceList}
                    searchParams={searchParams}
                    onFinishChange={onFinishChange}
                />
                <div className='btn-customer-search'>
                    <ButtonDanger type='reset' onClick={clearSearch}>
                        Xóa tìm kiếm
                    </ButtonDanger>
                </div>
            </Collapse>
        )
    },
    () => !isStringEmpty(location.search)
)

export default SearchCustomerOptions
