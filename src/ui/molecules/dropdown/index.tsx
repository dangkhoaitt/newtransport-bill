import React, { forwardRef, MouseEvent, useEffect, useRef, useState } from 'react'
import { Unknown } from '../../../share/interface/Unknown'
import { DownArrowIcon } from '../../atoms/icons'
import './style/index.scss'

export interface Source extends Unknown {
    code?: string | number | boolean
    name?: string
}
type SelectProps = {
    disabled?: boolean
    defaultValue?: string | number | boolean
    dataSource?: Source[]
    placeholder?: string
    isNoSelect?: boolean
    className?: string
    onSelect?: (value?: string | number | boolean) => void
}

const Dropdown = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
    const { dataSource = [], placeholder = '', className = '', onSelect, defaultValue, isNoSelect, disabled } = props
    const dataRef = useRef<HTMLDivElement>(null)
    const selectedRef = useRef<HTMLDivElement>(null)
    const optionFocus = useRef<number>(-1)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    if (isNoSelect && dataSource[0]?.code !== '') {
        // TODO : Không Hardcode, phục vụ đa ngôn ngữ
        dataSource.unshift({ name: 'Không lựa chọn', code: '' })
    }

    function onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (disabled) return
        const key = event.which || event.key
        if (key === 32) {
            onClick()
            return
        }

        if (key === 13) {
            onSelect && onSelect(dataSource[optionFocus.current].code)
            setSelectedIndex(optionFocus.current)
            onBlur()
            return
        }

        if (dataRef.current?.getAttribute('class')?.includes('focus') && (key === 38 || key === 40)) {
            optionFocus.current > -1 && optionFocus.current < dataSource.length && removeClassActive()
            if (key === 38) {
                optionFocus.current = optionFocus.current - 1 < 0 ? dataSource.length - 1 : optionFocus.current - 1
            }
            if (key === 40) {
                optionFocus.current = optionFocus.current + 1 === dataSource.length ? 0 : optionFocus.current + 1
            }
            setClassOption()
            return
        }
    }

    const onBlur = (): void => {
        if (dataRef.current) {
            dataRef.current && dataRef.current.setAttribute('class', 'data-list scroll-container')
            dataRef.current.style.display = 'none'
        }
    }

    function setClassOption(): void {
        if (dataRef.current) {
            const childNode = dataRef.current.childNodes[optionFocus.current] as HTMLDivElement
            const heightScroll = childNode?.offsetHeight * optionFocus.current
            childNode.setAttribute('class', `${childNode.className} option-hover`)
            dataRef.current.scrollTo(heightScroll, heightScroll)
        }
    }

    const removeClassActive = (): void => {
        const childNode = dataRef.current?.childNodes[optionFocus.current] as HTMLDivElement
        if (childNode) {
            const classOld = childNode.className.includes('option-active') ? 'option-active' : ''
            childNode?.setAttribute('class', classOld)
        }
    }

    const onClick = (): void => {
        if (disabled) return
        if (dataRef.current) {
            if (dataRef.current.style.display === 'block') {
                dataRef.current.setAttribute('class', 'data-list scroll-container')
                dataRef.current.style.display = 'none'
            } else {
                dataRef.current.focus()
                const classOld = dataRef.current.getAttribute('class')
                dataRef.current.setAttribute('class', `${classOld} focus`)
                dataRef.current.style.display = 'block'
            }
        }
    }

    const onFocus = (): void => {
        if (disabled) return
        if (dataRef.current) {
            const classOld = dataRef.current.getAttribute('class')
            dataRef.current.setAttribute('class', `${classOld} focus`)
        }
    }

    function onItemSelected(event: React.MouseEvent<HTMLDivElement>): void {
        if (disabled) return
        const dataIndex = Number(event.currentTarget.getAttribute('data-index'))
        onSelect && onSelect(dataSource[dataIndex].code)
        setSelectedIndex(dataIndex)
    }

    function onMouseOverHandler(event: MouseEvent<HTMLDivElement>): void {
        if (disabled) return
        removeClassActive()
        optionFocus.current = Number(event.currentTarget.getAttribute('data-index'))
    }

    useEffect(() => {
        if (selectedRef.current && defaultValue) {
            dataSource.forEach((source, index) => {
                if (source.code === defaultValue) setSelectedIndex(index)
            })
        }
    }, [defaultValue])

    const dataValue = selectedIndex !== -1 ? dataSource[selectedIndex] : undefined
    return (
        <div ref={ref} className={`${className} dropdown-container`}>
            <div ref={dataRef} style={{ display: 'none' }} className='data-list scroll-container'>
                {dataSource &&
                    dataSource.map((source, index) => (
                        <div
                            className={`${selectedIndex === index ? 'option-active' : ''}`}
                            key={index}
                            data-index={index}
                            onMouseDown={onItemSelected}
                            onMouseOver={onMouseOverHandler}>
                            {source.name}
                        </div>
                    ))}
            </div>
            <div
                tabIndex={0}
                ref={selectedRef}
                className={`selected-value ${disabled && 'select-disabled'}`}
                onFocus={onFocus}
                onClick={onClick}
                onKeyDown={onKeyDownHandler}
                onBlur={onBlur}>
                {dataValue ? (
                    <span className='default-value'>{dataValue.name}</span>
                ) : (
                    <span className='select-placeholder'>{placeholder}</span>
                )}
                <DownArrowIcon className='icon-down' />
            </div>
            <span className='focus-border'></span>
        </div>
    )
})

export default Dropdown
