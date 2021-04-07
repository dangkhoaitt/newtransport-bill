import React from 'react'
import { useSelector } from 'react-redux'
import { TRUCK_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Truck } from '../../share/interface/Truck'
import { TRUCK_RESOURCE } from '../../store/actions/truck.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import TruckListTemplate from '../../ui/templates/truck/TruckListTemplate'

const TruckList = (): JSX.Element => {
    const trucks = useSelector<AppState, Truck[] | undefined>((state) => state.truck.list)

    useGetRequest({
        ignore: !!trucks,
        url: TRUCK_URL,
        actionType: TRUCK_RESOURCE
    })

    if (trucks) return <TruckListTemplate data={trucks} />
    return <Spinner />
}
export default TruckList
