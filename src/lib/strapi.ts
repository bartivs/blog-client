import type {
    About,
    HomePage,
    Post,
    SiteProfile,
    StrapiCollectionResponse,
    StrapiSingleResponse,
    Topic,
} from "../interfaces/strapi";

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN || "";

interface FetchOptions {
    filters?: Record<string, any>;
    populate?: string | string[] | Record<string, boolean>;
    sort?: string | string[];
    pagination?: {
        page?: number;
        pageSize?: number;
    };
}

let siteProfilePromise: Promise<SiteProfile | null> | null = null;
let homePagePromise: Promise<HomePage | null> | null = null;
let aboutPromise: Promise<About | null> | null = null;

async function strapiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const params = new URLSearchParams();
    if (options.filters) {
        const buildFilterParams = (prefix: string, obj: any) => {
            Object.entries(obj).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}[${key}]` : `filters[${key}]`;
                if (typeof value === "object" && value !== null) {
                    buildFilterParams(newKey, value);
                } else {
                    params.append(newKey, String(value));
                }
            });
        };
        buildFilterParams("", options.filters);
    }

    if (options.populate) {
        if (typeof options.populate === "string") {
            params.append("populate", options.populate);
        } else if (Array.isArray(options.populate)) {
            params.append("populate", options.populate.join(","));
        } else {
            Object.entries(options.populate).forEach(([key, value]) => {
                if (value) {
                    params.append(`populate[${key}]`, "true");
                }
            });
        }
    }

    if (options.sort) {
        const sortArray = Array.isArray(options.sort) ? options.sort : [options.sort];
        sortArray.forEach((sortValue) => params.append("sort", sortValue));
    }

    if (options.pagination) {
        if (options.pagination.page) {
            params.append("pagination[page]", options.pagination.page.toString());
        }
        if (options.pagination.pageSize) {
            params.append("pagination[pageSize]", options.pagination.pageSize.toString());
        }
    }

    const url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (STRAPI_TOKEN) {
        headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function strapiFetchCollection<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<StrapiCollectionResponse<T>> {
    return strapiRequest<StrapiCollectionResponse<T>>(endpoint, options);
}

async function strapiFetchSingle<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T | null> {
    const response = await strapiRequest<StrapiSingleResponse<T>>(endpoint, options);
    return response.data ?? null;
}

export function resolveMediaUrl(url?: string): string | undefined {
    if (!url) {
        return undefined;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("/")) {
        return `${STRAPI_URL}${url}`;
    }

    return url;
}

export async function getPosts(filters?: Record<string, any>): Promise<Post[]> {
    const response = await strapiFetchCollection<Post>("posts", {
        filters,
        populate: {
            thumbnail: true,
            topics: true,
            references: true,
        },
        sort: "publication_date:desc",
        pagination: {
            pageSize: 100,
        },
    });

    return response.data.map((item) => ({
        ...item,
    }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const response = await strapiFetchCollection<Post>("posts", {
        filters: { documentId: { $eq: slug } },
        populate: {
            thumbnail: true,
            topics: true,
            references: true,
        },
    });

    if (response.data.length === 0) {
        return null;
    }

    return {
        ...response.data[0],
    };
}

export async function getTopics(): Promise<Topic[]> {
    const response = await strapiFetchCollection<Topic>("topics");

    return response.data.map((item) => ({
        ...item,
    }));
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
    const response = await strapiFetchCollection<Topic>("topics", {
        filters: { documentId: { $eq: slug } },
    });

    if (response.data.length === 0) {
        return null;
    }

    return {
        ...response.data[0],
    };
}

export async function getAbout(): Promise<About | null> {
    aboutPromise ??= strapiFetchSingle<About>("about");
    return aboutPromise;
}

export async function getSiteProfile(): Promise<SiteProfile | null> {
    siteProfilePromise ??= strapiFetchSingle<SiteProfile>("site-profile", {
        populate: {
            socialImage: true,
        },
    });
    return siteProfilePromise;
}

export async function getHomePage(): Promise<HomePage | null> {
    homePagePromise ??= strapiFetchSingle<HomePage>("home-page");
    return homePagePromise;
}
