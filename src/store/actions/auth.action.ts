import { AjaxResponse } from 'rxjs/ajax'
import { Unknown } from '../../share/interface/Unknown'
import { AppAction } from '../types'
import { BaseActionParams } from './base.action'

export const DO_LOGIN = 'DO_LOGIN'
export const FINISH_LOGIN = 'FINISH_LOGIN'

export const SAVE_PASSWORD = 'SAVE_PASSWORD'

export const CHECK_LOGIN = 'CHECK_LOGIN'
export const FINISH_CHECK_LOGIN = 'FINISH_CHECK_LOGIN'

export function doLoginAction(params: BaseActionParams = {}): AppAction {
    return { type: DO_LOGIN, payload: params.body, elemRef: params.elemRef }
}

export function finishLoginAction(value: AjaxResponse): AppAction {
    return { type: FINISH_LOGIN, payload: value.response.data }
}

export function checkLoggedIn(): AppAction {
    return { type: CHECK_LOGIN }
}

export function finishCheckLoggedIn(params: Unknown): AppAction {
    let payload: Unknown
    if (params['response']) {
        payload = params.response.data
    } else {
        payload = params
    }
    return { type: FINISH_CHECK_LOGIN, payload }
}
