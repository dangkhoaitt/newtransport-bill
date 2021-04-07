import React from 'react'
import IconProps from './interface'

export default function PhoneCallIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 492.456 492.456'>
            <path d='M13.448,208.9c-8.7-23.5-15-47.5-13.1-73c1.2-15.7,7.1-29.1,18.6-40.1c12.5-11.8,24.3-24.2,36.6-36.2 c16-15.8,36.1-15.7,52.1,0c9.9,9.7,19.7,19.6,29.5,29.5c9.5,9.5,19.1,19,28.6,28.6c16.7,16.9,16.8,36.6,0.1,53.4 c-12,12-23.9,24.1-36.1,35.9c-3.2,3.1-3.5,5.7-1.8,9.6c8,19.2,19.6,36.3,32.6,52.3c26.2,32.2,55.8,60.8,91.1,82.9 c7.6,4.7,15.9,8.2,23.8,12.5c4.1,2.2,6.8,1.5,10.1-1.9c11.9-12.3,24.1-24.4,36.3-36.5c16-15.8,36-15.9,52,0 c19.6,19.4,39.1,38.9,58.5,58.5c16.3,16.4,16.2,36.5-0.2,53c-11.1,11.2-22.8,21.8-33.2,33.5c-15.2,17-34.4,22.6-56.2,21.4 c-31.8-1.7-61.1-12.3-89.4-26c-62.8-30.5-116.4-72.8-161.3-126.2C58.848,300.5,31.448,257.5,13.448,208.9z M492.448,244.7 c0-134.9-109.8-244.7-244.7-244.7v46.6c109.2,0,198.1,88.9,198.1,198.1H492.448z M358.448,244.7h46.6 c0-86.7-70.6-157.3-157.3-157.3V134c29.6,0,57.4,11.5,78.3,32.4C346.948,187.3,358.448,215.1,358.448,244.7z' />
        </svg>
    )
}