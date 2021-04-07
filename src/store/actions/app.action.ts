import { isStringEmpty } from '../../share/utils/empty-util'
import { AppAction } from '../types'

export const RESIZE_EVENT = 'RESIZE_EVENT'
export const COLLAPSE_SIDEBAR = 'COLLAPSE_SIDEBAR'
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const REDIRECT = 'REDIRECT'
export const CLEAR_REDIRECT_PATH = 'CLEAR_REDIRECT_PATH'
export const LOAD_LABEL_PROJECT = 'LOAD_LABEL_PROJECT'
export const GET_USER_LOGIN = 'GET_USER_LOGIN'

export function resizeAction(): AppAction {
    return { type: RESIZE_EVENT }
}

export function collapseSideBarAction(): AppAction {
    return { type: COLLAPSE_SIDEBAR }
}

export function redirectDetailAction(id: string): AppAction {
    const mainPath = location.pathname.split('/')[1]
    const redirectPath = isStringEmpty(mainPath) ? undefined : `${mainPath}/chi-tiet/${id}`
    return { type: REDIRECT, payload: redirectPath }
}

export function redirectToListAction(): AppAction {
    const mainPath = location.pathname.split('/')[1]
    const redirectPath = isStringEmpty(mainPath) ? undefined : mainPath
    return { type: REDIRECT, payload: redirectPath }
}

export function clearRedirectPath(): AppAction {
    return { type: CLEAR_REDIRECT_PATH }
}
