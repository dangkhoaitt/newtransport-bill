import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { UNIT_URL } from '../../../../share/common/api-constants'
import { DATE_TIME_AM_FORMAT, MenuPaths } from '../../../../share/common/app-constants'
import DateView from '../../../atoms/date/DateView'
import { Unit } from '../../../../share/interface/Unit'
import { UNIT_DELETE } from '../../../../store/actions/unit.action'
import { ColumnSpec } from '../../../molecules/table'
import ModalUnitEdit from '../modal-edit/ModalUnitEdit'
import UnitCard from '../unit-card/UnitCard'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import Anchor from '../../../atoms/link'
interface Props {
    unitList: Unit[]
}

export default function UnitList({ unitList }: Props): JSX.Element {
    const TableColumns: ColumnSpec[] = [
        {
            key: 'order',
            title: 'STT',
            width: '100px',
            className: 'border-column text-center',
            render: (_, index?: number): ReactNode => <span>{index}</span>
        },
        {
            key: 'code',
            title: 'Mã',
            width: '15%',
            render: (record: Unit): ReactNode => (
                <Anchor linkType='text-primary' href={`/${MenuPaths.unitDetail}/${record.id}`}>
                    {record.code}
                </Anchor>
            )
        },
        {
            key: 'name',
            title: 'Tên đơn vị',
            render: (record: Unit): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'insertTime',
            title: 'Ngày tạo',
            width: '15%',
            className: 'border-column text-center',
            render: (record: Unit): ReactNode => <DateView format={DATE_TIME_AM_FORMAT} time={record.insertTime} />
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='unit'
                    data={unitList}
                    url={UNIT_URL}
                    actionType={UNIT_DELETE}
                    ModalComponent={ModalUnitEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {unitList?.map((item, index) => (
                        <UnitCard key={`${item}-${index}`} unit={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
