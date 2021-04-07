import React from 'react'
import { useSelector } from 'react-redux'
import { UNIT_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Unit } from '../../share/interface/Unit'
import { UNIT_RESOURCE } from '../../store/actions/unit.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import UnitListTemplate from '../../ui/templates/unit/UnitListTemplate'

const UnitList = (): JSX.Element => {
    const unitList = useSelector<AppState, Unit[] | undefined>((state) => state.unit.list)

    useGetRequest({
        ignore: !!unitList,
        url: UNIT_URL,
        actionType: UNIT_RESOURCE
    })

    if (unitList) return <UnitListTemplate unitList={unitList} />
    return <Spinner />
}
export default UnitList
