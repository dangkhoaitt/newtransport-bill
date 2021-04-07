import React, { ChangeEvent, Fragment, KeyboardEvent, memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    BILL_URL,
    FINANCE_URL,
    PROGRESS_URL,
    SERVICE_URL,
    UNIT_URL,
    USER_URL
} from '../../../../share/common/api-constants'
import { DATE_FORMAT, MenuPaths, Roles } from '../../../../share/common/app-constants'
import { useMultiGetRequest, useSearchRequest } from '../../../../share/hooks'
import { User } from '../../../../share/interface/User'
import { buildQuerySearchFromObject, updateURLSearch } from '../../../../share/utils/app-util'
import { formatDateFormTime } from '../../../../share/utils/date-util'
import { isNullOrUndefined, isObjectEmpty, isStringEmpty } from '../../../../share/utils/empty-util'
import { DO_SEARCH_BILL, FETCH_BILL_DROPDOWN_SEARCH } from '../../../../store/actions/bill.action'
import { AppState, BillSearchParams, BillValueDropdown } from '../../../../store/types'
import { TextInput } from '../../../atoms/inputs'
import Switch from '../../../atoms/switch'
import { ButtonDanger } from '../../../molecules/buttons'
import Collapse from '../../../molecules/collapse'
import { DatePicker } from '../../../molecules/date-picker'
import Dropdown from '../../../molecules/dropdown'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
type Props = { querySearch?: string }

