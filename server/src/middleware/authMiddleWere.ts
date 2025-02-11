import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import catchAsyncError, { IUserInfoRequest } from '../util/catchAsyncError'
import httpResponse from '../util/httpResponse'
import prisma from '../util/prisma'
import quicker from '../util/quicker'
import isTokenExpired from '../util/isTokenExpired'


const isAuthenticateUser = catchAsyncError(async (req: IUserInfoRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return httpResponse(req, res, 403, 'Unauthorized')
    }

    if (!accessToken || isTokenExpired(accessToken)) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new Error('Refresh token is missing')
        }

        const decryptedJwt = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string }

        const result = await prisma.user.findUnique({
            where: {
                id: decryptedJwt.id
            }
        })

        const newAccessToken = jwt.sign({ id: result?.id, email: result?.email, role: result?.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30d' })
        const newRefreshToken = jwt.sign({ id: decryptedJwt.id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' })

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.cookie('accessToken', newAccessToken, {
            sameSite: 'none',
            maxAge: 1000 * 24 * 60 * 60 * 30,
            httpOnly: true,
            secure: true
        }).cookie('refreshToken', newRefreshToken, {
            sameSite: 'none',
            maxAge: 1000 * 24 * 60 * 60 * 30,
            httpOnly: true,
            secure: true
        })

        const isExistUsr = await prisma.user.findUnique({
            where: {
                id: decryptedJwt.id
            }
        })
        if (!isExistUsr) {
            return httpResponse(req, res, 405, 'Unauthorized')
        }

        const pay = {
            id: isExistUsr.id,
            email: isExistUsr.email,
            role: isExistUsr.role
        }

        req.user = pay
    }

    if (accessToken && !isTokenExpired(accessToken)) {
        const payload = quicker.verifyAccessToken(accessToken)
        if (!payload) {
            return httpResponse(req, res, 404, 'Unauthorized')
        }
        const { id } = payload as { id: string; email: string; role: string }
        const isExistUsr = await prisma.user.findUnique({
            where: {
                id
            }
        })
        if (!isExistUsr) {
            return httpResponse(req, res, 405, 'Unauthorized')
        }

        const pay = {
            id: isExistUsr.id,
            email: isExistUsr.email,
            role: isExistUsr.role
        }

        req.user = pay
    }

    next()
})

const authorizeRoles = (...roles: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: `Forbidden: Access restricted to ${roles.join(' or ')} users` })
        } else {
            next()
        }
    }
}

export default {
    isAuthenticateUser,
    authorizeRoles
}
