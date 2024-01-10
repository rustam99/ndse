export const uploadFileName = (file: Express.Multer.File) =>
  `${Date.now().toString(36) + Math.random().toString(36).substring(2)}-${
    file.originalname
  }`
