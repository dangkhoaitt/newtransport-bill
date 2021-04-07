import loadable from '@loadable/component'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import RedirectComponent from '../../../share/redirect/RedirectComponent'
import './style/index.scss'

const AppRouting = loadable(() => import('../../../share/routing'))

export default function Content(): JSX.Element {
    return (
        <div className='main-content' id='maintext'>
            <div className='sidebar-menu-content'>
                <RedirectComponent />
                <Breadcrumb />
                <AppRouting />
            </div>
        </div>
    )
}
