import {Router} from 'express'
import {authRequired} from '../middlewares/validate.tokens.js'

const router = Router()

router.get('/tasks', authRequired, (req, res) => res.send('task'))

export default router