import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clearRedirectPath } from '../../store/actions/app.action'
import { AppState } from '../../store/types'

const RedirectComponent = React.memo(
    (): JSX.Element => {
        const history = useHistory()
        const dispatch = useDispatch()
        const redirectPath = useSelector<AppState, string | undefined>((state) => state.app.redirectPath)

        useEffect(() => {
            if (redirectPath) {
                history.push(`/${redirectPath}`)
                dispatch(clearRedirectPath())
            }
        }, [redirectPath])

        return <Fragment />
    },
    () => true
)
export default RedirectComponent
