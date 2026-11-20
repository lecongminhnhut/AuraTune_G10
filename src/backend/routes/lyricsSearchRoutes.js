import { Router } from 'express'
import { lyricsSearchController } from '../controllers/lyricsSearchController.js'

const router = Router()
router.get('/search/lyrics', lyricsSearchController)
export default router
