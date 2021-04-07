import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Bill } from '../../../../share/interface/Bill'
import { Customer } from '../../../../share/interface/Customer'
import { AppState } from '../../../../store/types'
import Card from '../../../molecules/card'
import SelectSearch, { Source } from '../../../molecules/select-search'
import BillImportList from '../../../organisms/bill/bill-import-list'
import './style/index.scss'

type Props = {
    billList: Bill[]
    onCustomerSelectChange: (customer?: Customer) => void
}

const BillImportListTeamplate = ({ billList, onCustomerSelectChange }: Props): JSX.Element => {
    const [selectSource, setSelectSource] = useState<Source[]>([])
    const customerList = useSelector<AppState, Customer[] | undefined>((state) => state.customer.list)

    useEffect(() => {
        if (customerList && customerList.length) {
            setSelectSource(
                customerList.map(({ code = '', name, address, district, province, tel }) => ({
                    code,
                    name: `#${code} - ${name} - ${address}, ${district?.name}, ${province?.name} - ${tel}`
                }))
            )
        }
    }, [customerList])

    return (
        <div id='bill-import-list'>
            <Card className='customer-select-search'>
                <label>Thông tin khách hàng gửi</label>
                <SelectSearch
                    placeholder='#Mã KH - Tên KH - Địa chỉ, Quận/Huyện, Tỉnh/Thành - Số điện thoại'
                    dataSource={selectSource}
                    onChange={(value): void => {
                        const sender = customerList?.find(({ code }) => code === value)
                        onCustomerSelectChange(sender)
                    }}
                />
            </Card>
            {billList.length > 0 && <BillImportList data={billList} />}
        </div>
    )
}

export default BillImportListTeamplate
