import { History } from 'history'
import { DATE_FORMAT } from '../common/app-constants'
import { Unknown } from '../interface/Unknown'
import { defaulValueFormat } from './date-util'
import { isStringEmpty } from './empty-util'

export function isMobile(): boolean {
    return window.innerWidth < 1025
}

export function initialValuesFromQueryString(): Unknown {
    const initial = {}
    const queryParams = new URLSearchParams(window.location.search)
    queryParams.forEach((value, key) => {
        if (key.toLowerCase().includes('date')) {
            initial[key] = defaulValueFormat(value, DATE_FORMAT)
        } else {
            initial[key] = precheckValue(value)
        }
    })
    return initial
}

export function buildQuerySearchFromObject(search: Unknown): string {
    const searchParams: URLSearchParams = new URLSearchParams('')
    Object.keys(search).map((key) => {
        if (search[key]) searchParams.set(key, search[key])
    })
    return searchParams.toString()
}

export function updateURLSearch(history: History, path: string, queryParams: string): void {
    const search = isStringEmpty(queryParams)
        ? queryParams
        : `?${buildQuerySearch(history.location.search, queryParams)}`
    history.replace({
        pathname: path,
        search: search.replace(`page=${new URLSearchParams(window.location.search).get('page')}`, 'page=1')
    })
}

function buildQuerySearch(currentQuery: string, newQuery: string): string {
    const currentQueryParams = {}
    const newQueryParams = {}
    const newKey = newQuery.split('=')[0]

    new URLSearchParams(currentQuery).forEach((value, key) => {
        currentQueryParams[key] = value
    })

    new URLSearchParams(newQuery).forEach((value, key) => {
        if (value) newQueryParams[key] = value
    })

    if (!newQueryParams[newKey]) {
        delete currentQueryParams[newKey]
    }

    return new URLSearchParams(Object.assign({}, currentQueryParams, newQueryParams)).toString()
}

const booleanValues = ['true', 'false', '1', '0']
function precheckValue(value: string): boolean | string {
    const decoded = decodeURIComponent(value)
    if (booleanValues.includes(decoded)) {
        return value === ('true' || '1')
    }
    return decoded
}
