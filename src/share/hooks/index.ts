import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { forkJoin, Observable, Subscription } from 'rxjs'
import { AjaxResponse } from 'rxjs/ajax'
import { AjaxError, AjaxObservable } from 'rxjs/internal/observable/dom/AjaxObservable'
import { Helpers } from '../../helpers'
import { REDIRECT, SHOW_NOTIFICATION } from '../../store/actions/app.action'
import { CHECK_LOGIN } from '../../store/actions/auth.action'
import { AppAction, BAD_REQUEST } from '../../store/types'
import { useModal } from '../../ui/molecules/modal'
import { message, notificationTitle, statusCodeError } from '../common/app-constants'
import { Unknown } from '../interface/Unknown'
import { ACCESS_TOKEN, clearAllCookies, getCookies } from '../utils/cookie-util'
import { isStringEmpty } from '../utils/empty-util'

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

const UNAUTHORIZED_CODES = [401, 403]
const METHODS = [HttpMethod.POST, HttpMethod.PATCH]

interface CommonOptions {
    actionType?: string
    params?: string | Unknown
}
interface UseRequestOptions extends CommonOptions {
    url?: string
    ignore?: boolean
    callback?: (response: Unknown) => void
}
interface SearchRequestOptions extends CommonOptions {
    url?: string
    callback?: (response: AjaxResponse) => void
}
interface SubmitRequestOptions extends CommonOptions {
    isConfirm?: boolean
    textConfirm?: string
    url?: string
    method?: HttpMethod
    callback?: (response: AjaxResponse) => void
}
interface UseMultiRequestOptions extends CommonOptions {
    urls?: string[]
    method?: HttpMethod
    ignore?: boolean
    callback?: (responses: AjaxResponse[]) => void
}

export function createRequest(url: string, method: HttpMethod, params?: string | Unknown): Observable<AjaxResponse> {
    return AjaxObservable.create({
        url,
        headers: { Authorization: `Bearer ${getCookies(ACCESS_TOKEN)}`, 'Content-Type': 'application/json' },
        timeout: 10000,
        method,
        body: params
    })
}

export function useGetRequest(options: UseRequestOptions): void {
    const { url = '', callback, params, ignore, actionType } = options
    const dispatch = useDispatch()

    useEffect(() => {
        if (ignore) return
        const request = createRequest(url, HttpMethod.GET, params)
        const subscription = request.subscribe(
            ({ response, status }) => {
                if (status === 204) {
                    dispatch(notificationHandler(HttpMethod.GET))
                    dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                } else if (callback) callback(response)
                else dispatch({ type: actionType, payload: response })
            },
            (err) => {
                if (err.status === 400) {
                    dispatch(notificationHandler(HttpMethod.GET))
                    dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                } else dispatch(catchErrorRequest(err))
            }
        )
        return (): void => {
            subscription?.unsubscribe()
        }
    }, [options])
}

export function useSearchRequest(): (options: SearchRequestOptions) => void {
    const dispatch = useDispatch()
    const queue = useRef<Array<Subscription>>([]).current

    if (queue.length > 1) queue.shift()?.unsubscribe()

    useEffect(() => {
        return (): void => {
            if (queue.length > 0) queue.shift()?.unsubscribe()
        }
    }, [])

    function searchRequest(options: SearchRequestOptions): void {
        const { url = '', callback, params, actionType } = options
        const subscription = createRequest(url, HttpMethod.GET, params).subscribe(
            (ajaxResponse) => {
                if (callback) callback(ajaxResponse)
                else dispatch({ type: actionType, payload: ajaxResponse })
            },
            (err) => {
                dispatch(catchErrorRequest(err))
            }
        )
        queue.push(subscription)
    }
    return (searchRequestOptions: SearchRequestOptions): void => {
        searchRequest(searchRequestOptions)
    }
}

