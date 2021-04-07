import React, { Fragment, memo, useState } from 'react'
import { CUSTOMER_URL } from '../../../../../share/common/api-constants'
import { useGetRequest } from '../../../../../share/hooks'
import { Customer } from '../../../../../share/interface/Customer'
import { isArrayEmpty } from '../../../../../share/utils/empty-util'
import { CancelIcon } from '../../../../atoms/icons'
import { ButtonIconOnly } from '../../../../molecules/buttons'
import Card from '../../../../molecules/card'
import { FormItem, FormItemGroup } from '../../../../molecules/form'
import SelectSearch from '../../../../molecules/select-search'
import { CustomerDetailProps } from '../../bill-detail/BillCustomer'
import BillCustomerForm from './BillCustomerForm'

const BillSenderForm = memo(
    (props: CustomerDetailProps): JSX.Element => {
        const [customer, setCustomer] = useState<Customer>(props.customer || {})
        const [customerList, setCustomerList] = useState<Customer[]>([])

        useGetRequest({
            url: CUSTOMER_URL,
            ignore: !isArrayEmpty(customerList),
            callback: (response) => {
                setCustomerList(response.data)
            }
        })

        function setCustomerHandle(customer?: Customer): void {
            const { code, name, tel, address, province, district } = customer || {}
            if (props.disableItem) {
                const { districtCode, provinceCode } = props.customer || {}
                setCustomer({ code, name, tel, address, districtCode, provinceCode })
                return
            }
            setCustomer({ code, name, tel, address, provinceCode: province?.code, districtCode: district?.code })
            const receiverInput = document.getElementsByName('receiverInfo.name')[0]
            code && receiverInput?.focus()
        }

        const customerCode: FormItem[] = [
            {
                title: 'Mã người gửi',
                name: 'senderInfo.code',
                defaultValue: customer.code,
                render: ({ onChange }): JSX.Element => {
                    onChange(customer.code)
                    return (
                        <Fragment>
                            <SelectSearch
                                disabled={props.disableItem}
                                defaultValue={customer.code}
                                dataSource={customerList.map((item) => ({
                                    code: item.code as string,
                                    name: `#${item.code}_${item.name}`
                                }))}
                                onChange={(value): void =>
                                    setCustomerHandle(customerList.find((c) => c.code === value))
                                }
                            />
                        </Fragment>
                    )
                }
            }
        ]

        return (
            <Card
                header={
                    <div className='bill-customer-header'>
                        <span>Thông tin người gửi</span>
                        {customer.code && (
                            <div className='btn-search-customer'>
                                <ButtonIconOnly
                                    onClick={(e): void => {
                                        e.preventDefault()
                                        setCustomerHandle({})
                                    }}
                                    icon={<CancelIcon />}
                                    iconType='primary'
                                />
                            </div>
                        )}
                    </div>
                }
                className='bill-form-item bill-customer'>
                <FormItemGroup
                    items={customerCode}
                    container={(props): JSX.Element => <div className='custom-form' {...props} />}
                />
                <BillCustomerForm disableItem={props.disableItem} customer={customer} nameForm='senderInfo' />
            </Card>
        )
    },
    () => true
)

export default BillSenderForm
