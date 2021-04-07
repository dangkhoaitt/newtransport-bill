import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { DATE_TIME_AM_FORMAT } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Truck } from '../../../../share/interface/Truck'
import { TRUCK_DELETE } from '../../../../store/actions/truck.action'
import { ColumnSpec } from '../../../molecules/table'
import ModalTruckEdit from '../modal-edit/ModalTruckEdit'
import TruckCard from '../truck-card/TruckCard'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import { TRUCK_URL } from '../../../../share/common/api-constants'
interface Props {
    data: Truck[]
}

export default function TruckList({ data }: Props): JSX.Element {
    const TableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center',
            render: (record: Truck): ReactNode => <span>{record.order}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Truck): ReactNode => <span>{record.code}</span>
        },
        {
            key: 'name',
            title: 'Tên loại xe',
            render: (record: Truck): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'weight',
            title: 'Trọng lượng',
            width: '15%',
            render: (record: Truck): ReactNode => <span>{record.weight}</span>
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'border-column text-center',
            render: (record: Truck): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='truck'
                    data={data}
                    url={TRUCK_URL}
                    actionType={TRUCK_DELETE}
                    ModalComponent={ModalTruckEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <TruckCard key={`${item}-${index}`} data={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
