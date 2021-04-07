import React, { Fragment, ReactNode, Ref, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Unknown, Any } from '../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../share/utils/empty-util'
import { AppState } from '../../../store/types'
import { CheckboxInput, NumberInput, TextInput } from '../../../ui/atoms/inputs'
import { fomatNumber } from '../../../ui/atoms/inputs/NumberInput'
import RadioGroup from '../../../ui/atoms/inputs/RadioGroup'
import Switch from '../../../ui/atoms/switch'
import { DatePicker } from '../../../ui/molecules/date-picker'
import Dropdown, { Source } from '../../../ui/molecules/dropdown'
import DropDownTree from '../../../ui/molecules/dropdown-tree'
import { FormContext, formReducer } from './FormContext'
import './style/index.scss'
import { FormRules, FormStore, InputType } from './type'

export type Rule = {
    required?: boolean
    pattern?: RegExp
    compareField?: string
    message?: string
    customValidate?: (store: Unknown, errors: Unknown, key: string, value?: string, rules?: Rule) => boolean
}

type NFormProps = {
    children: ReactNode
    className?: string
    initialValues?: Unknown
    badRequest?: Unknown
    onFieldChange?: (name: string, value: unknown) => void
    onFinish?: (values: Unknown, errors?: Unknown) => void
    getDataCurrent?: (values: Unknown) => void
}
export type RenderCallbackProps = {
    value: string | boolean | number | Date | Unknown | Unknown[] | undefined
    onChange: (value: unknown) => void
}
export interface FormItem {
    title?: string
    name: string
    type?: InputType
    rules?: Rule[]
    ref?: Ref<Any>
    format?: string
    disabled?: boolean
    selectSource?: Array<Source>
    defaultChecked?: boolean
    toggleSwitchOn?: string
    toggleSwitchOff?: string
    defaultValue?: string | boolean | number | Date | Unknown | Unknown[]
    containerClass?: string
    labelClass?: string
    controlClass?: string
    placeholder?: string
    icon?: ReactNode
    // onChange?:
    render?: (props: RenderCallbackProps) => React.ReactNode
}

const NForm = React.forwardRef(
    (props: NFormProps, ref: Ref<HTMLFormElement>): JSX.Element => {
        const { children, className, initialValues = {}, onFinish = (): boolean => false, onFieldChange } = props
        const { getDataCurrent = (): boolean => false } = props
        const badRequest = useSelector<AppState, Unknown[] | undefined>((state) => state.app.badRequest)
        const formStore = useRef<Unknown>(initialValues).current
        const formRules = useRef<FormRules>({}).current
        const initialForm: FormStore = { store: initialValues, errors: badRequest }
        const [state, dispatch] = useReducer(formReducer, initialForm)
        const submitRef = useRef(false)

        useEffect(() => {
            getDataCurrent({ ...formStore, ...state.store })
            if (isObjectEmpty(state.errors) && state.isValidated && submitRef.current === true) {
                submitRef.current = false
                onFinish({ ...formStore, ...state.store }, state.errors)
            }

            submitRef.current = false
        }, [state])

        useEffect(() => {
            dispatch({ type: 'badRequest', payload: badRequest })
        }, [badRequest])

        const onSubmitHandler = (event: React.FormEvent): boolean => {
            event.preventDefault()
            submitRef.current = true
            if ((!isObjectEmpty(formRules) && !state.isValidated) || !isObjectEmpty(state.errors || {})) {
                // trigger validate
                dispatch({ type: 'validate', payload: { formRules, formStore, formErrors: state.errors } })
            } else {
                submitRef.current = false
                onFinish({ ...formStore, ...state.store }, state.errors)
            }
            return false
        }

        return (
            <FormContext.Provider
                value={{ store: formStore, formRules, errors: state.errors, dispatch, onFieldChange }}>
                <form ref={ref} className={className} onSubmit={onSubmitHandler}>
                    {children}
                </form>
            </FormContext.Provider>
        )
    }
)

