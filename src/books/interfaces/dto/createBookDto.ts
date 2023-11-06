import { IBook } from '../Book'

export interface ICreateBookDTO extends Omit<IBook, 'authors'> {
  authors?: IBook['authors']
}
