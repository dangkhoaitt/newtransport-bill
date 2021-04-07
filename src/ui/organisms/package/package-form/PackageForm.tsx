import React, { Ref } from 'react'
import { useSelector } from 'react-redux'
import { Package } from '../../../../share/interface/Package'
import { Unknown } from '../../../../share/interface/Unknown'
import { AppState } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/style.scss'

type Props = {
    data?: Package
    onFinish: (values: Unknown) => void
    onFieldChange?: (name: string, values: unknown) => void
}

const PackageForm = React.forwardRef(
    ({ data, onFinish, onFieldChange }: Props, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const totalRecord = useSelector<AppState, number | undefined>((state) => state.package.totalRecords)

        function onHandleSubmit(values: Package): void {
            onFinish(values)
        }

        function onChange(name: string, values: unknown): void {
            onFieldChange && onFieldChange(name, values)
        }

        const packageItem: FormItem[] = [
            {
                title: 'Mã kiện hàng',
                disabled: data?.code ? true : false,
                name: 'code',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Mã kiện hàng không được phép để trống' },
                    {
                        pattern: /^[A-Za-z0-9]{2,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Mã kiện hàng nên từ 2-20 kí tự và không chứa kí tự đặc biệt!!'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Tên kiện hàng',
                name: 'name',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Tên kiện hàng không được phép để trống' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Tên kiện hàng không được chứa ký tự đặc biệt'
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
                defaultValue: data?.order ?? (totalRecord && totalRecord + 1),
                labelClass: 'form-label require',
                controlClass: 'form-value',
                rules: [{ required: true, message: 'Thứ tự không được phép để trống!' }]
            }
        ]

        return (
            <NForm
                className='package-form-create'
                onFinish={onHandleSubmit}
                initialValues={{ ...data }}
                onFieldChange={onChange}>
                <FormItemGroup items={packageItem} container={(props): JSX.Element => <Card {...props} />} />
                <ButtonPrimary ref={ref} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)

export default PackageForm
