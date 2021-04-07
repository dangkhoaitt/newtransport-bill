import { Rule } from '.'
import { Any, Unknown } from '../../../share/interface/Unknown'

export type FieldState = { isTouched?: boolean; isValid?: boolean; isValidated?: boolean; rules?: Array<Rule> }
export type FormAction = { type: string; payload: Any }
export type FormRules = { [name in string]?: Rule[] }
export type FormStore = {
    store: Unknown
    formRules?: FormRules
    errors?: Unknown
    isValidated?: boolean
    dispatch?: React.Dispatch<FormAction>
    onFieldChange?: (name: string, value: unknown) => void
}
export type InputType =
    | 'textbox'
    | 'switch'
    | 'select'
    | 'datepicker'
    | 'checkbox'
    | 'numberbox'
    | 'radio-group'
    | 'label'
    | 'selectTree'
