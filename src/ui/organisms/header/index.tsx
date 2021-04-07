import React from 'react'
import ProfileUser from './profile/ProfileUser'
import './style/index.scss'

export default function Header(): JSX.Element {
    return (
        <div className='header-section dock-menu' id='header'>
            <ul className='header-list'>
                <li className='right-header list'>
                    <ProfileUser />
                </li>
            </ul>
        </div>
    )
}
