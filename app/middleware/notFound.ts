import { Request, Response } from 'express'

export const notFound = (request: Request, response: Response) => {
    response.render('../views/404.ejs', {
        title: '404',
    })
}
