import { rm } from 'fs'

export const removeFiles = (files) => {
  for (const path of files) {
    rm(path, (error) => {
      if (error) console.log('Не удалось удалить файл')
    })
  }
}
