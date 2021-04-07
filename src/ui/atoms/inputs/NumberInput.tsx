import React, { forwardRef, KeyboardEvent, useRef } from 'react'
import { isStringEmpty } from '../../../share/utils/empty-util'
import InputBase from './interface'
import { getInputProps } from './TextInput'

const NumberRegex = /^\d+$/

interface NumberInputProps extends InputBase<HTMLInputElement> {
    min?: number
    max?: number
    fomat?: (value: number) => string
    getValueNumber?: (value: number) => void
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
    const { className = '', max = 0, defaultValue, value, onBlur, onChange, placeholder, disabled } = props
    const { fomat, getValueNumber } = props
    const inputRef = useRef<HTMLInputElement>(null)

    function onKeyPressHandler(event: KeyboardEvent<HTMLInputElement>): void {
        const value = String.fromCharCode(event.keyCode || event.which)
        const newValue = inputRef.current?.value + value
        if (!NumberRegex.test(value) || (max > 0 && parseInt(newValue) > max)) {
            event.preventDefault()
            return
        }
    }

    const onPasteHandler = (event: React.ClipboardEvent<HTMLInputElement>): void => {
        if (!NumberRegex.test(event.clipboardData.getData('text/plain'))) {
            event.preventDefault()
        }
    }

    const inputProps = { value, onBlur, placeholder, disabled }
    disabled && props.disabled && getInputProps(inputProps)
    function onChangeHandle(event: React.ChangeEvent<HTMLInputElement>): void {
        const numberValue = Number(event.target.value.replace(/[^0-9]/g, '')) || 0
        if (inputRef.current && !isStringEmpty(inputRef.current.value) && fomat) {
            event.target.value = fomat(numberValue)
        }
        getValueNumber && getValueNumber(numberValue)
        onChange && onChange(event)
    }

    return (
        <div ref={ref} className={`input input-numberbox ${className}`}>
            <input
                type='text'
                ref={inputRef}
                defaultValue={fomat ? fomat(Number(defaultValue) || 0) : defaultValue}
                onKeyPress={onKeyPressHandler}
                onPaste={onPasteHandler}
                onChange={onChangeHandle}
                {...inputProps}
            />
            <span className='focus-border' />
        </div>
    )
})

export default NumberInput

export function fomatNumber(value: number): string {
    return Intl.NumberFormat('integer').format(value)
}
