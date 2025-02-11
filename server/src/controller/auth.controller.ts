import responseMessage from "../constant/responseMessage"
import AppError from "../error/AppError"
import { IUser } from "../types/user.interface"
import catchAsyncError from "../util/catchAsyncError"
import httpResponse from "../util/httpResponse"
import prisma from "../util/prisma"
import quicker from "../util/quicker"
import sendResponse from "../util/sendResponse"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = catchAsyncError(async (req, res) => {
    const body = req.body as IUser
    const { name, email, password, role } = body

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (user) {
        throw new AppError(400, 'User already exist')
    }

    const hashedPassword = await quicker.hashPassword(password)


    const data = {
        name,
        email,
        password: hashedPassword,
        role,
    }

    const result = await prisma.user.create({
        data: {
            ...data,
            role: 'CUSTOMER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    })

    // const accessToken = quicker.generateAccessToken({ id: result.id, email: result.email, role: result.role })
    // const refreshToken = quicker.generateRefreshToken(result.id.toString())
    const accessToken = jwt.sign({ id: result.id, email: result.email, role: result.role }, process.env.ACCESS_TOKEN_SECRET as string)
    const refreshToken = jwt.sign({ id: result.id }, process.env.REFRESH_TOKEN_SECRET as string)

    res.cookie('accessToken', accessToken, {
        sameSite: 'none',
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: true
    }).cookie('refreshToken', refreshToken, {
        // sameSite: 'strict',
        sameSite: 'none',
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: true
    })

    sendResponse(res, { success: true, statusCode: 200, data: result, message: 'User created successfully' })
})

const login = catchAsyncError(async (req, res) => {
    const body = req.body as Pick<IUser, 'email' | 'password'>

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (!user) {
        throw new AppError(404, 'User not found')
    }

    const isMatch = bcrypt.compareSync(body.password, user.password!)
    if (!isMatch) {
        throw new AppError(403, 'Unauthorized. Password is incorrect')
    }

    // const accessToken = quicker.generateAccessToken({ id: user.id, email: user.email, role: user.role })
    // const refreshToken = quicker.generateRefreshToken(user.id.toString())

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET as string)
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET as string)


    res.cookie('accessToken', accessToken, {
        sameSite: 'none',
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: true
    }).cookie('refreshToken', refreshToken, {
        sameSite: 'none',
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: true
    })

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...rest } = user

    httpResponse(req, res, 200, responseMessage.SUCCESS, {
        accessToken,
        refreshToken,
        user: rest
    })
})

const author = catchAsyncError(async (req, res) => {
    const user = req.user

    const result = await prisma.user.findUnique({
        where: {
            id: user!.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    httpResponse(req, res, 200, responseMessage.SUCCESS, result)
})

const logout = catchAsyncError(async (req, res) => {
    res.clearCookie('accessToken', {
        path: '/',
        sameSite: 'none',
        secure: true
    })
    res.clearCookie('refreshToken', {
        path: '/',
        sameSite: 'none',
        secure: true
    })

    return httpResponse(req, res, 200, 'Log out successfully')
})

export default {
    register,
    login,
    author,
    logout
}