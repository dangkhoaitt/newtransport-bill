import React, { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './style/index.scss'

type LinkProps = {
    linkType:
        | 'text-default'
        | 'text-primary'
        | 'text-warning'
        | 'text-danger'
        | 'text-success'
        | 'bg-default'
        | 'bg-primary'
        | 'bg-warning'
        | 'bg-danger'
        | 'bg-success'
    children: ReactNode
    href: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

const Anchor = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const { linkType, children, ...otherProps } = props
    const linkProps: Omit<LinkProps, 'children' | 'linkType'> = { ...otherProps }
    linkProps.className = `link link-${linkType}`
    return (
        <Link {...linkProps} ref={ref} to={props.href}>
            {children}
        </Link>
    )
})

export default Anchor
