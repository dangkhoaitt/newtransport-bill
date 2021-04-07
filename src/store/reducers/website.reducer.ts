import { AjaxResponse } from 'rxjs/ajax'
import { SETTING_WEBSITE_RESOURCE, UPDATE_SETTING_WEBSITE } from '../actions/website.action'
import { AppAction, SettingWebsiteState } from '../types'

const initialState: SettingWebsiteState = {}

export default function SettingWebsiteReducer(state = initialState, action: AppAction): SettingWebsiteState {
    switch (action.type) {
        case SETTING_WEBSITE_RESOURCE:
            return { ...state, website: action.payload.data }
        case UPDATE_SETTING_WEBSITE:
            return storeResources(state, action.payload)
        default:
            break
    }
    return state
}

function storeResources(state: SettingWebsiteState, payload: AjaxResponse): SettingWebsiteState {
    const { request } = payload
    const output = Object.assign({}, state.website, JSON.parse(request.body))
    return {
        ...state,
        website: output
    }
}
