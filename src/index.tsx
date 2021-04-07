import { loadableReady } from '@loadable/component'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import App from './App'
import './index.css'
import * as serviceWorker from './serviceWorker'
import Notification from './ui/atoms/notification'
import store from './store'

loadableReady().then(function () {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={createBrowserHistory()}>
                <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
                    <App />
                    <Notification />
                </ToastProvider>
            </Router>
        </Provider>,
        document.getElementById('root')
    )
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
