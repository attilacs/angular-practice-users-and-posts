export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserAddDto extends Omit<User, 'id'> { }
