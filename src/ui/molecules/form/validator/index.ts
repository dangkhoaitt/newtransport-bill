import { Rule } from '..'
import { Unknown } from '../../../../share/interface/Unknown'
import { isStringEmpty, isObjectEmpty, isArrayEmpty } from '../../../../share/utils/empty-util'

export function validateRequired(
    key: string,
    value: string | Unknown | Unknown[],
    errors: Unknown,
    message?: string
): boolean {
    const valueType = typeof value
    if (
        isStringEmpty(value) ||
        isObjectEmpty(value) ||
        (Array.isArray(value) && isArrayEmpty(value)) ||
        valueType === 'undefined'
    ) {
        errors[key] = message
        return true
    } else {
        delete errors[key]
        return false
    }
}

export function validatePattern(key: string, value: string, errors: Unknown, rule: Rule): boolean {
    if (isStringEmpty(value) || rule.pattern?.test(value)) {
        delete errors[key]
        return false
    } else {
        errors[key] = rule.message
        return true
    }
}

export function validateCompareField(
    key: string,
    value: string,
    compareValue: string,
    errors: Unknown,
    rule: Rule
): boolean {
    if (value === compareValue) {
        delete errors[key]
        return false
    } else {
        errors[key] = rule.message
        return true
    }
}
