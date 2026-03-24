import type { BlocksContent } from "@strapi/blocks-react-renderer";

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
    content: BlocksContent;
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

export interface About {
    title: string;
    content: BlocksContent;
}

export interface StrapiItem<T> {
    id: number;
    attributes: T;
}
