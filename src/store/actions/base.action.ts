import { AjaxError } from 'rxjs/ajax'
import { statusCodeError } from '../../share/common/app-constants'
import { contentNotification } from '../../share/hooks'
import { Unknown } from '../../share/interface/Unknown'
import { clearAllCookies } from '../../share/utils/cookie-util'
import { AppAction, BAD_REQUEST, CANCEL_REQUEST } from '../types'
import { SHOW_NOTIFICATION } from './app.action'
import { CHECK_LOGIN } from './auth.action'

const UNAUTHORIZED_CODES = [401, 403]
const METHODS = ['POST', 'PATCH']

export interface BaseActionParams {
    elemRef?: React.RefObject<HTMLElement>
    body?: Unknown
}

interface BadRequestMessage {
    field: string
    message: string
}

export function cancelRequest(): AppAction {
    return { type: CANCEL_REQUEST }
}

export function catchErrorRequest(error: AjaxError, elemRef?: React.RefObject<HTMLElement>): AppAction {
    elemRef?.current?.removeAttribute('disabled')
    let message = ''
    if (error.name === 'AjaxTimeoutError') {
        message = 'Hết thời gian yêu cầu!'
        return { type: SHOW_NOTIFICATION, payload: contentNotification(message) }
    } else if (error.status === 400) {
        const messages: string | BadRequestMessage[] = error.response ? error.response.message : error.message
        if (METHODS.includes(error.request.method ?? '') && Array.isArray(messages)) {
            return { type: BAD_REQUEST, payload: messages }
        } else {
            message = messages as string
            return { type: SHOW_NOTIFICATION, payload: contentNotification(message) }
        }
    } else if (UNAUTHORIZED_CODES.includes(error.status) && !window.location.pathname.includes('login')) {
        clearAllCookies()
        return { type: CHECK_LOGIN }
    } else return { type: SHOW_NOTIFICATION, payload: contentNotification(statusCodeError[error.status]) }
}
