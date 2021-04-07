import React, { ChangeEvent, KeyboardEvent, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { MenuPaths } from '../../../../share/common/app-constants'
import { updateURLSearch } from '../../../../share/utils/app-util'
import { isNullOrUndefined, isStringEmpty } from '../../../../share/utils/empty-util'
import { CustomerSearchParams } from '../../../../store/types'
import { TextInput } from '../../../atoms/inputs'
import { ButtonDanger } from '../../../molecules/buttons'
import Collapse from '../../../molecules/collapse'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'

const SearchProvinceOptions = memo(
    (): JSX.Element => {
        const history = useHistory()
        const searchParams: CustomerSearchParams = {}
        const params = new URLSearchParams(window.location.search)

        params.forEach((value, key) => {
            searchParams[key] = value
        })

        const clearSearch = (): void => {
            if (isStringEmpty(location.search)) return
            updateURLSearch(history, MenuPaths.province, '')
        }

        function onFinishChange(name: string, value: string | number | undefined): void {
            if (isStringEmpty(value) && isNullOrUndefined(searchParams[name])) return
            if (value !== searchParams[name]) {
                updateURLSearch(history, MenuPaths.province, `${name}=${value}`)
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

        const SearchItem: FormItem[] = [
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Mã tỉnh/quận/huyện',
                name: 'code',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.code}
                        onBlur={(e): void => onFinishChange('code', e?.target?.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'code')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                controlClass: 'input-search',
                title: 'Tên tỉnh/quận/huyện',
                name: 'name',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.name}
                        onBlur={(e): void => onFinishChange('name', e?.target?.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'name')}
                    />
                )
            }
        ]

        return (
            <Collapse id='search-province' label='Tìm kiếm tỉnh/quận/huyện'>
                <NForm>
                    <FormItemGroup
                        items={SearchItem}
                        container={(props): JSX.Element => <div className='form-province-search' {...props}></div>}
                    />
                </NForm>
                <div className='btn-province-search'>
                    <ButtonDanger type='reset' onClick={clearSearch}>
                        Xóa tìm kiếm
                    </ButtonDanger>
                </div>
            </Collapse>
        )
    },
    () => !isStringEmpty(location.search)
)

export default SearchProvinceOptions
