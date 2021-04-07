import React, { forwardRef } from 'react'
import { InputCheckbox } from './interface'
import { getInputProps } from './TextInput'

const CheckboxInput = forwardRef<HTMLInputElement, InputCheckbox>((props, ref) => {
    const { className = '', ...inputProps } = props
    props.disabled && getInputProps(inputProps)

    return (
        <label className={`checkbox ${className}`}>
            <input type='checkbox' ref={ref} {...inputProps} />
            <span className='checkbox-custom' />
        </label>
    )
})

export default CheckboxInput