type NFormItemProps = { item: FormItem }
export function NFormItem({ item }: NFormItemProps): JSX.Element {
    const { name, containerClass, controlClass, labelClass, rules, title, defaultValue, icon } = item
    const {
        store = {},
        formRules = {},
        errors = {},
        dispatch = (): boolean => true,
        onFieldChange = (): boolean => false
    } = useContext(FormContext)
    const reduxDispatch = useDispatch()

    useEffect(() => {
        const nestedField = name.split('.')

        if (nestedField.length === 1 || nestedField.length > 2) {
            store[name] = store[name] ?? defaultValue
        } else if (nestedField.length === 2) {
            if (Object.keys(store).includes(nestedField[0])) {
                store[nestedField[0]][nestedField[1]] = defaultValue
            } else {
                store[nestedField[0]] = { [nestedField[1]]: defaultValue }
            }
        }
        if (nestedField.length > 2) {
            //console.error('Unsuppored nested more than 2 levels')
        }
        if (rules) formRules[name] = rules
    }, [])

    function onChangeHandler(value: unknown): void {
        reduxDispatch({ type: 'BAD_REQUEST' })
        dispatch({ type: name, payload: { value, rules } })
        onFieldChange(name, value)
    }

    return useMemo(
        () => (
            <div className={`input-validate ${containerClass}`}>
                <label className={labelClass}>
                    {icon}
                    {title?.split('|')[0].trim()}
                </label>
                <div className={controlClass}>
                    {item.render
                        ? item.render({ value: store[name] ?? defaultValue, onChange: onChangeHandler })
                        : renderItemByType({ ...item, defaultValue: store[name] ?? defaultValue }, onChangeHandler)}
                    {errors && errors[name] && <span className='error'>{errors[name]}</span>}
                </div>
            </div>
        ),
        [store[name], errors[name], defaultValue]
    )
}

type FormItemGroupProps = { container: React.ComponentType<{ children: ReactNode }>; items: FormItem[] }
export function FormItemGroup({ container: Container, items }: FormItemGroupProps): JSX.Element {
    return <Container>{<Content items={items} />}</Container>
}

const Content = ({ items }: { items: FormItem[] }): JSX.Element => (
    <Fragment>
        {items.map((item) => (
            <NFormItem key={item.name} item={item} />
        ))}
    </Fragment>
)

function renderItemByType(item: FormItem, onChange: (value: unknown) => void): ReactNode {
    const { defaultChecked, defaultValue, placeholder, toggleSwitchOn, toggleSwitchOff } = item
    const { selectSource, ref, title, name, disabled } = item
    const props = {
        ref,
        defaultValue: defaultValue as string,
        placeholder,
        title,
        name,
        defaultChecked,
        disabled
    }
    const swichProps = { onClick: onChange, value: !!defaultValue, toggleSwitchOn, toggleSwitchOff }
    switch (item.type) {
        case 'checkbox':
            return (
                <CheckboxInput onChange={(e): void => onChange((e?.target as HTMLInputElement).checked)} {...props} />
            )
        case 'datepicker':
            return <DatePicker format={item.format} value={defaultValue as Date} onChange={onChange} {...item} />
        case 'select':
            return <Dropdown onSelect={onChange} dataSource={selectSource || []} {...props} />
        case 'selectTree':
            return <DropDownTree onSelect={onChange} dataSource={selectSource || []} {...props} />
        case 'switch':
            return <Switch {...swichProps} />
        case 'textbox':
            return <TextInput onBlur={(e): void => onChange(e?.target.value)} {...props} />
        case 'radio-group':
            return <RadioGroup onChange={(e): void => onChange(e?.target.value)} {...props} />
        case 'numberbox':
            return (
                <NumberInput
                    fomat={fomatNumber}
                    onBlur={(e): void => onChange(Number(e?.target.value.replace(/[^0-9]/g, '')) || 0)}
                    {...props}
                />
            )
        case 'label':
            return <span {...props}>{defaultValue}</span>

        default:
            return <Fragment />
    }
}

export default NForm
