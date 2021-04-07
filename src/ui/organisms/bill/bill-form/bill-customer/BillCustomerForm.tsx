import React, { Fragment, memo, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Province } from '../../../../../share/interface/Province'
import { isNullOrUndefined } from '../../../../../share/utils/empty-util'
import { AppState } from '../../../../../store/types'
import { Textarea, TextInput } from '../../../../atoms/inputs'
import Dropdown from '../../../../molecules/dropdown'
import { FormItem, FormItemGroup } from '../../../../molecules/form'
import { CustomerDetailProps } from '../../bill-detail/BillCustomer'

const BillCustomerForm = memo(
    ({ customer, nameForm, disableItem }: CustomerDetailProps): JSX.Element => {
        const title = nameForm === 'receiverInfo' ? ' người nhận' : 'người gửi'
        const provinceList = useSelector<AppState, Province[] | undefined>(
            (state) => state.bill.billDropdown?.provinceList
        )
        const [distance, setDistance] = useState({
            province: customer?.provinceCode,
            district: customer?.districtCode
        })

        useEffect(() => {
            setDistance({
                province: customer?.provinceCode,
                district: customer?.districtCode
            })
        }, [customer])

        const districtList = provinceList?.find((item) => item.code === distance.province)?.district

        const receiveInfo: FormItem[] = [
            {
                title: `Tên ${title}`,
                name: `${nameForm}.name`,
                labelClass: 'require',
                rules: [
                    { required: true, message: ` Vui lòng nhập tên ${title}! ` },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Họ và tên không được chứa ký tự đặc biệt'
                    }
                ],
                defaultValue: customer?.name,
                render: ({ onChange }): JSX.Element => {
                    customer?.code && onChange(customer.name)
                    return (
                        <TextInput
                            name={`${nameForm}.name`}
                            disabled={!isNullOrUndefined(customer?.code) || disableItem}
                            defaultValue={customer?.name}
                            onChange={(e): void => onChange(e?.target.value)}
                        />
                    )
                }
            },
            {
                title: 'Điện thoại',
                name: `${nameForm}.tel`,
                labelClass: 'require',
                rules: [
                    { required: true, message: `Vui lòng số diện thoại ${title}!` },
                    { pattern: /^(?:[0-9+)(-] ?){6,20}[0-9]$/, message: 'Số điện thoại không hợp lệ' }
                ],
                defaultValue: customer?.tel,
                render: ({ onChange }): JSX.Element => {
                    customer?.code && onChange(customer.tel)
                    return (
                        <TextInput
                            disabled={!isNullOrUndefined(customer?.code) || disableItem}
                            defaultValue={customer?.tel}
                            onChange={(e): void => onChange(e?.target.value)}
                        />
                    )
                }
            }
        ]
        const transportFrom: FormItem[] = [
            {
                title: 'Tỉnh/Thành',
                name: `${nameForm}.provinceCode`,
                labelClass: 'require',
                rules: [{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }],
                defaultValue: distance.province,
                render: ({ onChange }): JSX.Element => {
                    customer?.code && onChange(customer.provinceCode)
                    return (
                        <Dropdown
                            disabled={!isNullOrUndefined(customer?.code) || disableItem}
                            defaultValue={distance.province}
                            onSelect={(value): void => {
                                onChange(value)
                                setDistance({ province: Number(value), district: undefined })
                            }}
                            dataSource={provinceList}
                        />
                    )
                }
            },
            {
                title: 'Quận/Huyện',
                name: `${nameForm}.districtCode`,
                defaultValue: distance.district,
                render: ({ onChange }): JSX.Element => {
                    distance.province && !distance.district && onChange(distance.district)
                    customer?.code && onChange(customer.districtCode)
                    return (
                        <Dropdown
                            disabled={disableItem || !isNullOrUndefined(customer?.code)}
                            defaultValue={distance?.district}
                            onSelect={(value): void => {
                                onChange(value)
                                setDistance({ ...distance, district: Number(value) })
                            }}
                            dataSource={districtList}
                        />
                    )
                }
            }
        ]

        const adress: FormItem[] = [
            {
                title: 'Địa chỉ',
                name: `${nameForm}.address`,
                labelClass: 'require',
                rules: [{ required: true, message: `Vui lòng nhập địa chỉ ${title}!` }],
                defaultValue: customer?.address,
                render: ({ onChange }): JSX.Element => {
                    customer?.code && onChange(customer.address)
                    return (
                        <Textarea
                            disabled={!isNullOrUndefined(customer?.code) || disableItem}
                            defaultValue={customer?.address}
                            onChange={(e): void => onChange(e?.target.value)}
                        />
                    )
                }
            }
        ]
        return (
            <Fragment>
                {useMemo(
                    () => (
                        <FormItemGroup
                            items={receiveInfo}
                            container={(props): JSX.Element => <div className='custom-form' {...props} />}
                        />
                    ),
                    [customer]
                )}

                <FormItemGroup
                    items={transportFrom}
                    container={(props): JSX.Element => <div className='custom-form' {...props} />}
                />
                {useMemo(
                    () => (
                        <FormItemGroup
                            items={adress}
                            container={(props): JSX.Element => <div className='custom-form' {...props} />}
                        />
                    ),
                    [customer]
                )}
            </Fragment>
        )
    },
    (p, n) => p.customer?.code === n.customer?.code
)
export default BillCustomerForm
