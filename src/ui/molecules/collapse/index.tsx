import React, { useRef } from 'react'
import './style/index.scss'

type CollapseProps = {
    id: string
    label?: string
    children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

function Collapse({ id, label, children, ...props }: CollapseProps): JSX.Element {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const onHandleClick = (): void => {
        const wrapper = wrapperRef.current
        if (wrapper) {
            wrapper.classList.toggle('active', !wrapper.classList.contains('active'))
        }
    }
    return (
        <div ref={wrapperRef} className='wrap-collapsible container-fluid' {...props}>
            <label htmlFor={id} className='lbl-toggle' onClick={onHandleClick}>
                {label}
            </label>
            <div className='collapsible-content'>{children}</div>
        </div>
    )
}

export default Collapse
