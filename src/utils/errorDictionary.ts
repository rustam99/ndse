export const errorDictionary = {
  invalidIdFormat: (field?: string) => {
    if (!field) return 'Не верный формат id'

    return `Не верный формат "id" поля "${field}"`
  },
}
