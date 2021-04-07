import React, { Fragment, ReactNode } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { UNIT_URL } from '../../../share/common/api-constants'
import { MenuPaths, Roles } from '../../../share/common/app-constants'
import { HttpMethod, useSubmitRequest } from '../../../share/hooks'
import { Bill } from '../../../share/interface/Bill'
import { Unit } from '../../../share/interface/Unit'
import { Any } from '../../../share/interface/Unknown'
import { User } from '../../../share/interface/User'
import { isArrayEmpty, isNullOrUndefined } from '../../../share/utils/empty-util'
import { INVENTORY } from '../../../share/utils/inventory'
import { UNIT_DELETE } from '../../../store/actions/unit.action'
import { AppState } from '../../../store/types'
import DateView from '../../atoms/date/DateView'
import Anchor from '../../atoms/link'
import Switch from '../../atoms/switch'
import { ButtonDanger, ButtonPrimary } from '../../molecules/buttons'
import Card from '../../molecules/card'
import { useModal } from '../../molecules/modal'
import Pagination from '../../molecules/pagination'
import Tabs, { TabItemProps } from '../../molecules/tabs'
import BillList from '../../organisms/bill/bill-list'
import ModalUnitEdit from '../../organisms/unit/modal-edit/ModalUnitEdit'
import UserList from '../../organisms/user/user-list'
import './style/index.scss'

type Props = { unit: Unit }
type TabProps = {
    users?: User[]
    bills?: Bill[]
    unitCode?: string | number
}

function TabBillComponent({ bills, unitCode }: TabProps): JSX.Element {
    const [SwitchValue, setSwitchValue] = useState(false)

    const getBillInventory = (bills?: Bill[]): Bill[] | undefined => {
        if (SwitchValue)
            return bills?.filter(
                (bill) =>
                    (bill.inventory === INVENTORY.INVENTORY_UNIT_TRANSPORT && bill?.unit?.code == unitCode) ||
                    ((bill.inventory === INVENTORY.INVENTORY_UNIT_DELIVERY ||
                        bill.inventory === INVENTORY.INVENTORY_USER) &&
                        bill.receiveUnit?.code === unitCode)
            )
        return bills
    }
    const [unitBill, setUnitBill] = useState({ page: 1, unitBill: getBillInventory(bills) })
    function paginate(array, page_size, page_number): Any {
        return array.slice((page_number - 1) * page_size, page_number * page_size)
    }
    return (
        <Card className='bill-list'>
            <span className='switch-action'>
                <span>Tồn:</span>
                <Switch value={SwitchValue} onClick={(): void => setSwitchValue && setSwitchValue(!SwitchValue)} />
            </span>
            {isArrayEmpty(bills) ? (
                'Không có vận đơn nào'
            ) : (
                <Fragment>
                    <BillList data={paginate(getBillInventory(unitBill.unitBill), 10, unitBill.page ?? 1)} />
                    <Pagination
                        showPrevNextJumpers={true}
                        defaultPageSize={10}
                        total={getBillInventory(bills)?.length}
                        onChange={(page): void => setUnitBill({ ...unitBill, page })}
                        defaultCurrent={1}
                        showTotal={(total: number, range: [number, number]): ReactNode => (
                            <div>{`${range[0]}-${range[1]}/${total} Vận đơn`}</div>
                        )}
                    />
                </Fragment>
            )}
        </Card>
    )
}

function TabMemberComponent({ users }: TabProps): JSX.Element {
    const [unitMember, setUnitMember] = useState({ page: 1, unitMember: users })
    function paginate(array, page_size, page_number): Any {
        return array.slice((page_number - 1) * page_size, page_number * page_size)
    }
    return (
        <Card className='card-member-info'>
            <div id='member-list'>
                {isArrayEmpty(users) ? (
                    'Không có thành viên nào'
                ) : (
                    <Fragment>
                        <UserList data={paginate(unitMember.unitMember, 10, unitMember.page ?? 1)} />
                        <Pagination
                            showPrevNextJumpers={true}
                            defaultPageSize={10}
                            total={users?.length}
                            onChange={(page): void => {
                                setUnitMember({ ...unitMember, page })
                                paginate(unitMember.unitMember, 10, unitMember.page ?? 1)
                            }}
                            defaultCurrent={1}
                            showTotal={(total: number, range: [number, number]): ReactNode => (
                                <div>{`${range[0]}-${range[1]}/${total} Tài khoản`}</div>
                            )}
                        />
                    </Fragment>
                )}
            </div>
        </Card>
    )
}
function TabComponent({ users, bills, unitCode }: TabProps): JSX.Element {
    const tabs: TabItemProps[] = [
        {
            title: 'Danh sách thành viên',
            tabContent: <TabMemberComponent users={users} />
        },
        {
            title: 'Danh sách vận đơn',
            tabContent: <TabBillComponent bills={bills} unitCode={unitCode} />
        }
    ]
    return <Tabs tabList={tabs} />
}

export default function UnitDetailTemplate({ unit }: Props): JSX.Element {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    const onOpenEdit = (values: Any): void => {
        openModal({
            className: `modal-create-unit`,
            title: 'Chỉnh sửa',
            content: <ModalUnitEdit data={values} />
        })
    }

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            isConfirm: true,
            url: UNIT_URL + '/' + id,
            actionType: UNIT_DELETE
        })
    }
    const itemUser = {
        code: 'Mã đơn vị',
        name: 'Tên đơn vị',
        order: 'Số thứ tự',
        insertTime: 'Ngày tạo',
        insertBy: 'Người tạo'
    }

    const itemUserCard = {
        code: <span className='card-item-address'>{unit?.code}</span>,
        name: <span className='card-item-address'>{unit?.name}</span>,
        order: <span className='card-item-address'>{unit?.order}</span>,
        insertTime: <DateView format='DD/MM/YYYY hh:mma' time={unit.insertTime} />,
        insertBy: (
            <Anchor linkType='text-primary' href={`/${MenuPaths.userDetail}/${unit.insertBy?.userId}`}>
                {unit.insertBy?.name}
            </Anchor>
        )
    }

    return (
        <div id='unit-detail'>
            {userLogin?.role !== Roles.member ? (
                <div className='btn-detail'>
                    <ButtonPrimary onClick={(): void => onOpenEdit(unit)}>Chỉnh sửa</ButtonPrimary>
                    <ButtonDanger onClick={(): void => onClickDelete(unit.id)}>Xóa</ButtonDanger>
                </div>
            ) : null}
            <Card className='card-user-info' header='Thông tin đơn vị'>
                {Object.keys(itemUser).map((key, index) => {
                    if (isNullOrUndefined(unit[key])) return <Fragment key={index} />
                    return (
                        <div key={index} className='user-input-item'>
                            <label className='label-item'>{itemUser[key]}</label>
                            <div className='value-item'>{unit && itemUserCard[key]}</div>
                        </div>
                    )
                })}
            </Card>
            <TabComponent users={unit.users} bills={unit.bills} unitCode={unit?.code} />
        </div>
    )
}
