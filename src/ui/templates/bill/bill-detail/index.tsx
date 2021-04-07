import React from 'react'
import { useSelector } from 'react-redux'
import { BILL_URL } from '../../../../share/common/api-constants'
import { MenuPaths } from '../../../../share/common/app-constants'
import { HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { User } from '../../../../share/interface/User'
import { DELETE_BILL_ACTION } from '../../../../store/actions/bill.action'
import { AppState } from '../../../../store/types'
import Anchor from '../../../atoms/link'
import { ButtonDanger, ButtonPrimary } from '../../../molecules/buttons'
import BillDetailCustomer from '../../../organisms/bill/bill-detail/BillCustomer'
import BillDetailGoods from '../../../organisms/bill/bill-detail/BillGoods'
import BillDetailInfo, { Distance } from '../../../organisms/bill/bill-detail/BillInfo'
import BillDetailInventory from '../../../organisms/bill/bill-detail/BillInventory'
import BillDetailPrice from '../../../organisms/bill/bill-detail/BillPrice'
import BillDetailService from '../../../organisms/bill/bill-detail/BillService'
import BillDetailSetting from '../../../organisms/bill/bill-detail/BillSetting'
import { getDisableBill } from '../bill-edit'
import './style/index.scss'

export interface BillDetailProps {
    bill: Bill
}

const BillDetailTeamplate = ({ bill }: BillDetailProps): JSX.Element => {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    const { code, insertTime, extraService, mainService, insertBy, weightUnit } = bill
    const { total, discount, discountUnit, weight, truck, senderInfo, receiverInfo, extraPrice } = bill
    const submitRequest = useSubmitRequest()

    const deleteBill = (): void => {
        submitRequest({
            url: BILL_URL + `/${window.location.pathname.split('/').pop()}`,
            method: HttpMethod.DELETE,
            actionType: DELETE_BILL_ACTION
        })
    }

    const distance: Distance = {
        provinceFrom: { code: senderInfo?.provinceCode, name: senderInfo?.provinceName },
        districtFrom: { code: senderInfo?.districtCode, name: senderInfo?.districtName },
        provinceTo: { code: receiverInfo?.provinceCode, name: receiverInfo?.provinceName },
        districtTo: { code: receiverInfo?.districtCode, name: receiverInfo?.districtName }
    }
    const disabledBtnEdit = getDisableBill(bill, userLogin)
    return (
        <div id='bill-detail'>
            <div className='btn-detail'>
                {(!disabledBtnEdit?.all || !disabledBtnEdit?.status) && (
                    <Anchor linkType='text-default' href={`/${MenuPaths.billEdit}/${bill?.id}`}>
                        <ButtonPrimary>Chỉnh sửa</ButtonPrimary>
                    </Anchor>
                )}
                {!disabledBtnEdit.all && <ButtonDanger onClick={deleteBill}>Xóa</ButtonDanger>}
            </div>
            <div className='bill-card-detail'>
                <BillDetailInfo code={code} insertTime={insertTime} distance={distance} user={insertBy} />
                <BillDetailCustomer customer={senderInfo} />
                <BillDetailCustomer nameForm='receiverInfo' customer={receiverInfo} />
                <BillDetailGoods goodsInfo={bill.goodsInfo} />
                <div className='card card-bill-detail-item card-inventory'>
                    <BillDetailSetting progress={bill.progress} finance={bill.finance} />
                    <BillDetailInventory
                        inventory={bill.inventory}
                        deliverMember={bill.deliverMember}
                        sendUnit={bill.sendUnit}
                        insertBy={bill.insertBy}
                        receiveUnit={bill.receiveUnit}
                    />
                </div>
                <BillDetailService extraService={extraService} mainService={mainService} />
                <BillDetailPrice
                    total={total}
                    discount={discount}
                    mainPrice={mainService?.price}
                    truck={truck}
                    weight={weight}
                    extraPrice={extraPrice}
                    weightUnit={weightUnit}
                    discountUnit={discountUnit}
                />
            </div>
        </div>
    )
}

export default BillDetailTeamplate
