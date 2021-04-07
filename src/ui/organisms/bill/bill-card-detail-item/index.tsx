import React, { ReactNode } from 'react'
import Card from '../../../molecules/card'
import { FieldSpec } from '../../../molecules/table/type'

export type CardValue = { [key: string]: ReactNode }

type CardDetailInforProps = { header?: string; assets: FieldSpec; className?: string; dataValue: CardValue }

export default function CardDetailItem(props: CardDetailInforProps): JSX.Element {
    const { header, dataValue, assets, className = '' } = props
    return (
        <Card className={`card-bill-detail-item ${className}`} header={header}>
            {Object.keys(dataValue).map((key, index) => {
                if (dataValue[key])
                    return (
                        <div key={index} className='input-validate col-sm-12 input-item'>
                            <label className='label-item'>{assets[key]}</label>
                            <div className='value-item'>{dataValue[key]}</div>
                        </div>
                    )
                else return
            })}
        </Card>
    )
}
