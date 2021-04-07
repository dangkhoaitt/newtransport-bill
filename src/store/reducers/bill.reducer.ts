import { AjaxResponse } from 'rxjs/ajax'
import { User } from '../../share/interface/User'
import {
    CREATE_BILL_ACTION,
    DELETE_BILL_ACTION,
    DO_SEARCH_BILL,
    EDIT_BILL_ACTION,
    FETCH_BILL_DROPDOWN,
    FETCH_BILL_DROPDOWN_SEARCH,
    FETCH_BILL_RESOURCES,
    REMOVE_BILL_DROPDOWN
} from '../actions/bill.action'
import { AppAction, BillState, BillValueDropdown, Facet, UserState } from '../types'

const initialState: UserState = {}

export interface UserResourceProps {
    list?: User[]
    totalRecords?: number
}

export default function billReducer(state = initialState, action: AppAction): BillState {
    switch (action.type) {
        case FETCH_BILL_RESOURCES:
            return storeResources(state, action.payload)
        case DO_SEARCH_BILL:
            return saveSearchResources(state, action.payload)
        case FETCH_BILL_DROPDOWN:
            return saveDropdownResources(state, action.payload)
        case REMOVE_BILL_DROPDOWN:
            return { ...state, billDropdown: undefined }
        case DELETE_BILL_ACTION:
        case EDIT_BILL_ACTION:
        case CREATE_BILL_ACTION:
            return { ...state, list: undefined, totalRecords: undefined }
        case FETCH_BILL_DROPDOWN_SEARCH:
            return saveDropdownSearchResources(state, action.payload)
        default:
            break
    }
    return state
}

function storeResources(state: BillState, payload: Facet): BillState {
    const { data, totalRecords } = payload
    return { ...state, list: data, totalRecords, querySearch: location.search }
}

function saveSearchResources(state: BillState, payload: AjaxResponse): BillState {
    const { data, totalRecords } = payload.response
    return { ...state, list: data, totalRecords, querySearch: location.search }
}

function saveDropdownResources(state: BillState, payload: AjaxResponse[]): BillState {
    const dropdown: BillValueDropdown = { extraServiceList: [], mainServiceList: [] }
    payload.forEach((ajaxResponse) => {
        if (ajaxResponse.request.url?.includes('service'))
            ajaxResponse.response.data?.forEach((service) =>
                service.isExtra ? dropdown.extraServiceList?.push(service) : dropdown.mainServiceList?.push(service)
            )
        if (ajaxResponse.request.url?.includes('province')) dropdown.provinceList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('progress')) dropdown.progressList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('finance')) dropdown.financeList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('truck')) dropdown.truckList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('package')) dropdown.packageList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('unit')) dropdown.unitList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('user')) dropdown.userList = ajaxResponse.response.data
    })

    return { ...state, billDropdown: dropdown }
}

function saveDropdownSearchResources(state: BillState, payload: AjaxResponse[]): BillState {
    const dropdown: BillValueDropdown = {}
    payload.forEach((ajaxResponse) => {
        if (ajaxResponse.request.url?.includes('service')) dropdown.service = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('progress')) dropdown.progressList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('finance')) dropdown.financeList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('unit')) dropdown.unitList = ajaxResponse.response.data
        if (ajaxResponse.request.url?.includes('user'))
            dropdown.userList = ajaxResponse.response.data.map((d) => {
                return { code: d.id, name: d.name, unit: d.unit }
            })
    })

    return { ...state, billSearchDropdown: dropdown }
}
