1. **Запрос(ы) для вставки данных минимум о двух книгах в коллекцию books**
```js
db.books.insertMany([
    {
        title: "Книга 1",
        description: "Описание 1",
        authors: "author 1, author 2",
    },
    {
        title: "Книга 2",
        description: "Описание 2",
        authors: "author 3, author 4",
    },
    {
        title: "Книга 3",
        description: "Описание 3",
        authors: "author 5, author 6",
    },
])
```
2. **Запрос для поиска полей документов коллекции books по полю title**
```js
db.books.find({ title: 'Книга 2' })
```
3. **Запрос для редактирования полей: description и authors коллекции books по _id записи**
```js
db.books.updateOne(
    { _id: '8dsadsd1a2d4a5s4d12zx4sd' },
    {
        $set: {
            description: 'Обновленая книга',
            authors: 'author 5, author 6, author 7',
        }
    },
)
```
