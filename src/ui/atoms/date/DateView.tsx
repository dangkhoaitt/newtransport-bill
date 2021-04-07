import React, { Fragment } from 'react'
import { DATE_FORMAT, DATE_TIME_AM_FORMAT, DATE_TIME_FORMAT } from '../../../share/common/app-constants'
import { formatDateFormTime } from '../../../share/utils/date-util'

interface DateViewProps {
    time?: string | number
    className?: string
    format?: typeof DATE_FORMAT | typeof DATE_TIME_FORMAT | typeof DATE_TIME_AM_FORMAT
}

export default function DateView({ time, className, format }: DateViewProps): JSX.Element {
    return (
        <Fragment>
            {time && <span className={className}>{formatDateFormTime(time, format || DATE_FORMAT)}</span>}
        </Fragment>
    )
}
