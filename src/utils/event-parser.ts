import { APIGatewayEvent } from 'aws-lambda';
import { Authorizer } from '../interfaces/Event';
import { User } from '../interfaces/User';

export class EventParser {
    static parseBody<Body>(event: APIGatewayEvent): Body | null {
        if (!event.body) {
            return null;
        }

        return JSON.parse(event.body);
    }

    static parseCurrentUser(event: APIGatewayEvent): User | null {
        if (!event.requestContext.authorizer) {
            return null;
        }

        const { claims } = event.requestContext.authorizer as Authorizer;

        return {
            id: claims.sub,
            email: claims.email,
            name: claims.name,
            emailVerified: claims.email_verified === 'true',
        };
    }

    static stringify(body: any) {
        return JSON.stringify(body);
    }
}
