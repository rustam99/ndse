export const returnNotFound = (response) => {
    response.status(404);
    response.json('Not found');
}