const BillSearch = memo(
    ({ querySearch }: Props): JSX.Element => {
        const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
        const history = useHistory()
        const searchRequest = useSearchRequest()
        const searchParams: BillSearchParams = {}
        const params = new URLSearchParams(querySearch)
        params.forEach((value, key) => {
            searchParams[key] = value
        })

        const billDropdown = useSelector<AppState, BillValueDropdown | undefined>(
            (state) => state.bill?.billSearchDropdown
        )
        const urls = [
            SERVICE_URL + '?isExtra=false&dropdown=true',
            PROGRESS_URL,
            FINANCE_URL,
            USER_URL + '?dropdown=true',
            UNIT_URL
        ]
        useMultiGetRequest({ urls, ignore: !isObjectEmpty(billDropdown), actionType: FETCH_BILL_DROPDOWN_SEARCH })

        const SearchItem: FormItem[] = [
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Mã vận đơn',
                name: 'code',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.code}
                        onBlur={(e): void => onFinishChange('code', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'code')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Mã khách hàng',
                name: 'customerCode',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.customerCode}
                        onBlur={(e): void => onFinishChange('customerCode', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'customerCode')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Tên khách hàng',
                name: 'sendName',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.sendName}
                        onBlur={(e): void => onFinishChange('sendName', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'sendName')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Dịch vụ ',
                name: 'service',
                render: (): JSX.Element => (
                    <Dropdown
                        isNoSelect
                        defaultValue={searchParams?.service}
                        onSelect={(value): void => onFinishChange('service', value as string)}
                        dataSource={billDropdown?.service}
                        className='bill-dropdown'
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Trạng thái hành trình',
                name: 'progress',
                render: (): JSX.Element => (
                    <Dropdown
                        isNoSelect
                        defaultValue={searchParams?.progress}
                        onSelect={(value): void => onFinishChange('progress', value as string)}
                        dataSource={billDropdown?.progressList}
                        className='bill-dropdown'
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Thông tin kế toán',
                name: 'finance',
                render: (): JSX.Element => (
                    <Dropdown
                        isNoSelect
                        defaultValue={searchParams?.finance}
                        onSelect={(value): void => onFinishChange('finance', value as string)}
                        dataSource={billDropdown?.financeList}
                        className='bill-dropdown'
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Đơn vị',
                name: 'unit',
                render: (): JSX.Element => (
                    <Dropdown
                        isNoSelect
                        defaultValue={searchParams?.unit}
                        onSelect={(value): void => onFinishChange('unit', value as string)}
                        dataSource={billDropdown?.unitList}
                        className='bill-dropdown'
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Người tạo',
                name: 'userId',
                render: (): JSX.Element => (
                    <Dropdown
                        isNoSelect
                        defaultValue={searchParams?.userId}
                        onSelect={(value): void => onFinishChange('userId', value as string)}
                        dataSource={billDropdown?.userList?.filter((u) => u.unit?.code === searchParams?.unit)}
                        className='bill-dropdown'
                    />
                )
            },
            {
                containerClass: 'input-item search-date',
                labelClass: 'label-item ',
                title: 'Thời gian tạo',
                name: 'insertTimeTo',
                render: (): JSX.Element => (
                    <div className='bill-search-date'>
                        {DateSearch('insertTimeFrom', 'Từ ngày')}
                        {DateSearch('insertTimeTo', 'Đến ngày')}
                    </div>
                )
            }
        ]

        function DateSearch(name: string, placeholder?: string): JSX.Element {
            return (
                <DatePicker
                    placeholder={placeholder}
                    value={searchParams[name] ? formatDateFormTime(Number(searchParams[name]), DATE_FORMAT) : ''}
                    onChange={(value): void => {
                        if (!value) {
                            searchParams[name] && onFinishChange(name, '')
                            return
                        }
                        const newValue = (value as string).split('/')
                        let newDate = `${newValue[1]}/${newValue[0]}/${newValue[2]}`
                        if (name === 'insertTimeTo') newDate = `${newDate} 23:59:59`
                        const date = new Date(newDate).getTime()
                        date && onFinishChange(name, date)
                    }}
                />
            )
        }

        const requestHandler = (name: string, value: unknown): void => {
            const clear = name === 'clear'
            const params = clear ? {} : { [name]: value, page: 1 }
            const newSearch = clear ? params : Object.assign(searchParams, params)
            const querySearch = '?' + buildQuerySearchFromObject(newSearch)

            searchRequest({ url: BILL_URL + querySearch, actionType: DO_SEARCH_BILL })
        }
        function onFinishChange(name: string, value: string | number | undefined): void {
            if (typeof value === 'string' && isStringEmpty(value) && isNullOrUndefined(searchParams[name])) return
            if (value !== searchParams[name]) {
                updateURLSearch(history, MenuPaths.shipping_bill, `${name}=${value}`)
                searchParams[name] = value
                requestHandler(name, value)
            }
        }

        const clearAll = useCallback(() => {
            if (isStringEmpty(location.search)) return
            updateURLSearch(history, MenuPaths.shipping_bill, '')
            requestHandler('clear', '')
        }, [])

        function onEnterSearch(
            event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
            field: string
        ): void {
            const key = (event as KeyboardEvent<HTMLInputElement>).which
            if (key === 13) {
                onFinishChange(field, (event as ChangeEvent<HTMLInputElement>).target.value)
            }
        }

        if (isObjectEmpty(billDropdown)) return <Fragment />
        return (
            <div id='search-bill'>
                {userLogin?.role !== Roles.admin && (
                    <span className='search-my-unit'>
                        <label> Đơn vị của tôi</label>
                        <Switch
                            value={userLogin?.unit?.code === searchParams.unit}
                            onClick={(value): void => onFinishChange('unit', value ? userLogin?.unit?.code : '')}
                        />
                    </span>
                )}
                <Collapse id='search-bill-collapse' label='Tìm kiếm vận đơn'>
                    <NForm className='forms'>
                        <FormItemGroup
                            items={SearchItem}
                            container={(props): JSX.Element => <div className='form-bill-search' {...props} />}
                        />
                    </NForm>
                    <div className='btn-bill-search'>
                        <ButtonDanger onClick={clearAll} type='submit'>
                            Xóa tìm kiếm
                        </ButtonDanger>
                    </div>
                </Collapse>
            </div>
        )
    },
    (prv, next) =>
        !!next.querySearch &&
        new URLSearchParams(prv.querySearch).get('unit') === new URLSearchParams(next.querySearch).get('unit')
)

export default BillSearch
