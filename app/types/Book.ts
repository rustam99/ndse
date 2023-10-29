export interface IBook {
  id: string
  title: string
  description: string
  authors: string
  favorite: string
  fileCover: string
  fileName: string
  fileBook: string
}

export interface ICreateBookDTO extends Partial<Omit<IBook, 'id'>> {
  title: string
  description: string
}

export interface Book {
  getAll(): Promise<IBook[]>
  getOne(id: string): Promise<IBook | null>
  create(data: ICreateBookDTO): Promise<IBook | null>
  edit(id: string, data: Partial<Omit<IBook, 'id'>>): Promise<IBook | null>
  remove(id: string): Promise<IBook | null>
}