export interface Post {
    id: string,
    userId: string,
    title: string,
    body: string,
}

export interface PostsAddDto extends Omit<Post, 'id'> { }