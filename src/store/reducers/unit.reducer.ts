import { AjaxResponse } from 'rxjs/ajax'
import { UNIT_CREATE, UNIT_DELETE, UNIT_RESOURCE, UNIT_UPDATE } from '../actions/unit.action'
import { AppAction, UnitState } from '../types'

const initialState: UnitState = {}

export default function UnitReducer(state = initialState, action: AppAction): UnitState {
    switch (action.type) {
        case UNIT_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.data.length + 1 }
        case UNIT_CREATE:
            return storeCreateResources(state, action.payload)
        case UNIT_UPDATE:
            return storeUpdateResources(state, action.payload)
        case UNIT_DELETE:
            return storeDeleteResources(state, action.payload)

        default:
            break
    }
    return state
}

function storeCreateResources(state: UnitState, { response }: AjaxResponse): UnitState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: UnitState, { response }: AjaxResponse): UnitState {
    const unitId = response.data.id
    if (state.list && unitId) {
        const newList = state.list.concat()
        const index = newList.findIndex((unit) => unit.id === unitId)
        if (index !== -1) {
            const data = response.data
            newList[index] = { ...newList[index], ...data }
            return { ...state, list: newList }
        }
    }
    return state
}

function storeDeleteResources(state: UnitState, { request }: AjaxResponse): UnitState {
    const unitId = request.url?.split('/').pop()
    if (state.list && unitId) {
        const newList = state.list.concat()
        const index = newList.findIndex((unit) => unit.id === unitId)
        if (index !== -1) {
            newList.splice(index, 1)
            return { ...state, list: newList }
        }
    }
    return state
}
