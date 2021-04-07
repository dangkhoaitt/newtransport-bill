import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { DATE_TIME_AM_FORMAT } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Package } from '../../../../share/interface/Package'
import { PACKAGE_DELETE } from '../../../../store/actions/package.action'
import { ColumnSpec } from '../../../molecules/table'
import ModalPackageEdit from '../modal-edit/ModalPackageEdit'
import PackageCard from '../package-card/PackageCard'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import { PACKAGE_URL } from '../../../../share/common/api-constants'
interface Props {
    data: Package[]
}

export default function PackageList({ data }: Props): JSX.Element {
    const TableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center ',
            render: (record: Package): ReactNode => <span>{record.order}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Package): ReactNode => <span>{record.code}</span>
        },
        {
            key: 'name',
            title: 'Tên kiện hàng',
            render: (record: Package): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'border-column text-center',
            render: (record: Package): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='package'
                    url={PACKAGE_URL}
                    data={data}
                    actionType={PACKAGE_DELETE}
                    ModalComponent={ModalPackageEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <PackageCard key={`${item}-${index}`} data={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
