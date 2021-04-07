import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import Button from '../../atoms/button'
import './styles/index.scss'

type ButtonWithIcon = { icon: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
export function ButtonWithIcon(props: ButtonWithIcon): JSX.Element {
    const btnProps: Omit<ButtonWithIcon, 'icon' | 'children'> = { ...props }
    return (
        <Button {...btnProps}>
            <span className='btn__label__icon'>{props.icon}</span>
            {props.children}
        </Button>
    )
}

type ButtonIconOnly = { icon: ReactNode; iconType: 'default' | 'warning' | 'primary' } & ButtonHTMLAttributes<
    HTMLButtonElement
>
export function ButtonIconOnly(props: ButtonIconOnly): JSX.Element {
    const btnProps: Omit<ButtonIconOnly, 'icon' | 'children' | 'iconType'> = { ...props }
    btnProps.className = `btn-icon btn-icon-${props.iconType}`
    return (
        <Button {...btnProps}>
            <span className='btn__label__icon'>{props.icon}</span>
            {props.children}
        </Button>
    )
}
