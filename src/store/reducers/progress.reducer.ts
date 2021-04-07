import { AjaxResponse } from 'rxjs/ajax'
import { PROGRESS_CREATE, PROGRESS_DELETE, PROGRESS_RESOURCE, PROGRESS_UPDATE } from '../actions/progress.action'
import { AppAction, ProgressState } from '../types'

const initialState: ProgressState = {}

export default function ProgressReducer(state = initialState, action: AppAction): ProgressState {
    switch (action.type) {
        case PROGRESS_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.data.length }
        case PROGRESS_CREATE:
            return storeCreateResources(state, action.payload)

        case PROGRESS_UPDATE:
            return storeUpdateResources(state, action.payload)

        case PROGRESS_DELETE:
            return storeDeleteResources(state, action.payload)

        default:
            break
    }
    return state
}

function storeCreateResources(state: ProgressState, { response }: AjaxResponse): ProgressState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: ProgressState, { request }: AjaxResponse): ProgressState {
    const progressId = request.url?.split('/').pop()
    if (state.list && progressId) {
        const newList = state.list.concat()
        const index = newList.findIndex((progress) => progress.id === progressId)
        if (index !== -1) {
            const data = JSON.parse(request.body)
            newList[index] = { ...newList[index], ...data }
            return { ...state, list: newList }
        }
    }
    return state
}

function storeDeleteResources(state: ProgressState, { request }: AjaxResponse): ProgressState {
    const progressId = request.url?.split('/').pop()
    if (state.list && progressId) {
        const newList = state.list.concat()
        const index = newList.findIndex((progress) => progress.id === progressId)
        if (index !== -1) {
            newList.splice(index, 1)
            return { ...state, list: newList }
        }
    }
    return state
}
