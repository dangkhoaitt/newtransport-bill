import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fromEvent, interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { Helpers } from './helpers'
import { resizeAction } from './store/actions/app.action'
import { Spinner } from './ui/molecules/loading'
import AppLayout from './ui/templates/layout'

require('./assets/favicon.ico')

export default function App(): JSX.Element {
    const dispatch = useDispatch()
    const progressRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (progressRef.current) {
            Helpers.getInstance().setProgressElement(progressRef.current)
        }
        Helpers.getInstance().setDispatch(dispatch)

        const resizeEvent = fromEvent(window, 'resize').pipe(debounce(() => interval(400)))
        const subcrible = resizeEvent.subscribe(() => dispatch(resizeAction()))
        return (): void => {
            subcrible.unsubscribe()
        }
    }, [])

    return (
        <Fragment>
            <AppLayout />
            <div ref={progressRef} id='progress-indicator' className=''>
                <Spinner />
            </div>
        </Fragment>
    )
}
