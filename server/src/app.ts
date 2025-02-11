import cookieParser from 'cookie-parser'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/index'
import globalErrorHanlder from './middleware/globalErrorHanlder'
import responseMessage from './constant/responseMessage'
import helmet from 'helmet'
import cors from 'cors'
import httpError from './util/httpError'
import config from './config/config'


const app: Application = express()

// middleware
app.use(helmet())
app.use(cookieParser())
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        origin: [config.FRONTEND_URL!],
        credentials: true
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

// routes
app.use('/api/v1', router)

// 404 handler
app.all('*', (req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (error) {
        httpError(next, error, req, 404)
    }
})

// global error handler
app.use(globalErrorHanlder)

export default app
