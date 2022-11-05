import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { SignInResponse, SignInBody } from '../../interfaces/User';
import { AuthService } from '../../services/auth-service';
import { CognitoClient } from '../../clients/cognito';
import { EventParser } from '../../utils/event-parser';
import { Responder } from '../../utils/responder';

const authClient = new CognitoClient();
const authService = new AuthService(authClient);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const body = EventParser.parseBody<SignInBody>(event);

        if (!body) {
            return Responder.BadRequest({
                message: 'Bad request',
            });
        }

        const result = await authService.signIn(body);

        if (!result) {
            return Responder.NotAuthorized({
                message: 'Fail to sign in',
            });
        }

        return Responder.Created<SignInResponse>(result);
    } catch (err: unknown) {
        return handleError(err);
    }
};
