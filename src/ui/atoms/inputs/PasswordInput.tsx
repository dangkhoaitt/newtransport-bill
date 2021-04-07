import React, { forwardRef } from 'react'
import InputBase from './interface'
import { getInputProps } from './TextInput'

const PasswordInput = forwardRef<HTMLInputElement, InputBase<HTMLInputElement>>((props, ref) => {
    const { className = '', ...inputProps } = props
    props.disabled && getInputProps(inputProps)

    return (
        <div className={`input ${className}`}>
            <input type='password' ref={ref} {...inputProps} />
            <span className='focus-border'></span>
        </div>
    )
})

export default PasswordInput
