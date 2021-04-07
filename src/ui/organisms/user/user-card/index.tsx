import React, { Fragment, ReactNode } from 'react'
import { DATE_TIME_FORMAT, rolesUser } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { User } from '../../../../share/interface/User'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import Card from '../../../molecules/card'
import { FieldSpec } from '../../../molecules/table/type'

interface UserCardProps {
    assets: FieldSpec
    id?: string
    header?: ReactNode
    data: User
}

const UserCard = ({ id, header, data, assets }: UserCardProps): JSX.Element => {
    function cardValue(key: string, value: string): ReactNode {
        if (key === 'unit') return data.unit?.name
        if (key === 'role') return rolesUser[value]
        if (key === 'insertTime') return <DateView time={value} format={DATE_TIME_FORMAT} />
        return value
    }

    return (
        <Card id={id} header={header}>
            {Object.keys(assets).map((key, index) => {
                if (isNullOrUndefined(data[key])) return <Fragment key={index} />
                return (
                    <div key={index} className='user-input-item'>
                        <label className='label-item'>{assets[key]}</label>
                        <div className='value-item'>{data && cardValue(key, data[key])}</div>
                    </div>
                )
            })}
        </Card>
    )
}

export default UserCard
