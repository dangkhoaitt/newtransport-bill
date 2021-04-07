import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { UNIT_URL } from '../../../../share/common/api-constants'
import { useGetRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { Unit } from '../../../../share/interface/Unit'
import { isNullOrUndefined, isObjectEmpty } from '../../../../share/utils/empty-util'
import { EMPTY_PROVINCE } from '../../../../share/utils/province-util'
import { GarbageBoldIcon } from '../../../atoms/icons'
import { ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../../molecules/form'
import { ColumnSpec, Table } from '../../../molecules/table'
import './style/style.scss'

type Props = {
    province: Province
    submit: (data: Province) => void
}

const ProvinceForm = ({ province, submit }: Props): JSX.Element => {
    const [newProvince, setNewProvince] = useState<Province>({ ...province })
    const [unit, setUnit] = useState<Unit[] | undefined>()

    useEffect(() => {
        if (isObjectEmpty(province)) {
            setNewProvince(EMPTY_PROVINCE)
        } else {
            setNewProvince({ ...province })
        }
    }, [province])

    useGetRequest({
        url: UNIT_URL,
        ignore: !!unit,
        callback: (response) => {
            setUnit(response.data)
        }
    })

    const provinceParentItem: FormItem[] = [
        {
            title: `Mã tỉnh/thành`,
            name: 'code',
            type: 'numberbox',
            disabled: province?.code ? true : false,
            rules: [{ required: true, message: 'Mã tỉnh thành không được phép để trống' }],
            containerClass: 'form-container',
            labelClass: 'form-label require',
            controlClass: 'form-value'
        },
        {
            title: `Tên tỉnh/thành`,
            name: 'name',
            type: 'textbox',
            rules: [{ required: true, message: 'Tên tỉnh thành không được phép để trống' }],
            containerClass: 'form-container',
            labelClass: 'form-label require',
            controlClass: 'form-value'
        },
        {
            title: 'Đơn vị',
            name: 'unitCode',
            selectSource: unit,
            defaultValue: newProvince.unit?.code,
            type: 'select',
            rules: [{ required: true, message: 'Vui lòng chọn đơn vị' }],
            containerClass: 'form-container',
            labelClass: 'form-label require',
            controlClass: 'form-value'
        }
    ]

    function onFieldChange(name: string, value: unknown): void {
        if (name.split('.').length === 1) {
            newProvince[name] = value
        } else {
            const districtArr = newProvince.district
            const index = name.split('.')[0].split('_')[1]
            if (districtArr) {
                if (name.split('.')[1] === 'code') {
                    districtArr[index][name.split('.')[1]] = Number(value)
                } else districtArr[index][name.split('.')[1]] = value
            }
            setNewProvince({ ...newProvince, district: districtArr })
        }
    }

    const onFinish = (): void => {
        const districtArr = [...(newProvince.district ?? [])]
        for (let index = 0; index < districtArr.length; index++) {
            const district = { ...districtArr[index] }
            if (isNullOrUndefined(district.code) && isNullOrUndefined(district.name)) delete districtArr[index]
        }
        setNewProvince({ ...newProvince, district: districtArr })
        submit(newProvince)
    }

    function onAddDistrict(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
        event?.preventDefault()
        const districtArr = [...(newProvince.district ?? [])]
        districtArr.push({})
        setNewProvince({ ...newProvince, district: [...districtArr] })
    }

    function onMinusDistrict(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number): void {
        event?.preventDefault()
        const districtArr = [...(newProvince.district ?? [])]
        districtArr.splice(index, 1)
        setNewProvince({ ...newProvince, district: [...districtArr] })
    }

    const TableColumns: ColumnSpec[] = [
        {
            key: 'code',
            title: 'Mã',
            width: '100px',
            className: 'text-center',
            render: (record: Province, index?: number): ReactNode => {
                return (
                    <FormItemGroup
                        items={[
                            {
                                name: `district_${index}.code`,
                                defaultValue: record.code,
                                type: 'numberbox',
                                disabled: record.code ? true : false,
                                containerClass: 'form-container district-item-form',
                                controlClass: 'form-value',
                                rules: [{ required: true, message: 'Mã tỉnh thành không được phép để trống' }]
                            }
                        ]}
                        container={(props): JSX.Element => <div className='input-table' {...props} />}
                    />
                )
            }
        },
        {
            key: 'name',
            title: 'Tên quận huyện',
            render: (record: Province, index?: number): ReactNode => (
                <FormItemGroup
                    items={[
                        {
                            name: `district_${index}.name`,
                            defaultValue: record.name,
                            type: 'textbox',
                            containerClass: 'form-container district-item-form',
                            controlClass: 'form-value',
                            rules: [{ required: true, message: 'Tên quận huyện không được phép để trống' }]
                        }
                    ]}
                    container={(props): JSX.Element => <div className='input-table' {...props} />}
                />
            )
        },
        {
            key: 'unitCode',
            title: 'Đơn vị',
            render: (record: Province, index?: number): ReactNode => {
                return (
                    <FormItemGroup
                        items={[
                            {
                                name: `district_${index}.unitCode`,
                                selectSource: unit,
                                defaultValue: record.unitCode ?? record.unit?.code,
                                type: 'select',
                                rules: [{ required: true, message: 'Vui lòng chọn đơn vị' }],
                                containerClass: 'form-container district-item-form',
                                controlClass: 'form-value'
                            }
                        ]}
                        container={(props): JSX.Element => <div className='input-table' {...props} />}
                    />
                )
            }
        },
        {
            key: 'deleteProvince',
            title: 'Xóa',
            width: '5%',
            className: 'border-columns text-center',
            render: (_, index?: number): ReactNode => (
                <span onClick={(e): void => onMinusDistrict(e, index ?? 0)}>
                    <GarbageBoldIcon />
                </span>
            )
        }
    ]

    return (
        <NForm
            className='province-form-create'
            onFinish={onFinish}
            initialValues={{ ...newProvince, unit: newProvince.unit?.code }}
            onFieldChange={onFieldChange}>
            <FormItemGroup items={[...provinceParentItem]} container={(props): JSX.Element => <Card {...props} />} />
            <Card
                className='district-card'
                header={
                    <Fragment>
                        <span onClick={(event): void => onAddDistrict(event)} className='icon-title-add'>
                            Thêm quận/huyện
                        </span>
                    </Fragment>
                }>
                <Table columns={TableColumns} dataSource={[...(newProvince.district ?? [])]} />
            </Card>

            <ButtonPrimary type='submit'>Lưu</ButtonPrimary>
        </NForm>
    )
}

export default ProvinceForm
