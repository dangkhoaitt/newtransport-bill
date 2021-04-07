import React, { ChangeEvent, KeyboardEvent, memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isNullOrUndefined } from 'util'
import { USER_URL } from '../../../../share/common/api-constants'
import { MenuPaths, rolesUser } from '../../../../share/common/app-constants'
import { useSearchRequest } from '../../../../share/hooks'
import { buildQuerySearchFromObject, updateURLSearch } from '../../../../share/utils/app-util'
import { isStringEmpty } from '../../../../share/utils/empty-util'
import { DO_SEARCH_USER } from '../../../../store/actions/user.action'
import { AppLabels, AppState, UserSearchParams } from '../../../../store/types'
import { TextInput } from '../../../atoms/inputs'
import { ButtonDanger } from '../../../molecules/buttons'
import Collapse from '../../../molecules/collapse'
import Dropdown, { Source } from '../../../molecules/dropdown'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
type Props = { querySearch?: string }

const UserSearch = memo(
    ({ querySearch }: Props): JSX.Element => {
        const history = useHistory()
        const searchRequest = useSearchRequest()
        const { userFields = {} } = useSelector<AppState, AppLabels>((state) => state.app.labels)
        const searchParams: UserSearchParams = {}
        const params = new URLSearchParams(querySearch)
        params.forEach((value, key) => {
            searchParams[key] = value
        })

        const selectRole: Source[] = Object.keys(rolesUser).map((key) => {
            return { code: key, name: rolesUser[key] }
        })

        const SearchItem: FormItem[] = [
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: userFields.name,
                name: 'name',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.name}
                        onBlur={(e): void => onFinishChange('name', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'name')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: userFields.username,
                name: 'username',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.username}
                        onBlur={(e): void => onFinishChange('username', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'username')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: userFields.tel,
                name: 'tel',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.tel}
                        onBlur={(e): void => onFinishChange('tel', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'tel')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: userFields.email,
                name: 'email',
                type: 'textbox',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.email}
                        onBlur={(e): void => onFinishChange('email', e?.target.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'email')}
                    />
                )
            },
            {
                containerClass: 'input-item ',
                labelClass: 'label-item ',
                title: userFields.role,
                controlClass: 'input-search ',
                name: 'role',
                render: (): JSX.Element => (
                    <Dropdown
                        placeholder='Tìm kiếm theo loại người dùng'
                        defaultValue={`${searchParams?.role}`}
                        isNoSelect
                        onSelect={(value): void => onFinishChange('role', value as string)}
                        dataSource={selectRole}
                        className='user-dropdown'
                    />
                )
            }
        ]

        const requestHandler = (name: string, value: unknown): void => {
            const clear = name === 'clear'
            const params = clear ? { page: 1 } : { [name]: value, page: 1 }
            const newSearch = clear ? params : Object.assign(searchParams, params)
            const querySearch = '?' + buildQuerySearchFromObject(newSearch)

            searchRequest({ url: USER_URL + querySearch, actionType: DO_SEARCH_USER })
        }

        function onFinishChange(name: string, value: string | undefined): void {
            if (isStringEmpty(value as string) && isNullOrUndefined(searchParams[name])) return
            if (value !== searchParams[name]) {
                updateURLSearch(history, MenuPaths.user, `${name}=${value}`)
                searchParams[name] = value
                requestHandler(name, value)
            }
        }

        function onEnterSearch(
            event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
            field: string
        ): void {
            const key = (event as KeyboardEvent<HTMLInputElement>).which
            if (key === 13) {
                onFinishChange(field, (event as ChangeEvent<HTMLInputElement>).target.value)
            }
        }

        const clearAll = useCallback(() => {
            if (isStringEmpty(location.search)) return
            updateURLSearch(history, MenuPaths.user, '')
            requestHandler('clear', '')
        }, [])

        return (
            <Collapse id='search-user' label='Tìm kiếm tài khoản'>
                <NForm className='forms'>
                    <FormItemGroup
                        items={SearchItem}
                        container={(props): JSX.Element => <div className='form-user-search' {...props} />}
                    />
                </NForm>
                <div className='btn-user-search'>
                    <ButtonDanger onClick={clearAll} type='submit'>
                        Xóa tìm kiếm
                    </ButtonDanger>
                </div>
            </Collapse>
        )
    },
    (_, next) => !isStringEmpty(next)
)

export default UserSearch
