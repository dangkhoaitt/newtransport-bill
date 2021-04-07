import { Unknown } from './Unknown'

export interface WebsiteSetting extends Unknown {
    id?: string
    code?: string
    name?: string
    order?: number
    parentCode?: string
    insertBy?: InsertBy
    insertTime?: number
    child?: ChildSetting[]
}

interface InsertBy {
    userId?: string
    username?: string
}

export interface ChildSetting {
    code?: string
    parentCode?: string
    name?: string
    insertBy?: InsertBy
    insertTime?: number
    id?: string
}
