import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { USER_URL } from '../../../../share/common/api-constants'
import { MenuPaths, Roles } from '../../../../share/common/app-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { User } from '../../../../share/interface/User'
import { isArrayEmpty } from '../../../../share/utils/empty-util'
import { INVENTORY } from '../../../../share/utils/inventory'
import { DELETE_USER_ACTION } from '../../../../store/actions/user.action'
import { AppLabels, AppState } from '../../../../store/types'
import Switch from '../../../atoms/switch'
import { ButtonDanger, ButtonPrimary } from '../../../molecules/buttons'
import Card from '../../../molecules/card'
import { useModal } from '../../../molecules/modal'
import { ModalProps } from '../../../molecules/modal/type'
import { FieldSpec } from '../../../molecules/table/type'
import BillList from '../../../organisms/bill/bill-list'
import ModalUserEdit from '../../../organisms/user/modal-edit'
import UserCard from '../../../organisms/user/user-card'
import './style/index.scss'

type Props = { user: User }

export default function UserDetailTemplate({ user }: Props): JSX.Element {
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()
    const { userFields = {} } = useSelector<AppState, AppLabels>((state) => state.app.labels)
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    const [SwitchValue, setSwitchValue] = useState(false)
    const [detailUser, setDetailUser] = useState<User>(user)
    const { code, name, username, role, unit, tel, email, birthday, address } = userFields
    const assets: FieldSpec = { code, username, name, role, unit, tel, birthday, email, address }
    const modal: ModalProps = {
        className: 'modal-user',
        title: 'Chỉnh sửa',
        content: <ModalUserEdit user={detailUser} setDetailUser={setDetailUser} />
    }

    const onOpenEdit = (): void => {
        openModal(modal)
    }

    const deleteUser = (): void => {
        submitRequest({
            url: USER_URL + `/${window.location.pathname.split('/').pop()}`,
            method: HttpMethod.DELETE,
            actionType: DELETE_USER_ACTION
        })
    }

    const getBillInventory = (bills?: Bill[]): Bill[] | undefined => {
        if (SwitchValue)
            return bills?.filter(
                (bill) =>
                    (bill.inventory === INVENTORY.INVENTORY_USER && bill.deliverMember?.userId === user?.id) ||
                    (bill.inventory === INVENTORY.INVENTORY_UNIT_TRANSPORT && bill.insertBy?.userId === user?.id)
            )
        return bills
    }

    return (
        <div id='user-detail'>
            {userLogin?.role !== Roles.member ? (
                <div className='btn-detail'>
                    <ButtonPrimary onClick={onOpenEdit}>Chỉnh sửa</ButtonPrimary>
                    {!window.location.pathname.includes(MenuPaths.profile) && (
                        <ButtonDanger onClick={deleteUser}>Xóa</ButtonDanger>
                    )}
                </div>
            ) : null}
            <UserCard assets={assets} header='Thông tin tài khoản' data={user} />
            <Card
                className='bill-list'
                header={
                    <Fragment>
                        <span>Danh sách vận đơn</span>
                        <span className='switch-action'>
                            <label>Tồn:</label>
                            <Switch value={SwitchValue} onClick={(): void => setSwitchValue(!SwitchValue)} />
                        </span>
                    </Fragment>
                }>
                {isArrayEmpty(getBillInventory(user.bills)) ? (
                    'Không có vận đơn nào'
                ) : (
                    <BillList data={getBillInventory(user.bills) ?? []} />
                )}
            </Card>
        </div>
    )
}
