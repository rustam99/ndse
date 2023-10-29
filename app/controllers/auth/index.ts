import { Request, Response } from 'express'

export const auth = (request: Request, response: Response) => {
    response.status(201);
    response.json({ id: 1, mail: 'test@mail.ru' });
}
