import React from 'react'
import { useSelector } from 'react-redux'
import { PROGRESS_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Progress } from '../../share/interface/Progress'
import { PROGRESS_RESOURCE } from '../../store/actions/progress.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import ProgressListTemplate from '../../ui/templates/progress/ProgressListTemplate'

const ProgressList = (): JSX.Element => {
    const progress = useSelector<AppState, Progress[] | undefined>((state) => state.progress.list)

    useGetRequest({
        ignore: !!progress,
        url: PROGRESS_URL + location.search,
        actionType: PROGRESS_RESOURCE
    })

    if (progress) return <ProgressListTemplate data={progress} />
    return <Spinner />
}
export default ProgressList
