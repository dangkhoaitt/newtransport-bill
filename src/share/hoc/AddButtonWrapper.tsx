import React, { Fragment, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../store/types'
import { Roles } from '../common/app-constants'
import { User } from '../interface/User'
import { createButtonRules, deleteButtonRules, editButtonRules, Rules } from './rules'

function hasPermission(rules: Rules[], unit?: string | null, id?: string): boolean {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    const path = location.pathname
    if (!userLogin?.role) return false
    for (let index = 0; index < rules.length; index++) {
        const rule = rules[index]
        if (path.includes(rule.path) && rule.accessible.includes(userLogin?.role)) {
            if (
                userLogin?.role !== Roles.admin &&
                ((unit && userLogin.unit?.code !== unit) || unit === null || (id && userLogin.id !== id))
            )
                return false
            else return true
        }
    }
    return false
}

type Props = { children: ReactNode; unit?: string | null; id?: string }
export function AddButtonWrapper({ children, unit }: Props): JSX.Element {
    if (!hasPermission(createButtonRules, unit)) return <Fragment />
    return <Fragment>{children}</Fragment>
}

export function EditButtonWrapper({ children, unit, id }: Props): JSX.Element {
    if (!hasPermission(editButtonRules, unit, id)) return <Fragment />
    return <Fragment>{children}</Fragment>
}

export function DeleteButtonWrapper({ children, unit }: Props): JSX.Element {
    if (!hasPermission(deleteButtonRules, unit)) return <Fragment />
    return <Fragment>{children}</Fragment>
}

interface ActionButtonProps {
    children?: ReactNode
    value?: string
    color?: string
    className?: string
}

export function ActionButtonWrapper({ children, color, value, className }: ActionButtonProps): JSX.Element {
    if (!hasPermission(editButtonRules))
        return (
            <label color={color} className={className}>
                {value}
            </label>
        )
    return <Fragment>{children}</Fragment>
}
