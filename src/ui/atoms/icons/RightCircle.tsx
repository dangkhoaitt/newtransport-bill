import React from 'react'
import IconProps from './interface'

export default function RightCircleIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 16 16'>
            <path d='M6.6 13l5-5-5-5-1.4 1.4 3.6 3.6-3.6 3.6z'></path>
            <path d='M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z'></path>
        </svg>
    )
}
