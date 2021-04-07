import React, { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { BILL_TAB_QUERY, MenuPaths, Roles } from '../../share/common/app-constants'
import withErrorBoundary from '../../share/hoc'
import { User } from '../../share/interface/User'
import { AppState } from '../../store/types'
import { DownloadIcon, UploadIcon } from '../../ui/atoms/icons'
import Anchor from '../../ui/atoms/link'
import { ButtonWithIcon } from '../../ui/molecules/buttons'
import { useModal } from '../../ui/molecules/modal'
import Tabs, { TabItemProps } from '../../ui/molecules/tabs'
import BillListTeamplate, { doExportBill } from '../../ui/templates/bill/bill-list'
import BillListTab from '../../ui/templates/bill/bill-list/BillListTab'

const BillList = (): JSX.Element => {
    const userLogin = useSelector<AppState, User | undefined>((state) => state.app.userLogin)
    const { confirm } = useModal()
    const dispatch = useDispatch()
    const tabIndex = useRef<number>(0)
    const querySearch = useRef<string>(location.search)
    const history = useHistory()

    const myUnit = {
        [Roles.manager]: `&unit=${userLogin?.unit?.code}`,
        [Roles.member]: `&deliverMember=${userLogin?.id}`
    }

    const onChangeTabs = (index: number): void => {
        tabIndex.current = index
        if (index === 2) querySearch.current = BILL_TAB_QUERY.extraService + myUnit[userLogin?.role || Roles.member]
    }

    const changeQuerySearch = (value: string): string => (querySearch.current = value)

    const tabs: TabItemProps[] = [
        {
            title: 'Tất cả',
            tabContent: <BillListTeamplate />
        },
        {
            title: 'Tồn',
            tabContent: (
                <BillListTab query={myUnit[userLogin?.role || Roles.member]} changeQuerySearch={changeQuerySearch} />
            )
        },
        {
            title: 'Thu hộ',
            tabContent: (
                <BillListTab query={BILL_TAB_QUERY.extraService + (myUnit[userLogin?.role || Roles.member] || '')} />
            )
        }
    ]

    function onImportExcelClickHandler(): void {
        history.push(MenuPaths.billImport)
    }

    function exportToExcel(): void {
        confirm({
            title: 'Bạn có chắc chắn muốn xuất dữ liệu sang excel?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onConfirm: () => doExportBill(dispatch, tabIndex.current === 0 ? location.search : querySearch.current)
        })
    }

    return (
        <div id='bill-list'>
            <div className='btn-add-export'>
                <ButtonWithIcon icon={<UploadIcon />} onClick={onImportExcelClickHandler}>
                    Nhập excel
                </ButtonWithIcon>
                <ButtonWithIcon icon={<DownloadIcon />} onClick={exportToExcel}>
                    Xuất excel
                </ButtonWithIcon>
                <Anchor href={MenuPaths.billCreate} linkType='bg-primary'>
                    Thêm vận đơn
                </Anchor>
            </div>
            {useMemo(
                () => (
                    <Tabs tabList={tabs} onChangeTabs={onChangeTabs} />
                ),
                []
            )}
        </div>
    )
}

export default withErrorBoundary(BillList)
