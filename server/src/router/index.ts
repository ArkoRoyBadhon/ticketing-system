import { Router } from 'express'
import authRoute from './authRouter'
import ticketRoute from './ticketRouter'

const router = Router()
const modulePath = [
    {
        path: '/',
        route: authRoute
    },
    {
        path: '/t/',
        route: ticketRoute
    },

]

modulePath.forEach(({ path, route }) => router.use(path, route))
export default router
