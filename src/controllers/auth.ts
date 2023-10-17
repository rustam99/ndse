import { Response, Request } from 'express'

const auth = (request: Request, response: Response) => {
    response.status(201);
    response.json({ id: 1, mail: 'test@mail.ru' });
}

export { auth }
