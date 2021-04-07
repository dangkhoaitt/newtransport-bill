import React from 'react'
import { MenuPaths } from '../../../../share/common/app-constants'
import { Customer } from '../../../../share/interface/Bill'
import Anchor from '../../../atoms/link'
import { FieldSpec } from '../../../molecules/table/type'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetsReceiver: FieldSpec = {
    code: 'Mã khách hàng:',
    name: 'Họ và tên:',
    tel: 'Số điện thoại:',
    address: 'Địa chỉ chi tiết:'
}

export type CustomerDetailProps = { customer?: Customer; nameForm?: string; disableItem?: boolean }

export default function BillDetailCustomer({ customer = {}, nameForm }: CustomerDetailProps): JSX.Element {
    const customerValue: CardValue = {
        code: customer.id && customer.code && (
            <Anchor href={`/${MenuPaths.customerDetail}/${customer.id}`} linkType='text-primary'>
                {customer.code}
            </Anchor>
        ),
        name: customer.name,
        tel: customer.tel,
        address: customer.address
    }

    return (
        <CardDetailItem
            className={customer.code ? '' : 'detail-receiver'}
            header={`Thông tin người ${nameForm === 'receiverInfo' ? ' nhận' : ' gửi'}`}
            dataValue={customerValue}
            assets={assetsReceiver}
        />
    )
}
