import React, { Fragment, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DISCOUNT_UNIT, weightUnitList } from '../../../../share/common/app-constants'
import { Truck } from '../../../../share/interface/Truck'
import { Unknown } from '../../../../share/interface/Unknown'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import { AppState } from '../../../../store/types'
import { formatPrice } from '../../../atoms/currency/CurrencyView'
import { NumberInput } from '../../../atoms/inputs'
import { fomatNumber } from '../../../atoms/inputs/NumberInput'
import Card from '../../../molecules/card'
import Dropdown from '../../../molecules/dropdown'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillPriceProps } from '../bill-detail/BillPrice'

export interface BillPriceFormProps extends BillPriceProps {
    truckId?: string
    isTruck?: boolean
    isWeight?: boolean
    disableItem?: boolean
}

const PricingInfoForm = memo(
    (props: BillPriceFormProps): JSX.Element => {
        const { mainPrice = 0, truckId, weight, discount, extraPrice, total, isTruck, weightUnit, discountUnit } = props
        const priceInfo: FormItem[] = [
            {
                title: 'Cước chính',
                name: 'mainService.price',
                labelClass: 'require',
                defaultValue: mainPrice,
                render: ({ onChange }): JSX.Element => (
                    <NumberInput
                        disabled
                        className='number-input'
                        defaultValue={mainPrice}
                        fomat={formatPrice}
                        onBlur={(e): void => onChange(Number(e?.target.value.replace(/[^0-9]/g, '')))}
                    />
                )
            },
            {
                title: 'Phụ phí thêm',
                name: 'extraPrice',
                labelClass: 'require',
                defaultValue: extraPrice,
                render: ({ onChange }): JSX.Element => {
                    onChange(extraPrice)
                    return (
                        <NumberInput
                            className='number-input'
                            defaultValue={extraPrice}
                            fomat={formatPrice}
                            disabled
                            onChange={(e): void => onChange(Number(e?.target.value))}
                        />
                    )
                }
            },
            {
                title: 'Tổng tiền',
                name: 'total',
                labelClass: 'require',
                containerClass: 'price-input',
                defaultValue: total,
                render: ({ onChange }): JSX.Element => {
                    onChange(total)
                    return (
                        <NumberInput
                            className='number-input'
                            defaultValue={total}
                            fomat={formatPrice}
                            disabled
                            onChange={(e): void => onChange(Number(e?.target.value))}
                        />
                    )
                }
            }
        ]
        return (
            <Card header='Thông tin cước' className='bill-form-item bill-form-price'>
                <WeightItem
                    disableItem={props.disableItem}
                    truckId={truckId}
                    weight={weight}
                    discount={discount}
                    isTruck={isTruck}
                    isWeight={props.isWeight}
                    weightUnit={weightUnit}
                    discountUnit={discountUnit}
                />
                <FormItemGroup
                    items={priceInfo}
                    container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                />
            </Card>
        )
    }
)

export default PricingInfoForm

const WeightItem = memo(
    ({
        truckId,
        weight,
        discount = 0,
        isTruck,
        isWeight,
        weightUnit,
        discountUnit = 1,
        disableItem
    }: BillPriceFormProps): JSX.Element => {
        const truckList = useSelector<AppState, Truck[] | undefined>((state) => state.bill.billDropdown?.truckList)
        const weghtInput: FormItem[] = [
            {
                title: 'Trọng lượng',
                name: 'weight',
                containerClass: 'weight-input',
                labelClass: 'require',
                rules: [{ required: isWeight, message: 'Vui lòng nhập trọng lượng!' }],
                defaultValue: weight,
                render: ({ onChange }): JSX.Element => (
                    <NumberInput
                        disabled={disableItem}
                        fomat={fomatNumber}
                        className='number-input'
                        defaultValue={weight || 0}
                        getValueNumber={onChange}
                    />
                )
            },
            {
                name: 'weightUnit',
                containerClass: 'weight-unit-input',
                defaultValue: weightUnit || weightUnitList[0].code,
                render: ({ onChange }): JSX.Element => (
                    <Dropdown
                        disabled
                        dataSource={weightUnitList}
                        defaultValue={weightUnit || weightUnitList[0].code}
                        onSelect={onChange}
                    />
                )
            }
        ]

        const truckInput: FormItem[] = [
            {
                name: 'truck',
                title: 'Loại xe',
                containerClass: 'truck-type-input',
                labelClass: 'require',
                rules: [{ required: isTruck, message: 'Vui lòng nhập Loại xe!' }],
                defaultValue: truckId,
                selectSource: truckList,
                type: 'select',
                disabled: disableItem
            }
        ]

        const discountItem: FormItem[] = [
            {
                title: 'Chiết khấu',
                name: 'discount',
                defaultValue: discount,
                rules: [{ customValidate: validateDiscount }],
                containerClass: 'discount-input weight-input',
                type: 'numberbox',
                disabled: disableItem
            },
            {
                name: 'discountUnit',
                containerClass: 'discount-input weight-unit-input',
                defaultValue: discountUnit,
                rules: [{ customValidate: validateDiscount }],
                selectSource: DISCOUNT_UNIT,
                type: 'select',
                disabled: disableItem
            }
        ]

        return (
            <Fragment>
                <div style={{ display: isTruck ? 'block' : 'none' }}>
                    <FormItemGroup
                        items={truckInput}
                        container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                    />
                </div>
                <div style={{ display: isTruck ? 'none' : 'block' }}>
                    {useMemo(
                        () => (
                            <FormItemGroup
                                items={weghtInput}
                                container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                            />
                        ),
                        [isWeight, weightUnit]
                    )}
                </div>

                {useMemo(
                    () => (
                        <FormItemGroup
                            items={discountItem}
                            container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                        />
                    ),
                    []
                )}
            </Fragment>
        )
    }
)

function validateDiscount(store: Unknown, errors: Unknown): boolean {
    if (store.discountUnit === 1) {
        store.discount > 100 ? (errors.discount = 'Giá trị chiết khấu không thể lớn hơn 100%') : delete errors.discount
    } else
        store.discount > store.mainService.price + store.extraPrice
            ? (errors.discount = 'Giá trị chiết khấu không thể lớn hơn tổng các dịch vụ')
            : delete errors.discount
    return isNullOrUndefined(errors.discount)
}
