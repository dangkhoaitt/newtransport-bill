import React, { forwardRef, LabelHTMLAttributes, ReactNode } from 'react'
import './style/index.scss'

type TagProps = { tagType: 'default' | 'primary'; text: string | ReactNode } & LabelHTMLAttributes<HTMLLabelElement>

const Tag = forwardRef<HTMLLabelElement, TagProps>((props, ref) => {
    const tagProps: Omit<TagProps, 'text' | 'tagType'> = { ...props }
    tagProps.className = `tag tag-${props.tagType}`
    return (
        <label {...tagProps} ref={ref}>
            {props.text}
        </label>
    )
})

export default Tag
