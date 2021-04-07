import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { MenuPaths, Roles } from '../../../share/common/app-constants'
import { Service } from '../../../share/interface/Service'
import { User } from '../../../share/interface/User'
import { AppState } from '../../../store/types'
import Anchor from '../../atoms/link'
import NForm, { FormItem, NFormItem } from '../../molecules/form'
import ServiceList from '../../organisms/service/service-list/ServiceList'
import './style/index.scss'

interface Props {
    serviceList: Service[]
    totalRecords?: number
}

const ServiceListTeamplate = ({ serviceList }: Props): JSX.Element => {
    const [isMain, setIsMain] = useState<boolean>(true)
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    const item: FormItem = {
        title: 'Loại dịch vụ:| Dịch vụ chính | Dịch vụ cộng thêm',
        name: 'typeService',
        type: 'radio-group',
        defaultChecked: true
    }

    return (
        <div id='service-list'>
            {userLogin?.role === Roles.admin ? (
                <Anchor href={MenuPaths.serviceCreate} linkType='bg-primary'>
                    Thêm dịch vụ
                </Anchor>
            ) : null}
            <div id='search-service'>
                <div className='label-search'>Tìm kiếm dịch vụ</div>
                <NForm onFieldChange={(_: string, value: unknown): void => setIsMain(value === '1' ? true : false)}>
                    <NFormItem item={item} />
                </NForm>
            </div>
            <ServiceList
                data={serviceList
                    .filter((s) => s.isExtra !== isMain)
                    .concat(serviceList.filter((s) => s.isExtra === isMain))}
            />
        </div>
    )
}

export default ServiceListTeamplate
