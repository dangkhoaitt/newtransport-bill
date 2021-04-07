import React from 'react'
import IconProps from './interface'

export default function PercentIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 263.285 263.285'>
            <path d='M193.882,8.561c-7.383-3.756-16.414-0.813-20.169,6.573L62.153,234.556c-3.755,7.385-0.812,16.414,6.573,20.169 c2.178,1.107,4.499,1.632,6.786,1.632c5.466,0,10.735-2.998,13.383-8.205L200.455,28.73 C204.21,21.345,201.267,12.316,193.882,8.561z' />
            <path d='M113.778,80.818c0-31.369-25.521-56.89-56.89-56.89C25.521,23.928,0,49.449,0,80.818c0,31.368,25.521,56.889,56.889,56.889 C88.258,137.707,113.778,112.186,113.778,80.818z M56.889,107.707C42.063,107.707,30,95.644,30,80.818 c0-14.827,12.063-26.89,26.889-26.89c14.827,0,26.89,12.062,26.89,26.89C83.778,95.644,71.716,107.707,56.889,107.707z' />
            <path d='M206.396,125.58c-31.369,0-56.89,25.521-56.89,56.889c0,31.368,25.52,56.889,56.89,56.889 c31.368,0,56.889-25.52,56.889-56.889C263.285,151.1,237.765,125.58,206.396,125.58z M206.396,209.357 c-14.827,0-26.89-12.063-26.89-26.889c0-14.826,12.063-26.889,26.89-26.889c14.826,0,26.889,12.063,26.889,26.889 C233.285,197.294,221.223,209.357,206.396,209.357z' />
        </svg>
    )
}
