import { SAVE_DETAIL } from '../actions/breadcrumb.action'
import { AppAction, BreadcrumbState } from '../types'

export default function breadCrumbReducer(state = {}, action: AppAction): BreadcrumbState {
    switch (action.type) {
        case SAVE_DETAIL:
            return { ...state, detail: action.payload }
        default:
            break
    }
    return state
}
