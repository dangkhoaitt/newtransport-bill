import React, { memo, ReactNode, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { USER_URL } from '../../../../share/common/api-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Province } from '../../../../share/interface/Province'
import { WebsiteSetting } from '../../../../share/interface/Setting'
import { User } from '../../../../share/interface/User'
import { INVENTORY, INVENTORY_SOURCE } from '../../../../share/utils/inventory'
import { AppState } from '../../../../store/types'
import Card from '../../../molecules/card'
import Dropdown from '../../../molecules/dropdown'
import { FormItem, FormItemGroup } from '../../../molecules/form'
import { BillInventoryProps } from '../bill-detail/BillInventory'

const BillInventoryForm = memo(
    (props: BillInventoryProps): JSX.Element => {
        const provinceList = useSelector<AppState, Province[] | undefined>(
            (state) => state.bill.billDropdown?.provinceList
        )
        const [userList, setUserList] = useState<User[] | undefined>()
        const [isMember, setIsMember] = useState<boolean>(props.inventory === INVENTORY.INVENTORY_USER || false)
        const submitRequest = useSubmitRequest()
        const unitCode =
            props.receiveUnit?.code ||
            (!props.districtCode
                ? provinceList?.find((p) => p.code === props.provinceCode)?.unit?.code
                : provinceList
                      ?.find((p) => p.code === props.provinceCode)
                      ?.district?.find((d) => d.code === props.districtCode)?.unit?.code)

        useEffect(() => {
            if (isMember && unitCode) {
                submitRequest({
                    url: USER_URL + `?unitCode=${unitCode}`,
                    isConfirm: false,
                    method: HttpMethod.GET,
                    callback: (response) => {
                        setUserList(response.response.data)
                    }
                })
            }
        }, [unitCode, isMember])

        function validateInventory(store: BillInventoryProps, errors: WebsiteSetting): boolean {
            if (isMember) {
                !store.deliverMember
                    ? (errors.deliverMember = 'Vui lòng chọn nhân viên phát!')
                    : delete errors.deliverMember
            } else {
                delete errors.deliverMember
            }
            return !errors.deliverMember
        }

        const inventoryItem: FormItem[] = [
            {
                title: 'Trạng thái tồn',
                name: 'inventory',
                labelClass: 'require',
                rules: [
                    { required: true, message: 'Vui lòng chọn trạng thái tồn!' },
                    { customValidate: validateInventory }
                ],
                containerClass: 'bill-seting-status',
                defaultValue: props.inventory,
                render: ({ onChange }): ReactNode => {
                    return (
                        <Dropdown
                            disabled={props?.disableItem}
                            dataSource={INVENTORY_SOURCE}
                            onSelect={(type): void => {
                                setIsMember(type === INVENTORY.INVENTORY_USER)
                                onChange(type)
                            }}
                            defaultValue={props.inventory}></Dropdown>
                    )
                }
            }
        ]
        const memberItem: FormItem[] = [
            {
                title: 'Nhân viên phát',
                name: 'deliverMember',
                labelClass: 'require',
                containerClass: 'bill-seting-status',
                rules: [{ customValidate: validateInventory }],
                type: 'select',
                disabled: props?.disableItem,
                selectSource: userList,
                defaultValue: props.deliverMember?.code
            }
        ]

        return (
            <Card header='Thông tin tồn' className='bill-form-item'>
                {useMemo(
                    () =>
                        inventoryItem && (
                            <FormItemGroup
                                items={inventoryItem}
                                container={(props): JSX.Element => <div className='custom-form' {...props} />}
                            />
                        ),
                    []
                )}
                {useMemo(
                    () =>
                        isMember && (
                            <FormItemGroup
                                items={memberItem}
                                container={(props): JSX.Element => <div className='custom-form' {...props} />}
                            />
                        ),
                    [isMember, userList]
                )}
            </Card>
        )
    }
)

export default BillInventoryForm
