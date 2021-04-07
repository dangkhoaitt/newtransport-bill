import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { DATE_TIME_AM_FORMAT } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Finance } from '../../../../share/interface/Finance'
import { FINANCE_DELETE } from '../../../../store/actions/finance.action'
import { ColumnSpec } from '../../../molecules/table'
import FinanceCard from '../finance-card/FinanceCard'
import ModalFinanceEdit from '../modal-edit/ModalFinanceEdit'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import { FINANCE_URL } from '../../../../share/common/api-constants'
interface Props {
    data: Finance[]
}

export default function FinanceList({ data }: Props): JSX.Element {
    const TableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center',
            render: (record: Finance): ReactNode => <span>{record.order}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Finance): ReactNode => <span>{record.code}</span>
        },
        {
            key: 'name',
            title: 'Tên trạng thái',
            render: (record: Finance): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'border-column text-center',
            render: (record: Finance): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='finance'
                    data={data}
                    actionType={FINANCE_DELETE}
                    url={FINANCE_URL}
                    ModalComponent={ModalFinanceEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <FinanceCard key={`${item}-${index}`} data={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
