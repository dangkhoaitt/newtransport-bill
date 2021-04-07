import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { MenuPaths } from '../../../../share/common/app-constants'
import { Customer } from '../../../../share/interface/Customer'
import Anchor from '../../../atoms/link'
import { ColumnSpec, Table } from '../../../molecules/table'
import { FieldSpec } from '../../../molecules/table/type'
import CustomerCard from '../customer-card'

interface CustomerListProps {
    customerList: Customer[]
}

const TableColumns: ColumnSpec[] = [
    {
        key: 'code',
        title: 'Mã khách hàng',
        width: '12%',
        render: (record: Customer): ReactNode => (
            <Anchor linkType='text-primary' href={`/${MenuPaths.customerDetail}/${record.id}`}>
                {record.code}
            </Anchor>
        )
    },
    {
        key: 'name',
        title: 'Tên khách hàng',
        width: '20%',
        render: (record: Customer): ReactNode => (
            <Anchor linkType='text-primary' href={`/${MenuPaths.customerDetail}/${record.id}`}>
                {record.name}
            </Anchor>
        )
    },
    {
        key: 'tel',
        title: 'Điện thoại',
        width: '12%',
        render: (record: Customer): ReactNode => <span>{record.tel}</span>
    },
    {
        key: 'provinceCode',
        title: 'Tỉnh/Thành phố',
        width: '12%',
        render: (record: Customer): ReactNode => <span>{record.province?.name}</span>
    },
    {
        key: 'districtCode',
        title: 'Quận/Huyện',
        render: (record: Customer): ReactNode => <span>{record.district?.name}</span>
    },
    {
        key: 'address',
        title: 'Địa chỉ',
        width: '20%',
        render: (record: Customer): ReactNode => <span>{record.address}</span>
    },
    {
        key: 'insertBy',
        title: 'Được tạo bởi',
        width: '12%',
        render: (record: Customer): ReactNode => (
            <Anchor linkType='text-primary' href={`/${MenuPaths.userDetail}/${record.insertBy?.userId}`}>
                {record.insertBy?.name}
            </Anchor>
        )
    }
]

const assets: FieldSpec = {}
TableColumns.forEach((value) => (assets[value.key] = value.title))

const CustomerList = ({ customerList }: CustomerListProps): JSX.Element => {
    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                {customerList && <Table dataSource={customerList} columns={TableColumns} />}
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div id='customer-list-mobile'>
                    {customerList.map((data, key) => {
                        const { code, name, province, district, insertBy, tel, id, address } = data
                        return (
                            <CustomerCard
                                key={key}
                                assets={assets}
                                dataValue={{
                                    code,
                                    province: province?.name,
                                    district: district?.name,
                                    address,
                                    insertBy: (
                                        <Anchor
                                            linkType='text-primary'
                                            href={`/${MenuPaths.userDetail}/${insertBy?.userId}`}>
                                            {insertBy?.name}
                                        </Anchor>
                                    )
                                }}
                                header={
                                    <Fragment>
                                        <Anchor linkType='text-primary' href={`${MenuPaths.customerDetail}/${id}`}>
                                            {name}
                                        </Anchor>
                                        <span>{tel}</span>
                                    </Fragment>
                                }
                            />
                        )
                    })}
                </div>
            </MediaQuery>
        </Fragment>
    )
}

export default CustomerList
