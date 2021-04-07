import React from 'react'
import { DATE_TIME_AM_FORMAT, MenuPaths } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Province } from '../../../../share/interface/Province'
import { UserInfo } from '../../../../share/interface/User'
import Anchor from '../../../atoms/link'
import { FieldSpec } from '../../../molecules/table/type'
import CardDetailItem, { CardValue } from '../bill-card-detail-item'

const assetsInfo: FieldSpec = {
    code: 'Mã vận đơn:',
    transportFrom: 'Điểm nhận hàng:',
    transportTo: 'Điểm giao hàng:',
    userCode: 'Nhân viên thực hiện:',
    insertTime: 'Ngày tạo:'
}

export type BillInfoProps = {
    user?: UserInfo
    code?: string
    distance?: Distance
    insertTime?: number
}

export type Distance = {
    provinceFrom?: Province
    districtFrom?: Province
    provinceTo?: Province
    districtTo?: Province
}

export default function BillDetailInfo(props: BillInfoProps): JSX.Element {
    const { user, code, distance = {}, insertTime } = props
    const { provinceFrom, provinceTo, districtTo, districtFrom } = distance

    function getNameDistance(province?: Province, district?: Province): string {
        if (district?.name && province?.name) return `${district?.name}, ${province?.name}`
        else return `${district?.name || ''} ${province?.name || ''}`
    }

    const infoValue: CardValue = {
        userCode: (
            <Anchor href={`/${MenuPaths.userDetail}/${user?.userId}`} linkType='text-primary'>
                {user?.name}
            </Anchor>
        ),
        code: code,
        transportFrom: getNameDistance(provinceFrom, districtFrom),
        transportTo: getNameDistance(provinceTo, districtTo),
        insertTime: <DateView format={DATE_TIME_AM_FORMAT} time={insertTime} />
    }

    return <CardDetailItem header='Thông tin vận đơn' dataValue={infoValue} assets={assetsInfo} />
}
