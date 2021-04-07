import React, { ButtonHTMLAttributes, Fragment, Ref } from 'react'
import { useSelector } from 'react-redux'
import { Roles } from '../../../share/common/app-constants'
import { User } from '../../../share/interface/User'
import { AppState } from '../../../store/types'
import Button from '../../atoms/button'
import './styles/index.scss'

export const ButtonDefault = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        return <Button className='btn-default' {...props} ref={ref} />
    }
)

export const ButtonPrimary = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        return <Button className='btn-primary' {...props} ref={ref} />
    }
)

export const ButtonWarning = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        return <Button className='btn-warning' {...props} ref={ref} />
    }
)

export const ButtonDanger = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        return <Button className='btn-danger' {...props} ref={ref} />
    }
)

export const AddButtonWrapper = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
        if (userLogin?.role === Roles.admin) return <Button className='btn-primary' {...props} ref={ref} />
        else return <Fragment />
    }
)
