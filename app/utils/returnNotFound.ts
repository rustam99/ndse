import { Response } from 'express'

export const returnNotFound = (response: Response) => {
    response.status(404);
    response.json('Not found');
}
