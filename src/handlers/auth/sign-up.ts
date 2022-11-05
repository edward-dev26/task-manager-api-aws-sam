import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { getResponse } from '../../utils/getResponse';
import { handleError } from '../../utils/handleError';
import { CreateUserBody } from '../../interfaces/User';
import { AuthService } from '../../services/auth-service';
import { CognitoClient } from '../../clients/cognito';
import { EventParser } from '../../utils/event-parser';

const authClient = new CognitoClient();
const authService = new AuthService(authClient);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const body = EventParser.parseBody<CreateUserBody>(event);

        if (!body) {
            return getResponse(400, {
                message: 'Bad request',
            });
        }

        await authService.signUp(body);

        return getResponse(201, {
            message: 'User successfully created',
        });
    } catch (err: unknown) {
        return handleError(err);
    }
};
