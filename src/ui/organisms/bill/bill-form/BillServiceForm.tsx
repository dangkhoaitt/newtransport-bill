import React, { memo, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Service } from '../../../../share/interface/Service'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import { AppState } from '../../../../store/types'
import CurrencyView, { formatPrice } from '../../../atoms/currency/CurrencyView'
import { NumberInput } from '../../../atoms/inputs'
import CheckboxInput from '../../../atoms/inputs/CheckboxInput'
import Card from '../../../molecules/card'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillServiceProps } from '../bill-detail/BillService'

const BillServiceForm = memo(
    ({ mainService, extraService, disableItem }: BillServiceProps): JSX.Element => {
        const mainServiceList = useSelector<AppState, Service[] | undefined>(
            (state) => state.bill.billDropdown?.mainServiceList
        )
        const extraServiceList = useSelector<AppState, Service[] | undefined>(
            (state) => state.bill.billDropdown?.extraServiceList
        )

        const serviceInfo: FormItem[] = [
            {
                title: 'Dịch vụ chính',
                name: 'mainService.code',
                defaultValue: mainService?.code,
                labelClass: 'require',
                rules: [{ required: true, message: 'Vui lòng chọn dịch vụ chính!' }],
                type: 'select',
                selectSource: mainServiceList,
                disabled: disableItem
            }
        ]

        return (
            <Card header='Thông tin dịch vụ' className='bill-form-item bill-service'>
                {useMemo(
                    () => (
                        <FormItemGroup
                            items={serviceInfo}
                            container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                        />
                    ),
                    []
                )}

                <div className='bill-service-extra'>
                    <label>Dịch vụ cộng thêm</label>
                    {disableItem ? (
                        <div className='service-value'>
                            {extraService?.map((item) => (
                                <div key={item.code} className='service-extra-value'>
                                    {item.name}
                                    {CurrencyView({ value: item.priceByUser || item.price || 0 })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        extraServiceList
                            ?.filter(
                                (e) => !(mainService?.isTruck && e.isWeight) && !(mainService?.isWeight && e.isTruck)
                            )
                            ?.map((item) => {
                                const newExtraItem = extraService?.find((e) => e.code === item.code)
                                return (
                                    <RenderExtraItem
                                        key={item.id}
                                        item={newExtraItem || item}
                                        checked={!isNullOrUndefined(newExtraItem)}
                                        defaultValue={newExtraItem?.price}
                                    />
                                )
                            })
                    )}
                </div>
            </Card>
        )
    }
)

export default BillServiceForm
interface ExtraProps {
    item: Service
    checked: boolean
    defaultValue?: number
}

const RenderExtraItem = memo(
    ({ item, checked, defaultValue }: ExtraProps): JSX.Element => {
        const [isChecked, setIsChecked] = useState<boolean>(checked)
        function onHandleItem(
            onChange: (value: unknown) => void,
            event?: React.ChangeEvent<HTMLInputElement> | undefined
        ): void {
            const value = event?.currentTarget.checked || false
            onChange(value)
            setIsChecked(value)
        }

        const extraItem: FormItem[] = [
            {
                containerClass: ' input-item',
                title: item.name,
                name: `extraService-${item?.id}-.check`,
                defaultValue: checked,
                render: ({ onChange }): JSX.Element => (
                    <CheckboxInput defaultChecked={isChecked} onChange={(e): void => onHandleItem(onChange, e)} />
                )
            },
            {
                containerClass: 'input-price-extra input-item',
                name: `extraService-${item?.id}-.price`,
                defaultValue: defaultValue,
                render: ({ onChange }): JSX.Element => (
                    <div className='value-extra' style={{ display: `${isChecked ? 'block' : 'none'}` }}>
                        <NumberInput
                            disabled
                            fomat={formatPrice}
                            defaultValue={defaultValue}
                            placeholder='Giá tiền'
                            onBlur={(e): void => onChange(Number(e?.target.value.replace(/[^0-9]/g, '')))}
                        />
                    </div>
                )
            }
        ]

        return (
            <div key={item.code} className='extra-item'>
                <FormItemGroup
                    items={extraItem}
                    container={(props): JSX.Element => <div className='custom-form ' {...props} />}
                />
            </div>
        )
    },
    (prv, next) => prv.checked === next.checked && prv.defaultValue === next.defaultValue
)
