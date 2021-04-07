import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { USER_URL } from '../../share/common/api-constants'
import { MenuPaths } from '../../share/common/app-constants'
import withErrorBoundary from '../../share/hoc'
import { useGetRequest } from '../../share/hooks'
import { User } from '../../share/interface/User'
import { updateURLSearch } from '../../share/utils/app-util'
import { FETCH_USER_RESOURCES } from '../../store/actions/user.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import UserTemplate from '../../ui/templates/user/user-list'

const UserList = (): JSX.Element => {
    const history = useHistory()
    const userList = useSelector<AppState, User[] | undefined>((state) => state.user.list)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.user.totalRecords)
    const storeQuerySearch = useSelector<AppState, string | undefined>((state) => state.user.querySearch)

    const querySearchCurrent = location.search || storeQuerySearch || ''
    useGetRequest({ url: USER_URL + querySearchCurrent, ignore: !!userList, actionType: FETCH_USER_RESOURCES })

    useEffect(() => {
        history.action === 'PUSH' && userList && updateURLSearch(history, MenuPaths.user, querySearchCurrent)
    }, [])

    if (userList)
        return <UserTemplate userList={userList} totalRecords={totalRecords} querySearch={querySearchCurrent} />
    return <Spinner />
}

export default withErrorBoundary(UserList)
