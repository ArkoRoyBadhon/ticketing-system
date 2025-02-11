import responseMessage from '../constant/responseMessage'
import catchAsyncError from '../util/catchAsyncError'
import httpResponse from '../util/httpResponse'
import prisma from '../util/prisma'

const CreateTicket = catchAsyncError(async (req, res) => {
    const user = req.user

    if (!user || !user.id) {
        throw new Error('User not found')
    }

    const allAdmins = await prisma.user.findFirst({
        where: {
            role: 'ADMIN'
        },
        select: {
            id: true
        }
    })

    const result = await prisma.ticket.create({
        data: {
            subject: req.body.subject,
            description: req.body.description,
            customerId: user!.id,
            executiveId: allAdmins!.id,
            status: 'OPEN'
        }
    })

    httpResponse(req, res, 200, responseMessage.SUCCESS, result)
})

const viewAllTicket = catchAsyncError(async (req, res) => {
    const user = req.user

    const result = await prisma.ticket.findMany({
        where: user.role === 'ADMIN' ? {} : { customerId: user!.id },
        select: {
            id: true,
            status: true,
            subject: true,
            description: true,
            replies: {
                select: {
                    id: true,
                    message: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            createdAt: true,
            updatedAt: true
        }
    })

    httpResponse(req, res, 200, responseMessage.SUCCESS, result)
})

const getTicketById = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    let ticket;

    if (user.role === 'ADMIN') {
        ticket = await prisma.ticket.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                status: true,
                subject: true,
                description: true,
                customerId: true,
                executiveId: true,
                replies: {
                    select: {
                        id: true,
                        message: true,
                        userId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    } else if (user.role === 'CUSTOMER') {
        ticket = await prisma.ticket.findFirst({
            where: {
                id,
                customerId: user.id,
            },
            select: {
                id: true,
                status: true,
                subject: true,
                description: true,
                customerId: true,
                executiveId: true,
                replies: {
                    select: {
                        id: true,
                        message: true,
                        userId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    httpResponse(req, res, 200, responseMessage.SUCCESS, ticket);
});

const deleteTicketById = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
  
    // Check if the ticket exists and belongs to the authenticated user
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      select: {
        customerId: true, // Only retrieve the customerId to verify ownership
      },
    });
  
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
  
    if (ticket.customerId !== user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this ticket",
      });
    }
  
    // Proceed to delete the ticket
    await prisma.ticket.delete({
      where: {
        id,
      },
    });
  
    // Respond with success message
    return res.status(200).json({
      message: "Ticket deleted successfully",
    });
  });
  

const updateTicketById = catchAsyncError(async (req, res) => {
    const { id } = req.params

    const updatedTicket = await prisma.ticket.update({
        where: {
            id
        },
        data: {
            status: req.body.status
        }
    })

    httpResponse(req, res, 200, responseMessage.SUCCESS, updatedTicket)
})

export default {
    CreateTicket,
    viewAllTicket,
    getTicketById,
    deleteTicketById,
    updateTicketById
}
