import React, { Ref } from 'react'
import { Unit } from '../../../../share/interface/Unit'
import { Unknown } from '../../../../share/interface/Unknown'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/style.scss'

type Props = {
    unit?: Unit
    order?: number
    onFinish: (values: Unknown) => void
    onFieldChange?: (name: string, values: unknown) => void
}

const UnitForm = React.forwardRef(
    ({ unit, order, onFinish, onFieldChange }: Props, ref: Ref<HTMLButtonElement>): JSX.Element => {
        function onHandleSubmit(values: Unit): void {
            onFinish(values)
        }

        function onChange(name: string, values: unknown): void {
            onFieldChange && onFieldChange(name, values)
        }

        const unitItem: FormItem[] = [
            {
                title: 'Mã đơn vị',
                name: 'code',
                type: 'textbox',
                disabled: unit?.code ? true : false,
                rules: [
                    { required: true, message: 'Mã đơn vị không được phép để trống!' },
                    {
                        pattern: /^[A-Za-z0-9]{2,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Mã đơn vị nên từ 2-20 kí tự và không chứa kí tự đặc biệt!'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Tên đơn vị',
                name: 'name',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Tên đơn vị không được phép để trống!' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Tên đơn vị không được chứa ký tự đặc biệt!'
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
                defaultValue: unit?.order ?? order,
                labelClass: 'form-label ',
                controlClass: 'form-value'
            }
        ]

        return (
            <NForm
                className='unit-form-create'
                onFinish={onHandleSubmit}
                initialValues={{ ...unit }}
                onFieldChange={onChange}>
                <FormItemGroup items={unitItem} container={(props): JSX.Element => <Card {...props} />} />
                <ButtonPrimary ref={ref} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)

export default UnitForm
