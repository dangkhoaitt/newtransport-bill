import Pages, { PaginationProps } from 'rc-pagination'
import React, { Fragment } from 'react'
import { isNullOrUndefined } from '../../../share/utils/empty-util'
import { NextIcon, PrevioustIcon } from '../../atoms/icons'
import './style/index.scss'

export default function Pagination(props: PaginationProps): JSX.Element {
    if (isNullOrUndefined(props.total)) return <Fragment />
    return (
        <div id='pagination-custom'>
            <Pages
                {...props}
                prevIcon={<PrevioustIcon />}
                nextIcon={<NextIcon />}
                jumpPrevIcon={<a>...</a>}
                jumpNextIcon={<a>...</a>}
                showTitle={false}
            />
        </div>
    )
}
