import multer from 'multer'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `uploads/`)
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now().toString(36) + Math.random().toString(36).substring(2)}-${
        file.originalname
      }`,
    )
  },
})

export const upload = multer({ storage })
