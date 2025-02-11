import responseMessage from "../constant/responseMessage"
import catchAsyncError from "../util/catchAsyncError"
import httpResponse from "../util/httpResponse"
import prisma from "../util/prisma"


const replyTicket = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
console.log("meee", req.body);

    if (!user || !user.id) {
        throw new Error("User not found");
    }

    const existingTicket = await prisma.ticket.findUnique({
        where: {
            id,
        },
    });

    if (!existingTicket) {
        throw new Error("Ticket not found");
    }

    const reply = await prisma.reply.create({
        data: {
            ticketId: id,
            message: req.body.message,
            userId: user.id,
        },
    });

    httpResponse(req, res, 200, responseMessage.SUCCESS, reply);
});


export default {
    replyTicket
}
