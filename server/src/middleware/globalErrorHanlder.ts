/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import AppError from '../error/AppError'
import handleZodError from '../error/zodError'
import { THttpError } from '../types/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: THttpError, _: Request, res: Response, __: NextFunction) => {
    let message = error.message || 'Something went wrong!'
    // let message = 'Something went wrong!'
    let statusCode = 500
    let errorMessages = [
        {
            path: '',
            message: 'Something went wrong'
        }
    ]
    if (error instanceof AppError) {
        statusCode = error?.statusCode || 400
        message = error.message
        errorMessages = [
            {
                path: '',
                message: error?.message
            }
        ]
    } else if (error instanceof ZodError) {
        const simpleErr = handleZodError(error)
        statusCode = simpleErr?.statusCode
        message = simpleErr?.message
        errorMessages = simpleErr?.errorSources
    }

    console.log(error)
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessages: errorMessages
    })
}
