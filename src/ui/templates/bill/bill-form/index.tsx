import React, { Ref, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuPaths } from '../../../../share/common/app-constants'
import { Bill } from '../../../../share/interface/Bill'
import { Service } from '../../../../share/interface/Service'
import { Unknown } from '../../../../share/interface/Unknown'
import {
    BillPrice,
    BillPriceProps,
    getBillPrice,
    getServiceError,
    handleDataBill
} from '../../../../share/utils/bill-price'
import { isNullOrUndefined, isObjectEmpty } from '../../../../share/utils/empty-util'
import { REDIRECT } from '../../../../store/actions/app.action'
import { AppState } from '../../../../store/types'
import { ButtonDanger, ButtonPrimary } from '../../../molecules/buttons'
import NForm from '../../../molecules/form'
import { useModal } from '../../../molecules/modal'
import BillSenderForm from '../../../organisms/bill/bill-form/bill-customer'
import GoodsContentInfoForm from '../../../organisms/bill/bill-form/BillGoodsForm'
import BillCardInfo from '../../../organisms/bill/bill-form/BillInfoForm'
import BillInventoryForm from '../../../organisms/bill/bill-form/BillInventoryForm'
import PricingInfoForm from '../../../organisms/bill/bill-form/BillPriceForm'
import RecipientInfo from '../../../organisms/bill/bill-form/BillRecipientForm'
import BillServiceForm from '../../../organisms/bill/bill-form/BillServiceForm'
import SettingInfoForm from '../../../organisms/bill/bill-form/BillSettingForm'
import './style/index.scss'

