import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { getResponse } from '../../utils/getResponse';
import { handleError } from '../../utils/handleError';
import { ConfirmEmailBody } from '../../interfaces/User';
import { AuthService } from '../../services/auth-service';
import { CognitoClient } from '../../clients/cognito';
import { EventParser } from '../../utils/event-parser';

const authClient = new CognitoClient();
const authService = new AuthService(authClient);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const body = EventParser.parseBody<ConfirmEmailBody>(event);

        if (!body) {
            return getResponse(400, {
                message: 'Bad request',
            });
        }

        await authService.confirmEmail(body);

        return getResponse(201, {
            message: 'Your email was successfully confirmed',
        });
    } catch (err: unknown) {
        return handleError(err);
    }
};
