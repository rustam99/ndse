import { Container, injectable, decorate } from 'inversify'
import { BookRepository } from './serveices/BooksRepository.js'

export const container = new Container();

decorate(injectable(), BookRepository);

container.bind(BookRepository).toSelf();
