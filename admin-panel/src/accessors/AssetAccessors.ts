import * as Yup from 'yup';

export interface Asset {   
    id: string;
    state: string;
    type: string;
    fileName: string;
    extension: string;
}

export function getAsset(asset: any): Asset {
    return {
        id: asset.id,
        state: asset.state,
        type: asset.type,
        fileName: asset.fileName,
        extension: asset.extension
    }
}