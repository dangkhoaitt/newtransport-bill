import React, { useCallback } from 'react'
import { USER_URL } from '../../../../share/common/api-constants'
import { useSubmitRequest } from '../../../../share/hooks'
import { User } from '../../../../share/interface/User'
import { isNullOrUndefined, isStringEmpty } from '../../../../share/utils/empty-util'
import { CREATE_USER_ACTION } from '../../../../store/actions/user.action'
import { UserForm } from '../../../organisms/user/user-form'

export default function ModalUserCreate(): JSX.Element {
    const submitRequest = useSubmitRequest()

    const onFinish = useCallback((user: User) => {
        Object.keys(user).forEach((u) => (isNullOrUndefined(user[u]) || isStringEmpty(user[u])) && delete user[u])
        submitRequest({
            url: USER_URL,
            params: user,
            actionType: CREATE_USER_ACTION
        })
    }, [])

    return <UserForm onFinish={onFinish} />
}
