import CognitoIdentityServiceProvider, { AttributeListType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AuthClient, SignInResult } from '../interfaces/AuthClient';
import env from '../config/env';
import { ConfirmEmailBody, CreateUserBody, SignInBody } from '../interfaces/User';

class Cognito {
    private static instance: CognitoIdentityServiceProvider;

    private constructor() {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new CognitoIdentityServiceProvider({
                region: env.AWS_REGION,
            });
        }

        return this.instance;
    }
}

export class CognitoClient implements AuthClient {
    async signIn(data: SignInBody): Promise<SignInResult> {
        const { AuthenticationResult = {} } = await Cognito.getInstance()
            .initiateAuth({
                ClientId: env.USER_POOL_CLIENT_ID,
                AuthFlow: 'USER_PASSWORD_AUTH',
                AuthParameters: {
                    USERNAME: data.email,
                    PASSWORD: data.password,
                },
            })
            .promise();

        return this.mapAuthenticationResult(AuthenticationResult);
    }

    private mapAuthenticationResult(
        AuthenticationResult: CognitoIdentityServiceProvider.AuthenticationResultType,
    ): SignInResult {
        const { AccessToken, RefreshToken, IdToken, ExpiresIn } = AuthenticationResult;

        return {
            accessToken: AccessToken,
            refreshToken: RefreshToken,
            idToken: IdToken,
            expiresIn: ExpiresIn,
        };
    }

    async signUp(data: CreateUserBody) {
        await Cognito.getInstance()
            .signUp({
                ClientId: env.USER_POOL_CLIENT_ID,
                Username: data.email,
                Password: data.password,
                UserAttributes: this.getUserAttributes(data),
            })
            .promise();
    }

    private getUserAttributes(data: CreateUserBody): AttributeListType {
        return [{ Name: 'name', Value: data.name }];
    }

    async confirmEmail(data: ConfirmEmailBody) {
        await Cognito.getInstance()
            .confirmSignUp({
                ClientId: env.USER_POOL_CLIENT_ID,
                ConfirmationCode: data.code,
                Username: data.email,
            })
            .promise();
    }
}
