import { DatePickerInput } from 'rc-datepicker'
import 'rc-datepicker/styles'
import React, { Ref, useRef } from 'react'
import { DATE_FORMAT } from '../../../share/common/app-constants'
import { Input } from '../../../share/interface/ComponentsProperties'
import './style/index.scss'

interface DatePickerProps extends Input {
    onChange: (...event: [string | undefined | boolean | number | Date | null]) => void
    value?: Date | string
    format?: string
    maxDate?: string | Date | moment.Moment
    minDate?: string | Date | moment.Moment
}

export const DatePicker = React.forwardRef(
    (props: DatePickerProps, ref: Ref<DatePickerInput>): JSX.Element => {
        const refDate = useRef<HTMLDivElement>(null)
        const { value, className, placeholder, format, onChange, maxDate, minDate } = props

        function onChangeHandler(jsDate: Date, dateString: string): void {
            if (refDate.current) {
                const input = refDate.current.getElementsByTagName('input')[0]
                input.onkeyup = (): void => {
                    const currentYear = new Date().getFullYear()
                    const values = input.value.split('/')
                    if (values[0]) values[0] = checkValueDate(values[0], 31)
                    if (values[1]) values[1] = checkValueDate(values[1], 12)
                    if (values[2]) values[2] = checkValueDate(values[2], currentYear)
                    const output = values.map(function (v, i) {
                        return v.length == 2 && i < 2 ? v + '/' : v
                    })

                    input.value = output.join('').substr(0, 10)
                    values[2]?.length == 4 && onChange(input.value)
                }
                input.onblur = (): void => {
                    if (jsDate.toString() === 'Invalid date') input.value = ''
                }
            }
            if (jsDate.toString() !== 'Invalid date') onChange(dateString)
            else onChange(null)
        }

        const inputProps = {
            defaultValue: value,
            className,
            ref,
            placeholder,
            displayFormat: format || DATE_FORMAT,
            returnFormat: format || DATE_FORMAT,
            minDate,
            maxDate
        }
        return (
            <div ref={refDate}>
                <DatePickerInput {...inputProps} onChange={onChangeHandler} />
            </div>
        )
    }
)

function checkValueDate(str: string, max: number): string {
    if (str.charAt(0) !== '0' || str == '00') {
        let num = parseInt(str)
        if (isNaN(num) || num <= 0 || num > max) num = 1
        if (num > parseInt(max.toString().charAt(0)) && num.toString().length == 1) {
            str = '0' + num
        } else {
            str = num.toString()
        }
    }
    return str
}
