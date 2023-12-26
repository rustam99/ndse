export const regexStringFilter = (value: string) => {
  return { $regex: new RegExp(value, 'i') }
}
