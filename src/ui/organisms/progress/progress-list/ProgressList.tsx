import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { DATE_TIME_AM_FORMAT } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Progress } from '../../../../share/interface/Progress'
import { PROGRESS_DELETE } from '../../../../store/actions/progress.action'
import { ColumnSpec } from '../../../molecules/table'
import ModalProgressEdit from '../modal-edit/ModalProgressEdit'
import ProgressCard from '../progress-card/ProgressCard'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import { PROGRESS_URL } from '../../../../share/common/api-constants'
interface Props {
    data: Progress[]
}

export default function ProgressList({ data }: Props): JSX.Element {
    const TableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center',
            render: (record: Progress): ReactNode => <span>{record.order}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Progress): ReactNode => <span>{record.code}</span>
        },
        {
            key: 'name',
            title: 'Tên hành trình',
            render: (record: Progress): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'border-column text-center',
            render: (record: Progress): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='progress'
                    url={PROGRESS_URL}
                    data={data}
                    actionType={PROGRESS_DELETE}
                    ModalComponent={ModalProgressEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <ProgressCard key={`${item}-${index}`} data={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
