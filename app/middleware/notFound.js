export const notFound = (request, response) => {
    response.render('../views/404.ejs', {
        title: '404',
    })
}
