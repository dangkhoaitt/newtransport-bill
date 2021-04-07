import React from 'react'
import IconProps from './interface'

export default function EyeIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 54.309 54.309'>
            <path d='M53.583,25.903c-5.448-9.413-15.575-15.26-26.429-15.26c-10.854,0-20.981,5.847-26.429,15.26L0,27.154l0.725,1.252 c5.447,9.414,15.574,15.26,26.429,15.26c10.854,0,20.98-5.846,26.429-15.26l0.726-1.252L53.583,25.903z M37.602,22.885 c0,1.155-0.313,2.234-0.852,3.167c-1.098,1.903-3.148,3.188-5.505,3.188c-3.51,0-6.356-2.846-6.356-6.355 c0-2.778,1.785-5.133,4.267-5.998c0.654-0.228,1.355-0.358,2.089-0.358C34.756,16.529,37.602,19.375,37.602,22.885z M19.154,31.902 c0.207-1.277,1.306-2.254,2.642-2.254c1.483,0,2.685,1.202,2.685,2.686c0,1.222-0.821,2.24-1.938,2.566 c-0.239,0.069-0.486,0.118-0.747,0.118c-1.483,0-2.685-1.202-2.685-2.685C19.111,32.186,19.132,32.044,19.154,31.902z M5.827,27.154c2.187-3.318,5.102-6.031,8.452-7.993c-1.198,2.126-1.889,4.574-1.889,7.183c0,3.778,1.446,7.215,3.797,9.821 C12.031,34.18,8.419,31.09,5.827,27.154z M37.844,36.303c2.426-2.621,3.922-6.113,3.922-9.958c0-2.667-0.727-5.163-1.975-7.321 c3.451,1.972,6.452,4.734,8.689,8.13C45.83,31.179,42.116,34.324,37.844,36.303z' />
        </svg>
    )
}