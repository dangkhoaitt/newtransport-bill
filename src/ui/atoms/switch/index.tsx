import React, { Fragment, useEffect, useRef, useState } from 'react'
import './style/index.scss'

interface toggleSwitchProps {
    toggleSwitchOn?: string
    toggleSwitchOff?: string
    value?: boolean
    disabled?: boolean
    className?: string
    onClick?: (value: boolean) => void
}

const defaultClass = 'toggle_switch__check'
const checkedClass = 'toggle_switch__checked'

function Switch(props: toggleSwitchProps): JSX.Element {
    const { toggleSwitchOn, toggleSwitchOff, className = '', value, onClick, disabled } = props
    const btnToggleSwitchRef = useRef<HTMLButtonElement>(null)
    const [checked, setChecked] = useState(value || false)

    function classHandler(value?: boolean): void {
        if (value && !btnToggleSwitchRef.current?.classList.contains(checkedClass)) {
            btnToggleSwitchRef.current?.classList.remove(defaultClass)
            btnToggleSwitchRef.current?.classList.add(checkedClass)
        } else if (!value && btnToggleSwitchRef.current?.classList.contains(checkedClass)) {
            btnToggleSwitchRef.current?.classList.remove(checkedClass)
            btnToggleSwitchRef.current?.classList.add(defaultClass)
        }
    }

    function toggleSwitch(): void {
        setChecked(!checked)
    }

    function onClickHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        onClick && onClick(!checked)
        toggleSwitch()
        event.preventDefault()
    }

    useEffect(() => {
        classHandler(checked)
    }, [checked])

    useEffect(() => {
        classHandler(value)
    }, [value])
    return (
        <Fragment>
            <button
                disabled={disabled}
                ref={btnToggleSwitchRef}
                className={`btn__toggle--switch ${className}`}
                onClick={onClickHandler}>
                <span>{toggleSwitchOn}</span>
                <span>{toggleSwitchOff}</span>
            </button>
        </Fragment>
    )
}

export default Switch
