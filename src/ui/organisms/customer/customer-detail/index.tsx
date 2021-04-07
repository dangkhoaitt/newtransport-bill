import React from 'react'
import { DATE_TIME_AM_FORMAT, MenuPaths } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Customer } from '../../../../share/interface/Customer'
import Anchor from '../../../atoms/link'
import CustomerCard from '../customer-card'

interface CustomerDetailProps {
    detail: Customer
}

const personalAssets = {
    code: 'Mã khách hàng',
    province: 'Tỉnh/Thành phố',
    name: 'Tên khách hàng',
    district: 'Quận/Huyện',
    tel: 'Số điện thoại',
    insertBy: 'Người thêm',
    address: 'Địa chỉ chi tiết',
    insertTime: 'Ngày thêm'
}
export default function CustomerDetail({ detail }: CustomerDetailProps): JSX.Element {
    const personalInfo = {
        code: detail.code,
        name: detail.name,
        tel: detail.tel,
        province: detail.province?.name,
        district: detail.district?.name,
        address: detail.address,
        insertBy: (
            <Anchor href={`/${MenuPaths.user}/${detail.insertBy?.userId}`} linkType='text-primary'>
                {detail.insertBy?.name}
            </Anchor>
        ),
        insertTime: <DateView time={detail.insertTime as number} format={DATE_TIME_AM_FORMAT} />
    }

    return (
        <div id='customer-detail'>
            <CustomerCard assets={personalAssets} dataValue={personalInfo} header='Thông tin khách hàng' />
        </div>
    )
}
