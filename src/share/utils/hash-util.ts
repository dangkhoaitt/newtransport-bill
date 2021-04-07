import { Unknown } from '../interface/Unknown'

/**
 * Generate a hash key from object
 *
 * @param searchParams
 * @returns hashkey
 */
export function hashKey(searchParams: Unknown): number {
    let stringKey = ''
    Object.keys(searchParams).map((key) => {
        stringKey += `${key}=${searchParams[key]}-`
    })

    let hash = 0
    for (let i = 0; i < stringKey.length; i++) {
        const char = stringKey.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return hash
}
