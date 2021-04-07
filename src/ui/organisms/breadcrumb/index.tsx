import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { AppState } from '../../../store/types'
import { HomeBoldIcon } from '../../atoms/icons'
import { MenuPaths } from '../../../share/common/app-constants'
import { Unknown } from '../../../share/interface/Unknown'
import { isNullOrUndefined } from '../../../share/utils/empty-util'
import './style/style.scss'

const baseCrumbMap = {
    [`/${MenuPaths.home}`]: 'Trang chủ',
    [`/${MenuPaths.main_service}`]: 'Dịch vụ chính',
    [`/${MenuPaths.shipping_bill}`]: 'Vận đơn',
    [`/${MenuPaths.billImport}`]: 'Nhập excel',
    [`/${MenuPaths.service}`]: 'Dịch vụ',
    [`/${MenuPaths.news}`]: 'Tin tức',
    [`/${MenuPaths.customer_support}`]: 'Hỗ trợ khách hàng',
    [`/${MenuPaths.about_us}`]: 'Giới thiệu',
    [`/${MenuPaths.careers}`]: 'Tuyển dụng',
    [`/${MenuPaths.changePassword}`]: 'Đổi mật khẩu',
    [`/${MenuPaths.profile}`]: 'Thông tin cá nhân',
    [`/${MenuPaths.userDetail}`]: 'chi tiết',
    [`/${MenuPaths.serviceDetail}`]: 'chi tiết',
    [`/${MenuPaths.customerDetail}`]: 'chi tiết',
    [`/${MenuPaths.customer}`]: 'Khách hàng',
    [`/${MenuPaths.user}`]: 'Tài khoản',
    [`/${MenuPaths.truck}`]: 'Quản lý loại xe',
    [`/${MenuPaths.unit}`]: 'Quản lý đơn vị',
    [`/${MenuPaths.progress}`]: 'Trạng thái hành trình',
    [`/${MenuPaths.finance}`]: 'Thông tin kế toán',
    [`/${MenuPaths.package}`]: 'Quản lý số kiện',
    [`/${MenuPaths.province}`]: 'Quản lý tỉnh-quận-huyện',
    [`/${MenuPaths.provinceDetail}`]: 'chi tiết',
    [`/${MenuPaths.quotation}`]: 'Quản lý báo giá',

    ['chi-tiet']: 'Chi tiết',
    ['tao-moi']: 'Tạo mới',
    ['chinh-sua']: 'Chỉnh sửa'
}

const Breadcrumb = (): JSX.Element => {
    const item = useSelector<AppState, Unknown | undefined>((state) => state.breadcrumb.detail)

    const Custom = withRouter((props) => {
        const { location } = props
        const map = Object.assign({}, baseCrumbMap)
        const pathSnippets = location.pathname.split('/').filter((i) => i)
        if (item) {
            map[`${location.pathname}`] = item.name as string
        }

        const extraBreadcrumbItems = pathSnippets.map((pathName, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
            const displayName = map[url] || map[pathName]
            if (isNullOrUndefined(displayName)) return <Fragment key={url} />

            if (pathName.includes('tao-moi') || pathName.includes('chi-tiet')) {
                return (
                    <div key={url} className='breadcrumb-item'>
                        {displayName}
                    </div>
                )
            }
            return (
                <div key={url} className='breadcrumb-item'>
                    <Link to={url}>{displayName}</Link>
                </div>
            )
        })

        const breadcrumbItems = [
            <div key='home' className='breadcrumb-item'>
                {location.pathname === '/' ? (
                    <HomeBoldIcon />
                ) : (
                    <Link to='/'>
                        <HomeBoldIcon />
                    </Link>
                )}
            </div>
        ].concat(extraBreadcrumbItems)

        return <div className='breadcrumb'>{breadcrumbItems}</div>
    })

    return <Custom />
}

export default Breadcrumb