interface BillFormProps {
    onFinish: (values: Unknown, errors?: Unknown | undefined) => void
    disableItem?: { all: boolean; status: boolean }
    getDataCurrent?: (values: Unknown) => void
    onFieldChange?: (name: string, value: unknown) => void
    bill?: Bill
    billPriceParams?: BillPriceProps
    className?: string
}
const BillFormTeamplate = React.forwardRef(
    (props: BillFormProps, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const { bill, onFinish, onFieldChange, className, disableItem } = props
        const mainServiceList = useSelector<AppState, Service[] | undefined>(
            (state) => state.bill.billDropdown?.mainServiceList
        )
        const extraServiceList = useSelector<AppState, Service[] | undefined>(
            (state) => state.bill.billDropdown?.extraServiceList
        )
        const { code, insertTime, mainService = {}, user } = bill || {}
        const { total = 0, senderInfo, receiverInfo, extraPrice = 0 } = bill || {}
        const [priceBill, setPriceBill] = useState<BillPrice>({
            extraPrice,
            mainPrice: mainService.price || 0,
            total,
            returnExtraService: props.billPriceParams?.extraService
        })
        const billPriceParams = useRef<BillPriceProps>(props.billPriceParams || { extraService: [] }).current
        const [formErrors, setFormErrors] = useState<string[]>([])

        const onFinishHandle = (data: Bill): void => {
            if (isObjectEmpty(formErrors)) {
                data.extraService = billPriceParams.extraService
                const newBill = handleDataBill(data)
                if (isTruck) {
                    newBill.weight = undefined
                    newBill.weightUnit = undefined
                } else newBill.truck = undefined
                onFinish(newBill)
            }
        }

        const handleFormError = (): void => {
            const newErr = getServiceError(billPriceParams)
            newErr.length !== formErrors.length && setFormErrors(newErr)
        }

        const changeMainService = (key: string, value: string | number): void => {
            if (key === 'code') {
                billPriceParams.mainService = mainServiceList?.find((m) => m.code === value) || {}
                const { isTruck, isWeight, weightUnit } = billPriceParams.mainService
                billPriceParams.weightUnit = weightUnit
                const newExtraList = billPriceParams.extraService?.filter(
                    (e) => !(isTruck && e.isWeight) && !(isWeight && e.isTruck)
                )
                if (newExtraList?.length !== billPriceParams.extraService?.length) {
                    billPriceParams.extraService = newExtraList
                    onFieldChange && onFieldChange('extraService', [])
                }
                handleFormError()
            } else if (billPriceParams.mainService) billPriceParams.mainService.priceByUser = value as number
            setPriceBill(getBillPrice(billPriceParams))
        }

        const changePosition = (key: string, value: unknown): void => {
            if (billPriceParams.position && billPriceParams.position[key] === value) return
            billPriceParams.position
                ? (billPriceParams.position[key] = value)
                : Object.assign(billPriceParams, { position: { [key]: value } })
            setPriceBill(getBillPrice(billPriceParams))
            handleFormError()
        }

        const changeExtraService = (key: string, value: boolean | number): void => {
            if (typeof value === 'boolean' && value) {
                billPriceParams.extraService?.push(extraServiceList?.find((extra) => extra.id === key) || {})
            } else
                billPriceParams.extraService = billPriceParams.extraService?.filter((extra) => {
                    if (extra.id === key) {
                        if (typeof value === 'boolean') return false
                        else {
                            extra.priceByUser = value
                            return extra
                        }
                    }
                    return extra
                })
            setPriceBill(getBillPrice(billPriceParams))
            handleFormError()
        }

        const changeWeightOrTruck = (name: string, value: unknown): void => {
            billPriceParams[name] = value
            const newBillPrice = getBillPrice(billPriceParams)
            if (onFieldChange) {
                onFieldChange('mainService.price', newBillPrice.mainPrice)
                onFieldChange('extraService', [])
            }

            setPriceBill(newBillPrice)
            handleFormError()
        }

        const onFieldChangeHandle = (name: string, value: unknown): void => {
            switch (name) {
                case 'mainService.code':
                case 'mainService.price':
                    changeMainService(name.split('.')[1], value as string)
                    break
                case 'senderInfo.provinceCode':
                case 'receiverInfo.provinceCode':
                    changePosition(name.split('.')[0] === 'senderInfo' ? 'provinceFrom' : 'provinceTo', value)
                    break
                case 'senderInfo.districtCode':
                case 'receiverInfo.districtCode':
                    changePosition(name.split('.')[0] === 'senderInfo' ? 'districtFrom' : 'districtTo', value)
                    break
                case 'weight':
                case 'truck':
                    changeWeightOrTruck(name, value)
                    break
                case 'discount':
                case 'discountUnit':
                    billPriceParams[name] = value as number
                    setPriceBill(getBillPrice(billPriceParams))
                    break
                case String(name.match(/.*extraService.*/)):
                    changeExtraService(name.split('-')[1], value as boolean | number)
                    break
                default:
                    break
            }
            onFieldChange && onFieldChange(name, value)
        }

        const isTruck = billPriceParams.mainService?.isTruck || billPriceParams.extraService?.some((e) => e.isTruck)
        return (
            <NForm
                className={className ? className : 'bill-form-create'}
                onFieldChange={onFieldChangeHandle}
                onFinish={onFinishHandle}>
                <BillCardInfo
                    disableItem={disableItem?.all}
                    errorsBill={formErrors}
                    code={code}
                    insertTime={insertTime}
                    user={user}
                />
                <BillSenderForm disableItem={disableItem?.all} customer={senderInfo} />
                <RecipientInfo disableItem={disableItem?.all} customer={receiverInfo} />
                <GoodsContentInfoForm disableItem={disableItem?.all} goodsInfo={bill?.goodsInfo} />
                <div className='card bill-form-item setting-inventory'>
                    <SettingInfoForm
                        disableItem={disableItem?.all && disableItem?.status}
                        progress={bill?.progress}
                        finance={bill?.finance}
                    />
                    <BillInventoryForm
                        disableItem={disableItem?.all && disableItem?.status}
                        inventory={bill?.inventory}
                        deliverMember={bill?.deliverMember}
                        provinceCode={billPriceParams.position?.provinceTo}
                        districtCode={billPriceParams.position?.districtTo}
                    />
                </div>
                <BillServiceForm
                    disableItem={disableItem?.all}
                    mainService={billPriceParams.mainService}
                    extraService={priceBill.returnExtraService}
                />
                <PricingInfoForm
                    disableItem={disableItem?.all}
                    {...priceBill}
                    truckId={billPriceParams.truck}
                    weight={billPriceParams.weight}
                    weightUnit={billPriceParams.weightUnit}
                    isTruck={isTruck}
                    isWeight={billPriceParams.mainService?.isWeight}
                    discount={billPriceParams.discount}
                    discountUnit={billPriceParams.discountUnit}
                />
                <div className='bill-form-groupbtn'>
                    <ButtonCancelFormBill />
                    {(!disableItem?.all || !disableItem?.status) && (
                        <ButtonPrimary disabled={!isNullOrUndefined(bill)} ref={ref} type='submit'>
                            Lưu
                        </ButtonPrimary>
                    )}
                </div>
            </NForm>
        )
    }
)

export default BillFormTeamplate

export const ButtonCancelFormBill = (): JSX.Element => {
    const { confirm } = useModal()
    const dispatch = useDispatch()

    const pathName = location.pathname

    const pathRedirect = pathName.includes('chinh-sua')
        ? MenuPaths.billDetail + '/' + pathName.split('/').pop()
        : pathName.split('/')[1]

    function onCancelForm(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault()
        confirm({
            title: 'Bạn có chắc chắn muốn thoát và hủy các thao tác đã nhập?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onConfirm: () => dispatch({ type: REDIRECT, payload: pathRedirect })
        })
    }

    return <ButtonDanger onClick={onCancelForm}>Hủy</ButtonDanger>
}
