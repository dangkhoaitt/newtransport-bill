import React from 'react'
import IconProps from './interface'

export default function PlusCircleIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 512 512'>
            <path d='M255-1C113.618-1-1,113.618-1,255s114.618,256,256,256s256-114.618,256-256S396.382-1,255-1z M255,468.333 c-117.818,0-213.333-95.515-213.333-213.333S137.182,41.667,255,41.667S468.333,137.182,468.333,255S372.818,468.333,255,468.333 z' />
            <path d='M382.996,233.667H276.333V127c0-11.782-9.551-21.333-21.333-21.333s-21.333,9.551-21.333,21.333v106.667H127.038 c-11.782,0-21.333,9.551-21.333,21.333s9.551,21.333,21.333,21.333h106.628V383c0,11.782,9.551,21.333,21.333,21.333 s21.333-9.551,21.333-21.333V276.333h106.662c11.782,0,21.333-9.551,21.333-21.333S394.778,233.667,382.996,233.667z' />
        </svg>
    )
}
