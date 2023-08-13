const auth = (request, response) => {
    response.status(201);
    response.json({ id: 1, mail: 'test@mail.ru' });
}

export { auth }
