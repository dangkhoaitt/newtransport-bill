import React, { forwardRef } from 'react'
import InputBase from './interface'
import { getInputProps } from './TextInput'

const Textarea = forwardRef<HTMLTextAreaElement, InputBase<HTMLTextAreaElement>>((props, ref) => {
    const { className = '', ...textareaProps } = props
    props.disabled && getInputProps(textareaProps)

    return (
        <div className={`input ${className}`}>
            <textarea ref={ref} {...textareaProps} />
            <span className='focus-border'></span>
        </div>
    )
})

export default Textarea
