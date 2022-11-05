import { Responder } from './responder';

export const handleError = (err: unknown) => {
    console.log(err);

    return Responder.ServerError({
        message: err instanceof Error ? err.message : 'Some error happened',
    });
};
