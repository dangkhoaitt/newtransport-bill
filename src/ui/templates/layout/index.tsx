import React from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from '../../organisms/breadcrumb'
import RedirectComponent from '../../../share/redirect/RedirectComponent'
import AppRouting from '../../../share/routing'
import { AppState } from '../../../store/types'
import Header from '../../../ui/organisms/header'
import { ModalProvider } from '../../molecules/modal'
import SideBar from '../../organisms/sidebar'
import './style/index.scss'

export default function AppLayout(): JSX.Element {
    const isMobile = useSelector<AppState, boolean>((state) => state.app.isMobile)
    function toggleSidebar(event: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
        const toggleClass = 'show-sidebar'
        const currentToggle = event.currentTarget
        currentToggle.classList.toggle(toggleClass, !currentToggle.classList.contains(toggleClass))
    }

    return (
        <ModalProvider>
            <input
                type='checkbox'
                id='drawer-toggle'
                name='drawer-toggle'
                className={`${!isMobile && 'show-sidebar'}`}
                onClick={toggleSidebar}
            />
            <label htmlFor='drawer-toggle' id='drawer-toggle-label' />
            <Header />
            <SideBar />
            <div id='page-content'>
                <div className='main-content' id='maintext'>
                    <div className='sidebar-menu-content'>
                        <RedirectComponent />
                        <Breadcrumb />
                        <AppRouting />
                    </div>
                </div>
            </div>
        </ModalProvider>
    )
}
