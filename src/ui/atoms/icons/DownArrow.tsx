import React from 'react'
import IconProps from './interface'

export default function DownArrowIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 386.257 386.257'>
            <polygon points='0,96.879 193.129,289.379 386.257,96.879 ' />
        </svg>
    )
}
