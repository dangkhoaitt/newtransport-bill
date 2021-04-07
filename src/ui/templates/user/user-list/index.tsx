import React, { ReactNode, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { USER_URL } from '../../../../share/common/api-constants'
import { MenuPaths, Roles } from '../../../../share/common/app-constants'
import { useSearchRequest } from '../../../../share/hooks'
import { User } from '../../../../share/interface/User'
import { buildQuerySearchFromObject, updateURLSearch } from '../../../../share/utils/app-util'
import { isNullOrUndefined } from '../../../../share/utils/empty-util'
import { DO_SEARCH_USER } from '../../../../store/actions/user.action'
import { AppState, UserSearchParams } from '../../../../store/types'
import { ButtonPrimary } from '../../../molecules/buttons'
import { useModal } from '../../../molecules/modal'
import { ModalProps } from '../../../molecules/modal/type'
import Pagination from '../../../molecules/pagination'
import ModalUserCreate from '../../../organisms/user/modal-create'
import UserList from '../../../organisms/user/user-list'
import UserSearch from '../../../organisms/user/user-search'
import './style/index.scss'

interface Props {
    userList: User[]
    totalRecords?: number
    querySearch?: string
}

export default function UserTemplate({ userList, totalRecords, querySearch }: Props): JSX.Element {
    const history = useHistory()
    const { openModal } = useModal()
    const searchRequest = useSearchRequest()
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    function defaultCurrent(): number {
        const pageNumber = new URLSearchParams(querySearch || window.location.search).get('page')
        if (isNullOrUndefined(pageNumber)) return 1
        return Number(pageNumber)
    }

    function currentSearch(page: number): UserSearchParams {
        const searchParams: UserSearchParams = {}
        const params = new URLSearchParams(window.location.search)
        params.forEach((value, key) => (searchParams[key] = value))
        return Object.assign(searchParams, { page })
    }

    const onPageChange = useCallback((page: number) => {
        searchRequest({
            url: USER_URL + '?' + buildQuerySearchFromObject(currentSearch(page)),
            actionType: DO_SEARCH_USER
        })
        updateURLSearch(history, MenuPaths.user, `page=${page}`)
    }, [])

    const modal: ModalProps = {
        className: 'modal-user',
        title: 'Thêm tài khoản',
        content: <ModalUserCreate />
    }

    const openCreateUser = (): void => {
        openModal(modal)
    }

    return (
        <div id='user-list'>
            {userLogin?.role !== Roles.member ? (
                <ButtonPrimary onClick={openCreateUser}>Thêm tài khoản</ButtonPrimary>
            ) : null}
            <UserSearch querySearch={querySearch} />
            <UserList data={userList} />
            {totalRecords === 0 ? (
                <div className='empty-table-data'>Không có tài khoản nào</div>
            ) : (
                <Pagination
                    showPrevNextJumpers={true}
                    defaultPageSize={10}
                    total={totalRecords}
                    onChange={onPageChange}
                    current={defaultCurrent()}
                    showTotal={(total: number, range: [number, number]): ReactNode => (
                        <div>{`${range[0]}-${range[1]}/${total} Tài khoản`}</div>
                    )}></Pagination>
            )}
        </div>
    )
}
