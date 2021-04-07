import { AjaxResponse } from 'rxjs/ajax'
import { TRUCK_CREATE, TRUCK_DELETE, TRUCK_RESOURCE, TRUCK_UPDATE } from '../actions/truck.action'
import { AppAction, TruckState } from '../types'

const initialState: TruckState = {}

export default function TruckReducer(state = initialState, action: AppAction): TruckState {
    switch (action.type) {
        case TRUCK_RESOURCE:
            return { ...state, list: action.payload.data, totalRecords: action.payload.data.length }
        case TRUCK_CREATE:
            return storeCreateResources(state, action.payload)
        case TRUCK_UPDATE:
            return storeUpdateResources(state, action.payload)
        case TRUCK_DELETE:
            return storeDeleteResources(state, action.payload)

        default:
            break
    }
    return state
}

function storeCreateResources(state: TruckState, { response }: AjaxResponse): TruckState {
    if (!state.list) return state
    const newList = [...state.list]
    newList.unshift(response.data)
    return { ...state, list: newList }
}

function storeUpdateResources(state: TruckState, { request }: AjaxResponse): TruckState {
    const truckId = request.url?.split('/').pop()
    if (state.list && truckId) {
        const newList = state.list.concat()
        const index = newList.findIndex((truck) => truck.id === truckId)
        if (index !== -1) {
            const data = JSON.parse(request.body)
            newList[index] = { ...newList[index], ...data }
            return { ...state, list: newList }
        }
    }
    return state
}

function storeDeleteResources(state: TruckState, { request }: AjaxResponse): TruckState {
    const truckId = request.url?.split('/').pop()
    if (state.list && truckId) {
        const newList = state.list.concat()
        const index = newList.findIndex((truck) => truck.id === truckId)
        if (index !== -1) {
            newList.splice(index, 1)
            return { ...state, list: newList }
        }
    }
    return state
}
