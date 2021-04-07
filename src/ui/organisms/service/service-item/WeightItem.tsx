import React, { ReactNode, useRef } from 'react'
import { useSelector } from 'react-redux'
import { formatPrice } from '../../../atoms/currency/CurrencyView'
import { Distance } from '../../../../share/interface/Service'
import { Truck } from '../../../../share/interface/Truck'
import { AppState } from '../../../../store/types'
import { AddPlusIcon, GarbageIcon } from '../../../atoms/icons'
import { NumberInput } from '../../../atoms/inputs'
import { fomatNumber } from '../../../atoms/inputs/NumberInput'
import { ButtonIconOnly } from '../../../molecules/buttons'
import Dropdown from '../../../molecules/dropdown'
import { NFormItem } from '../../../molecules/form'
import { ColumnSpec, Table } from '../../../molecules/table'

interface WeightItemProps {
    priceArr: Distance[]
    isTruck?: boolean
    onHandleAddItem: () => void
    onHandleDeleteItem: (index: number) => void
}

const WeightItem = ({ priceArr, isTruck, onHandleAddItem, onHandleDeleteItem }: WeightItemProps): JSX.Element => {
    const deleteRef = useRef<HTMLSpanElement>(null)
    const truckList = useSelector<AppState, Truck[] | undefined>((state) => state.service?.truckList)
    const tableColumns = (): ColumnSpec[] => {
        console.log('truckList :>> ', truckList)
        return [
            {
                key: 'deleteWeight',
                width: '50px',
                render: (_, index?: number): ReactNode => (
                    <span
                        className='delete-columns'
                        ref={deleteRef}
                        onClick={(): void => onHandleDeleteItem(index ?? 0)}>
                        <GarbageIcon />
                    </span>
                )
            },
            {
                key: `${isTruck ? 'truckId' : 'weightTo'}`,
                title: isTruck ? 'Trọng lượng xe' : 'Khối lượng',
                render: (record: Distance, index?: number): ReactNode => (
                    <NFormItem
                        item={{
                            name: `${isTruck ? `priceArr.truckId_${index}` : `priceArr.weightTo_${index}`}`,
                            defaultValue: record.priceArr && record.priceArr[0].weightTo,
                            render: ({ onChange }): JSX.Element => {
                                return isTruck ? (
                                    <Dropdown
                                        // defaultValue={record.priceArr && record.priceArr[0].truckId}
                                        dataSource={truckList}
                                        onSelect={onChange}
                                    />
                                ) : (
                                    <NumberInput
                                        fomat={fomatNumber}
                                        defaultValue={record.priceArr && record.priceArr[0].weightTo}
                                        onBlur={(e): void => {
                                            onChange(Number(e?.target.value.replace(/[^0-9]/g, '')) || 0)
                                        }}
                                    />
                                )
                            }
                        }}
                    />
                )
            },
            {
                key: 'price',
                title: 'Giá tiền',
                render: (record: Distance, index?: number): ReactNode => (
                    <NFormItem
                        item={{
                            name: `priceArr.price.${index}`,
                            defaultValue: record.priceArr && record.priceArr[0].price,
                            render: ({ onChange }): JSX.Element => (
                                <NumberInput
                                    fomat={formatPrice}
                                    defaultValue={record.priceArr && record.priceArr[0].price}
                                    onBlur={(e): void => {
                                        onChange(Number(e?.target.value.replace(/[^0-9]/g, '')) || 0)
                                    }}
                                />
                            )
                        }}
                    />
                )
            }
        ]
    }
    return (
        <div id='service-truck'>
            <Table dataSource={priceArr} columns={tableColumns()} />
            <ButtonIconOnly
                icon={<AddPlusIcon />}
                iconType='primary'
                onClick={(event): void => {
                    event.preventDefault()
                    onHandleAddItem()
                }}
            />
        </div>
    )
}

export default WeightItem
