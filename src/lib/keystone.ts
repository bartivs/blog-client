import type { Post, Tag } from "../interfaces/keystone";

interface Props {
    queryGraphQL?: string;
}

/**
 * Fetches data from the Strapi API
 * @param query - The query parameters to add to the url
 * @returns
 */
export default async function fetchApi({
    queryGraphQL,
}: Props): Promise<any> {

    const url = new URL(`${import.meta.env.KEYSTONE_URL}/api/graphql`);

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: queryGraphQL,
        }),
    });
    let { data } = await res.json();

    return data;
}


export async function getCollection(name: "post" | "tag") {
    if (name === "post") {
        const { posts } = await fetchApi({
            queryGraphQL: `
            query Query {
                posts {
                id
                author {
                    name
                }
                content {
                    document
                }
                title
                pubDate
                description
                tags{
                    id
                    name
                }
                } 
                } 
      `
        })
        return posts as Post[]
    }
    if (name === "tag") {
        const {tags}=  await fetchApi({
            queryGraphQL: `
            query Query {
                tags {
                id
                name 
                }
            } 
      `
        }) 
        return tags as Tag[]
    }
}
