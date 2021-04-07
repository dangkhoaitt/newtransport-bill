import React from 'react'
import { useSelector } from 'react-redux'
import { PROVINCE_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Province } from '../../share/interface/Province'
import { PROVINCE_RESOURCE } from '../../store/actions/province.action'
import { AppState, ProvinceSearchParams } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import ProvinceListTemplate from '../../ui/templates/province/ProvinceListTemplate'

const ProvinceList = (): JSX.Element => {
    const province = useSelector<AppState, Province[] | undefined>((state) => state.province.list)
    const searchParams: ProvinceSearchParams = {}
    const params = new URLSearchParams(window.location.search)

    params.forEach((value, key) => {
        searchParams[key] = value
    })

    useGetRequest({
        ignore: !!province,
        url: PROVINCE_URL,
        actionType: PROVINCE_RESOURCE
    })

    const check = (a: string, b: string): boolean => {
        return a.toLocaleLowerCase().includes(b.toLocaleLowerCase())
    }
    const provinceSourceSearch = province?.filter((i) => {
        const code = searchParams.code ? i.code && check(`${i.code}`, `${searchParams.code}`) : true
        const name = searchParams.name ? i.name && check(i.name, searchParams.name) : true
        return code && name
    })

    if (province)
        return <ProvinceListTemplate totalRecords={provinceSourceSearch?.length} data={provinceSourceSearch ?? []} />
    return <Spinner />
}
export default ProvinceList
