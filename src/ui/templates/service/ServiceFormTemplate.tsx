import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { MenuPaths, weightUnitList } from '../../../share/common/app-constants'
import { Service } from '../../../share/interface/Service'
import { getFixPrice } from '../../../share/utils/bill-price'
import { getServiceType } from '../../../share/utils/service-util'
import { formatPrice } from '../../atoms/currency/CurrencyView'
import { AddPlusIcon } from '../../atoms/icons'
import { NumberInput } from '../../atoms/inputs'
import { ButtonDanger, ButtonIconOnly, ButtonPrimary } from '../../molecules/buttons'
import Card from '../../molecules/card'
import NForm, { FormItem, FormItemGroup } from '../../molecules/form'
import { useModal } from '../../molecules/modal'
import { ServiceTable } from '../../molecules/table'
import './style/index.scss'
interface EditProp {
    service: Service
    isEdit: boolean
    onFinish: (service: Service) => void
    onFieldChange: (name: string, value: unknown) => void
    addRow: () => void
    deleteRow: (index: number) => void
    addColumn: () => void
    deleteColumn: (index: number | string) => void
}
export const REDIRECT = 'REDIRECT'
export const pathRedirect = 'REDIRECT'
const ServiceFormTemplate = ({
    service,
    isEdit,
    onFinish,
    onFieldChange,
    addRow,
    deleteRow,
    addColumn,
    deleteColumn
}: EditProp): JSX.Element => {
    const dispatch = useDispatch()
    const { confirm } = useModal()
    const serviceItem: FormItem[] = [
        {
            title: 'Mã dịch vụ:',
            disabled: isEdit,
            name: 'code',
            type: 'textbox',
            containerClass: 'form-service text-box',
            defaultValue: service?.code,
            rules: [
                {
                    pattern: /^[0-9a-zA-Z_-]{1,}$/,
                    message: 'Mã dịch vụ không được chứa ký tự đặc biệt!'
                }
            ],
            labelClass: 'form-label',
            controlClass: 'form-value'
        },
        {
            title: 'Tên dịch vụ:',
            name: 'name',
            rules: [{ required: true, message: 'Vui lòng lựa chọn tên dịch vụ!' }],
            type: 'textbox',
            containerClass: 'form-service text-box',
            labelClass: 'form-label require',
            defaultValue: service?.name,
            controlClass: 'form-value'
        },
        {
            title: 'Số thứ tự:',
            name: 'order',
            type: 'numberbox',
            containerClass: 'form-service text-box',
            labelClass: 'form-label ',
            defaultValue: service?.order,
            controlClass: 'form-value'
        },
        {
            title: 'Loại dịch vụ: | Dịch vụ chính | Dịch vụ cộng thêm',
            name: 'isExtra',
            disabled: isEdit,
            type: 'radio-group',
            containerClass: 'form-service type-service',
            labelClass: 'form-label',
            controlClass: 'form-radio',
            defaultChecked: !service?.isExtra
        },
        {
            title: 'Loại giá: | Giá cố định | Giá không cố định',
            name: 'isFix',
            disabled: isEdit ? true : false,
            type: 'radio-group',
            containerClass: 'form-service type-service',
            labelClass: 'form-label',
            controlClass: 'form-radio',
            defaultChecked: service?.isFix
        }
    ]
    const priceFixed: FormItem[] = [
        {
            title: 'Giá cố định:',
            name: 'fixPrice',
            containerClass: 'form-service form-weight',
            labelClass: 'form-label',
            controlClass: 'form-value price',
            rules: [{ required: true, message: 'Vui lòng nhập giá tiền!' }],
            defaultValue: getFixPrice(service?.fix),
            render: ({ onChange }): JSX.Element => (
                <NumberInput
                    fomat={formatPrice}
                    onBlur={(e): void => onChange(Number(e?.target.value.replace(/[^0-9]/g, '')) || 0)}
                    defaultValue={getFixPrice(service?.fix)}
                />
            )
        }
    ]
    const priceNoFixed: FormItem[] = [
        {
            name: 'isDistance',
            title: 'Khoảng cách',
            containerClass: 'form-service ',
            labelClass: 'form-label',
            controlClass: 'form-value',
            disabled: isEdit,
            defaultChecked: service?.isDistance,
            type: 'checkbox'
        },
        {
            name: 'isWeight',
            title: 'Trọng lượng',
            containerClass: 'form-service',
            labelClass: 'form-label',
            disabled: isEdit,
            controlClass: 'form-value',
            defaultChecked: service?.isWeight,
            type: 'checkbox'
        },
        {
            name: 'isTruck',
            title: 'Loại xe tải',
            containerClass: 'form-service',
            labelClass: 'form-label',
            disabled: isEdit,
            controlClass: 'form-value',
            defaultChecked: service?.isTruck,
            type: 'checkbox'
        }
    ]
    const weightUnit: FormItem[] = [
        {
            name: 'weightUnit',
            title: 'Đơn vị khối lượng:',
            defaultValue: service.weightUnit,
            placeholder: 'Đơn vị',
            containerClass: 'form-service form-type-price',
            labelClass: 'form-label',
            controlClass: 'type-weight',
            selectSource: weightUnitList,
            disabled: isEdit,
            type: 'select'
        }
    ]
    const serviceType = getServiceType(service)
    const distanceArr = service[serviceType]?.map((p) => {
        const d = { ...p }
        d.priceArr?.forEach((w) => {
            if (service?.isWeight) d[`${w.weightTo}`] = w.price
            else if (service?.isTruck) d[`${w.truckCode}`] = w.price
            else d['price'] = w.price
        })
        return d
    })
    function onCancelForm(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault()
        confirm({
            title: 'Bạn có chắc chắn muốn thoát và hủy các thao tác đã nhập?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onConfirm: () => dispatch({ type: REDIRECT, payload: pathRedirect })
        })
    }
    const pathRedirect = location.pathname.includes('chinh-sua')
        ? MenuPaths.serviceDetail + '/' + location.pathname.split('/').pop()
        : location.pathname.split('/')[1]
    return (
        <Fragment>
            <Card header='Thông tin dịch vụ' className='service-form'>
                <NForm onFinish={onFinish} onFieldChange={onFieldChange} initialValues={{ ...service }}>
                    <FormItemGroup
                        items={serviceItem}
                        container={(props): JSX.Element => <div className='service-item' {...props} />}
                    />
                    {service?.isFix ? (
                        <FormItemGroup
                            items={priceFixed}
                            container={(props): JSX.Element => (
                                <div className='service-item service-position-price' {...props} />
                            )}
                        />
                    ) : (
                        <Fragment>
                            <div className='nofixed-container price-type-service'>
                                <label className='form-label'>Tính giá dựa trên:</label>
                                <FormItemGroup
                                    items={service.isWeight ? [...priceNoFixed, ...weightUnit] : priceNoFixed}
                                    container={(props): JSX.Element => (
                                        <div className='service-item price-nofixed' {...props} />
                                    )}
                                />
                            </div>
                            <div className='position-form'>
                                <ServiceTable
                                    deleteRow={deleteRow}
                                    deleteColumn={deleteColumn}
                                    onFieldChange={onFieldChange}
                                    isEdit={true}
                                    columns={[]}
                                    dataSource={distanceArr || []}
                                    service={service}
                                />
                                {(service?.isWeight || service?.isTruck) && (
                                    <ButtonIconOnly
                                        icon={<AddPlusIcon />}
                                        iconType='primary'
                                        className='add-column'
                                        onClick={(e): void => {
                                            e.preventDefault()
                                            addColumn()
                                        }}
                                    />
                                )}
                            </div>
                            {service?.isDistance && (
                                <ButtonIconOnly
                                    icon={<AddPlusIcon />}
                                    iconType='primary'
                                    className='add-row'
                                    onClick={(event): void => {
                                        event.preventDefault()
                                        addRow && addRow()
                                    }}
                                />
                            )}
                        </Fragment>
                    )}
                    <div className='serrvice-form-groupbtn'>
                        <ButtonPrimary type='submit'>Lưu</ButtonPrimary>
                        <ButtonDanger onClick={onCancelForm}>Hủy</ButtonDanger>
                    </div>
                </NForm>
            </Card>
        </Fragment>
    )
}

export default ServiceFormTemplate
