import React, { Fragment, Ref, useState } from 'react'
import { useSelector } from 'react-redux'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { useGetRequest } from '../../../../share/hooks'
import { Customer } from '../../../../share/interface/Customer'
import { Province } from '../../../../share/interface/Province'
import { isNullOrUndefined, isObjectEmpty } from '../../../../share/utils/empty-util'
import { FETCH_PROVINCE_DROPDOWN } from '../../../../store/actions/customer.action'
import { AppState } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import Dropdown from '../../../molecules/dropdown'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/index.scss'

export interface CustomerFormProps {
    detail?: Customer
    onFinish?: (value: Customer) => void
    onFieldChange?: (name: string, value: unknown) => void
}

export type Distance = { province: Province; district?: Province }

const CustomerForm = React.forwardRef(
    ({ detail, onFinish, onFieldChange }: CustomerFormProps, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const provinceList = useSelector<AppState, Province[] | undefined>((state) => state.customer.provinceList)
        const [distance, setDistance] = useState({
            province: detail?.province?.code,
            district: detail?.district?.code
        })

        const districtList = provinceList?.find((item) => item.code === distance?.province)?.district || []

        useGetRequest({ url: PROVINCE_URL, ignore: !!provinceList, actionType: FETCH_PROVINCE_DROPDOWN })
        const personalItems: FormItem[] = [
            {
                title: 'Mã khách hàng',
                name: 'code',
                type: 'textbox',
                rules: [
                    {
                        pattern: /^[0-9a-zA-Z_-]{1,}$/,
                        message: 'Mã khách hàng không được chứa ký tự đặc biệt!'
                    }
                ],
                defaultValue: detail?.code
            },
            {
                title: 'Tên khách hàng',
                name: 'name',
                type: 'textbox',
                defaultValue: detail?.name,
                rules: [{ required: true, message: 'Vui lòng nhập tên khách hàng!' }],
                labelClass: 'require'
            },
            {
                title: 'Số điện thoại',
                name: 'tel',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^(?:[0-9+)(-] ?){6,20}[0-9]$/, message: 'Số điện thoại không hợp lệ!' }
                ],
                defaultValue: detail?.tel,
                labelClass: 'require'
            },
            {
                title: 'Tỉnh/Thành phố',
                name: 'province',
                rules: [{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }],
                defaultValue: distance.province,
                labelClass: 'require',
                render: ({ onChange }): JSX.Element => (
                    <Dropdown
                        defaultValue={distance.province}
                        onSelect={(value): void => {
                            onChange(value)
                            setDistance({ province: value as number, district: undefined })
                        }}
                        dataSource={provinceList}
                    />
                )
            },
            {
                title: 'Quận/Huyện',
                name: 'district',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }],
                defaultValue: distance?.district,
                labelClass: 'require',
                render: ({ onChange }): JSX.Element => {
                    isObjectEmpty(distance.district) && onChange(distance.district)
                    return (
                        <Dropdown
                            defaultValue={distance?.district}
                            onSelect={(value): void => {
                                onChange(value)
                                setDistance({ ...distance, district: value as number })
                            }}
                            dataSource={districtList}
                        />
                    )
                }
            },
            {
                title: 'Địa chỉ chi tiết',
                name: 'address',
                type: 'textbox',
                rules: [{ required: true, message: 'Vui lòng nhập địa chỉ!' }],
                defaultValue: detail?.address,
                labelClass: 'require'
            }
        ]
        if (isNullOrUndefined(provinceList)) return <Fragment />
        return (
            <NForm className='customer-form' onFinish={onFinish} onFieldChange={onFieldChange}>
                <FormItemGroup
                    items={personalItems}
                    container={(props): JSX.Element => <div className='content-form' {...props} />}
                />
                <ButtonPrimary ref={ref} disabled={!isNullOrUndefined(detail)} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)
export default CustomerForm
