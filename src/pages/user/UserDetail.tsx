import React, { Fragment, useEffect, useState } from 'react'
import { USER_URL } from '../../share/common/api-constants'
import { MenuPaths } from '../../share/common/app-constants'
import withErrorBoundary from '../../share/hoc'
import { HttpMethod, useSubmitRequest } from '../../share/hooks'
import { User } from '../../share/interface/User'
import { GET_USER_DETAIL } from '../../store/actions/user.action'
import UserDetailTemplate from '../../ui/templates/user/user-detail'

const UserDetail = (): JSX.Element => {
    const [user, setUser] = useState<User>()
    const submitRequest = useSubmitRequest()
    const id = window.location.pathname.split('/').pop()
    const idUser = document.getElementsByTagName('meta')['id'].content
    const urlProfile = window.location.pathname.includes(MenuPaths.profile)
    const idProfile = urlProfile ? `/${idUser}` : `/${id}`

    useEffect(() => {
        submitRequest({
            url: USER_URL + idProfile,
            actionType: GET_USER_DETAIL,
            isConfirm: false,
            method: HttpMethod.GET,
            callback: (response) => setUser(response.response.data)
        })
    }, [id])

    if (user) return <UserDetailTemplate user={user} />
    return <Fragment />
}

export default withErrorBoundary(UserDetail)
