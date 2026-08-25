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

export interface StrapiCollectionResponse<T> {
    data: T[];
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiSingleResponse<T> {
    data: T | null;
    meta: Record<string, never>;
}

export interface About {
    seoTitle?: string;
    seoDescription?: string;
    title: string;
    content: BlocksContent;
}

export interface StrapiImage {
    id?: number;
    url: string;
}

export interface SiteProfile {
    siteTitle?: string;
    displayName?: string;
    summary?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    resumeUrl?: string;
    schemaResumeUrl?: string;
    socialImage?: StrapiImage;
    schemaName?: string;
    knowsAbout?: string;
}

export interface HomePage {
    seoTitle?: string;
    seoDescription?: string;
    heroTitle?: string;
    heroBody?: string;
    skillsText?: string;
}

export interface StrapiItem<T> {
    id: number;
    attributes: T;
}
