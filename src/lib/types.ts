export type CollectionType = 'base' | 'auth' | 'view';

export interface CollectionField {
    id?: string;
    name: string;
    type: string;
    required?: boolean;
    system?: boolean;
    options?: Record<string, any>;
}

export interface Collection {
    id: string;
    name: string;
    type: CollectionType;
    system: boolean;
    fields: CollectionField[];
    listRule?: string | null;
    viewRule?: string | null;
    createRule?: string | null;
    updateRule?: string | null;
    deleteRule?: string | null;
    created: string;
    updated: string;
}


export interface RecordModel {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    [key: string]: any;
}

export interface ProjectInfo {
    subdomain: string;
    adminToken: string;
}
