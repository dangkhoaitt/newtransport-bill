import {
    DELETE_SERVICE,
    EDIT_SERVICE_ACTION,
    FETCH_SERVICES,
    SAVE_PROVINCE_LIST,
    SAVE_TRUCK_LIST
} from '../actions/service.action'
import { AppAction, Facet, ServiceState } from '../types'

const initialState: ServiceState = {}

export default function serviceReducer(state = initialState, action: AppAction): ServiceState {
    switch (action.type) {
        case FETCH_SERVICES:
            return storeResources(state, action.payload)
        case SAVE_PROVINCE_LIST:
            return saveProvinceList(state, action.payload)
        case SAVE_TRUCK_LIST:
            return saveTruckList(state, action.payload)
        case DELETE_SERVICE:
        case EDIT_SERVICE_ACTION:
            return { ...state, list: undefined, totalRecords: undefined }
        default:
            break
    }
    return state
}

function storeResources(state: ServiceState, payload: Facet): ServiceState {
    const { data, totalRecords } = payload
    return { ...state, list: data, totalRecords }
}

function saveProvinceList(state: ServiceState, payload: Facet): ServiceState {
    return { ...state, provinceList: payload.data }
}

function saveTruckList(state: ServiceState, payload: Facet): ServiceState {
    return { ...state, truckList: payload.data }
}
