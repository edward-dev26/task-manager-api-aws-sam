import { ConfirmEmailBody, CreateUserBody, SignInBody } from './User';

export interface SignInResult {
    accessToken?: string | null;
    idToken?: string | null;
    refreshToken?: string | null;
    expiresIn?: number | null;
}

export interface AuthClient {
    signUp(data: CreateUserBody): Promise<void>;

    signIn(data: SignInBody): Promise<SignInResult>;

    confirmEmail(data: ConfirmEmailBody): Promise<void>;
}
