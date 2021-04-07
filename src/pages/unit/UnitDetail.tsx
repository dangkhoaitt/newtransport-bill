import React, { useState, useEffect, Fragment } from 'react'
import { UNIT_URL } from '../../share/common/api-constants'
import withErrorBoundary from '../../share/hoc'
import { useSubmitRequest, HttpMethod } from '../../share/hooks'
import { Unit } from '../../share/interface/Unit'
import { UNIT_DETAIL } from '../../store/actions/unit.action'
import UnitDetailTemplate from '../../ui/templates/unit/UnitDetailTemplate'

const UnitDetail = (): JSX.Element => {
    const [unit, setUnit] = useState<Unit>()
    const submitRequest = useSubmitRequest()
    const id = window.location.pathname.split('/').pop()
    useEffect(() => {
        submitRequest({
            url: UNIT_URL + '/' + id,
            actionType: UNIT_DETAIL,
            isConfirm: false,
            method: HttpMethod.GET,
            callback: (response) => setUnit(response.response.data)
        })
    }, [id])
    if (unit) return <UnitDetailTemplate unit={unit} />
    return <Fragment />
}

export default withErrorBoundary(UnitDetail)
