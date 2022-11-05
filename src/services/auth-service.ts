import { ConfirmEmailBody, CreateUserBody, SignInBody, SignInResponse } from '../interfaces/User';
import { AuthClient, SignInResult } from '../interfaces/AuthClient';

export class AuthService {
    private readonly client: AuthClient;

    constructor(client: AuthClient) {
        this.client = client;
    }

    async signUp(data: CreateUserBody) {
        await this.client.signUp(data);
    }

    async signIn(body: SignInBody) {
        const result = await this.client.signIn(body);
        const isResultValid = this.validateSignInResult(result);

        if (!isResultValid) {
            return null;
        }

        return result as SignInResponse;
    }

    private validateSignInResult(result: SignInResult) {
        const { accessToken, idToken, refreshToken, expiresIn } = result;

        return accessToken && idToken && refreshToken && expiresIn;
    }

    async confirmEmail(body: ConfirmEmailBody) {
        await this.client.confirmEmail(body);
    }
}
