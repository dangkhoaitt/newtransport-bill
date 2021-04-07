import { createContext } from 'react'
import { Rule } from '.'
import { Unknown } from '../../../share/interface/Unknown'
import { isObjectEmpty } from '../../../share/utils/empty-util'
import { FormAction, FormRules, FormStore } from './type'
import { validateCompareField, validatePattern, validateRequired } from './validator'

export const FormContext = createContext<FormStore>({ store: {}, dispatch: () => null })

export const formReducer = (state: FormStore, action: FormAction): FormStore => {
    switch (action.type) {
        case 'validate':
            return validateItem(state, action.payload)
        case 'badRequest':
            return handleBadRequest(state, action.payload)
        default:
            return valueChange(state, action.type, action.payload)
    }
}

function handleBadRequest(state: FormStore, payload?: Array<{ field: string; message: string }>): FormStore {
    if (payload?.length === 0) {
        return { ...state, errors: undefined }
    }
    if (state.errors !== payload) {
        const errors = {}
        if (payload) {
            for (const err of payload) {
                errors[err.field] = err.message
            }
        }
        return { ...state, errors }
    }
    return state
}

function valueChange(state: FormStore, key: string, payload: { value: string; rules: Array<Rule> }): FormStore {
    const { value, rules } = payload
    const { store } = state
    const nestedField = key.split('.')
    if (nestedField.length === 1 || nestedField.length > 2) {
        store[key] = value
    } else if (nestedField.length === 2) {
        if (Object.keys(store).includes(nestedField[0])) {
            store[nestedField[0]][nestedField[1]] = value
        } else {
            store[nestedField[0]] = { [nestedField[1]]: value }
        }
    }

    if (rules) {
        const errors = { ...state.errors }
        validateByRules(key, value, store, errors, rules)
        return { ...state, store, errors }
    }

    return { ...state, store }
}

function validateItem(
    state: FormStore,
    payload: { formRules: FormRules; formStore: FormStore; formErrors: Unknown }
): FormStore {
    const { formRules, formErrors = {} } = payload
    const { store } = state
    if (isObjectEmpty(formRules)) return state
    const errors = {}
    Object.keys(formRules).map((key) => {
        const rules = formRules[key] || []
        let value = ''
        const nestedField = key.split('.')

        if (nestedField.length === 1 || nestedField.length > 2) {
            value = store[key]
        } else if (nestedField.length === 2) {
            if (Object.keys(store).includes(nestedField[0])) {
                value = store[nestedField[0]][nestedField[1]]
            } else {
                value = store[nestedField[0]][nestedField[1]]
            }
        }

        validateByRules(key, value, store, errors, rules)
    })
    // return { ...state, errors, isValidated: true }
    return { ...state, errors: Object.assign(formErrors, errors), isValidated: true }
}

function validateByRules(key: string, value: string, store: Unknown, errors: Unknown = {}, rules: Rule[]): void {
    for (let index = 0; index < rules.length; index++) {
        const rule = rules[index]
        if (rule.required && validateRequired(key, value, errors, rule.message)) break
        if (rule.pattern && validatePattern(key, value, errors, rule)) break
        if (rule.compareField && validateCompareField(key, value, store[rule.compareField], errors, rule)) break
        if (rule.customValidate && rule.customValidate(store, errors, key, value, rule)) break
    }
}
