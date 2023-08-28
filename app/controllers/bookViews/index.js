import { books, getIndexById } from '../../store/index.js';

const index = (request, response) => {
    response.render('../views/index.ejs', {
        title: 'Библиотека',
        books: books,
    });
}

const view = (request, response) => {
    const { id } = request.params;
    const index = getIndexById(id);

    if (index < 0) response.redirect('/404');

    response.render('../views/view.ejs', {
        title: books[index].title,
        book: books[index],
    });
}

const create = (request, response) => {
    response.render('../views/create.ejs', {
        title: 'Добавить',
        book: {},
    });
}

const update = (request, response) => {
    const { id } = request.params;
    const index = getIndexById(id);

    if (index < 0) response.redirect('/404');

    response.render('../views/update.ejs', {
        title: 'Редактировать',
        book: books[index],
    });
}

export { index, view, create, update }
