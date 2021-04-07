import React from 'react'
import IconProps from './interface'

export default function MinusIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 384 384'>
            <path d='M192,0C85.961,0,0,85.961,0,192s85.961,192,192,192s192-85.961,192-192S298.039,0,192,0z M192,341.333 c-82.475,0-149.333-66.859-149.333-149.333S109.525,42.667,192,42.667S341.333,109.525,341.333,192S274.475,341.333,192,341.333z' />
            <rect x='106.667' y='170.667' width='170.667' height='42.667' />
        </svg>
    )
}
