import { AjaxResponse } from 'rxjs/ajax'
import { User } from '../../share/interface/User'
import {
    CLEAR_USER_RESOURCES,
    DELETE_USER_ACTION,
    DO_SEARCH_USER,
    FETCH_UNIT_USER,
    FETCH_USER_RESOURCES
} from '../actions/user.action'
import { AppAction, Facet, UserState } from '../types'

const initialState: UserState = {}

export interface UserResourceProps {
    list?: User[]
    totalRecords?: number
}

export default function userReducer(state = initialState, action: AppAction): UserState {
    switch (action.type) {
        case FETCH_USER_RESOURCES:
            return storeResources(state, action.payload)
        case DO_SEARCH_USER:
            return saveSearchResources(state, action.payload)
        case DELETE_USER_ACTION:
        case CLEAR_USER_RESOURCES:
            return clearUserResources(state)
        case FETCH_UNIT_USER:
            return { ...state, unit: action.payload.data }
        default:
            break
    }
    return state
}

function storeResources(state: UserState, payload: Facet): UserState {
    const { data, totalRecords } = payload
    return { ...state, list: data, totalRecords, querySearch: location.search }
}

function saveSearchResources(state: UserState, payload: AjaxResponse): UserState {
    const { data, totalRecords } = payload.response
    return { ...state, list: data, totalRecords, querySearch: location.search }
}

function clearUserResources(state: UserState): UserState {
    return { ...state, list: undefined }
}
