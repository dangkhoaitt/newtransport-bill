import { AjaxResponse } from 'rxjs/ajax'
import { QUOTATION_ACTION, QUOTATION_RESOURCE } from '../actions/quotation.action'
import { AppAction, QuotationState } from '../types'

const initialState: QuotationState = {}

export default function QuotationReducer(state = initialState, action: AppAction): QuotationState {
    switch (action.type) {
        case QUOTATION_RESOURCE:
            return { ...state, quotationList: action.payload.data }
        case QUOTATION_ACTION:
            return storeUpdateResources(state, action.payload)
        default:
            break
    }
    return state
}

function storeUpdateResources(state: QuotationState, { response }: AjaxResponse): QuotationState {
    if (state.quotationList && response.data.id) {
        const newList = state.quotationList
        const index = newList.findIndex((q) => q.id === response.data.id)
        if (index !== -1) {
            newList[index] = response.data
            return { ...state, quotationList: newList }
        }
    }
    return { ...state }
}
