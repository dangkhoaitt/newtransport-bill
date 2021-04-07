import React, { Fragment, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import MediaQuery from 'react-responsive'
import { MenuPaths, rolesUserSearch } from '../../../../share/common/app-constants'
import { User } from '../../../../share/interface/User'
import { AppLabels, AppState } from '../../../../store/types'
import Anchor from '../../../atoms/link'
import { ColumnSpec, Table } from '../../../molecules/table'
import { FieldSpec } from '../../../molecules/table/type'
import UserCard from '../user-card'

interface Props {
    data: User[]
}

export default function UserList({ data }: Props): JSX.Element {
    const { userFields = {} } = useSelector<AppState, AppLabels>((state) => state.app.labels)

    const TableColumns: ColumnSpec[] = [
        {
            key: 'code',
            title: userFields.code,
            width: '15%',
            render: (record: User): ReactNode => (
                <Anchor linkType='text-primary' href={`/${MenuPaths.userDetail}/${record.id}`}>
                    {record.code}
                </Anchor>
            )
        },
        {
            key: 'username',
            title: userFields.username,
            width: '15%',
            render: (record: User): ReactNode => <div>{record.username}</div>
        },
        {
            key: 'name',
            title: userFields.name,
            width: '20%',
            render: (record: User): ReactNode => <div>{record.name}</div>
        },
        {
            key: 'role',
            title: userFields.role,
            width: '15%',
            render: (record: User): ReactNode => <div>{record.role && rolesUserSearch[record.role]}</div>
        },
        {
            key: 'tel',
            title: userFields.tel,
            width: '15%',
            render: (record: User): ReactNode => <div>{record.tel}</div>
        },
        {
            key: 'email',
            title: userFields.email,
            width: '20%',
            render: (record: User): ReactNode => <div>{record.email}</div>
        }
    ]

    const assets: FieldSpec = {}
    TableColumns.forEach((value) => (assets[value.key] = value.title ?? ''))

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <Table dataSource={data} columns={TableColumns} />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                {data.map((item, index) => (
                    <UserCard
                        assets={assets}
                        key={index}
                        header={
                            <Anchor linkType='text-primary' href={`${MenuPaths.userDetail}/${item.id}`}>
                                {item?.name}
                            </Anchor>
                        }
                        data={item}
                    />
                ))}
            </MediaQuery>
        </Fragment>
    )
}
