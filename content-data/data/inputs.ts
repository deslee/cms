export type SliceType = 'PARAGRAPH' | 'IMAGE' | 'VIDEO'

export interface SliceInput {
    id?: string
    type?: SliceType
    url?: string
    siteId?: string
    postId?: string
    loop?: Boolean
    autoplay?: Boolean
    text?: string
    assetIds?: [string]
    data?: any
}

export interface PostInput {
    id?: string
    siteId: string
    title?: string
    date?: Date
    password?: string
    passwordSalt?: string
    categories?: string[]
    slices?: SliceInput[]
    data?: any
}

export interface SiteInput {
    id?: string
    name?: string
    data?: any
}

export interface CommandResponse {
    success: boolean
    error?: any
    message?: string
}

export interface UpsertCommandResponse extends CommandResponse {
    created?: string
}