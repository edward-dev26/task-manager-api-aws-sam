export interface Authorizer {
    claims: AuthorizerClaims;
}

export interface AuthorizerClaims {
    sub: string;
    email_verified: string;
    iss: string;
    'cognito:username': string;
    origin_jti: string;
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: string;
    name: string;
    exp: string;
    iat: string;
    jti: string;
    email: string;
}
