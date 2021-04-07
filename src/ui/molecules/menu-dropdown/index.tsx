import React, { forwardRef, ReactNode, useEffect, useRef } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import './style/index.scss'

type MenuDropdownProps = {
    label: ReactNode
    children: ReactNode
    className?: string
}

const MenuDropdown = forwardRef<HTMLDivElement, MenuDropdownProps>((props, ref) => {
    const { className = '' } = props
    const menuRef = useRef<HTMLDivElement>(null)

    function onMenuToggle(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        event.stopPropagation()
        const lastChild = event.currentTarget.children[1] as HTMLDivElement
        lastChild.style.height = lastChild.clientHeight ? '0' : `${lastChild.children[0].clientHeight}px`
    }

    useEffect(() => {
        const clickOutsideEvent: Subscription = fromEvent(window, 'click').subscribe(() => {
            if (menuRef.current && menuRef.current.clientHeight) menuRef.current.style.height = '0'
        })
        return (): void => clickOutsideEvent.unsubscribe()
    }, [])

    return (
        <div className={`menu-dropdown ${className}`} ref={ref} onClick={onMenuToggle}>
            <div className='label-dropdown'>{props.label}</div>
            <div className='info-menu' ref={menuRef}>
                <div className='info-item'>{props.children}</div>
            </div>
        </div>
    )
})

export default MenuDropdown
