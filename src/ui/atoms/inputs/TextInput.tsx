import React, { forwardRef } from 'react'
import InputBase from './interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInputProps(inputProps: InputBase<any>): void {
    Object.keys(inputProps).forEach((key) => {
        if (key.startsWith('on')) inputProps[key] = undefined
    })
}

const TextInput = forwardRef<HTMLInputElement, InputBase<HTMLInputElement>>((props, ref) => {
    const { className = '', ...inputProps } = props
    props.disabled && getInputProps(inputProps)

    return (
        <div className={`input ${className}`}>
            <input type='text' ref={ref} {...inputProps} />
            <span className='focus-border'></span>
        </div>
    )
})

export default TextInput
