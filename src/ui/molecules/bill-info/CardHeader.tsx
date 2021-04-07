import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Roles } from '../../../share/common/app-constants'
import { User } from '../../../share/interface/User'
import { AppState } from '../../../store/types'
import { EditIcon, GarbageBoldIcon } from '../../atoms/icons'
import { ButtonIconOnly } from '../buttons'

interface CardHeaderProps {
    title?: string | number
    onOpenEdit?: () => void
    onClickDelete?: () => void
}

const CardHeader = ({ title, onOpenEdit, onClickDelete }: CardHeaderProps): JSX.Element => {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    return (
        <Fragment>
            <span>{title}</span>
            {userLogin?.role === Roles.admin && (
                <div>
                    <ButtonIconOnly onClick={onOpenEdit} iconType={'default'} icon={<EditIcon />} />
                    <ButtonIconOnly onClick={onClickDelete} iconType={'default'} icon={<GarbageBoldIcon />} />
                </div>
            )}
        </Fragment>
    )
}

export default CardHeader
