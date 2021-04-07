import React, { ChangeEvent, KeyboardEvent, memo } from 'react'
import { Province } from '../../../../share/interface/Province'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { CustomerSearchParams } from '../../../../store/types'
import { TextInput } from '../../../atoms/inputs'
import Dropdown from '../../../molecules/dropdown'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'

type Props = {
    searchParams?: CustomerSearchParams
    provinceList?: Province[]
    onFinishChange(name: string, value: string | number | undefined): void
}
const CustomerSearchForm = memo(
    ({ provinceList, searchParams = {}, onFinishChange }: Props): JSX.Element => {
        function onEnterSearch(
            event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
            field: string
        ): void {
            const key =
                (event as KeyboardEvent<HTMLInputElement>).which || (event as KeyboardEvent<HTMLInputElement>).key
            if (key === 13) {
                onFinishChange(field, (event as ChangeEvent<HTMLInputElement>).target.value)
            }
        }
        const SearchItem: FormItem[] = [
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                title: 'Mã khách hàng',
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
                title: 'Tên khách hàng',
                name: 'name',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.name}
                        onBlur={(e): void => onFinishChange('name', e?.target?.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'name')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                title: 'Số điện thoại',
                name: 'tel',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.tel}
                        onBlur={(e): void => onFinishChange('tel', e?.target?.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'tel')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                title: 'Được tạo bởi',
                name: 'insertName',
                render: (): JSX.Element => (
                    <TextInput
                        defaultValue={searchParams?.insertName}
                        onBlur={(e): void => onFinishChange('insertName', e?.target?.value)}
                        onKeyPress={(e): void => onEnterSearch(e, 'insertName')}
                    />
                )
            },
            {
                containerClass: 'input-item',
                labelClass: 'label-item ',
                title: 'Tỉnh/Thành phố',
                name: 'province',
                render: (): JSX.Element => (
                    <Dropdown
                        defaultValue={Number(searchParams.province)}
                        onSelect={(value): void => onFinishChange('province', value as number)}
                        dataSource={provinceList}
                    />
                )
            }
        ]
        return (
            <NForm>
                <FormItemGroup
                    items={SearchItem}
                    container={(props): JSX.Element => <div className='form-customer-search' {...props}></div>}
                />
            </NForm>
        )
    },
    (p, n) => !isObjectEmpty(p.searchParams) && !isObjectEmpty(n.searchParams)
)

export default CustomerSearchForm
