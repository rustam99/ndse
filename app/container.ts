import { Container } from 'inversify'
import { BookRepositoryID, BookRepository } from './serveices/BooksRepository'
import { Book } from './types/Book'

const container = new Container()

container.bind<Book>(BookRepositoryID).to(BookRepository);

export { container }
