import React, { ButtonHTMLAttributes, Ref } from 'react'
import './styles/index.scss'

const Button = React.forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>): JSX.Element => {
        return (
            <button
                className={`btn ${props.className || 'btn-default'}`}
                ref={ref}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onClick={props.onClick}
                disabled={props.disabled}>
                <span className='btn__label'>{props.children}</span>
            </button>
        )
    }
)

export default Button
