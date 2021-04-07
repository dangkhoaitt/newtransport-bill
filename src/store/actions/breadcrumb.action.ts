import { Unknown } from '../../share/interface/Unknown'
import { AppAction } from '../types'

export const SAVE_DETAIL = 'SAVE_DETAIL'

export function saveDetail(data: Unknown): AppAction {
    return { type: SAVE_DETAIL, payload: data }
}
