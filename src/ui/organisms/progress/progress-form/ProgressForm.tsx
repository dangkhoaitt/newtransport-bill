import React, { Ref } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from '../../../../share/interface/Progress'
import { Unknown } from '../../../../share/interface/Unknown'
import { AppState } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/style.scss'

type Props = {
    progress?: Progress
    onFinish: (values: Unknown) => void
    onFieldChange?: (name: string, values: unknown) => void
}

const ProgressForm = React.forwardRef(
    ({ progress, onFinish, onFieldChange }: Props, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const totalRecord = useSelector<AppState, number | undefined>((state) => state.progress.totalRecords)
        function onHandleSubmit(values: Progress): void {
            onFinish(values)
        }

        function onChange(name: string, values: unknown): void {
            onFieldChange && onFieldChange(name, values)
        }

        const progressItem: FormItem[] = [
            {
                title: 'Mã hành trình',
                disabled: progress?.code ? true : false,
                name: 'code',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Mã hành trình không được phép để trống!' },
                    {
                        pattern: /^[A-Za-z0-9]{2,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Mã hành trình nên từ 2-20 kí tự và không chứa kí tự đặc biệt!'
                    }
                ],
                containerClass: 'form-container',
                labelClass: 'form-label require',
                controlClass: 'form-value'
            },
            {
                title: 'Tên hành trình',
                name: 'name',
                type: 'textbox',
                rules: [
                    { required: true, message: 'Tên hành trình không được phép để trống!' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Tên hành trình không được chứa ký tự đặc biệt!'
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
                defaultValue: progress?.order ?? (totalRecord && totalRecord + 1),
                labelClass: 'form-label require',
                controlClass: 'form-value',
                rules: [{ required: true, message: 'Thứ tự không được phép để trống!' }]
            }
        ]

        return (
            <NForm
                className='progress-form-create'
                onFinish={onHandleSubmit}
                initialValues={{ ...progress }}
                onFieldChange={onChange}>
                <FormItemGroup items={progressItem} container={(props): JSX.Element => <Card {...props} />} />
                <ButtonPrimary ref={ref} type='submit'>
                    Lưu
                </ButtonPrimary>
            </NForm>
        )
    }
)

export default ProgressForm
