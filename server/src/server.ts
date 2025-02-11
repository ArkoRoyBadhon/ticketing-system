import { PrismaClient } from '@prisma/client';
import config from './config/config'
// import { initRateLimiter } from './config/rateLimiter'

import { server } from './socket'
// import { adminSeed } from './util/admin.utils'
import logger from './util/logger'

const prisma = new PrismaClient()

const appServer = server.listen(config.PORT)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
    try {
        await prisma.$connect()
        // adminSeed()
        console.log('database connnected', config.PORT)
    } catch (err) {
        console.log('database connnected', err)
        appServer.close((error) => {
            if (error) {
                logger.error(error)
            }
            process.exit(1)
        })
    }
})()
