import React, { forwardRef } from 'react'
import { InputRadio } from './interface'
import { getInputProps } from './TextInput'

const RadioInput = forwardRef<HTMLInputElement, InputRadio>((props, ref) => {
    const { className = '', ...inputProps } = props
    props.disabled && getInputProps(inputProps)

    return (
        <label className={`radio ${className}`}>
            <input type='radio' ref={ref} {...inputProps} />
            <span className='radio-design' />
        </label>
    )
})

export default RadioInput
