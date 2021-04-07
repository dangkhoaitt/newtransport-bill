import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import { AppState } from '../../../store/types'
import { NotificationOptions } from '../../../store/types/index'

const Notification = React.memo(
    (): JSX.Element => {
        const notification = useSelector<AppState, NotificationOptions | undefined>((state) => state.app.notification)
        const { addToast } = useToasts()

        useEffect(() => {
            if (notification) {
                addToast(notification.title, { appearance: notification.status })
            }
        }, [notification])

        return <Fragment />
    },
    () => true
)

export default Notification
