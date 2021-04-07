import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { SERVICE_URL } from '../../../share/common/api-constants'
import { MenuPaths, Roles } from '../../../share/common/app-constants'
import CurrencyView from '../../atoms/currency/CurrencyView'
import { HttpMethod, useSubmitRequest } from '../../../share/hooks'
import { Service } from '../../../share/interface/Service'
import { User } from '../../../share/interface/User'
import { DELETE_SERVICE } from '../../../store/actions/service.action'
import { AppState } from '../../../store/types'
import Anchor from '../../atoms/link'
import { ButtonDanger } from '../../molecules/buttons'
import Card from '../../molecules/card'
import { ServiceTable } from '../../molecules/table'
import './style/index.scss'
import { getPrice } from './util-service'
import { isArrayEmpty } from '../../../share/utils/empty-util'
interface EditProp {
    service: Service
}

const ServiceDetailTemplate = ({ service }: EditProp): JSX.Element => {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    const submitRequest = useSubmitRequest()
    service.distanceArr?.forEach((p) => {
        p.priceArr?.forEach((w) => {
            if (service?.isWeight) p[`${w.weightTo}`] = w.price
            else if (service?.isTruck) p[`${w.truckCode}`] = w.price
            else p['price'] = w.price
        })
        p.priceArr
    })

    const deleteService = (): void => {
        submitRequest({
            isConfirm: true,
            method: HttpMethod.DELETE,
            url: SERVICE_URL + '/' + service.id,
            actionType: DELETE_SERVICE
        })
    }

    const dataItem = {
        code: 'Mã dịch vụ:',
        name: 'Tên dịch vụ:',
        isExtra: 'Loại dịch vụ:',
        order: 'Số thứ tự'
    }

    const componentItem = {
        code: <span>{service?.code}</span>,
        name: <span>{service?.name}</span>,
        order: <span>{service?.order}</span>,
        isExtra: <span>{service?.isExtra ? 'Dịch vụ cộng thêm' : 'Dịch vụ chính'}</span>,
        price: !isArrayEmpty(service.distanceArr) ? (
            <CurrencyView value={getPrice(service)}></CurrencyView>
        ) : (
            <Fragment />
        )
    }

    return (
        <div className='service-detail-container'>
            {userLogin?.role !== Roles.admin || service?.code === 'COD' ? null : (
                <div className='button-delete-service'>
                    <Anchor href={`/${MenuPaths.serviceEdit}/${service.id}`} linkType='bg-primary'>
                        Chỉnh sửa
                    </Anchor>
                    <ButtonDanger onClick={deleteService}>Xóa</ButtonDanger>
                </div>
            )}
            <div className='service-content-container'>
                <Card className='card-serivce-content' header='Thông tin dịch vụ'>
                    {Object.keys(dataItem).map((key, index) => {
                        return (
                            <div key={index} className='body-row'>
                                <div className='row-label'>{dataItem[key]}</div>
                                <div className='row-content'>{componentItem[key]}</div>
                            </div>
                        )
                    })}
                    {service.isFix ? (
                        <div className='body-row'>
                            <div className='row-label'>Giá dịch vụ:</div>
                            <div className='row-content'>{componentItem.price}</div>
                        </div>
                    ) : (
                        <div className='list-price'>
                            <ServiceTable
                                isEdit={false}
                                columns={[]}
                                dataSource={service.distanceArr || []}
                                service={service}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default ServiceDetailTemplate
