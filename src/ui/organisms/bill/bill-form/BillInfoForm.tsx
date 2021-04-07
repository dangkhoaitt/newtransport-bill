import React, { memo, useEffect } from 'react'
import { DATE_FORMAT, DATE_TIME_AM_FORMAT } from '../../../../share/common/app-constants'
import { isArrayEmpty } from '../../../../share/utils/empty-util'
import DateView from '../../../atoms/date/DateView'
import Card from '../../../molecules/card'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillInfoProps } from '../bill-detail/BillInfo'

interface Props extends BillInfoProps {
    errorsBill: string[]
    disableItem?: boolean
}

const BillCardInfo = memo(
    ({ code, insertTime, errorsBill, disableItem }: Props): JSX.Element => {
        const date = insertTime ? insertTime : new Date().getTime()

        useEffect(() => {
            const codeBill = document.getElementsByName('code')[0]
            codeBill && codeBill.focus()
        }, [])

        const customerInfo: FormItem[] = [
            {
                title: 'Ngày tạo đơn',
                name: 'insertTime',
                controlClass: 'bill-info-item',
                render: (): JSX.Element => (
                    <div className='infor-value'>
                        <DateView format={insertTime ? DATE_TIME_AM_FORMAT : DATE_FORMAT} time={date}></DateView>
                    </div>
                )
            },
            {
                title: 'Mã vận đơn',
                name: 'code',
                controlClass: 'bill-info-item',
                defaultValue: code,
                rules: [
                    {
                        pattern: /^[0-9a-zA-Z_-]{1,}$/,
                        message: 'Mã vận đơn không được chứa ký tự đặc biệt!'
                    }
                ],
                disabled: disableItem,
                type: 'textbox'
            }
        ]

        const errList = errorsBill.map((err) => <li key={err}>{err}</li>)
        return (
            <Card
                className='bill-form-item bill-info '
                header={
                    <>
                        Thông tin vận đơn
                        {!isArrayEmpty(errorsBill) && <ul className='form-bill-err'>{errList}</ul>}
                    </>
                }>
                <FormItemGroup
                    items={customerInfo}
                    container={(props): JSX.Element => <div className='custom-form' {...props} />}
                />
            </Card>
        )
    }
)

export default BillCardInfo
