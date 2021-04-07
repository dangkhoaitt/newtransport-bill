import { Unknown } from '../../../share/interface/Unknown'
import { sortByNumber, sortByText } from '../../../share/utils/sort-util'
import { SortOptions } from './type'

export function handleSortByKey(dataSource: Array<Unknown>, options: Unknown): Array<Unknown> {
    if (dataSource.length === 0) return dataSource
    // check type of value by key
    const { key, type } = options as SortOptions
    const value = typeof dataSource[0][key]
    switch (value) {
        case 'string':
            return [...dataSource].sort((x, y) => sortByText(x[key], y[key], type))
        case 'number':
            return [...dataSource].sort((x, y) => sortByNumber(x[key], y[key]))
        default:
            return dataSource
    }
}
