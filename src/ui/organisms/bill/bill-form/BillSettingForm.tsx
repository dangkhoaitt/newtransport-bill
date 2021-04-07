import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { Finance } from '../../../../share/interface/Finance'
import { Progress } from '../../../../share/interface/Progress'
import { AppState } from '../../../../store/types'
import Card from '../../../molecules/card'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillSettingProps } from '../bill-detail/BillSetting'

const SettingInfoForm = memo(
    (props: BillSettingProps): JSX.Element => {
        const progressList = useSelector<AppState, Progress[] | undefined>(
            (state) => state.bill.billDropdown?.progressList
        )
        const financeList = useSelector<AppState, Finance[] | undefined>(
            (state) => state.bill.billDropdown?.financeList
        )

        const settingBill: FormItem[] = [
            {
                title: 'Trạng thái',
                name: 'progress',
                labelClass: 'require',
                rules: [{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }],
                containerClass: 'bill-seting-status',
                type: 'select',
                disabled: props.disableItem,
                defaultValue: (props.progress && props.progress?.code) || (progressList && progressList[0].code),
                selectSource: progressList
            },
            {
                title: 'TT kế toán',
                name: 'finance',
                labelClass: 'require',
                rules: [{ required: true, message: 'Vui lòng chọn trạng thái kế toán!' }],
                containerClass: 'bill-seting-status',
                type: 'select',
                disabled: props.disableItem,
                defaultValue: props.finance?.code,
                selectSource: financeList
            }
        ]

        return (
            <Card header='Thông tin trạng thái' className='bill-form-item'>
                {settingBill && (
                    <FormItemGroup
                        items={settingBill}
                        container={(props): JSX.Element => <div className='custom-form' {...props} />}
                    />
                )}
            </Card>
        )
    }
)

export default SettingInfoForm
