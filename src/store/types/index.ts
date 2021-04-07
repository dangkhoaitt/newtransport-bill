import { Action } from 'redux'
import { Bill } from '../../share/interface/Bill'
import { Customer } from '../../share/interface/Customer'
import { Finance } from '../../share/interface/Finance'
import { Package } from '../../share/interface/Package'
import { Progress } from '../../share/interface/Progress'
import { Province } from '../../share/interface/Province'
import { Quotation } from '../../share/interface/Quotation'
import { Service } from '../../share/interface/Service'
import { WebsiteSetting } from '../../share/interface/Setting'
import { SettingWebsite } from '../../share/interface/SettingWebsite'
import { Truck } from '../../share/interface/Truck'
import { Unit } from '../../share/interface/Unit'
import { Any, Unknown } from '../../share/interface/Unknown'
import { User } from '../../share/interface/User'
export const ERROR_REQUEST = 'ERROR_REQUEST'
export const BAD_REQUEST = 'BAD_REQUEST'
export const CANCEL_REQUEST = 'CANCEL_REQUEST'

export interface AppState {
    login: LoginState
    app: MainAppState
    breadcrumb: BreadcrumbState
    user: UserState
    customer: CustomerState
    service: ServiceState
    website: SettingWebsiteState
    bill: BillState
    truck: TruckState
    unit: UnitState
    progress: ProgressState
    finance: FinanceState
    package: PackageState
    province: ProvinceState
    quotation: QuotationState
}

export interface AppAction extends Action {
    payload?: Any
    elemRef?: React.RefObject<HTMLElement>
}

export interface NotificationOptions {
    title: string
    status: 'error' | 'info' | 'success' | 'warning'
}

export interface MainAppState {
    isMobile: boolean
    menuToggle: boolean
    labels: AppLabels
    userLogin?: User
    redirectPath?: string
    badRequest?: Unknown[]
    notification?: NotificationOptions
}

export interface BreadcrumbState {
    detail?: Unknown
}

export interface LoginState {
    isChecking: boolean
    loggedIn?: boolean
    loginResponse?: { accessToken?: string; expiresIn?: string }
}
export interface UserSearchParams extends Unknown {
    page?: number
    tel?: number
    role?: string
    name?: string
    email?: string
    username?: string
}

export interface BillSearchParams extends Unknown {
    page?: number
    code?: string
    customerCode?: string
    sendName?: string
    receiveName?: string
    progress?: string
    finance?: string
    service?: string
    insertTimeFrom?: number
    insertTimeTo?: number
    unit?: number
    userId?: string
}

export interface UserState {
    totalRecords?: number
    list?: User[]
    querySearch?: string
    unit?: Unit[]
}

export interface CustomerState {
    list?: Customer[]
    detail?: Customer
    provinceList?: Province[]
    querySearch?: string
}

export interface CustomerResourceProps {
    list?: Customer[]
    searchParams?: CustomerSearchParams
    totalRecords?: number
    detail?: Customer
}

export interface CustomerSearchParams {
    page?: number
    tel?: string
    name?: string
    code?: string
    insertName?: string
    province?: number
}

export interface SettingWebsiteState {
    website?: SettingWebsite
}

export interface ServiceState {
    list?: Service[]
    detail?: Service
    totalRecords?: number
    provinceList?: Province[]
    truckList?: Truck[]
}

export interface SettingStore {
    [code: string]: WebsiteSetting
}

export interface TruckState {
    list?: Truck[]
    totalRecords?: number
}
export interface UnitState {
    list?: Unit[]
    totalRecords?: number
}

export interface TruckSearchParams extends Unknown {
    page?: number
}

export interface ProgressState {
    list?: Progress[]
    totalRecords?: number
}

export interface ProgressSearchParams {
    page?: number
}
export interface FinanceState {
    list?: Finance[]
    totalRecords?: number
}

export interface FinanceSearchParams {
    page?: number
}

export interface PackageState {
    list?: Package[]
    totalRecords?: number
}

export interface PackageSearchParams {
    page?: number
}

export interface ProvinceState {
    list?: Province[]
    totalRecords?: number
}

export interface ProvinceSearchParams {
    page?: number
    code?: number
    name?: string
}
export interface QuotationState {
    quotationList?: Quotation[]
    quotationDetail?: Quotation
}
export interface QuotationSearchParams extends Unknown {
    page?: number
    status?: number
}

export interface Facet {
    data: Unknown[]
    totalRecords?: number
}

export interface AppLabels {
    userFields?: UserFields
}

interface UserFields {
    code?: string
    name?: string
    tel?: string
    email?: string
    birthday?: string
    insertTime?: string
    role?: string
    updateTime?: string
    username?: string
    field?: string
    oldValue?: string
    newValue?: string
    collection?: string
    action?: string
    address?: string
    unit?: string
}

export interface BillState {
    totalRecords?: number
    list?: Bill[]
    billDropdown?: BillValueDropdown
    billSearchDropdown?: BillValueDropdown
    querySearch?: string
}

export interface BillValueDropdown {
    provinceList?: Province[]
    packageList?: Package[]
    progressList?: Progress[]
    financeList?: Finance[]
    mainServiceList?: Service[]
    extraServiceList?: Service[]
    truckList?: Truck[]
    service?: Service[]
    unitList?: { code?: string; name?: string }[]
    userList?: User[]
}
