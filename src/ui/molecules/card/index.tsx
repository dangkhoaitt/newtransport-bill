import React, { HTMLAttributes, ReactNode } from 'react'
import './styles/index.scss'

type Props = {
    id?: string
    header?: ReactNode | string
    children: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

function Card({ id, header, children, className = '', ...props }: Props): JSX.Element {
    return (
        <div id={id} className={`card ${className}`} {...props}>
            {header && (
                <div className='card-header'>
                    <div className='card-header-caption'>
                        <div className='card-title'>{header}</div>
                    </div>
                </div>
            )}
            <div className='card-content'>{children}</div>
        </div>
    )
}

export default Card
