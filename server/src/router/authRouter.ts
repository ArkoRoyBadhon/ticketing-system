import { Router } from 'express'
import authController from '../controller/auth.controller'
import authMiddleWere from '../middleware/authMiddleWere'

const router = Router()
router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/author', authMiddleWere.isAuthenticateUser, authController.author)
router.post('/logout', authMiddleWere.isAuthenticateUser, authController.logout)

const authRoute = router
export default authRoute
