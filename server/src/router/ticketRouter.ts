import { Router } from 'express'
import authMiddleWere from '../middleware/authMiddleWere'
import ticketController from '../controller/ticket.controller'
import replyController from '../controller/reply.controller'

const router = Router()
router.post('/create',  authMiddleWere.isAuthenticateUser, authMiddleWere.authorizeRoles("CUSTOMER"), ticketController.CreateTicket)
router.get('/view-all', authMiddleWere.isAuthenticateUser, ticketController.viewAllTicket)
router.get('/view/:id', authMiddleWere.isAuthenticateUser, ticketController.getTicketById)

router.patch('/update/:id', authMiddleWere.isAuthenticateUser, ticketController.updateTicketById)

router.delete('/delete/:id', authMiddleWere.isAuthenticateUser, ticketController.deleteTicketById)
router.post('/reply/:id', authMiddleWere.isAuthenticateUser, replyController.replyTicket)

const ticketRoute = router
export default ticketRoute