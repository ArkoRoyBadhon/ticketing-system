/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'

export interface IUserInfoRequest extends Request {
    user: {
        id?: string
        email?: string
        role?: string
        name?: string
    }
}

type THandelerFunc = (req: IUserInfoRequest, res: Response, next: NextFunction) => void

const catchAsyncError = (fn: THandelerFunc) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req as IUserInfoRequest, res, next)).catch((err) => next(err))
    }
}

export default catchAsyncError
