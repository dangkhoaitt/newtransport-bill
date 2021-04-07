import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Goods } from '../../../../share/interface/Bill'
import { Package } from '../../../../share/interface/Package'
import { AppState } from '../../../../store/types'
import { AddPlusIcon, MinusIcon } from '../../../atoms/icons'
import { ButtonIconOnly } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillGoodsProps } from '../bill-detail/BillGoods'

const GoodsContentInfoForm = memo(
    ({ goodsInfo, disableItem }: BillGoodsProps): JSX.Element => {
        const [goodsItem, setGoodsItem] = useState<GoodsItemProps[]>(
            goodsInfo?.map((item, index) => ({ item, index, deleted: false })) || [{ index: 0, deleted: false }]
        )
        function onHandleAddContent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
            event.preventDefault()
            const newItem = [...goodsItem]
            newItem.push({ item: {}, index: newItem.length, deleted: false })
            setGoodsItem(newItem)
        }

        function onRemoveGoodsItem(index: number): void {
            const newItem = [...goodsItem]
            newItem[index].deleted = true
            setGoodsItem(newItem)
        }
        const goodsFormItem = goodsItem.map((item, index) => {
            const removeButton: FormItem[] = [
                {
                    name: `goodsInfo${item.index}.check`,
                    defaultValue: true,
                    containerClass: 'btn-delete-goods',
                    render: ({ onChange }): JSX.Element => (
                        <ButtonIconOnly
                            onClick={(e): void => {
                                e.preventDefault()
                                onChange(false)
                                onRemoveGoodsItem(index)
                            }}
                            icon={<MinusIcon />}
                            iconType='default'
                        />
                    )
                }
            ]

            return (
                <div key={item.index} className='goods-group-value'>
                    <GoodsContentItem
                        disabled={disableItem}
                        key={item.index}
                        item={item.item}
                        index={item.index}
                        deleted={item.deleted}
                    />
                    {!item.deleted && !disableItem && (
                        <FormItemGroup
                            items={removeButton}
                            container={(props): JSX.Element => <div className='custom-form' {...props} />}
                        />
                    )}
                </div>
            )
        })

        return (
            <Card header='Nội dung hàng hóa' className='bill-form-item bill-form-goods'>
                {goodsFormItem}
                <ButtonIconOnly onClick={onHandleAddContent} iconType='primary' icon={<AddPlusIcon />} />
            </Card>
        )
    }
)

export default GoodsContentInfoForm

type GoodsItemProps = { item?: Goods; index: number; deleted: boolean; disabled?: boolean }

const GoodsContentItem = memo(
    ({ item, index, deleted, disabled: disabled }: GoodsItemProps): JSX.Element => {
        const packageList = useSelector<AppState, Package[] | undefined>(
            (state) => state.bill.billDropdown?.packageList
        )
        const goodsContentItem: FormItem[] = [
            {
                name: `goodsInfo${index}.quantity`,
                type: 'numberbox',
                controlClass: 'number-input',
                placeholder: 'Số lượng',
                disabled,
                defaultValue: item?.quantity
            },
            {
                name: `goodsInfo${index}.package`,
                type: 'select',
                defaultValue: item?.package,
                selectSource: packageList,
                disabled,
                placeholder: 'Số kiện'
            },
            {
                name: `goodsInfo${index}.content`,
                defaultValue: item?.content,
                rules: [
                    {
                        pattern: /^[\p{L}|0-9]+([',. -]|[\p{L}|0-9])*$/u,
                        message: 'Tên hàng hóa không được chứa ký tự đặc biệt'
                    }
                ],
                placeholder: 'Tên hàng hóa',
                disabled,
                type: 'textbox'
            }
        ]
        return (
            <div style={{ display: deleted ? 'none' : 'block' }}>
                <FormItemGroup
                    items={goodsContentItem}
                    container={(props): JSX.Element => <div className='custom-form' {...props} />}
                />
            </div>
        )
    },
    (_, next) => !next.deleted
)