export function useSubmitRequest(): (options: SubmitRequestOptions) => Promise<void> {
    const dispatch = useDispatch()
    const { closeAllModal, confirm } = useModal()

    function submitRequest(options: Omit<SubmitRequestOptions, 'isConfirm'>): void {
        const progressIndicator = Helpers.getInstance().getProgressElement()
        progressIndicator.classList.toggle('overlay')
        const { url = '', method = HttpMethod.POST, callback, params, actionType } = options

        createRequest(url, method, params).subscribe(
            (ajaxResponse) => {
                progressIndicator.classList.toggle('overlay')
                const { request, response, status } = ajaxResponse

                if (request?.method === HttpMethod.GET && status === 204) {
                    dispatch(notificationHandler(HttpMethod.GET))
                    dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                } else if (callback) callback(ajaxResponse)
                else {
                    if (request.method === HttpMethod.POST) {
                        dispatch(notificationHandler(request.method))
                        status === 201 && dispatch(redirectDetailAction(response.data.id))
                    } else if (request.method === HttpMethod.PATCH || request.method === HttpMethod.DELETE) {
                        dispatch(notificationHandler(request.method))
                        // redirect to list page
                        dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                    }
                    dispatch({ type: actionType, payload: ajaxResponse })
                    closeAllModal()
                }
            },
            (err) => {
                progressIndicator.classList.toggle('overlay')
                if (err.status === 400 && method === HttpMethod.GET) {
                    dispatch(notificationHandler(HttpMethod.GET))
                    dispatch({ type: REDIRECT, payload: location.pathname.split('/')[1] })
                } else dispatch(catchErrorRequest(err))
            }
        )
    }

    return ({ isConfirm = true, textConfirm, ...sumbitRequestOptions }: SubmitRequestOptions): Promise<void> => {
        return new Promise((resolve) => {
            isConfirm
                ? confirm({
                      title: 'Xác nhận',
                      content: textConfirm || 'Bạn có chắc chắn?',
                      onConfirm: (): void => {
                          submitRequest(sumbitRequestOptions)
                          resolve()
                      }
                  })
                : submitRequest(sumbitRequestOptions)
        })
    }
}

export function useMultiGetRequest(options: UseMultiRequestOptions): void {
    const { urls = [], callback, params, ignore, actionType } = options
    const dispatch = useDispatch()

    useEffect(() => {
        if (ignore) return
        const subscription = forkJoin(urls.map((url) => createRequest(url, HttpMethod.GET, params))).subscribe(
            (responses) => {
                if (callback) callback(responses)
                else dispatch({ type: actionType, payload: responses })
            },
            (err) => dispatch(catchErrorRequest(err))
        )
        return (): void => {
            subscription?.unsubscribe()
        }
    }, [options])
}

interface BadRequestMessage {
    field: string
    message: string
}
function catchErrorRequest(error: AjaxError): AppAction {
    let message = ''
    if (error.name === 'AjaxTimeoutError') {
        message = 'Hết thời gian yêu cầu!'
        return { type: SHOW_NOTIFICATION, payload: contentNotification(message) }
    } else if (error.status === 400) {
        const method = HttpMethod[error.request.method || 0]
        const messages: string | BadRequestMessage[] = error.response ? error.response.message : error.message
        if (METHODS.includes(method) && Array.isArray(messages)) {
            return { type: BAD_REQUEST, payload: messages }
        } else {
            return { type: SHOW_NOTIFICATION, payload: contentNotification(messages as string) }
        }
    } else if (UNAUTHORIZED_CODES.includes(error.status) && !location.pathname.includes('login')) {
        clearAllCookies()
        return { type: CHECK_LOGIN }
    } else return { type: SHOW_NOTIFICATION, payload: contentNotification(statusCodeError[error.status]) }
}

function notificationHandler(method: string): AppAction {
    return { type: SHOW_NOTIFICATION, payload: contentNotification(method, true) }
}

function redirectDetailAction(id: string): AppAction {
    const mainPath = location.pathname.split('/')[1]
    const redirectPath = isStringEmpty(mainPath) ? undefined : `${mainPath}/chi-tiet/${id}`
    return { type: REDIRECT, payload: redirectPath }
}

interface NotificationOptions {
    title: string
    status: 'error' | 'info' | 'success' | 'warning'
}
export function contentNotification(method: string, isSuccess?: boolean): NotificationOptions {
    const notification: NotificationOptions = {
        status: isSuccess ? 'success' : 'error',
        title: isSuccess
            ? message[`${method}`].replace('title', notificationTitle[`${location.pathname.split('/')[1]}`] ?? '')
            : method
    }
    return notification
}
