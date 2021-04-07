import React from 'react'
import IconProps from './interface'

export default function ShopBoldIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 489.4 489.4'>
            <path d='M511.52,172.128L482.56,56.224C479.008,41.984,466.208,32,451.52,32H60.512c-14.688,0-27.488,9.984-31.072,24.224 L0.48,172.128C0.16,173.376,0,174.688,0,176c0,44.096,34.08,80,76,80c24.352,0,46.08-12.128,60-30.944 C149.92,243.872,171.648,256,196,256s46.08-12.128,60-30.944C269.92,243.872,291.616,256,316,256c24.384,0,46.08-12.128,60-30.944 C389.92,243.872,411.616,256,436,256c41.92,0,76-35.904,76-80C512,174.688,511.84,173.376,511.52,172.128z' />
            <path d='M436,288c-21.792,0-42.496-6.656-60-18.816c-35.008,24.352-84.992,24.352-120,0c-35.008,24.352-84.992,24.352-120,0 C118.496,281.344,97.792,288,76,288c-15.712,0-30.528-3.68-44-9.952V448c0,17.664,14.336,32,32,32h128V352h128v128h128 c17.664,0,32-14.336,32-32V278.048C466.528,284.32,451.712,288,436,288z' />
        </svg>
    )
}