export const DATE_TIME_AM_FORMAT = 'DD/MM/YYYY hh:mma'

export const DATE_TIME_FORMAT = 'DD/MM/YYYY hh:mm'

export const DATE_BIRTHDAY_FORMAT = 'DD/MM/YYYY'

export const DATE_FORMAT = 'DD/MM/YYYY'

export const EJ2_DATE_FORMAT = 'dd/MM/yyyy'

export const MenuPaths = Object.freeze({
    home: 'trang-chu',
    main_service: 'dich-vu-chinh',
    bill: 'van-don',
    user: 'tai-khoan',
    customer: 'khach-hang',
    shipping_bill: 'van-don',
    service: 'dich-vu',
    news: 'tin-tuc',
    customer_support: 'ho-tro-khach-hang',
    about_us: 'gioi-thieu',
    careers: 'tuyen-dung',
    image_slider: 'hinh-anh-slider',
    changePassword: 'doi-mat-khau',
    profile: 'thong-tin-ca-nhan',
    billCreate: 'van-don/tao-moi',
    billEdit: 'van-don/chinh-sua',
    billImport: 'van-don/import',
    customerDetail: 'khach-hang/chi-tiet',
    serviceDetail: 'dich-vu/chi-tiet',
    serviceCreate: 'dich-vu/tao-moi',
    serviceEdit: 'dich-vu/chinh-sua',
    billDetail: 'van-don/chi-tiet',
    userDetail: 'tai-khoan/chi-tiet',
    userCreate: 'tai-khoan/tao-moi',
    newCustomer: 'khach-hang/tao-moi',
    settingWebsite: 'tuy-chinh-website',
    province: 'quan-ly-tinh-quan-huyen',
    provinceDetail: 'quan-ly-tinh-quan-huyen/chi-tiet',
    progress: 'quan-ly-hanh-trinh',
    finance: 'quan-ly-trang-thai-ke-toan',
    package: 'quan-ly-don-vi-kien-hang',
    truck: 'quan-ly-loai-xe-tai',
    unit: 'quan-ly-loai-don-vi',
    quotation: 'quan-ly-bao-gia',
    quotationDetail: 'quan-ly-bao-gia/chi-tiet',
    unitDetail: 'quan-ly-loai-don-vi/chi-tiet'
})

export const Roles = Object.freeze({
    admin: 'ADMIN',
    manager: 'MANAGER',
    member: 'MEMBER'
})

export const message = {
    POST: 'Thêm title thành công!',
    PATCH: 'Sửa title thành công!',
    DELETE: 'Xóa title thành công!',
    GET: 'Không có dữ liệu!'
}

export const notificationTitle = {
    'doi-mat-khau': 'mật khẩu',
    'tai-khoan': 'tài khoản',
    'tuy-chinh-website': 'tùy chỉnh website',
    'quan-ly-tinh-quan-huyen': 'tỉnh-quận-huyện',
    'quan-ly-trang-thai-hanh-trinh': 'trạng thái hành trình',
    'quan-ly-thong-tin-ke-toan': 'thông tin kế toán',
    'quan-ly-so-kien': 'đơn vị kiện hàng',
    'quan-ly-loai-xe-tai': 'loại xe tải'
}

export const statusCodeError = {
    404: 'Trang không tồn tại!',
    500: 'Máy chủ đang gặp sự cố!'
}

export const keyCodes = {
    ESC: 27
}

export const rolesUser = {
    MANAGER: 'Quản lý',
    MEMBER: 'Thành viên'
}

export const rolesUserSearch = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Quản lý',
    MEMBER: 'Thành viên'
}

export const typeService = {
    main: 'Dịch vụ chính',
    extra: 'Dịch vụ cộng thêm'
}

export const PRICE_TYPE = Object.freeze({
    LO: 1,
    KG: 2
})

export const weightUnitList = [
    { code: 1, name: 'Kg' },
    { code: 2, name: 'Khối' }
]

export const DISCOUNT_UNIT = [
    { code: 1, name: '%' },
    { code: 2, name: '₫' }
]

export const BILL_TAB_QUERY = Object.freeze({
    inventory: '?inventory=1,2,3',
    extraService: '?extraService=COD'
})

export const INVENTORY_VALUES = {
    1: 'Tồn ở đơn vị chuyển',
    2: 'Tồn ở đơn vị phát',
    3: 'Tồn ở nhân viên phát',
    4: 'Kết thúc (thành công hoặc đóng trả)'
}
