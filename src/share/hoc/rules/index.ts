import { MenuPaths, Roles } from '../../common/app-constants'

export interface Rules {
    path: string
    accessible: string[]
}

export const createButtonRules: Rules[] = [
    { path: MenuPaths.shipping_bill, accessible: [Roles.admin, Roles.manager, Roles.member] }
]

export const editButtonRules: Rules[] = [
    { path: MenuPaths.shipping_bill, accessible: [Roles.admin, Roles.manager, Roles.member] },
    { path: MenuPaths.customer, accessible: [Roles.admin, Roles.manager] }
]

export const deleteButtonRules: Rules[] = [
    { path: MenuPaths.shipping_bill, accessible: [Roles.admin, Roles.manager] },
    { path: MenuPaths.customer, accessible: [Roles.admin, Roles.manager] }
]
