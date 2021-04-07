import loadable from '@loadable/component'
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { AppState } from '../../store/types'
import Loading from '../../ui/atoms/animations/Loading'
import { MenuPaths, Roles } from '../common/app-constants'
import { User } from '../interface/User'

export const lazyOptions = {
    fallback: (
        <div
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                height: '100vh',
                width: '100%'
            }}>
            <Loading />
        </div>
    )
}

// Bill
const BillEdit = loadable(() => import('../../pages/bill/BillEdit'), lazyOptions)
const BillDetail = loadable(() => import('../../pages/bill/BillDetail'), lazyOptions)
const BillCreate = loadable(() => import('../../pages/bill/BillCreate'), lazyOptions)
const BillList = loadable(() => import('../../pages/bill/BillList'), lazyOptions)
const BillImport = loadable(() => import('../../pages/bill/BillImport'), lazyOptions)
// Customer
const CustomerList = loadable(() => import('../../pages/customer/CustomerList'), lazyOptions)
const CustomerDetail = loadable(() => import('../../pages/customer/CustomerDetail'), lazyOptions)
// Bill information
const ProvinceList = loadable(() => import('../../pages/province/ProvinceList'), lazyOptions)
const TruckList = loadable(() => import('../../pages/truck/TruckList'), lazyOptions)
const ProgressList = loadable(() => import('../../pages/progress/ProgressList'), lazyOptions)
const FinanceList = loadable(() => import('../../pages/finance/FinanceList'), lazyOptions)
const PackageList = loadable(() => import('../../pages/package/PackageList'), lazyOptions)
const ServiceList = loadable(() => import('../../pages/service/ServiceList'), lazyOptions)
const ServiceCreate = loadable(() => import('../../pages/service/ServiceCreate'), lazyOptions)
const ServiceEdit = loadable(() => import('../../pages/service/ServiceEdit'), lazyOptions)
const ServiceDetail = loadable(() => import('../../pages/service/ServiceDetail'), lazyOptions)
//Account
const UserList = loadable(() => import('../../pages/user/UserList'), lazyOptions)
const UserDetail = loadable(() => import('../../pages/user/UserDetail'), lazyOptions)
const ChangePassword = loadable(() => import('../../pages/auth/ChangePassword'), lazyOptions)
const NotFoundPage = loadable(() => import('../../pages/not-found'), lazyOptions)
//Quotation
const QuotationList = loadable(() => import('../../pages/quotation/QuotationList'), lazyOptions)
//Unit
const UnitList = loadable(() => import('../../pages/unit/UnitList'), lazyOptions)
const UnitDetail = loadable(() => import('../../pages/unit/UnitDetail'), lazyOptions)

const routeList = [
    {
        component: <Route key='1' path='/doi-mat-khau' exact component={ChangePassword} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='2' path={`/`} exact component={BillList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='3' path={`/${MenuPaths.customer}`} exact component={CustomerList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='4' path={`/${MenuPaths.user}`} exact component={UserList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='5' path={`/${MenuPaths.userDetail}/:id`} exact component={UserDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='6' path={`/${MenuPaths.profile}`} exact component={UserDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='7' path={`/${MenuPaths.service}`} exact component={ServiceList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='8' path={`/${MenuPaths.serviceEdit}/:id`} exact component={ServiceEdit} />,
        accessible: [Roles.admin]
    },
    {
        component: <Route key='9' path={`/${MenuPaths.customerDetail}/:id`} exact component={CustomerDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='10' path={`/${MenuPaths.billCreate}`} exact component={BillCreate} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='11' path={`/${MenuPaths.shipping_bill}`} exact component={BillList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='12' path={`/${MenuPaths.billDetail}/:id`} exact component={BillDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='13' path={`/${MenuPaths.billEdit}/:id`} exact component={BillEdit} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='14' path={`/${MenuPaths.progress}`} exact component={ProgressList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='15' path={`/${MenuPaths.finance}`} exact component={FinanceList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='16' path={`/${MenuPaths.package}`} exact component={PackageList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='17' path={`/${MenuPaths.truck}`} exact component={TruckList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='18' path={`/${MenuPaths.province}`} exact component={ProvinceList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='19' path={`/${MenuPaths.quotation}`} exact component={QuotationList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='21' path={`/${MenuPaths.serviceDetail}/:id`} exact component={ServiceDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='22' path={`/${MenuPaths.serviceCreate}`} exact component={ServiceCreate} />,
        accessible: [Roles.admin]
    },
    {
        component: <Route key='23' path={`/${MenuPaths.unit}`} exact component={UnitList} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='24' path={`/${MenuPaths.unitDetail}/:id`} exact component={UnitDetail} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    },
    {
        component: <Route key='25' path={`/${MenuPaths.billImport}`} exact component={BillImport} />,
        accessible: [Roles.admin, Roles.manager, Roles.member]
    }
]

export default function AppRouting(): JSX.Element {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)

    return (
        <Switch>
            {routeList.map((route) => {
                if (route.accessible.includes(userLogin?.role ?? '')) return route.component
                return null
            })}
            <Route path='*' component={NotFoundPage} />
        </Switch>
    )
}
