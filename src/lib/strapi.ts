import type { Post, Topic, StrapiResponse } from "../interfaces/strapi";

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN || "";
console.log(STRAPI_TOKEN);

interface FetchOptions {
    filters?: Record<string, any>;
    populate?: string | string[] | Record<string, boolean>;
    sort?: string | string[];
    pagination?: {
        page?: number;
        pageSize?: number;
    };
}

async function strapiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<StrapiResponse<T[]>> {
    const params = new URLSearchParams();
    if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
            params.append(`filters[${key}][$eq]`, value);
        });
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
        sortArray.forEach((s) => params.append("sort", s));
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
        headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
    }

    console.log('url', url);
    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`Strapi API error: ${res.status} ${res.statusText} `);
    }

    return res.json();
}

export async function getPosts(): Promise<Post[]> {
    const response = await strapiFetch<Post>("posts", {
        populate: {
            thumbnail: true,
            topics: true,
            references: true,
        },
        sort: "publication_date",
        pagination: {
            pageSize: 100,
        },
    });

    return response.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        // @ts-ignore
        ...item.attributes,
    }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const response = await strapiFetch<Post>("posts", {
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

    const item = response.data[0];
    return {
        id: item.id,
        documentId: item.documentId,
        // @ts-ignore
        ...item.attributes,
    };
}

export async function getTopics(): Promise<Topic[]> {
    const response = await strapiFetch<Topic>("topics", {
        populate: {
            posts: {
                populate: {
                    thumbnail: true,
                    topics: true,
                },
            },
        },
    });

    return response.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        // @ts-ignore
        ...item.attributes,
    }));
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
    const response = await strapiFetch<Topic>("topics", {
        filters: { documentId: { $eq: slug } },
        populate: {
            posts: {
                populate: {
                    thumbnail: true,
                    topics: true,
                },
            },
        },
    });

    if (response.data.length === 0) {
        return null;
    }

    const item = response.data[0];
    return {
        id: item.id,
        documentId: item.documentId,
        // @ts-ignore
        ...item.attributes,
    };
}
