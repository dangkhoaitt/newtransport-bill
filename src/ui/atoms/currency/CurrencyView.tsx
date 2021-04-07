import React from 'react'

interface CurrencyViewProps {
    value: number
    className?: string
}
export default function CurrencyView({ value, className }: CurrencyViewProps): JSX.Element {
    return <span className={className}>{formatPrice(value)}</span>
}
export function formatPrice(n: number): string {
    return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
