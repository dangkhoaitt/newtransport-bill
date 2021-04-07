import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Unknown } from '../../../share/interface/Unknown'
import { DownArrowIcon } from '../../atoms/icons'
import './style/index.scss'

export interface Source extends Unknown {
    code: string
    name: string
}
type SelectProps = {
    defaultValue?: string
    dataSource: Source[]
    placeholder?: string
    className?: string
    disabled?: boolean
    onChange?: (value: string) => void
}

const SelectSearch = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
    const { dataSource, placeholder, className, onChange, defaultValue, disabled } = props
    const dataRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [valueFilter, setValueFilter] = useState('')
    const optionFocus = useRef<number>(-1)
    const value = useRef<string>('')

    function onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (disabled) return
        const key = event.which || event.key
        if (key === 38) {
            if (optionFocus.current <= 0) {
                removeClassActive(0)
                optionFocus.current = filters.length - 1
            } else {
                removeClassActive(optionFocus.current)
                optionFocus.current--
            }
            setClassOption()
            return
        }

        if (key === 40) {
            if (optionFocus.current >= filters.length - 1 || optionFocus.current < 0) {
                removeClassActive(filters.length - 1)
                optionFocus.current = 0
            } else {
                removeClassActive(optionFocus.current)
                optionFocus.current++
            }
            setClassOption()
            return
        }

        if (key === 13 && inputRef.current) {
            value.current = filters[optionFocus.current]?.name || value.current
            onChange && onChange(filters[optionFocus.current]?.code || defaultValue || '')
            onFocusOutHandler()
            event.preventDefault()
            return
        }
    }

    function setClassOption(): void {
        if (dataRef.current) {
            const childNodes = dataRef.current.childNodes[optionFocus.current] as HTMLDivElement
            const heightScroll = childNodes?.offsetHeight * optionFocus.current
            childNodes?.setAttribute('class', 'option option-active')
            dataRef.current.scrollTo(heightScroll, heightScroll)
        }
    }

    const removeClassActive = (child: number): void => {
        dataRef.current && (dataRef.current.childNodes[child] as HTMLDivElement)?.setAttribute('class', 'option')
    }

    const onFocusHandler = (): void => {
        if (disabled) return
        optionFocus.current = -1
        if (dataRef.current) dataRef.current.style.display = 'block'
    }

    const onFocusOutHandler = (): void => {
        if (disabled) return
        if (inputRef.current) {
            inputRef.current.value = value.current
        }
        setValueFilter('')
        if (dataRef.current) dataRef.current.style.display = 'none'
    }

    function onChangeHandle(event: React.ChangeEvent<HTMLInputElement>): void {
        if (disabled) return
        onFocusHandler()
        setValueFilter(event.currentTarget.value.toLowerCase())
    }

    function onItemSelected(event: React.MouseEvent<HTMLDivElement>): void {
        if (disabled) return
        dataRef.current?.getElementsByClassName('option-active')[0]?.classList.remove('option-active')
        event.currentTarget.classList.add('option-active')
        const id = event.currentTarget.id
        const selected = dataSource.find((item) => item.code === id)
        if (inputRef.current && selected) {
            inputRef.current.value = selected.name
            onChange && onChange(selected.code)
            value.current = selected.name
        }
        onFocusHandler()
        event.currentTarget.blur()
    }

    useEffect(() => {
        if (inputRef.current && defaultValue) {
            for (const key in dataSource) {
                if (dataSource[key].code === defaultValue) {
                    inputRef.current.value = dataSource[key].name
                    value.current = dataSource[key].name
                }
            }
        }
    }, [defaultValue])

    const filters = valueFilter ? dataSource.filter((item) => item.name.toLowerCase().includes(valueFilter)) : []
    return (
        <div ref={ref} className={`${className} data-over`}>
            <input
                disabled={disabled}
                onKeyDown={onKeyDownHandler}
                ref={inputRef}
                className='data-input'
                placeholder={placeholder}
                onClick={onFocusHandler}
                onFocus={onFocusHandler}
                onBlur={onFocusOutHandler}
                onChange={onChangeHandle}
            />
            <span className='focus-border'></span>
            <DownArrowIcon className='icon-down' />
            <div ref={dataRef} style={{ display: 'none' }} className='data-list scroll-container'>
                {filters.map((source, index) => (
                    <div
                        tabIndex={index}
                        key={source.code}
                        id={source.code}
                        className='option'
                        onMouseDown={onItemSelected}>
                        {source.name}
                    </div>
                ))}
            </div>
        </div>
    )
})

export default SelectSearch
