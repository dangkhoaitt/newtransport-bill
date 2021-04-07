import React, { Ref } from 'react'
import { useSelector } from 'react-redux'
import { Finance } from '../../../../share/interface/Finance'
import { Unknown } from '../../../../share/interface/Unknown'
import { AppState } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/style.scss'

type Props = {
    finance?: Finance
    onFinish: (values: Unknown) => void
    onFieldChange?: (name: string, values: unknown) => void
}

const FinanceForm = React.forwardRef(
    ({ finance, onFinish, onFieldChange }: Props, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const totalRecord = useSelector<AppState, number | undefined>((state) => state.finance.totalRecords)

        function onHandleSubmit(values: Finance): void {
            onFinish(values)
        }

        function onChange(name: string, values: unknown): void {
            onFieldChange && onFieldChange(name, values)
        }

        const financeItem: FormItem[] = [
            {
                title: 'Mã trạng thái',
                disabled: finance?.code ? true : false,
                name: 'code',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Mã trạng thái không được phép để trống' },
                    {
                        pattern: /^[A-Za-z0-9]{2,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Mã trạng thái nên từ 2-20 kí tự và không chứa kí tự đặc biệt!!'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Tên trạng thái',
                name: 'name',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Tên trạng thái không được phép để trống' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Tên trạng thái không được chứa ký tự đặc biệt'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Thứ tự',
                name: 'order',
                type: 'numberbox',
                containerClass: 'form-container',
                defaultValue: finance?.order ?? (totalRecord && totalRecord + 1),
                labelClass: 'form-label require',
                controlClass: 'form-value',
                rules: [{ required: true, message: 'Thứ tự không được phép để trống!' }]
            }
        ]

        return (
            <NForm
                className='finance-form-create'
                onFinish={onHandleSubmit}
                initialValues={{ ...finance }}
                onFieldChange={onChange}>
                <FormItemGroup items={financeItem} container={(props): JSX.Element => <Card {...props} />} />
                <ButtonPrimary ref={ref} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)

export default FinanceForm
