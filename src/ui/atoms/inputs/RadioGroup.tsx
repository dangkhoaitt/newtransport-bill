import React, { forwardRef } from 'react'
import { InputRadio } from './interface'
import { getInputProps } from './TextInput'

const RadioGroup = forwardRef<HTMLInputElement, InputRadio>((props, ref) => {
    const { className = '', title, defaultChecked, onChange, ...inputProps } = props
    props.disabled && getInputProps(inputProps)
    const titleItem = title?.split('|')

    return (
        <div className={`radio-group ${className}`}>
            <div className='radio-item'>
                <label className='radio'>
                    <input
                        type='radio'
                        value={1}
                        ref={ref}
                        defaultChecked={defaultChecked}
                        onChange={(e): void => {
                            onChange && onChange(e)
                        }}
                        {...inputProps}
                    />
                    <span className='radio-design' />
                </label>
                <span className='label-radio'>{titleItem && titleItem[1].trim()}</span>
            </div>
            <div className='radio-item'>
                <label className='radio'>
                    <input
                        type='radio'
                        ref={ref}
                        value={0}
                        defaultChecked={!defaultChecked}
                        onChange={(e): void => {
                            onChange && onChange(e)
                        }}
                        {...inputProps}
                    />
                    <span className='radio-design' />
                </label>
                <span className='label-radio'>{titleItem && titleItem[2].trim()}</span>
            </div>
        </div>
    )
})

export default RadioGroup
