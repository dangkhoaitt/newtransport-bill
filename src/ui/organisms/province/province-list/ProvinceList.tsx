import React, { Fragment, ReactNode } from 'react'
import MediaQuery from 'react-responsive'
import { PROVINCE_URL } from '../../../../share/common/api-constants'
import { Province } from '../../../../share/interface/Province'
import { PROVINCE_DELETE } from '../../../../store/actions/province.action'
import TableBillInfo from '../../../molecules/bill-info/TableBillInfo'
import { ColumnSpec } from '../../../molecules/table'
import ModalProvinceEdit from '../modal-province/ModalProvinceEdit'
import ProvinceCard from '../province-card/ProvinceCard'
interface Props {
    data: Province[]
}

export default function ProvinceList({ data }: Props): JSX.Element {
    const onClickViewMore = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        const element = e.currentTarget.parentNode?.querySelector('.item-district')?.classList
        if (element && element[1] !== 'more') {
            element?.add('more')
        } else element?.remove('more')
    }
    const TableColumns: ColumnSpec[] = [
        {
            key: 'code',
            title: 'Mã',
            width: '100px',
            className: 'border-column text-center',
            render: (record: Province): ReactNode => <span>{record.code}</span>
        },
        {
            key: 'name',
            width: '20%',
            title: 'Tên tỉnh thành',
            render: (record: Province): ReactNode => <span>{record.name}</span>
        },
        {
            key: 'district',
            title: 'Quận/ Huyện',
            render: (record: Province): ReactNode => {
                return (
                    <div className='district'>
                        <div className='item-district'>
                            {record.district?.map((district, index) => (
                                <label key={`${district.code}-${index}`}>{district.name}</label>
                            ))}
                        </div>
                        {record.district && record.district?.length > 0 ? (
                            <span className='click-more' onClick={(e): void => onClickViewMore(e)}>
                                Xem thêm
                            </span>
                        ) : null}
                    </div>
                )
            }
        },
        {
            key: 'unit',
            width: '10%',
            title: 'Đơn vị',
            render: (record: Province): ReactNode => <span>{record.unit?.name}</span>
        }
    ]

    return (
        <Fragment>
            <MediaQuery minDeviceWidth={769}>
                <TableBillInfo
                    TableColumns={TableColumns}
                    name='province'
                    url={PROVINCE_URL}
                    data={data}
                    actionType={PROVINCE_DELETE}
                    ModalComponent={ModalProvinceEdit}
                />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
                <div className='list-common'>
                    {data?.map((item, index) => (
                        <ProvinceCard key={`${item}-${index}`} data={item} />
                    ))}
                </div>
            </MediaQuery>
        </Fragment>
    )
}
