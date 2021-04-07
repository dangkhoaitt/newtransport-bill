import { ChangeEvent, InputHTMLAttributes } from 'react'

export default interface InputBase<T> {
    disabled?: boolean
    value?: string | ReadonlyArray<string> | number
    defaultValue?: string | number
    className?: string
    placeholder?: string
    name?: string
    onChange?: (event?: ChangeEvent<T>) => void
    onBlur?: (event?: ChangeEvent<T>) => void
    onKeyPress?: (event: React.KeyboardEvent<T>) => void
}

export interface InputRadio extends InputBase<HTMLInputElement> {
    defaultChecked?: boolean
    checked?: boolean
    value?: string | ReadonlyArray<string> | number
    title?: string
}

export type InputCheckbox = InputRadio

export type InputAttributes = InputHTMLAttributes<HTMLInputElement>
