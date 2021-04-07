import { Action, applyMiddleware, combineReducers, createStore, Middleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { USER_URL } from '../share/common/api-constants'
import { createRequest, HttpMethod } from '../share/hooks'
import { GET_USER_LOGIN, LOAD_LABEL_PROJECT } from './actions/app.action'
import appReducer from './reducers/app.reducer'
import billReducer from './reducers/bill.reducer'
import breadCrumbReducer from './reducers/breacrumb.reducer'
import customerReducer from './reducers/customer.reducer'
import FinanceReducer from './reducers/finance.reducer'
import packageReducer from './reducers/package.reducer'
import progressReducer from './reducers/progress.reducer'
import provinceReducer from './reducers/province.reducer'
import quotationReducer from './reducers/quotation.reducer'
import serviceReducer from './reducers/service.reducer'
import truckReducer from './reducers/truck.reducer'
import unitReducer from './reducers/unit.reducer'
import userReducer from './reducers/user.reducer'
import websiteReducer from './reducers/website.reducer'

const logger: Middleware = () => (next: unknown) => (action: Action): void => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Logger', action)
    }
    return typeof next === 'function' ? next(action) : undefined
}

const rootReducer = combineReducers({
    app: appReducer,
    breadcrumb: breadCrumbReducer,
    user: userReducer,
    customer: customerReducer,
    service: serviceReducer,
    website: websiteReducer,
    bill: billReducer,
    truck: truckReducer,
    progress: progressReducer,
    finance: FinanceReducer,
    package: packageReducer,
    province: provinceReducer,
    quotation: quotationReducer,
    unit: unitReducer
})

const epicMiddleware = createEpicMiddleware()

const store = createStore(rootReducer, applyMiddleware(logger, epicMiddleware))

function loadLabelProject(): void {
    import('../assets/json/label-vi.json').then((labels) => {
        store.dispatch({ type: LOAD_LABEL_PROJECT, payload: labels.default })
    })
}

export function getRoleUser(): void {
    const id = document.getElementsByTagName('meta')['id'].content

    createRequest(USER_URL + '/' + id, HttpMethod.GET).subscribe(
        ({ response }) => {
            store.dispatch({ type: GET_USER_LOGIN, payload: response.data })
        },
        () => store.dispatch({ type: GET_USER_LOGIN, payload: undefined })
    )
}

loadLabelProject()
getRoleUser()

export default store
