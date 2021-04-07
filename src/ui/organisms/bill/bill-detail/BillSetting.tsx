import React from 'react'
import { WebsiteSetting } from '../../../../share/interface/Setting'
import { FieldSpec } from '../../../molecules/table/type'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetsSetting: FieldSpec = {
    progress: 'Trạng thái vận đơn:',
    finance: 'Thông tin kế toán:'
}

export type BillSettingProps = {
    disableItem?: boolean
    progress?: WebsiteSetting
    finance?: WebsiteSetting
}
export default function BillDetailSetting({ progress = {}, finance = {} }: BillSettingProps): JSX.Element {
    const settingValue: CardValue = { progress: progress?.name, finance: finance?.name }

    return <CardDetailItem header='Thông tin trạng thái' dataValue={settingValue} assets={assetsSetting} />
}
