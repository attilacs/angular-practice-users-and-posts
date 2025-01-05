import { User } from "./user";

export interface Post {
    id: string,
    userId: string,
    title: string,
    body: string,
}

export interface PostWithUser extends Post {
    user: User | null;
}

export interface PostsEditDto extends Omit<Post, 'id'> { }