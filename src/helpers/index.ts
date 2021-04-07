import { Dispatch } from 'redux'

export class Helpers {
    private static _instance: Helpers
    private _dispatch!: Dispatch
    private _progressElement!: HTMLDivElement

    static getInstance(): Helpers {
        if (!this._instance) this._instance = new Helpers()
        return this._instance
    }

    setDispatch(dispatch: Dispatch): void {
        this._dispatch = dispatch
    }

    getDispatch(): Dispatch {
        return this._dispatch
    }

    setProgressElement(element: HTMLDivElement): void {
        this._progressElement = element
    }

    getProgressElement(): HTMLDivElement {
        return this._progressElement
    }
}
