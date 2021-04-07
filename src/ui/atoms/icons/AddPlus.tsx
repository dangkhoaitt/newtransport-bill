import React from 'react'
import IconProps from './interface'

export default function AddPlusIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 357 357'>
            <path d='M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z' />
        </svg>
    )
}
