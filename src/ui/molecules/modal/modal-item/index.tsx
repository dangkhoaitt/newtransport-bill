import React, { useEffect, useRef } from 'react'
import { useModal } from '..'
import { keyCodes } from '../../../../share/common/app-constants'
import { CancelBoldIcon } from '../../../atoms/icons'
import { ButtonWithIcon } from '../../buttons'
import { ModalProps } from '../type'

type EventListener = Event & { keyCode?: number; target: EventTarget | null }

const ModalItem = (props: ModalProps): JSX.Element => {
    const { closeModal } = useModal()
    const { title = '', content = '', className = '' } = props
    const { closeOnClickOutside = false, closeOnEsc = false, onCancel } = props
    const wrapperRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        closeOnEsc && wrapperRef.current && wrapperRef.current.addEventListener('keydown', onKeyEsc, false)
        closeOnClickOutside && wrapperRef.current && wrapperRef.current.addEventListener('mousedown', onKeyEsc)
        return (): void => {
            closeOnEsc && wrapperRef.current && wrapperRef.current.removeEventListener('keydown', onKeyEsc, false)
            closeOnClickOutside && wrapperRef.current && wrapperRef.current.removeEventListener('mousedown', onKeyEsc)
        }
    }, [])

    function onKeyEsc(event: EventListener): void {
        if (
            contentRef.current &&
            (event.keyCode === keyCodes.ESC || !contentRef.current.contains(event.target as Node))
        ) {
            onCancel && onCancel()
            closeModal()
        }
    }

    function onCloseModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        e.preventDefault()
        onCancel && onCancel()
        closeModal()
    }

    return (
        <div ref={wrapperRef} className={`modal ${className}`}>
            <div ref={contentRef} className='modal-content'>
                <div className='modal-header'>
                    <span>{title}</span>
                    <ButtonWithIcon onClick={onCloseModal} icon={<CancelBoldIcon />} />
                </div>
                {content}
            </div>
        </div>
    )
}

export default ModalItem
