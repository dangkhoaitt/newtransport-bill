import React from 'react'
import { useSelector } from 'react-redux'
import { PACKAGE_URL } from '../../share/common/api-constants'
import { useGetRequest } from '../../share/hooks'
import { Package } from '../../share/interface/Package'
import { PACKAGE_RESOURCE } from '../../store/actions/package.action'
import { AppState } from '../../store/types'
import { Spinner } from '../../ui/molecules/loading'
import PackageListTemplate from '../../ui/templates/package/PackageListTemplate'

const PackageList = (): JSX.Element => {
    const packageSource = useSelector<AppState, Package[] | undefined>((state) => state.package.list)

    useGetRequest({
        ignore: !!packageSource,
        url: PACKAGE_URL,
        actionType: PACKAGE_RESOURCE
    })

    if (packageSource) return <PackageListTemplate data={packageSource} />
    return <Spinner />
}
export default PackageList
