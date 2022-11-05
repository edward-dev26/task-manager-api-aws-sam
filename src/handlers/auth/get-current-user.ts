import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { EventParser } from '../../utils/event-parser';
import { User } from '../../interfaces/User';
import { Responder } from '../../utils/responder';

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const user = EventParser.parseCurrentUser(event);

        if (!user) {
            return Responder.NotAuthorized({
                message: 'Failed to get user from authorization data',
            });
        }

        return Responder.OK<User>(user);
    } catch (err: unknown) {
        return handleError(err);
    }
};
