import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Unknown } from '../../../share/interface/Unknown'
import { isArrayEmpty } from '../../../share/utils/empty-util'
import { DownArrowIcon, NextIcon } from '../../atoms/icons'
import { ButtonIconOnly } from '../buttons'
import './style/index.scss'

export interface Source extends Unknown {
    code?: string | number | boolean
    name?: string
    child?: Source[]
}
type SelectProps = {
    disable?: boolean
    defaultValue?: string | number | boolean
    dataSource?: Source[]
    isNoSelect?: boolean
    placeholder?: string
    className?: string
    onSelect?: (name: string, value: string | number | boolean) => void
}

const DropDownTree = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
    const { dataSource = [], placeholder = '', className = '', onSelect, defaultValue, isNoSelect, disable } = props
    const dataRef = useRef<HTMLDivElement>(null)
    const selectedRef = useRef<HTMLDivElement>(null)
    const selectedText = useRef<string>('')
    const [selectedValue, setSelectedValue] = useState<string | number | boolean>()

    if (isNoSelect && dataSource[0]?.code !== '') {
        // TODO : Không Hardcode, phục vụ đa ngôn ngữ
        dataSource.unshift({ name: 'Không lựa chọn', code: '' })
    }

    const onClick = (): void => {
        if (disable) return
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
        if (disable) return
        if (dataRef.current) {
            const classOld = dataRef.current.getAttribute('class')
            dataRef.current.setAttribute('class', `${classOld} focus`)
        }
    }
    const onBlur = (): void => {
        dataRef.current && dataRef.current.setAttribute('class', 'data-list scroll-container')
    }

    function onSelected(value: string | number | boolean, name: string): void {
        if (disable) return
        selectedText.current = name
        onSelect && onSelect(name, value)
        setSelectedValue(value)
        onClick()
    }

    useEffect(() => {
        function handleClickOutside(this: Document, event: globalThis.MouseEvent): void {
            const node = event.target as Node
            if (dataRef.current && !dataRef.current.contains(node) && !selectedRef.current?.contains(node)) {
                dataRef.current.style.display = 'none'
                dataRef.current.setAttribute('class', 'data-list scroll-container')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return (): void => document.removeEventListener('mousedown', handleClickOutside)
    }, [dataRef.current?.style.display])

    function checkDefaultValue(source: Source[], value: string | number | true): void {
        source.forEach((source) => {
            if (source.code === value) {
                selectedText.current = source?.name as string
                setSelectedValue(value)
            } else if (source.child) {
                checkDefaultValue(source.child, value)
            }
        })
    }

    useEffect(() => {
        if (selectedRef.current && defaultValue) {
            checkDefaultValue(dataSource, defaultValue)
        }
    }, [defaultValue])

    return (
        <div ref={ref} className={`${className} dropdown-tree-container`}>
            <div ref={dataRef} style={{ display: 'none' }} className='data-list scroll-container'>
                {RenderItems({ dataSource, onSelect: onSelected, root: true, value: selectedValue })}
            </div>

            <div
                tabIndex={0}
                ref={selectedRef}
                className={`selected-value ${disable && 'select-disabled'}`}
                onBlur={onBlur}
                onFocus={onFocus}
                onClick={onClick}>
                {selectedText.current ? (
                    <span className='default-value'>{selectedText.current}</span>
                ) : (
                    <span className='select-placeholder'>{placeholder}</span>
                )}
                <DownArrowIcon className='icon-down' />
            </div>
            <span className='focus-border'></span>
        </div>
    )
})

type ItemProps = {
    dataSource: Source[]
    root?: boolean
    onSelect?: (value: string | number | boolean, name: string) => void
    value?: string | number | boolean
}

function RenderItems({ dataSource, root, onSelect, value }: ItemProps): JSX.Element[] {
    const onHandleFocus = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault()
        const options = event.currentTarget.parentElement?.parentElement?.children as HTMLCollection
        const childNode = options[options?.length - 1]
        const classChild = childNode?.getAttribute('class')?.includes('child-nodes-focus')
            ? 'child-nodes'
            : 'child-nodes child-nodes-focus'
        childNode?.setAttribute('class', classChild)
    }

    const onHandleSelect = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>): void => {
        const code = event.currentTarget.getAttribute('data-index')
        const name = event.currentTarget.getAttribute('id') as string
        onSelect && onSelect(code || '', name)
    }

    return dataSource.map((item, index) => {
        return (
            <div
                key={`dropdown-${index}`}
                data-root={root}
                className={`node ${root ? 'node-root' : ''} ${!isArrayEmpty(item.child) ? 'node-parent' : ''}`}
                data-parent={!isArrayEmpty(item.child)}>
                <div className={`option ${value === item?.code ? 'option-active' : ''}`}>
                    <label id={item?.name} data-index={item?.code} onClick={onHandleSelect}>
                        {item?.name}
                    </label>
                    {!isArrayEmpty(item.child) && (
                        <ButtonIconOnly onClick={onHandleFocus} icon={<NextIcon />} iconType='default' />
                    )}
                </div>
                {item.child && (
                    <div className='child-nodes'>
                        {RenderItems({ dataSource: item.child, onSelect, root: false, value: value })}
                    </div>
                )}
            </div>
        )
    })
}

export default DropDownTree
