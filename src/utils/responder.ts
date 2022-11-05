import { Response, StatusCodes } from './response';

type DefaultBody = string | number | boolean | object | null;

export class Responder {
    static OK<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.OK, body);
    }

    static Created<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.Created, body);
    }

    static BadRequest<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.BadRequest, body);
    }

    static NotAuthorized<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.NotAuthorized, body);
    }

    static Forbidden<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.Forbidden, body);
    }

    static NotFound<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.NotFound, body);
    }

    static ServerError<Body = DefaultBody>(body: Body) {
        return new Response<Body>(StatusCodes.ServerError, body);
    }
}
