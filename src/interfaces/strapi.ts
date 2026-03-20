export interface Reference {
    id: number;
    documentId: string;
    title: string;
    url: string;
}

export interface Topic {
    id: number;
    documentId: string;
    name: string;
    posts?: Post[];
}

export interface Post {
    id: number;
    documentId: string;
    title: string;
    content: any;
    publication_date: string;
    thumbnail?: {
        id: number;
        url: string;
    };
    topics?: Topic[];
    references?: Reference[];
}

export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiItem<T> {
    id: number;
    attributes: T;
}
