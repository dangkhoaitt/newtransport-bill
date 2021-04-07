import { createContext } from 'react'
import { Unknown } from '../../../share/interface/Unknown'
import { handleSortByKey } from './table-util'
import { Render, SortOptions } from './type'

type TableAction = { type: ActionType; payload: Unknown | Unknown[] | boolean | undefined }
type ActionType = 'sort' | 'dataSource' | 'isLoading'

type TableStore = {
    cells: Array<{ key: string; render?: Render }>
    dataSource: Array<Unknown>
    sortOpts?: SortOptions
    isLoading?: boolean
    dispatch?: React.Dispatch<TableAction>
}
export const TableContext = createContext<TableStore>({ cells: [], dataSource: [], dispatch: () => null })

export const tableReducer = (state: TableStore, action: TableAction): TableStore => {
    const { type, payload } = action
    switch (type) {
        case 'sort':
            return {
                ...state,
                sortOpts: payload as SortOptions,
                dataSource: handleSortByKey(state.dataSource, payload as Unknown[])
            }
        case 'dataSource':
            return { ...state, dataSource: payload as Unknown[] }
        case 'isLoading':
            return { ...state, isLoading: payload as boolean }
        default:
            return state
    }
}
