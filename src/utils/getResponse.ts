export const getResponse = <Body = string | number | boolean | object | null>(statusCode: number, body: Body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
    };
};
