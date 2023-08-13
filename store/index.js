export const books = [];
export const addBook = (book) => books.push(book);
export const removeBook = (index) => books.splice(index, 1);
export const editBook = (index, book) => books[index] = book;

export const getIndexById = (id) => {
    return books.findIndex((book) => book.id === id);
}
