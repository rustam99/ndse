import { upload } from '../middleware/upload.js'
import { needAuth } from '../middleware/needAuth.js'
import { AdvertisementsController } from '../controllers/advertisements/index.js'

export const advertisementsRoutes = (app) => {
  app.get('/api/advertisements', AdvertisementsController.all)
  app.get('/api/advertisements/:id', AdvertisementsController.one)
  app.post(
    '/api/advertisements',
    needAuth,
    upload.any('images'),
    AdvertisementsController.add,
  )
  app.put('/api/advertisements/:id', needAuth, () => '')
  app.delete(
    '/api/advertisements/:id',
    needAuth,
    AdvertisementsController.remove,
  )
}
