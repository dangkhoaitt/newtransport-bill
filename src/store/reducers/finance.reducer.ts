import { AjaxResponse } from 'rxjs/ajax'
import { FINANCE_CREATE, FINANCE_DELETE, FINANCE_RESOURCE, FINANCE_UPDATE } from '../actions/finance.action'
import { AppAction, FinanceState } from '../types'

const initialState: FinanceState = {}

export default function FinanceReducer(state = initialState, action: AppAction): FinanceState {
    switch (action.type) {
        case FINANCE_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.data.length }
        case FINANCE_CREATE:
            return storeCreateResources(state, action.payload)
        case FINANCE_UPDATE:
            return storeUpdateResources(state, action.payload)
        case FINANCE_DELETE:
            return storeDeleteResources(state, action.payload)

        default:
            break
    }
    return state
}

function storeCreateResources(state: FinanceState, { response }: AjaxResponse): FinanceState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: FinanceState, { request }: AjaxResponse): FinanceState {
    const financeId = request.url?.split('/').pop()
    if (state.list && financeId) {
        const newList = state.list.concat()
        const index = newList.findIndex((finance) => finance?.id === financeId)
        if (index !== -1) {
            const data = JSON.parse(request.body)
            newList[index] = { ...newList[index], ...data }
            return { ...state, list: newList }
        }
    }
    return state
}

function storeDeleteResources(state: FinanceState, { request }: AjaxResponse): FinanceState {
    const financeId = request.url?.split('/').pop()
    if (state.list && financeId) {
        const newList = state.list.concat()
        const index = newList.findIndex((finance) => finance.id === financeId)
        if (index !== -1) {
            newList.splice(index, 1)
            return { ...state, list: newList }
        }
    }
    return state
}
