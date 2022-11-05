import { EventParser } from './event-parser';

export enum StatusCodes {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    NotAuthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ServerError = 500,
}

export class Response<Body = string | number | boolean | object | null> {
    statusCode: StatusCodes;
    body: string;

    constructor(statusCode: StatusCodes, body: Body) {
        this.statusCode = statusCode;
        this.body = EventParser.stringify(body);
    }
}
