import { AjaxResponse } from 'rxjs/ajax'
import {
    PROVINCE_CREATE,
    PROVINCE_DELETE,
    PROVINCE_RESOURCE,
    PROVINCE_SEARCH,
    PROVINCE_UPDATE
} from '../actions/province.action'
import { AppAction, ProvinceState } from '../types'

const initialState: ProvinceState = {}

export default function ProvinceReducer(state = initialState, action: AppAction): ProvinceState {
    switch (action.type) {
        case PROVINCE_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.totalRecords }
        case PROVINCE_CREATE:
            return storeCreateResources(state, action.payload)
        case PROVINCE_UPDATE:
            return storeUpdateResources(state, action.payload)
        case PROVINCE_DELETE:
            return storeDeleteResources(state, action.payload)
        case PROVINCE_SEARCH:
            return storeSearchResources(state, action.payload)
        default:
            break
    }
    return state
}

function storeCreateResources(state: ProvinceState, { response }: AjaxResponse): ProvinceState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: ProvinceState, { response }: AjaxResponse): ProvinceState {
    const provinceId = response.data.id
    if (!state.list) return state
    const newList = [...state.list]
    const index = state.list.findIndex((province) => province.id === provinceId)
    newList[index] = response.data
    return { ...state, list: newList }
}

function storeDeleteResources(state: ProvinceState, { request }: AjaxResponse): ProvinceState {
    const provinceId = request.url?.split('/').pop()
    if (state.list) {
        const newList = state.list.concat()
        const index = newList.findIndex((province) => province.id === provinceId)
        newList.splice(index, 1)
        return { ...state, list: newList }
    }
    return state
}

function storeSearchResources(state: ProvinceState, { response }: AjaxResponse): ProvinceState {
    return { ...state, list: response.data, totalRecords: response.totalRecords }
}
