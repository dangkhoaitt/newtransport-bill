import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Roles } from '../../../share/common/app-constants'
import { useSubmitRequest, HttpMethod } from '../../../share/hooks'
import { Any } from '../../../share/interface/Unknown'
import { User } from '../../../share/interface/User'
import { AppState } from '../../../store/types'
import { EditIcon, GarbageBoldIcon } from '../../atoms/icons'
import { ButtonIconOnly } from '../buttons'
import { useModal } from '../modal'
import { ColumnSpec, Table } from '../table'

interface Props {
    name: string
    data: Any[]
    TableColumns: ColumnSpec[]
    actionType?: string
    url?: string
    ModalComponent: (data: Any) => JSX.Element
}

export default function TableBillInfo(props: Props): JSX.Element {
    const { name, data, TableColumns, actionType, url, ModalComponent } = props
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    const { openModal } = useModal()
    const submitRequest = useSubmitRequest()
    const onOpenEdit = (values: Any): void => {
        openModal({
            className: `modal-create-${name}`,
            title: 'Chỉnh sửa',
            content: <ModalComponent data={values} />
        })
    }

    const onClickDelete = (id?: string): void => {
        submitRequest({
            method: HttpMethod.DELETE,
            url: url + '/' + id,
            params: { id },
            actionType: actionType
        })
    }

    const actionColumns: ColumnSpec[] = [
        {
            key: `${name}Edit`,
            title: 'Sửa',
            width: '5%',
            className: 'border-column text-center icon-value',
            render: (record): ReactNode => (
                <ButtonIconOnly
                    iconType='default'
                    icon={<EditIcon />}
                    onClick={(): void => onOpenEdit(record)}></ButtonIconOnly>
            )
        },
        {
            key: `${name}Delete`,
            title: 'Xóa',
            width: '5%',
            className: 'border-column text-center col-icon',
            render: (record): ReactNode => (
                <ButtonIconOnly
                    iconType='default'
                    icon={<GarbageBoldIcon />}
                    onClick={(): void => onClickDelete(record?.id)}
                />
            )
        }
    ]

    return (
        <div id={`${name}-table`}>
            <Table
                dataSource={data}
                columns={userLogin?.role === Roles.admin ? [...TableColumns, ...actionColumns] : TableColumns}
            />
        </div>
    )
}
