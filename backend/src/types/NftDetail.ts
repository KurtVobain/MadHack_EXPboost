export interface NftDetail {
    name: string
    symbol: string
    uri: string
    royalties: number
    description: string
    imgType: string
    attributes: Array<{ trait_type: string; value: string }>
}
