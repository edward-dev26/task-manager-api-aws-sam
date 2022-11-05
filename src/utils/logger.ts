import { APIGatewayEvent } from 'aws-lambda';

export const logEvent = (event: APIGatewayEvent) => {
    console.log(JSON.stringify(event, null, 2));
};
