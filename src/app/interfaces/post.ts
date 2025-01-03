export interface Post {
    id: string,
    userId: string,
    title: string,
    body: string,
}

export interface PostsEditDto extends Omit<Post, 'id'> { }