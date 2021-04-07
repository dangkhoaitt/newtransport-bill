import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import XLSX from 'xlsx'
import {
    BILL_IMPORT_URL,
    CUSTOMER_URL,
    FINANCE_URL,
    PACKAGE_URL,
    PROGRESS_URL,
    PROVINCE_URL,
    SERVICE_URL,
    TRUCK_URL
} from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { HttpMethod, useGetRequest, useMultiGetRequest, useSubmitRequest } from '../../share/hooks'
import { Bill } from '../../share/interface/Bill'
import { Customer } from '../../share/interface/Customer'
import { Unknown } from '../../share/interface/Unknown'
import { isArrayEmpty, isObjectEmpty } from '../../share/utils/empty-util'
import { REDIRECT, SHOW_NOTIFICATION } from '../../store/actions/app.action'
import { FETCH_BILL_DROPDOWN } from '../../store/actions/bill.action'
import { FETCH_CUSTOMER_RESOURCES } from '../../store/actions/customer.action'
import { AppState, BillValueDropdown } from '../../store/types'
import { CheckIcon, UploadIcon, WarningIcon } from '../../ui/atoms/icons'
import Anchor from '../../ui/atoms/link'
import { ButtonWithIcon } from '../../ui/molecules/buttons'
import { useModal } from '../../ui/molecules/modal'
import BillImportListTeamplate from '../../ui/templates/bill/bill-import-list'

enum FieldIndexEnum {
    Code,
    ReceiverName,
    ReceiverTel,
    Province,
    District,
    ReceiverAddress,
    MainService,
    ExtraServices,
    ParcelContent,
    COD,
    Weight,
    TotalCharge,
    Finance
}

