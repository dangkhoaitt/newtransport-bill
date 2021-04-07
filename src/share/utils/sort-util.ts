import { isNumberEmpty, isStringEmpty } from './empty-util'

type SortType = 'ASC' | 'DESC'
export function sortByText(textA: string, textB: string, type: SortType): number {
    if (isStringEmpty(textA) || isStringEmpty(textB)) return -1
    return type === 'ASC' ? textA.localeCompare(textB) : textB.localeCompare(textA)
}

export function sortByNumber(numberA: number, numberB: number): number {
    if (isNumberEmpty(numberA) || isNumberEmpty(numberB)) return -1
    return numberA - numberB
}
