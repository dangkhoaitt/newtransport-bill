import React from 'react'
import { MenuPaths } from '../../../../share/common/app-constants'
import { Unit } from '../../../../share/interface/Unit'
import { UserInfo } from '../../../../share/interface/User'
import { INVENTORY, INVENTORY_CONTENT } from '../../../../share/utils/inventory'
import Anchor from '../../../atoms/link'
import { FieldSpec } from '../../../molecules/table/type'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetInventory: FieldSpec = {
    inventory: 'Trạng thái tồn',
    sendUnit: 'Đơn vị nhận',
    insertBy: 'Nhân viên nhận',
    receiveUnit: 'Đơn vị phát'
}
const assetDeliverMember: FieldSpec = {
    deliverMember: 'Nhân viên phát'
}

export type BillInventoryProps = {
    disableItem?: boolean
    inventory?: number
    deliverMember?: UserInfo
    sendUnit?: Unit
    insertBy?: UserInfo
    receiveUnit?: UserInfo
    provinceCode?: number
    districtCode?: number
}
export default function BillDetailInventory({
    inventory = INVENTORY.INVENTORY_UNIT_TRANSPORT,
    sendUnit = {},
    insertBy = {},
    receiveUnit = {},
    deliverMember = {}
}: BillInventoryProps): JSX.Element {
    const inventoryValue: CardValue = {
        inventory: INVENTORY_CONTENT[inventory],
        sendUnit: sendUnit.name,
        insertBy: (
            <Anchor href={`/${MenuPaths.userDetail}/${insertBy?.userId}`} linkType='text-primary'>
                {insertBy?.name}
            </Anchor>
        ),
        receiveUnit: receiveUnit.name
    }
    const deliverMemberValue: CardValue = {
        deliverMember: (
            <Anchor href={`/${MenuPaths.userDetail}/${deliverMember?.userId}`} linkType='text-primary'>
                {deliverMember?.name}
            </Anchor>
        )
    }

    return (
        <CardDetailItem
            header='Thông tin tồn'
            dataValue={
                inventory === INVENTORY.INVENTORY_USER || inventory === INVENTORY.INVENTORY_END
                    ? { ...inventoryValue, ...deliverMemberValue }
                    : inventoryValue
            }
            assets={
                inventory === INVENTORY.INVENTORY_USER || inventory === INVENTORY.INVENTORY_END
                    ? { ...assetInventory, ...assetDeliverMember }
                    : assetInventory
            }
        />
    )
}
