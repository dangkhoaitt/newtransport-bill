import React, { Fragment, useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { ButtonPrimary, ButtonWarning } from '../buttons'
import ModalItem from './modal-item'
import './style/index.scss'
import {
    CLOSE_ALL_MODAL,
    CLOSE_MODAL,
    ConfirmProps,
    ModalAction,
    ModalContextValue,
    ModalProps,
    ModalStore,
    OPEN_MODAL
} from './type'

const ModalContext = React.createContext<ModalContextValue>({} as ModalContextValue)

const initialState = {
    modalStack: []
}

function reducer(state: ModalStore, action: ModalAction): ModalStore {
    switch (action.type) {
        case OPEN_MODAL:
            return { ...state, modalStack: [...state.modalStack, action.payload] }
        case CLOSE_MODAL:
            return closeModalAction(state)
        case CLOSE_ALL_MODAL:
            return { ...state, modalStack: [] }
        default:
            return state
    }
}

function closeModalAction(state: ModalStore): ModalStore {
    const modalStack = [...state.modalStack]
    modalStack.pop()
    return { ...state, modalStack }
}

function ModalProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState)

    const openModal = (props: ModalProps): void => {
        dispatch({ type: OPEN_MODAL, payload: props })
    }

    const closeModal = (): void => {
        dispatch({ type: CLOSE_MODAL })
    }

    const closeAllModal = (): void => {
        dispatch({ type: CLOSE_ALL_MODAL })
    }

    const confirm = (props: ConfirmProps): void => {
        const { className = '', title = '', content, okText, cancelText, onConfirm, onCancel } = props

        const contentModal = (
            <Fragment>
                {content && <div className='confirm-content'>{content}</div>}
                <div className='confirm-groupbtn'>
                    <ButtonPrimary
                        children={okText || 'Đồng ý'}
                        onClick={(): void => {
                            closeModal()
                            onConfirm && onConfirm()
                        }}
                    />
                    <ButtonWarning
                        children={cancelText || 'Hủy'}
                        onClick={(): void => {
                            closeModal()
                            onCancel && onCancel()
                        }}
                    />
                </div>
            </Fragment>
        )

        dispatch({
            type: OPEN_MODAL,
            payload: {
                title,
                className: `confirm-container ${className}`,
                content: contentModal,
                closeOnClickOutside: false
            }
        })
    }

    return (
        <ModalContext.Provider value={{ modalStack: state.modalStack, openModal, closeModal, closeAllModal, confirm }}>
            {children}
            <Modal />
        </ModalContext.Provider>
    )
}

function Modal(): JSX.Element {
    const { modalStack } = useContext(ModalContext)

    return ReactDOM.createPortal(
        <Fragment>
            {modalStack.length > 0 && modalStack.map((modal, index) => <ModalItem key={index} {...modal} />)}
        </Fragment>,
        document.getElementById('root') ?? new Element()
    )
}

function useModal(): ModalContextValue {
    return useContext(ModalContext)
}

export { ModalProvider, useModal }
