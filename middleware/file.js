import multer from 'multer';

const storage = multer.diskStorage({
   destination(req, file, cb) {
       cb(null, 'upload/')
   },
    filename(req, file, cb) {
       cb(null, `${Date.now()}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`)
    },
});

export const upload = multer({ storage });
