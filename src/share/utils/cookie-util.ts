import Cookies from 'js-cookie'
import { Unknown } from '../interface/Unknown'
import { convertTimeToDate } from './date-util'
import { isObjectEmpty } from './empty-util'

export const EXPIRES_IN = 'expiresIn'
export const ACCESS_TOKEN = 'accessToken'
export const USERNAME = 'currentItem'

export function clearAllCookies(): void {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookies.remove(cookieName)
    })
    window.location.href = '/login?redirectUrl=' + window.location.pathname + window.location.search
}

export function setCookies(options: Unknown = {}, expiresIn?: number): void {
    if (isObjectEmpty(options)) return
    addOrRemoveCookie(options, true, expiresIn)
}

export function removeCookies(options: Unknown = {}): void {
    if (isObjectEmpty(options)) return
    addOrRemoveCookie(options)
}

export function getCookies(key: string): string | undefined {
    return Cookies.get(key)
}

function addOrRemoveCookie(options: Unknown = {}, isAdd?: boolean, expiresIn?: number): void {
    Object.keys(options).forEach(function (key) {
        if (isAdd && options[key]) {
            Cookies.set(key, `${options[key]}`, { expires: convertTimeToDate(expiresIn) })
        } else {
            Cookies.remove(key)
        }
    })
}
