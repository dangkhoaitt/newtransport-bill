import { AjaxResponse } from 'rxjs/ajax'
import { PACKAGE_CREATE, PACKAGE_DELETE, PACKAGE_RESOURCE, PACKAGE_UPDATE } from '../actions/package.action'
import { AppAction, PackageState } from '../types'

const initialState: PackageState = {}

export default function PackageReducer(state = initialState, action: AppAction): PackageState {
    switch (action.type) {
        case PACKAGE_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.data.length }
        case PACKAGE_CREATE:
            return storeCreateResources(state, action.payload)
        case PACKAGE_UPDATE:
            return storeUpdateResources(state, action.payload)
        case PACKAGE_DELETE:
            return storeDeleteResources(state, action.payload)

        default:
            break
    }
    return state
}

function storeCreateResources(state: PackageState, { response }: AjaxResponse): PackageState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: PackageState, { request }: AjaxResponse): PackageState {
    const packageId = request.url?.split('/').pop()
    if (state.list && packageId) {
        const newList = state.list.concat()
        const index = newList.findIndex((item) => item.id === packageId)
        if (index !== -1) {
            const data = JSON.parse(request.body)
            newList[index] = { ...newList[index], ...data }
            return { ...state, list: newList }
        }
    }
    return state
}

function storeDeleteResources(state: PackageState, { request }: AjaxResponse): PackageState {
    const packageId = request.url?.split('/').pop()
    if (state.list && packageId) {
        const newList = state.list.concat()
        const index = newList.findIndex((item) => item.id === packageId)
        if (index !== -1) {
            newList.splice(index, 1)
            return { ...state, list: newList }
        }
    }
    return state
}
