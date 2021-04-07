import React from 'react'
import IconProps from './interface'

export default function ListIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 120 120'>
            <path d='M114,0H43c-3.3,0-6,2.7-6,6v12c0,3.3,2.7,6,6,6h71c3.3,0,6-2.7,6-6V6C120,2.7,117.3,0,114,0z' />
            <path d='M114,48H43c-3.3,0-6,2.7-6,6v12c0,3.3,2.7,6,6,6h71c3.3,0,6-2.7,6-6V54C120,50.7,117.3,48,114,48z' />
            <path d='M114,96H43c-3.3,0-6,2.7-6,6v12c0,3.3,2.7,6,6,6h71c3.3,0,6-2.7,6-6v-12C120,98.7,117.3,96,114,96z' />
            <path d='M18,0H6C2.7,0,0,2.7,0,6v12c0,3.3,2.7,6,6,6h12c3.3,0,6-2.7,6-6V6C24,2.7,21.3,0,18,0z' />
            <path d='M18,48H6c-3.3,0-6,2.7-6,6v12c0,3.3,2.7,6,6,6h12c3.3,0,6-2.7,6-6V54C24,50.7,21.3,48,18,48z' />
            <path d='M18,96H6c-3.3,0-6,2.7-6,6v12c0,3.3,2.7,6,6,6h12c3.3,0,6-2.7,6-6v-12C24,98.7,21.3,96,18,96z' />
        </svg>
    )
}
