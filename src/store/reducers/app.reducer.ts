import { isMobile } from '../../share/utils/app-util'
import {
    CLEAR_REDIRECT_PATH,
    COLLAPSE_SIDEBAR,
    GET_USER_LOGIN,
    LOAD_LABEL_PROJECT,
    REDIRECT,
    RESIZE_EVENT,
    SHOW_NOTIFICATION
} from '../actions/app.action'
import { AppAction, BAD_REQUEST, MainAppState } from '../types'

const initialState: MainAppState = {
    isMobile: isMobile(),
    menuToggle: isMobile() ? false : true,
    labels: {}
}

export default function appReducer(state = initialState, action: AppAction): MainAppState {
    switch (action.type) {
        case RESIZE_EVENT:
            return { ...state, isMobile: isMobile(), menuToggle: isMobile() ? false : true }
        case COLLAPSE_SIDEBAR:
            return { ...state, menuToggle: !state.menuToggle }
        case REDIRECT:
            return { ...state, redirectPath: action.payload }
        case SHOW_NOTIFICATION:
            return { ...state, notification: action.payload }
        case CLEAR_REDIRECT_PATH:
            return { ...state, redirectPath: undefined }
        case BAD_REQUEST:
            return { ...state, badRequest: action.payload }
        case LOAD_LABEL_PROJECT:
            return { ...state, labels: action.payload }
        case GET_USER_LOGIN:
            return { ...state, userLogin: action.payload }
        default:
            break
    }
    return state
}
