export interface IBook {
  id: string;
  name: string;
  authors?: string[];
}

export interface ICreateBookDTO extends Omit<IBook, 'id'> {}

export interface IEditBookDTO extends Partial<Omit<IBook, 'id'>> {}

export interface IBooksService {
  getAll(): IBook[];
  getById(id: string): IBook | null;
  create(book: ICreateBookDTO): IBook;
  edit(id: string, book: IEditBookDTO): IBook | null;
  remove(id: string): IBook | null;
}
