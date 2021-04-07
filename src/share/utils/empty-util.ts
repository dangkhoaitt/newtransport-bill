import { Any } from '../interface/Unknown'

export function isNullOrUndefined(value?: Any): boolean {
    return value === undefined || value === null
}

export function isObjectEmpty(obj: Any = {}): boolean {
    return typeof obj === 'object' && (isNullOrUndefined(obj) || Object.keys(obj).length === 0)
}

export function isArrayEmpty(arr?: Any): boolean {
    return isNullOrUndefined(arr) || (Array.isArray(arr) && arr.length === 0)
}

export function isStringEmpty(str: Any): boolean {
    return typeof str === 'string' && (isNullOrUndefined(str) || str.trim().length === 0)
}

export function isNumberEmpty(value: Any): boolean {
    return typeof value === 'number' && (isNullOrUndefined(value) || Number.isNaN(value))
}
