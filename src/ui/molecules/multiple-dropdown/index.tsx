import React, { forwardRef, Fragment, MouseEvent, useEffect, useRef, useState } from 'react'
import { Unknown } from '../../../share/interface/Unknown'
import { CrossIcon, UpArrowIcon } from '../../atoms/icons'
import { ButtonIconOnly } from '../buttons'
import '../dropdown/style/index.scss'
import './style/index.scss'

export interface Source extends Unknown {
    id: string
    name: string
}
type SelectProps = {
    multiple?: boolean
    defaultValue?: string[]
    dataSource: Source[]
    placeholder?: string
    className?: string
    onSelect?: (value: string[]) => void
}

const MultipleDropdown = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
    const { dataSource, placeholder = '', className = '', onSelect, defaultValue } = props
    const dataRef = useRef<HTMLDivElement>(null)
    const selectedRef = useRef<HTMLDivElement>(null)
    const optionFocus = useRef<number>(-1)
    const selectedValues = useRef<string[]>([])
    const [selectedList, setSelectedList] = useState<Source[]>([])

    function onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
        const key = event.which || event.key
        if (key === 13) {
            handleSelected(dataSource[optionFocus.current].id)
            return
        }
        if (dataRef.current?.style.display === 'block' && (key === 38 || key === 40)) {
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

    function handleSelected(id: string): void {
        const selecteds = [...selectedList]
        const indexExist = selectedValues.current.indexOf(id)
        if (indexExist < 0) {
            dataSource.forEach((source) => source.id === id && selecteds.push(source))
            selectedValues.current.push(id)
        } else {
            selecteds.forEach((source, index) => source.id === id && selecteds.splice(index, 1))
            selectedValues.current.splice(indexExist, 1)
        }
        setSelectedList(selecteds)
        onSelect && onSelect(selectedValues.current)
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
        if (optionFocus.current > -1 && optionFocus.current) {
            const childNode = dataRef.current?.childNodes[optionFocus.current] as HTMLDivElement
            const classOld = childNode.className.includes('option-active') ? 'option-active' : ''
            childNode?.setAttribute('class', classOld)
        }
    }

    const onFocusHandler = (): void => {
        if (dataRef.current) dataRef.current.style.display = 'block'
    }

    const onFocusOutHandler = (): void => {
        if (dataRef.current) dataRef.current.style.display = 'none'
    }

    const onDeleteAll = (): void => {
        setSelectedList([])
        selectedValues.current = []
        onSelect && onSelect([])
    }

    function onHandleDeleteValueItem(event: React.FocusEvent<HTMLSpanElement>): void {
        handleSelected(event.currentTarget.getAttribute('data-index') || '')
    }

    useEffect(() => {
        function handleClickOutside(this: Document, event: globalThis.MouseEvent): void {
            const node = event.target as Node
            if (dataRef.current && !dataRef.current.contains(node) && !selectedRef.current?.contains(node))
                onFocusOutHandler()
        }
        document.addEventListener('mousedown', handleClickOutside)
        return (): void => document.removeEventListener('mousedown', handleClickOutside)
    }, [dataRef.current?.style.display])

    useEffect(() => {
        if (selectedRef.current && defaultValue) {
            selectedValues.current = defaultValue
            const selecteds = dataSource.filter((source) => {
                return defaultValue.includes(source.id)
            })
            setSelectedList(selecteds)
        }
    }, [defaultValue])

    function RenderValue(): JSX.Element {
        if (selectedList.length > 0)
            return (
                <Fragment>
                    {selectedList.map((item) => (
                        <span
                            data-index={item.id}
                            key={item.id}
                            className='option-selected'
                            onFocus={onHandleDeleteValueItem}>
                            {item.name}
                            <ButtonIconOnly className='btn-cancel' icon={<CrossIcon />} iconType='default' />
                        </span>
                    ))}
                </Fragment>
            )
        return <span className='select-placeholder'>{placeholder}</span>
    }

    return (
        <div ref={ref} className={`${className} dropdown-container multiple-dropdown`}>
            <div
                tabIndex={-1}
                ref={selectedRef}
                className='selected-value'
                onClick={onFocusHandler}
                onKeyDown={onKeyDownHandler}>
                <RenderValue />
            </div>
            <div tabIndex={-2} ref={dataRef} style={{ display: 'none' }} className='data-list scroll-container'>
                <DataSource dataSource={dataSource} values={selectedValues.current} onSelected={handleSelected} />
            </div>
            <span className='focus-border'></span>
            {selectedList.length > 0 ? (
                <ButtonIconOnly
                    className='btn-delete-all'
                    icon={<CrossIcon />}
                    onClick={onDeleteAll}
                    iconType='default'
                />
            ) : (
                <UpArrowIcon className='icon-up' />
            )}
        </div>
    )
})

interface DataSourceProps {
    values: string[]
    dataSource: Array<{ id: string; name: string; selected?: boolean }>
    onSelected: (id: string) => void
}

function DataSource(props: DataSourceProps): JSX.Element {
    const { dataSource, values, onSelected } = props
    dataSource.forEach((data) => {
        data.selected = values.includes(data.id)
    })

    function onItemClickHandler(event: MouseEvent<HTMLDivElement>): void {
        const index = event.currentTarget.getAttribute('data-index') || 0
        onSelected(dataSource[index].id)
    }

    return (
        <Fragment>
            {dataSource.map((source, index) => (
                <div
                    className={source.selected ? 'option-active' : ''}
                    key={source.id}
                    id={source.id}
                    data-index={index}
                    onMouseDown={onItemClickHandler}>
                    {source.name}
                </div>
            ))}
        </Fragment>
    )
}

export default MultipleDropdown
