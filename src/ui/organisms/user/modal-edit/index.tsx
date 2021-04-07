import React from 'react'
import { useDispatch } from 'react-redux'
import { USER_URL } from '../../../../share/common/api-constants'
import { MenuPaths } from '../../../../share/common/app-constants'
import { contentNotification, HttpMethod, useSubmitRequest } from '../../../../share/hooks'
import { User } from '../../../../share/interface/User'
import { SHOW_NOTIFICATION } from '../../../../store/actions/app.action'
import { EDIT_USER_ACTION } from '../../../../store/actions/user.action'
import { useModal } from '../../../molecules/modal'
import { UserForm } from '../../../organisms/user/user-form'

interface Props {
    user: User
    setDetailUser: (user: User) => void
}

export default function ModalUserEdit({ user, setDetailUser }: Props): JSX.Element {
    const { closeModal } = useModal()
    const submitRequest = useSubmitRequest()
    const dispatch = useDispatch()
    const idUser = document.getElementsByTagName('meta')['id'].content
    const urlProfile = window.location.pathname.includes(MenuPaths.profile)
    const idProfile = urlProfile ? `/${idUser}` : `/${window.location.pathname.split('/').pop()}`

    function onFinish(newUser: User): void {
        submitRequest({
            url: USER_URL + idProfile,
            params: newUser,
            method: HttpMethod.PATCH,
            actionType: EDIT_USER_ACTION,
            callback: ({ response, request }) => {
                const newEdit: User = Object.assign(user, response.data)
                setDetailUser(newEdit)
                dispatch({
                    type: SHOW_NOTIFICATION,
                    payload: contentNotification(request.method ?? '', true)
                })
                closeModal()
            }
        })
    }

    return <UserForm user={user} isEdit onFinish={onFinish} />
}
