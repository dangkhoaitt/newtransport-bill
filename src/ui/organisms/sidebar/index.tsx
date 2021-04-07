import React, { useRef } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { MenuPaths } from '../../../share/common/app-constants'
import { Any } from '../../../share/interface/Unknown'
import {
    ClipBoardIcon,
    DeliveryIcon,
    FinanceIcon,
    ListBoldIcon,
    NextIcon,
    PackageIcon,
    ProfileIcon,
    ProvinceIcon,
    RegisterIcon,
    SettingIcon,
    TruckIcon,
    UserProfileBoldIcon,
    UserProfileIcon
} from '../../atoms/icons'
import './style/index.scss'

const items = [
    { key: MenuPaths.shipping_bill, title: 'Quản lý vận đơn', icon: <ListBoldIcon /> },
    { key: MenuPaths.customer, title: 'Quản lý khách hàng', icon: <UserProfileBoldIcon /> },
    {
        key: 'setting-info',
        title: 'Thông tin vận đơn',
        icon: <SettingIcon />,
        child: [
            { key: MenuPaths.province, title: 'Quản lý tỉnh thành', icon: <ProvinceIcon /> },
            { key: MenuPaths.truck, title: 'Quản lý loại xe tải', icon: <TruckIcon /> },
            { key: MenuPaths.service, title: 'Quản lý dịch vụ', icon: <RegisterIcon /> },
            { key: MenuPaths.package, title: 'Quản lý số kiện', icon: <PackageIcon /> },
            { key: MenuPaths.progress, title: 'Trạng thái hành trình', icon: <DeliveryIcon /> },
            { key: MenuPaths.finance, title: 'Thông tin kế toán', icon: <FinanceIcon /> }
        ]
    },
    { key: MenuPaths.user, title: 'Quản lý tài khoản', icon: <UserProfileIcon /> },
    { key: MenuPaths.unit, title: 'Quản lý đơn vị', icon: <ProfileIcon /> },
    { key: MenuPaths.quotation, title: 'Quản lý báo giá', icon: <ClipBoardIcon /> }

    // { key: MenuPaths.customer, title: 'Quản lý khách hàng', icon: <UserProfileBoldIcon /> },
    // { key: MenuPaths.settings, title: 'Thiết lập hệ thống', icon: <SettingIcon /> }
]

type SideBarItemProps = {
    items: Any
    onHanldeClick: () => void
}

const SideBarItem = ({ items, onHanldeClick }: SideBarItemProps): JSX.Element => {
    const match = useRouteMatch({ path: window.location.pathname, strict: true, sensitive: true })

    const setClassActive = (url: string): string => {
        if ((match?.path === '/' || match?.path.includes(url)) && url === MenuPaths.bill) return 'menu-link-active'
        else if (match?.path !== '/' && match?.path.includes(url)) return 'menu-link-active'
        return ''
    }
    return items.map((item) => {
        return (
            <li
                key={item.key}
                className={`${setClassActive(item.key)} ${item.child ? 'parent-item' : 'children-item'}`}>
                <div className='sidebar-item'>
                    <span className='drawer-icon'>{item.icon}</span>

                    {item.child ? (
                        <label className='parent-label' onClick={onHanldeClick}>
                            {item.title}
                            <NextIcon className='icon-up' />
                        </label>
                    ) : (
                        <Link to={`/${item.key}`}>{item.title}</Link>
                    )}
                </div>
                {item.child && (
                    <ul>
                        <SideBarItem items={item.child} onHanldeClick={onHanldeClick} />
                    </ul>
                )}
            </li>
        )
    })
}

export default function SideBar(): JSX.Element {
    const itemRef = useRef<HTMLUListElement>(null)
    const onHandleClick = (): void => {
        const wrapper = itemRef.current
        if (wrapper) {
            if (wrapper.classList.contains('active')) wrapper.classList.toggle('active', false)
            else wrapper.classList.toggle('active', !wrapper.classList.contains('parent-item'))
        }
    }
    return (
        <nav id='drawer'>
            <div className='logo'>New Transport</div>
            <ul ref={itemRef}>
                <SideBarItem items={items} onHanldeClick={onHandleClick} />
            </ul>
        </nav>
    )
}
