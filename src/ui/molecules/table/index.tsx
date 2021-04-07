import React, { Fragment, memo, MouseEvent, ReactNode, useContext, useEffect, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux'
import CurrencyView from '../../atoms/currency/CurrencyView'
import { Province } from '../../../share/interface/Province'
import { Distance, Service } from '../../../share/interface/Service'
import { Truck } from '../../../share/interface/Truck'
import { Unknown } from '../../../share/interface/Unknown'
import { WEIGHT_UNIT } from '../../../share/utils/service-util'
import { AppState } from '../../../store/types'
import { DownArrowIcon, GarbageIcon, UpArrowIcon } from '../../atoms/icons'
import { NumberInput } from '../../atoms/inputs'
import { fomatNumber } from '../../atoms/inputs/NumberInput'
import Dropdown from '../dropdown'
import DropDownTree, { Source } from '../dropdown-tree'
import { Spinner } from '../loading'
import './style/index.scss'
import { TableContext, tableReducer } from './TableContext'
import { Render, SortOptions, SortType } from './type'
import { useModal } from '../modal'

export type ColumnSpec = {
    key: string
    title?: string | JSX.Element
    sort?: boolean
    className?: string
    render?: Render
    width?: string
}

type ActionOptions = { title: string; render: Render }

interface TableProps {
    columns: Array<ColumnSpec>
    dataSource: Array<Unknown>
    actionOpts?: ActionOptions
    isLoading?: boolean
    isEdit?: boolean
    deleteRow?: (index: number) => void
    deleteColumn?: (index: number) => void
    onFieldChange?: (name: string, value: unknown, positionName?: string) => void
    service?: Service
}

export function Table(props: TableProps): JSX.Element {
    const { columns, dataSource, actionOpts, isLoading } = props
    const cells = columns.map(
        (column): Omit<ColumnSpec, 'title' | 'sort'> => {
            return { key: column.key, render: column.render, className: column.className, width: column.width }
        }
    )
    const [state, dispatch] = useReducer(tableReducer, { cells, dataSource })

    useEffect(() => {
        dispatch({ type: 'dataSource', payload: dataSource })
    }, [dataSource])

    useEffect(() => {
        dispatch({ type: 'isLoading', payload: isLoading })
    }, [isLoading])

    return (
        <TableContext.Provider value={{ cells, dataSource, dispatch }}>
            <table className='table'>
                <THead columns={columns} sortOpts={state.sortOpts} actionOpts={actionOpts} />
                <TBody cells={cells} dataSource={state.dataSource} actionOpts={actionOpts} />
                {isLoading && <Loading />}
            </table>
        </TableContext.Provider>
    )
}

export function ServiceTable(props: TableProps): JSX.Element {
    const { dataSource, actionOpts, isLoading, isEdit, deleteRow, deleteColumn, onFieldChange, service } = props
    const { openModal, closeModal } = useModal()

    const itemCode = service?.isTruck ? 'truckCode' : service?.isWeight ? 'weightTo' : 'price'
    const itemName = service?.isTruck ? 'truckName' : service?.isWeight ? 'weightTo' : 'Giá'

    const provinceDropdown = useSelector<AppState, Province[] | undefined>((state) => state.service?.provinceList)
    const truckDropdown = useSelector<AppState, Truck[] | undefined>((state) => state.service?.truckList)
    const deleteRef = useRef<HTMLSpanElement>(null)

    const columns: ColumnSpec[] = dataSource[0]?.priceArr?.map((w: Unknown, index: number) => {
        return {
            title: isEdit ? (
                <div className='header-table-edit'>
                    {service?.isWeight ? (
                        <NumberInput
                            className='input-weight'
                            fomat={fomatNumber}
                            defaultValue={w[itemCode]}
                            onBlur={(event): void =>
                                onFieldChange &&
                                onFieldChange(
                                    `${itemCode}.${index}`,
                                    Number(event?.target.value.replace(/[^0-9]/g, '')) || 0
                                )
                            }
                        />
                    ) : service?.isTruck ? (
                        <Dropdown
                            className='truck-column'
                            onSelect={(value): void => onFieldChange && onFieldChange(`${itemCode}.${index}`, value)}
                            dataSource={truckDropdown}
                            defaultValue={w[itemCode]}
                        />
                    ) : (
                        <span>{itemName}</span>
                    )}

                    {service?.isWeight && (
                        <Dropdown
                            dataSource={WEIGHT_UNIT}
                            defaultValue={w.priceType}
                            onSelect={(value): void =>
                                onFieldChange && onFieldChange(`priceType.${index}`, Number(value))
                            }
                        />
                    )}
                    {(service?.isTruck || service?.isWeight) && (
                        <span
                            onClick={(): void => {
                                deleteColumn && deleteColumn(index)
                            }}
                            className='icon-delete'>
                            <GarbageIcon />
                        </span>
                    )}
                </div>
            ) : (
                <Fragment>
                    {service?.isWeight && (
                        <span>
                            {w.priceType == 1
                                ? w.weightTo >= 1000
                                    ? `${w.weightTo / 1000} Tấn`
                                    : `${w.weightTo} kg`
                                : `${w.weightTo} Lô`}
                        </span>
                    )}
                    {service?.isTruck && <span>{w[itemName]}</span>}
                    {!service?.isTruck && !service?.isWeight && <span>{itemName}</span>}
                </Fragment>
            ),
            width: '150px',
            key: index,
            className: `${service?.isTruck || service?.isWeight ? `${w[itemCode]} icon-btn-delete` : itemCode}`
        }
    })
    if (service?.isDistance) {
        columns?.unshift({ key: 'positionTo', title: 'Địa chỉ đến', className: 'positionTo', width: '200px' })
        columns?.unshift({ key: 'positionFrom', title: 'Địa chỉ đi', className: 'positionForm', width: '200px' })
    }
    if (isEdit && service?.isDistance)
        columns?.unshift({ key: 'deleteService', title: '', width: '50px', className: 'deleteService' })

    function dataProvince(province: Province[]): Source[] {
        return province.map((item) => {
            return {
                name: item.name as string,
                code: item.code as number,
                child: item.district && dataProvince(item.district)
            }
        })
    }
    const cells = columns?.map(
        (column): Omit<ColumnSpec, 'title' | 'sort'> => {
            const render = (record: Distance, index?: number): ReactNode => {
                if (isEdit) {
                    switch (column.key) {
                        case 'positionTo':
                        case 'positionFrom':
                            return (
                                <div
                                    className='position'
                                    onClick={(): void =>
                                        openModal({
                                            className: 'position-create-modal',
                                            title: column.title as string,
                                            closeOnClickOutside: true,
                                            closeOnEsc: true,
                                            content: (
                                                <DropDownTree
                                                    defaultValue={record[column.key]}
                                                    placeholder='Chọn tỉnh/quận/huyện'
                                                    dataSource={dataProvince(provinceDropdown || [])}
                                                    onSelect={(name, value): void => {
                                                        return (
                                                            onFieldChange &&
                                                                onFieldChange(
                                                                    `${column.key}.${index}`,
                                                                    Number(value),
                                                                    name as string
                                                                ),
                                                            closeModal()
                                                        )
                                                    }}
                                                />
                                            )
                                        })
                                    }>
                                    <div className='input position'>
                                        <span>{record[`${column.key}Name`] ?? column.title}</span>
                                    </div>
                                </div>
                            )
                        case 'deleteService':
                            return (
                                <span
                                    className='delete-columns'
                                    ref={deleteRef}
                                    onClick={(): void => deleteRow && deleteRow(index ?? 0)}>
                                    <GarbageIcon />
                                </span>
                            )

                        default:
                            return (
                                <NumberInput
                                    fomat={fomatNumber}
                                    defaultValue={record.priceArr ? record.priceArr[column.key].price : 0}
                                    onBlur={(event): void =>
                                        onFieldChange &&
                                        onFieldChange(
                                            `price.${index}.${column.key}`,
                                            Number(event?.target.value.replace(/[^0-9]/g, '')) || 0
                                        )
                                    }
                                />
                            )
                    }
                } else {
                    if (column.key !== 'positionTo' && column.key !== 'positionFrom')
                        return (
                            <CurrencyView
                                className='customer-item-price'
                                value={record.priceArr ? record.priceArr[column.key].price : 0}
                            />
                        )
                    return <span className='customer-item-distance'>{record[`${column.key}Name`]}</span>
                }
            }
            return { key: column.key, width: column.width, render: render, className: column.className }
        }
    )

    const [state, dispatch] = useReducer(tableReducer, { cells, dataSource })

    useEffect(() => {
        dispatch({ type: 'dataSource', payload: dataSource })
    }, [dataSource])

    useEffect(() => {
        dispatch({ type: 'isLoading', payload: isLoading })
    }, [isLoading])

    if (!provinceDropdown && isEdit) return <Spinner />
    return (
        <TableContext.Provider value={{ cells, dataSource, dispatch }}>
            <table className='table'>
                <THead columns={columns} sortOpts={state.sortOpts} actionOpts={actionOpts} />
                <TBody cells={cells} dataSource={state.dataSource} actionOpts={actionOpts} />
                {isLoading && <Loading />}
            </table>
        </TableContext.Provider>
    )
}

type TBodyProps = {
    cells: Array<{ key: string; className?: string; render?: Render; width?: string }>
    dataSource: Array<Unknown>
    actionOpts?: ActionOptions
}
const TBody = ({ cells, dataSource, actionOpts }: TBodyProps): JSX.Element => {
    return (
        <tbody>
            {dataSource?.map((item, number) => {
                return (
                    <tr className={`service-cell-${number}`} key={`row-${number}-${Date.now()}`}>
                        {cells?.map(({ key, className = '', render, width }, index) => (
                            <td
                                className={`table__th__cell service-column-${className}`}
                                key={`price-${index}-${Date.now()}`}
                                style={{ width }}>
                                {render ? render(item, number) : (item[key] as string)}
                            </td>
                        ))}
                        {actionOpts && <td className='table__th__cell'>{actionOpts.render(item, number)}</td>}
                    </tr>
                )
            })}
        </tbody>
    )
}

type THeadSortProps = { item: ColumnSpec; sortOpts?: SortOptions }
function THeadSort({ item, sortOpts }: THeadSortProps): JSX.Element {
    const { dispatch = (): boolean => true } = useContext(TableContext)

    function onSortClickHandler(event: MouseEvent<HTMLSpanElement>): void {
        if (event.currentTarget.children[0].classList.contains('active')) return
        dispatch({ type: 'sort', payload: { key: item.key, type: event.currentTarget.getAttribute('data-type') } })
    }

    function checkActive(type: SortType): boolean {
        return sortOpts?.key === item.key && sortOpts?.type === type
    }

    return (
        <div className='table-header-sort'>
            <div className='table-header-sort__content'>
                <span className='table-header-sort__content__text'>{item.title}</span>
                <span className='table-header-sort__content__icon'>
                    <span data-type='ASC' onClick={onSortClickHandler}>
                        <UpArrowIcon
                            className={`table-header-sort__content__icon__up ${checkActive('ASC') && 'active'}`}
                        />
                    </span>
                    <span data-type='DESC' onClick={onSortClickHandler}>
                        <DownArrowIcon
                            className={`table-header-sort__content__icon__down ${checkActive('DESC') && 'active'}`}
                        />
                    </span>
                </span>
            </div>
        </div>
    )
}

type THeadProps = { columns: Array<ColumnSpec>; actionOpts?: ActionOptions; sortOpts?: SortOptions }
const THead = memo(
    function ({ columns, actionOpts, sortOpts }: THeadProps): JSX.Element {
        return (
            <thead className='thead'>
                <tr>
                    {columns?.map((item, index) => (
                        <th
                            className={`table__th__cell service-column-${item.className}`}
                            key={`column-${Date.now()}-${index}`}
                            style={{ minWidth: item.width }}>
                            {item.sort ? <THeadSort key={item.key} item={item} sortOpts={sortOpts} /> : item.title}
                        </th>
                    ))}
                    {actionOpts && <th className='table__th__cell'>{actionOpts.title}</th>}
                </tr>
            </thead>
        )
    },
    (prevProps: THeadProps, nextProps: THeadProps) => prevProps.columns === nextProps.columns
)

function Loading(): JSX.Element {
    return (
        <div className='lds-over'>
            <div className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <label>Đang xử lý ...</label>
            </div>
        </div>
    )
}
