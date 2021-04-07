import React, { Ref } from 'react'
import { useSelector } from 'react-redux'
import { Truck } from '../../../../share/interface/Truck'
import { Unknown } from '../../../../share/interface/Unknown'
import { AppState } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/style.scss'

type Props = {
    truck?: Truck
    onFinish: (values: Unknown) => void
    onFieldChange?: (name: string, values: unknown) => void
}

const TruckForm = React.forwardRef(
    ({ truck, onFinish, onFieldChange }: Props, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const totalRecord = useSelector<AppState, number | undefined>((state) => state.truck.totalRecords)

        function onHandleSubmit(values: Truck): void {
            onFinish(values)
        }

        function onChange(name: string, values: unknown): void {
            onFieldChange && onFieldChange(name, values)
        }

        const truckItem: FormItem[] = [
            {
                title: 'Mã loại xe',
                name: 'code',
                type: 'textbox',
                disabled: truck?.code ? true : false,
                rules: [
                    { required: true, message: 'Mã loại không được phép để trống' },
                    {
                        pattern: /^[A-Za-z0-9]{2,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Mã loại xe nên từ 2-20 kí tự và không chứa kí tự đặc biệt!!'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Tên loại xe',
                name: 'name',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Tên loại xe không được phép để trống' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Họ và tên không được chứa ký tự đặc biệt'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Trọng lượng',
                name: 'weight',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Trọng lượng không được phép để trống' },
                    { pattern: /^(?:[0-9+)(-] ?){1,20}[0-9]$/, message: 'Trọng lượng - không hợp lệ' }
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
                defaultValue: truck?.order ?? (totalRecord && totalRecord + 1),
                labelClass: 'form-label ',
                controlClass: 'form-value'
            }
        ]

        return (
            <NForm
                className='truck-form-create'
                onFinish={onHandleSubmit}
                initialValues={{ ...truck }}
                onFieldChange={onChange}>
                <FormItemGroup items={truckItem} container={(props): JSX.Element => <Card {...props} />} />
                <ButtonPrimary ref={ref} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)

export default TruckForm
