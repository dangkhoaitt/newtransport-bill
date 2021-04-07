import React from 'react'
import { CHANGEPASSWORD_URL } from '../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../share/hooks'
import { Unknown } from '../../share/interface/Unknown'
import { SAVE_PASSWORD } from '../../store/actions/auth.action'
import { PasswordInput } from '../../ui/atoms/inputs'
import { ButtonPrimary } from '../../ui/molecules/buttons'
import Card from '../../ui/molecules/card'
import NForm, { NFormItem } from '../../ui/molecules/form'
import './styles/change-password.scss'

type Props = {
    onChange: (value: unknown) => void
}
export default function ChangePassword(): JSX.Element {
    const submitRequest = useSubmitRequest()

    const onFinish = (values: Unknown): void => {
        submitRequest({ url: CHANGEPASSWORD_URL, params: values, actionType: SAVE_PASSWORD, method: HttpMethod.PATCH })
    }

    return (
        <div id='change-password-form'>
            <Card header='Thay đổi mật khẩu'>
                <NForm onFinish={onFinish}>
                    <NFormItem
                        item={{
                            title: 'Mật khẩu hiện tại',
                            name: 'oldPassword',
                            rules: [{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }],
                            containerClass: 'password-item',
                            labelClass: 'label-item ',
                            controlClass: 'input-item',
                            render: PasswordItem
                        }}
                    />
                    <NFormItem
                        item={{
                            title: 'Mật khẩu mới',
                            name: 'password',
                            rules: [{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }],
                            containerClass: 'password-item',
                            labelClass: 'label-item ',
                            controlClass: 'input-item',
                            render: PasswordItem
                        }}
                    />
                    <NFormItem
                        item={{
                            title: 'Xác nhận mật khẩu',
                            name: 'confirmPassword',
                            rules: [
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                { compareField: 'password', message: 'Mật khẩu không khớp!' }
                            ],
                            containerClass: 'password-item',
                            labelClass: 'label-item ',
                            controlClass: 'input-item',
                            render: PasswordItem
                        }}
                    />
                    <div className='action-button'>
                        <ButtonPrimary type='submit'>Lưu thay đổi</ButtonPrimary>
                    </div>
                </NForm>
            </Card>
        </div>
    )
}

function PasswordItem({ onChange }: Props): JSX.Element {
    function onChangeItem(e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        onChange(e?.target.value)
    }
    return <PasswordInput onChange={onChangeItem} />
}
