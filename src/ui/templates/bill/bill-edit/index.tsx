import React, { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    BILL_URL,
    FINANCE_URL,
    PACKAGE_URL,
    PROGRESS_URL,
    PROVINCE_URL,
    SERVICE_URL,
    TRUCK_URL
} from '../../../../share/common/api-constants'
import { Roles } from '../../../../share/common/app-constants'
import { contentNotification, HttpMethod, useMultiGetRequest, useSubmitRequest } from '../../../../share/hooks'
import { Bill } from '../../../../share/interface/Bill'
import { User } from '../../../../share/interface/User'
import { BillPriceProps } from '../../../../share/utils/bill-price'
import { isObjectEmpty } from '../../../../share/utils/empty-util'
import { INVENTORY } from '../../../../share/utils/inventory'
import { redirectDetailAction, SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { EDIT_BILL_ACTION, FETCH_BILL_DROPDOWN } from '../../../../store/actions/bill.action'
import { AppState, BillValueDropdown } from '../../../../store/types'
import BillFormTeamplate from '../bill-form'
import './style/index.scss'

type Props = {
    bill?: Bill
}
const BillEditTeamplate = ({ bill = {} }: Props): JSX.Element => {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const buttonSave = useRef<HTMLButtonElement>(null)
    const valueChange = useRef<Bill>({})
    const billDropdown = useSelector<AppState, BillValueDropdown | undefined>((state) => state.bill?.billDropdown)
    const urls = [SERVICE_URL, PROGRESS_URL, PACKAGE_URL, FINANCE_URL, TRUCK_URL, PROVINCE_URL]
    useMultiGetRequest({ urls, ignore: !isObjectEmpty(billDropdown), actionType: FETCH_BILL_DROPDOWN })

    const onFinish = (bill: Bill): void => {
        Object.keys(valueChange.current).forEach((field) => (valueChange.current[field] = bill[field]))

        submitRequest({
            url: BILL_URL + '/' + location.pathname.split('/').pop(),
            method: HttpMethod.PATCH,
            params: valueChange.current,
            callback: (res) => {
                dispatch({ type: EDIT_BILL_ACTION, payload: undefined })
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(res.request.method ?? '', true)
                })
                dispatch(redirectDetailAction(`${window.location.pathname.split('/').pop()}`))
            }
        })
    }
    if (!billDropdown) return <Fragment />

    const { mainService, truck, weight, extraService, discount, discountUnit, senderInfo, receiverInfo } = bill

    function onFieldChange(name: string, value: unknown): void {
        if (name.includes('goodsInfo')) valueChange.current.goodsInfo = []
        else if (name.includes('extraService')) valueChange.current.extraService = []
        else if (name.includes('.')) {
            //if have nested field
            const parentField = name.split('.')[0]
            const subField = name.split('.')[1]
            const newValue = valueChange.current[parentField] ? valueChange.current[parentField] : {}
            //if value change !== initialValues assign to newValue else delete subField
            if (bill[parentField] && value !== bill[parentField][subField]) newValue[subField] = value
            else delete newValue[subField]
            isObjectEmpty(newValue) //if parentField not change
                ? delete valueChange.current[parentField]
                : (valueChange.current[parentField] = newValue)
        } else if (
            (typeof bill[name] === 'object' && value !== bill[name].code) || //if typeof initialValues ='object' compare code
            (typeof bill[name] !== 'object' && value !== bill[name])
        )
            valueChange.current[name] = value
        else delete valueChange.current[name]
        if (isObjectEmpty(valueChange.current)) buttonSave.current?.setAttribute('disabled', 'true')
        else buttonSave.current?.removeAttribute('disabled')
    }

    const billPriceParams: BillPriceProps = {
        extraService: extraService?.map((extra) =>
            Object.assign(billDropdown?.extraServiceList?.find((e) => e.code === extra.code) || {}, extra)
        ),
        mainService: Object.assign(
            mainService || {},
            billDropdown?.mainServiceList?.find((main) => main.code === mainService?.code)
        ),
        weight,
        weightUnit: bill?.weightUnit,
        truck: truck?.code,
        position: {
            provinceFrom: Number(senderInfo?.provinceCode || 0),
            districtFrom: Number(senderInfo?.districtCode || 0),
            provinceTo: Number(receiverInfo?.provinceCode || 0),
            districtTo: Number(receiverInfo?.districtCode || 0)
        },
        discount,
        discountUnit
    }

    return (
        <Fragment>
            <BillFormTeamplate
                disableItem={getDisableBill(bill, userLogin)}
                billPriceParams={billPriceParams}
                ref={buttonSave}
                className='bill-form-edit'
                bill={bill}
                onFinish={onFinish}
                onFieldChange={onFieldChange}
            />
        </Fragment>
    )
}

export default BillEditTeamplate

export function getDisableBill(bill: Bill, userLogin?: User): { all: boolean; status: boolean } {
    const { inventory, sendUnit, insertBy, deliverMember, receiveUnit } = bill
    const editStatus = {
        [Roles.admin]: true,
        [Roles.manager]: userLogin?.unit?.code === sendUnit?.code,
        [Roles.member]: userLogin?.id === insertBy?.userId
    }

    if (bill?.inventory === INVENTORY.INVENTORY_UNIT_DELIVERY) {
        editStatus[Roles.manager] =
            editStatus[Roles.manager] ||
            (userLogin?.role === Roles.manager && receiveUnit?.code === userLogin.unit?.code)
        editStatus[Roles.member] = false
    } else if (inventory === INVENTORY.INVENTORY_USER) {
        editStatus[Roles.manager] = editStatus[Roles.manager] || receiveUnit?.code === userLogin?.unit?.code
        editStatus[Roles.member] = editStatus[Roles.member] || deliverMember?.userId === userLogin?.id
    }

    return {
        all: !(
            userLogin?.role === Roles.admin ||
            (userLogin?.role === Roles.manager && userLogin?.unit?.code === sendUnit?.code)
        ),
        status: !editStatus[`${userLogin?.role}`]
    }
}
