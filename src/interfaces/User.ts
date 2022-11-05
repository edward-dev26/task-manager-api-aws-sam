export interface CreateUserBody {
    email: string;
    password: string;
    name: string;
}

export interface SignInBody {
    email: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ConfirmEmailBody {
    email: string;
    code: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
}
