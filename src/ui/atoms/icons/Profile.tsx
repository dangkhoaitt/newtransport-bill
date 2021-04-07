import React from 'react'
import IconProps from './interface'

export default function ProfileIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 508 508'>
            <circle cx='444.5' cy='254' r='63.5' />
            <circle cx='444.5' cy='444.5' r='63.5' />
            <path d='m301.625 169.333h-264.583c-20.32 0-37.042 16.722-37.042 37.042v264.583c0 20.32 16.722 37.042 37.042 37.042h264.583c20.32 0 37.042-16.722 37.042-37.042v-264.583c0-20.32-16.722-37.042-37.042-37.042zm-132.292 84.667c17.568 0 31.75 14.182 31.75 31.75s-14.182 31.75-31.75 31.75-31.75-14.182-31.75-31.75 14.182-31.75 31.75-31.75zm63.5 132.292c0 8.678-7.197 15.875-15.875 15.875h-95.25c-8.678 0-15.875-7.197-15.875-15.875v-7.832c0-22.013 19.897-39.793 44.45-39.793h38.1c24.553 0 44.45 17.78 44.45 39.793z' />
            <path d='m480.907 77.47c3.81-7.197 5.927-15.663 5.927-24.553-.001-29.21-23.707-52.917-52.917-52.917s-52.917 23.707-52.917 52.917 23.707 52.917 52.917 52.917c8.89 0 17.357-2.117 24.553-5.927l22.437 22.437c3.09 3.112 7.154 4.657 11.218 4.657s8.128-1.545 11.218-4.657c6.202-6.202 6.202-16.256 0-22.458zm-68.157-24.553c0-11.642 9.525-21.167 21.167-21.167s21.167 9.525 21.167 21.167-9.525 21.167-21.167 21.167c-11.642-.001-21.167-9.526-21.167-21.167z' />
            <path d='m37.042 127h264.583c20.426 0 37.042-16.616 37.042-37.042v-52.916c0-20.426-16.616-37.042-37.042-37.042h-264.583c-20.426 0-37.042 16.616-37.042 37.042v52.917c0 20.425 16.616 37.041 37.042 37.041z' />
        </svg>
    )
}