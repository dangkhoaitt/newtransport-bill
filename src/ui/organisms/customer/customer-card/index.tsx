import React, { Fragment, ReactNode } from 'react'
import Card from '../../../molecules/card'
import { FieldSpec } from '../../../molecules/table/type'

export type CardValue = { [key: string]: ReactNode }

type CustomerCardProps = { header?: JSX.Element | string; assets: FieldSpec; className?: string; dataValue: CardValue }

const CustomerCard = ({ header, dataValue, assets, className = '' }: CustomerCardProps): JSX.Element => {
    return (
        <Card className={className} header={header}>
            {Object.keys(assets).map((key, index) => {
                if (dataValue[key])
                    return (
                        <div key={index} className='customer-input-item'>
                            <label className='label-item'>{assets[key]}</label>
                            <div className='value-item'>{dataValue[key]}</div>
                        </div>
                    )
                else return <Fragment key={index} />
            })}
        </Card>
    )
}

export default CustomerCard
