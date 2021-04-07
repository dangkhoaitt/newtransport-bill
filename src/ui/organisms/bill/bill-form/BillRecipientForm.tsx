import React, { memo } from 'react'
import Card from '../../../molecules/card'
import { CustomerDetailProps } from '../bill-detail/BillCustomer'
import BillCustomerForm from './bill-customer/BillCustomerForm'

const RecipientInfo = memo(
    ({ customer, disableItem }: CustomerDetailProps): JSX.Element => (
        <Card header='Thông tin người nhận' className='bill-form-item bill-form-receiveInfo'>
            <BillCustomerForm disableItem={disableItem} customer={customer} nameForm='receiverInfo' />
        </Card>
    )
)
export default RecipientInfo
