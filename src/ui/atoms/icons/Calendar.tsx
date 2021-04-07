import React from 'react'
import IconProps from './interface'

export default function CalendarIcon(props: IconProps): JSX.Element {
    return (
        <svg height='1rem' className={props.className} viewBox='0 0 512 512'>
            <path d='M420.103,42.667V16.41h-39.385v26.256H275.692V16.41h-39.385v26.256H131.282V16.41H91.897v26.256H0V495.59h512V42.667 H420.103z M472.615,456.205H39.385V193.641h433.231V456.205z M472.615,154.256H39.385V82.051h52.513v26.256h39.385V82.051h105.026 v26.256h39.385V82.051h105.026v26.256h39.385V82.051h52.513V154.256z' />
            <circle cx='131.282' cy='259.282' r='19.692' />
            <circle cx='214.423' cy='259.282' r='19.692' />
            <circle cx='297.577' cy='259.282' r='19.692' />
            <circle cx='380.718' cy='259.282' r='19.692' />
            <circle cx='131.282' cy='324.923' r='19.692' />
            <circle cx='214.423' cy='324.923' r='19.692' />
            <circle cx='297.577' cy='324.923' r='19.692' />
            <circle cx='380.718' cy='324.923' r='19.692' />
            <circle cx='131.282' cy='390.564' r='19.692' />
            <circle cx='214.423' cy='390.564' r='19.692' />
            <circle cx='297.577' cy='390.564' r='19.692' />
            <circle cx='380.718' cy='390.564' r='19.692' />
        </svg>
    )
}
