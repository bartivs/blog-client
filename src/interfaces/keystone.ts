export interface Post {
    id: string;
    title: string;
    content: any;
    author?: User | null;
    authorId?: string | null;
    tags?: Tag[];
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
    published: boolean;
}

export interface Tag {
    id: string;
    name: string;
    posts?: Post[]
}
