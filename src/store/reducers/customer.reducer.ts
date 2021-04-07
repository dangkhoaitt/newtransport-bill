import { AjaxResponse } from 'rxjs/ajax'
import { Customer } from '../../share/interface/Customer'
import {
    CREATE_CUSTOMER_ACTION,
    DELETE_CUSTOMER_ACTION,
    FETCH_CUSTOMER_RESOURCES,
    FETCH_PROVINCE_DROPDOWN,
    SAVE_CUSTOMER_QUERY_SEARCH,
    UPDATE_CUSTOMER_ACTION
} from '../actions/customer.action'
import { AppAction, CustomerState } from '../types'

const initialState: CustomerState = {}

export default function customerReducer(state = initialState, action: AppAction): CustomerState {
    switch (action.type) {
        case FETCH_CUSTOMER_RESOURCES:
            return { ...state, list: action.payload.data, querySearch: window.location.search }
        case FETCH_PROVINCE_DROPDOWN:
            return { ...state, provinceList: action.payload.data }
        case DELETE_CUSTOMER_ACTION:
            return saveDelete(state, action.payload)
        case CREATE_CUSTOMER_ACTION:
            return saveNewCustomer(state, action.payload)
        case UPDATE_CUSTOMER_ACTION:
            return saveUpdate(state, action.payload)
        case SAVE_CUSTOMER_QUERY_SEARCH:
            return { ...state, querySearch: window.location.search }
        default:
            break
    }
    return state
}

function saveNewCustomer(state: CustomerState, payload: AjaxResponse): CustomerState {
    const list = state.list
    list?.unshift(payload.response.data)
    return { ...state, list }
}

function saveDelete(state: CustomerState, payload: AjaxResponse): CustomerState {
    const id = payload.request.url?.split('/').pop()
    const list = state.list?.filter((i) => i.id !== id)
    return { ...state, list }
}

function saveUpdate(state: CustomerState, payload: Customer): CustomerState {
    const id = payload.id
    const list = state.list?.map((i) => {
        if (i.id === id) return payload
        else return i
    })
    return { ...state, list }
}
