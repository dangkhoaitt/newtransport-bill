import { ReactNode } from 'react'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const CLOSE_ALL_MODAL = 'CLOSE_ALL_MODAL'

type OpenModalAction = {
    type: typeof OPEN_MODAL
    payload: ModalProps
}
type CloseModalAction = {
    type: typeof CLOSE_MODAL
}
type CloseAllModalAction = {
    type: typeof CLOSE_ALL_MODAL
}

export type ModalAction = OpenModalAction | CloseModalAction | CloseAllModalAction
export type ModalStore = {
    modalStack: ModalProps[]
}

export type ModalProps = {
    title?: string
    content?: React.ReactNode
    className?: string
    onCancel?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    closeOnEsc?: boolean
    closeOnClickOutside?: boolean
}
export type ConfirmProps = {
    title?: string
    okText?: string
    cancelText?: string
    content?: ReactNode
    className?: string
    onConfirm?: () => void
    onCancel?: () => void
}
export type ModalContextValue = {
    modalStack: ModalProps[]
    openModal: (props: ModalProps) => void
    closeModal: () => void
    closeAllModal: () => void
    confirm: (props: ConfirmProps) => void
}
