import React, { Fragment, MouseEvent, ReactNode } from 'react'
import { ajaxPost } from 'rxjs/internal/observable/dom/AjaxObservable'
import { MenuPaths } from '../../../../share/common/app-constants'
import { clearAllCookies, getCookies, USERNAME } from '../../../../share/utils/cookie-util'
import { DownArrowIcon, LogoutBoldIcon, PasswordIcon, UserProfileBoldIcon, UserProfileIcon } from '../../../atoms/icons'
import Anchor from '../../../atoms/link'
import MenuDropdown from '../../../molecules/menu-dropdown'
import { useModal } from '../../../molecules/modal'

export default function ProfileUser(): JSX.Element {
    const { confirm } = useModal()

    const logOut = (event: MouseEvent<HTMLAnchorElement>): void => {
        event.preventDefault()
        event.stopPropagation()
        confirm({
            title: 'Bạn có chắc chắn muốn đăng xuất?',
            okText: 'Thoát',
            cancelText: 'Hủy',
            onConfirm: () => {
                if (process.env.LOGOUT_URL) {
                    ajaxPost(process.env.LOGOUT_URL).subscribe(() => {
                        location.reload()
                    })
                } else clearAllCookies()
            }
        })
    }

    const label: ReactNode = (
        <Fragment>
            <UserProfileIcon />
            {process.env.LOGOUT_URL ? document.getElementsByTagName('meta')['user'].content : getCookies(USERNAME)}
            <DownArrowIcon />
        </Fragment>
    )

    return (
        <MenuDropdown label={label}>
            <Anchor href={`/${MenuPaths.profile}`} linkType='text-default'>
                <UserProfileBoldIcon /> Thông tin cá nhân
            </Anchor>
            <Anchor href={`/${MenuPaths.changePassword}`} linkType='text-default'>
                <PasswordIcon /> Thay đổi mật khẩu
            </Anchor>
            <Anchor href='#' linkType='text-default' onClick={logOut}>
                <LogoutBoldIcon /> Đăng xuất
            </Anchor>
        </MenuDropdown>
    )
}
