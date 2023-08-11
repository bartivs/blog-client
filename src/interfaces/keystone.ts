
export interface Post {
    id: string;
    title: string;
    content: string;
    author?: User | null;
    authorId?: string | null;
    tags: Tag[];
    pubDate: string;
    description: string;
}

export interface User {
    // Define your User interface properties here
    id: string;
    name: string;
    email: string;
    password: string;
    posts: Post[];
    createdAt?: Date;
}

export interface Tag {
    id: string;
    name: string;
    posts: Post[];
}
