import { Unknown } from '../../../share/interface/Unknown'

export type SortType = 'ASC' | 'DESC'

export interface SortOptions {
    key: string
    type: SortType
}

export type FieldSpec = {
    [key: string]: string | JSX.Element | undefined
}

export type Render = (record: Unknown, index?: number) => React.ReactNode