const BillImport = (): JSX.Element => {
    const { confirm, openModal } = useModal()
    const importInputRef = useRef<HTMLInputElement>(null)
    const customerList = useSelector<AppState, Customer[] | undefined>((state) => state.customer.list)
    const [billList, setBillList] = useState<Bill[]>([])
    const [count, setCount] = useState({ valid: 0, invalid: 0 })
    const [customer, setCustomer] = useState<Customer | undefined>()
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const badRequest = useSelector<AppState, Unknown[] | undefined>((state) => state.app.badRequest)
    const billDropdown = useSelector<AppState, BillValueDropdown | undefined>((state) => state.bill.billDropdown)
    const urls = [SERVICE_URL, PROGRESS_URL, PACKAGE_URL, FINANCE_URL, TRUCK_URL, PROVINCE_URL]

    useMultiGetRequest({ urls, ignore: !isObjectEmpty(billDropdown), actionType: FETCH_BILL_DROPDOWN })
    useGetRequest({ url: CUSTOMER_URL, ignore: !!customerList, actionType: FETCH_CUSTOMER_RESOURCES })

    useEffect(() => {
        if (badRequest) {
            const messageGroup = badRequest.reduce((prev, curr) => {
                const { message, value } = curr
                return { ...prev, [message]: [...(prev[message] ?? []), value] }
            }, {})
            const messages = Object.keys(messageGroup)
                .map((message) => `${message}: ${messageGroup[message].join(', ')}`)
                .join('\n')
            dispatch({ type: SHOW_NOTIFICATION, payload: { status: 'error', title: messages } })
        }
    }, [badRequest])

    function onUploadFile(): void {
        if (importInputRef.current) {
            importInputRef.current.click()
        }
    }

    function resetState(): void {
        setBillList([])
        setCount({ valid: 0, invalid: 0 })
    }

    function validateRequire(header: string[], bill: Bill): string[] {
        const message = 'Không được để trống'
        const errors: string[] = []
        if (!bill.receiverInfo?.name) errors.push(`${header[FieldIndexEnum.ReceiverName]}: ${message}`)
        if (!bill.receiverInfo?.tel) errors.push(`${header[FieldIndexEnum.ReceiverTel]}: ${message}`)
        if (!bill.receiverInfo?.provinceName) errors.push(`${header[FieldIndexEnum.Province]}: ${message}`)
        if (!bill.receiverInfo?.districtName) errors.push(`${header[FieldIndexEnum.District]}: ${message}`)
        if (!bill.receiverInfo?.address) errors.push(`${header[FieldIndexEnum.ReceiverAddress]}: ${message}`)
        if (!bill.weight) errors.push(`${header[FieldIndexEnum.Weight]}: ${message}`)
        if (!bill.mainService?.name) errors.push(`${header[FieldIndexEnum.MainService]}: ${message}`)
        if (!bill.finance?.name) errors.push(`${header[FieldIndexEnum.Finance]}: ${message}`)
        if (!bill.total) errors.push(`${header[FieldIndexEnum.TotalCharge]}: ${message}`)
        return errors
    }

    function importFromExcel(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.files && e.target.files.length) {
            const file = e.target.files[0]
            const reader = new FileReader()
            const rABS = !!reader.readAsBinaryString
            reader.onload = (e: ProgressEvent<FileReader>): void => {
                resetState()
                /* Parse data */
                const bstr = e.target?.result
                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
                /* Get first worksheet */
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
                const [header, ...rows] = data as [string[], string[]]
                const bills = rows.filter((_) => !isArrayEmpty(_))
                const billData: Bill[] = bills.map((billArr: Unknown) => {
                    const bill: Bill = {
                        code: String(billArr[FieldIndexEnum.Code] || ''),
                        receiverInfo: {
                            name: billArr[FieldIndexEnum.ReceiverName] || '',
                            address: billArr[FieldIndexEnum.ReceiverAddress] || '',
                            tel: billArr[FieldIndexEnum.ReceiverTel] || '',
                            districtName: billArr[FieldIndexEnum.District] || '',
                            provinceName: billArr[FieldIndexEnum.Province] || ''
                        },
                        mainService: { name: billArr[FieldIndexEnum.MainService] || '' },
                        extraService:
                            billArr[FieldIndexEnum.ExtraServices]?.split('\n').map((name) => ({ name })) || [],
                        goodsInfo: [{ content: billArr[FieldIndexEnum.ParcelContent] || '' }],
                        weight: billArr[FieldIndexEnum.Weight] || 0,
                        finance: { name: billArr[FieldIndexEnum.Finance] },
                        total: billArr[FieldIndexEnum.TotalCharge] || 0
                    }
                    const errors: string[] = validateRequire(header, bill)
                    if (bill.receiverInfo?.provinceName) {
                        const province = billDropdown?.provinceList?.find(({ name }) =>
                            name?.toLowerCase().includes((bill?.receiverInfo?.provinceName || '').toLowerCase())
                        )
                        if (province) {
                            Object.assign(bill.receiverInfo, {
                                provinceCode: province.code,
                                provinceName: province.name
                            })
                        }
                        const district = province?.district?.find(({ name }) =>
                            name?.toLowerCase().includes((bill.receiverInfo?.districtName || '').toLowerCase())
                        )
                        if (district) {
                            Object.assign(bill.receiverInfo, {
                                districtCode: district.code,
                                districtName: district.name
                            })
                        } else {
                            errors.push(`${header[FieldIndexEnum.Province]}: Không hợp lệ`)
                        }
                    }
                    if (bill.mainService?.name) {
                        const mainService = billDropdown?.mainServiceList?.find(({ name }) =>
                            name?.toLowerCase().includes((bill.mainService?.name ?? '').toLowerCase())
                        )
                        if (mainService) {
                            bill.mainService = mainService
                        } else {
                            errors.push(`${header[FieldIndexEnum.MainService]}: không hợp lệ`)
                        }
                    }
                    if (bill.extraService && bill.extraService.length) {
                        const extraService = bill.extraService?.map(({ name: extraService = '' }) => {
                            const service = billDropdown?.extraServiceList?.find(({ name }) =>
                                name?.toLowerCase().includes(extraService.toLowerCase())
                            )
                            if (!service) {
                                errors.push(
                                    `${header[FieldIndexEnum.ExtraServices]}: không tìm thấy dịch vụ ${extraService}`
                                )
                                return { name: extraService }
                            }
                            return service
                        })
                        if (extraService && extraService.length) {
                            bill.extraService = extraService
                        }
                    }
                    if (bill.finance?.name) {
                        const finance = billDropdown?.financeList?.find(({ name }) =>
                            name?.toLowerCase().includes((bill.finance?.name || '').toLowerCase())
                        )
                        if (!finance) {
                            errors.push(`${header[FieldIndexEnum.Finance]}: không hợp lệ`)
                        }
                        bill.finance = finance
                    }
                    bill.errors = errors
                    setCount((state) => {
                        const key = errors.length ? 'invalid' : 'valid'
                        return { ...state, [key]: state[key] + 1 }
                    })
                    return bill
                })
                setBillList(billData)
                if (importInputRef.current) {
                    // Clear the input value to avoid not being able to read the same file
                    importInputRef.current.value = ''
                }
            }
            if (rABS) reader.readAsBinaryString(file)
            else reader.readAsArrayBuffer(file)
        }
    }

    const onImportClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        e.preventDefault()
        if (!customer) {
            openModal({
                title: 'Không tìm thấy thông tin người gửi',
                content: 'Vui lòng chọn thông tin người gửi!',
                closeOnClickOutside: true
            })
        } else if (!billList.length) {
            openModal({
                title: 'Không tìm thấy thông tin đơn hàng',
                content: 'Vui lòng mở file excel!',
                closeOnClickOutside: true
            })
        } else {
            confirm({
                title: 'Xác nhận',
                content: (
                    <div>
                        <p>Bạn có chắc chắn đồng ý tạo đơn?</p>
                        <div className='import-count'>
                            <span>
                                <CheckIcon className='valid-icon' /> Số đơn hợp lệ: {count.valid}/{billList.length}
                            </span>
                            <span style={{ marginLeft: 20 }}>
                                <WarningIcon className='invalid-icon' /> Số đơn lỗi: {count.invalid}/{billList.length}
                            </span>
                        </div>
                        <i style={{ color: 'red' }}>*Lưu ý: Hệ thống chỉ tạo các đơn có trạng thái hợp lệ.</i>
                    </div>
                ),
                onConfirm: async () => {
                    const progress = billDropdown?.progressList ? billDropdown.progressList[0] : undefined
                    const validBills: Unknown[] = []
                    billList.forEach(({ errors, finance, weight = 1000, ...billData }) => {
                        if (!errors.length) {
                            validBills.push({
                                progress: progress?.code,
                                finance: finance?.code,
                                // Convert gram to kg
                                weight: Math.ceil(weight / 1000),
                                ...billData
                            })
                        }
                    })
                    submitRequest({
                        isConfirm: false,
                        url: BILL_IMPORT_URL,
                        method: HttpMethod.POST,
                        params: { senderInfo: customer, items: validBills },
                        callback: () => {
                            dispatch({
                                type: SHOW_NOTIFICATION,
                                payload: { status: 'success', title: 'Nhập vận đơn thành công!' }
                            })
                            dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                        }
                    })
                }
            })
        }
    }

    return (
        <div id='bill-import-list'>
            <div className='btn-add-export'>
                <div className='import-count'>
                    <span>
                        <CheckIcon className='valid-icon' /> {count.valid}/{billList.length}
                    </span>
                    <span>
                        <WarningIcon className='invalid-icon' /> {count.invalid}/{billList.length}
                    </span>
                </div>
                <ButtonWithIcon icon={<UploadIcon />} onClick={onUploadFile}>
                    <input
                        ref={importInputRef}
                        style={{ display: 'none' }}
                        type='file'
                        accept='.xlsx'
                        onChange={importFromExcel}
                    />
                    Mở file
                </ButtonWithIcon>
                <Anchor href='#' linkType='bg-primary' onClick={onImportClickHandler}>
                    Nhập vận đơn
                </Anchor>
            </div>
            <BillImportListTeamplate
                billList={billList}
                onCustomerSelectChange={(customer?: Customer): void => {
                    if (customer) {
                        const { code, name, address, province, district, tel } = customer
                        setCustomer({
                            code,
                            name,
                            provinceCode: province?.code || '',
                            provinceName: province?.name || '',
                            districtCode: district?.code || '',
                            districtName: district?.name || '',
                            address,
                            tel
                        })
                    }
                }}
            />
        </div>
    )
}

export default withErrorBoundary(BillImport)
