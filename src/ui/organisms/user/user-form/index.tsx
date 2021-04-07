import React, { Fragment, memo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { UNIT_URL } from '../../../../share/common/api-constants'
import { Roles, rolesUser } from '../../../../share/common/app-constants'
import { useGetRequest } from '../../../../share/hooks'
import { Unit } from '../../../../share/interface/Unit'
import { Unknown } from '../../../../share/interface/Unknown'
import { User } from '../../../../share/interface/User'
import { isArrayEmpty, isNullOrUndefined, isObjectEmpty, isStringEmpty } from '../../../../share/utils/empty-util'
import { FETCH_UNIT_USER } from '../../../../store/actions/user.action'
import { AppLabels, AppState } from '../../../../store/types'
import { TextInput } from '../../../atoms/inputs'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import { DatePicker } from '../../../molecules/date-picker'
import { Source } from '../../../molecules/dropdown'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import './style/index.scss'

interface Props {
    user?: User
    isEdit?: boolean
    unitUser?: string
    onFinish: (values: Unknown) => void
}

export const UserForm = memo(
    ({ user, isEdit, onFinish }: Props): JSX.Element => {
        const formValues = useRef<Unknown>({})
        const buttonRef = useRef<HTMLButtonElement>(null)
        const { userFields = {} } = useSelector<AppState, AppLabels>((state) => state.app.labels)
        const unit = useSelector<AppState, Unit[] | undefined>((state) => state.user.unit)
        const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

        const selectRole: Source[] = Object.keys(rolesUser).map((key) => {
            return { code: key, name: rolesUser[key] }
        })

        useGetRequest({ url: UNIT_URL, ignore: !!unit, actionType: FETCH_UNIT_USER })

        const infoLogin: FormItem[] = [
            {
                title: userFields.username,
                containerClass: 'input-item',
                labelClass: 'require label-item',
                controlClass: 'input-name',
                name: 'username',
                rules: [
                    { required: true, message: 'Vui lòng nhập tên đăng nhập !' },
                    {
                        pattern: /^[A-Za-z0-9]{5,20}(?:[ _-][A-Za-z0-9]+)*$/,
                        message: 'Tên đăng nhập nên từ 5-20 kí tự và không chứa kí tự đặc biệt!'
                    }
                ],
                defaultValue: user?.username,
                type: 'textbox'
            }
        ]
        const infoUser: FormItem[] = [
            {
                title: userFields.name,
                containerClass: 'input-item',
                labelClass: 'require label-item ',
                controlClass: 'input-name',
                name: 'name',
                rules: [
                    { required: true, message: 'Vui lòng nhập họ tên !' },
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Họ và tên không được chứa ký tự đặc biệt'
                    }
                ],
                defaultValue: user?.name,
                type: 'textbox'
            },
            {
                title: userFields.role,
                containerClass: 'input-item ',
                labelClass: 'require label-item ',
                controlClass: 'input-name ',
                name: 'role',
                rules: [{ required: true, message: 'Vui lòng phân quyền cho tài khoản!' }],
                defaultValue: user?.role,
                selectSource: selectRole,
                type: 'select'
            },
            {
                title: userFields.unit,
                containerClass: 'input-item ',
                labelClass: 'require label-item ',
                controlClass: 'input-name ',
                name: 'unit',
                disabled: userLogin?.role === Roles.manager,
                rules: [{ required: true, message: 'Vui lòng chọn đơn vị!' }],
                defaultValue: userLogin?.role === Roles.manager ? userLogin.unit?.code : user?.unit?.code,
                selectSource: unit,
                type: 'select'
            },
            {
                title: userFields.tel,
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-name',
                name: 'tel',
                rules: [{ pattern: /^((?:[0-9+)(-.] ?){6,20}[0-9])*$/, message: 'Số điện thoại không hợp lệ!' }],
                defaultValue: user?.tel || '',
                render: ({ onChange }): JSX.Element => (
                    <TextInput defaultValue={user?.tel || ''} onBlur={(e): void => onChange(e?.target.value)} />
                )
            },
            {
                title: userFields.birthday,
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-name ',
                name: 'birthday',
                defaultValue: user?.birthday,
                render: ({ onChange }): JSX.Element => (
                    <DatePicker maxDate={new Date()} onChange={onChange} value={user?.birthday} />
                )
            },
            {
                title: userFields.email,
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-name',
                name: 'email',
                rules: [
                    {
                        pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,6})*$/,
                        message: 'Email sai định dạng (ví dụ:abc@xyz.com)!'
                    }
                ],
                defaultValue: user?.email || '',
                render: ({ onChange }): JSX.Element => (
                    <TextInput defaultValue={user?.email || ''} onBlur={(e): void => onChange(e?.target.value)} />
                )
            },
            {
                title: userFields.address,
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-name',
                name: 'address',
                defaultValue: user?.address,
                type: 'textbox'
            }
        ]

        function onHandleSubmit(values: User): void {
            isEdit ? onFinish(formValues.current) : onFinish(values)
        }

        const onFieldChange = (name: string, value: unknown): void => {
            if (!isEdit) return
            if (user && (value === user[name] || (isNullOrUndefined(user[name]) && isStringEmpty(value as string)))) {
                delete formValues.current[name]
            } else {
                if (typeof value === 'boolean') formValues.current[name] = value[name]
                else formValues.current[name] = value
            }
            if (isObjectEmpty(formValues.current)) {
                buttonRef.current?.setAttribute('disabled', 'true')
            } else buttonRef.current?.removeAttribute('disabled')
        }

        if (isArrayEmpty(unit)) return <Fragment />
        return (
            <div id='user-form'>
                <NForm className='forms' onFinish={onHandleSubmit} onFieldChange={onFieldChange}>
                    <FormItemGroup
                        items={isEdit ? infoUser : [...infoLogin, ...infoUser]}
                        container={(props): JSX.Element => <Card className='form-user-modal' {...props} />}
                    />
                    <ButtonPrimary ref={buttonRef} disabled={isEdit}>
                        Lưu
                    </ButtonPrimary>
                </NForm>
            </div>
        )
    },
    () => true
)
